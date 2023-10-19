package com.weavechain.node.blockchains.icp;

import com.weavechain.core.data.ConvertUtils;
import com.weavechain.core.data.DataLayout;
import com.weavechain.core.data.Records;
import com.weavechain.core.data.ThresholdSig;
import com.weavechain.core.data.filter.Filter;
import com.weavechain.core.encoding.Utils;
import com.weavechain.core.encrypt.ECIESKeys;
import com.weavechain.core.error.AccessError;
import com.weavechain.core.error.OperationResult;
import com.weavechain.core.error.OperationScope;
import com.weavechain.core.error.Success;
import com.weavechain.core.operations.ApiOperationType;
import com.weavechain.core.operations.ReadContext;
import com.weavechain.core.utils.CompletableFuture;
import com.weavechain.node.blockchains.BatchHashChecker;
import com.weavechain.node.blockchains.ChainSigner;
import com.weavechain.node.blockchains.RecordLocation;
import com.weavechain.node.blockchains.RecordMetadata;
import com.weavechain.node.blockchains.inmem.InMemHash;
import com.weavechain.node.config.ConfigProvider;
import com.weavechain.node.config.blockchain.BlockchainConfig;
import com.weavechain.node.config.blockchain.ICPConfig;
import com.weavechain.node.db.RecordsProvider;
import com.weavechain.node.sidechain.SidechainDataProvider;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.hc.client5.http.impl.async.CloseableHttpAsyncClient;
import org.apache.hc.client5.http.impl.async.HttpAsyncClients;
import org.apache.hc.client5.http.impl.nio.PoolingAsyncClientConnectionManagerBuilder;
import org.apache.http.conn.ssl.DefaultHostnameVerifier;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.hc.client5.http.impl.nio.PoolingAsyncClientConnectionManager;
import org.apache.hc.client5.http.ssl.ClientTlsStrategyBuilder;
import org.apache.http.ssl.SSLContexts;
import org.ic4j.agent.identity.BasicIdentity;
import org.ic4j.agent.identity.Identity;
import org.ic4j.agent.identity.Secp256k1Identity;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.ic4j.agent.Agent;
import org.ic4j.agent.AgentBuilder;
import org.ic4j.agent.ProxyBuilder;
import org.ic4j.agent.ReplicaTransport;
import org.ic4j.agent.http.ReplicaApacheHttpTransport;
import org.ic4j.types.Principal;

import javax.net.ssl.SSLContext;
import java.io.*;
import java.math.BigInteger;
import java.security.KeyPair;
import java.security.KeyStore;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

public class ICPSigner extends ChainSigner {

    static final Logger logger = LoggerFactory.getLogger(ICPSigner.class);

    private final BlockchainConfig config;

    private Agent api;

    private final Map<String, Map<String, String>> contracts = Utils.newConcurrentHashMap();

    private final Map<String, HashesCanister> cachedProxies = Utils.newConcurrentHashMap();

    public ICPSigner(BlockchainConfig config, SidechainDataProvider sidechainDataProvider, ConfigProvider configProvider) {
        super(config.getSignSecret(), config.getSigningOptions(), sidechainDataProvider, configProvider);

        this.config = config;

        initAgent(config);
        initContracts(config);
    }


    private void initContracts(BlockchainConfig blockchainConfig) {

        if (getChainCfg(blockchainConfig).getCanisters() != null) {
            for (Map.Entry<String, Map<String, String>> mappings : getChainCfg(blockchainConfig).getCanisters().entrySet()) {
                Map<String, String> contractsMap = new HashMap<>();
                contracts.put(mappings.getKey(), contractsMap);
                contractsMap.putAll(mappings.getValue());
            }
        } else {
            logger.error("No contracts mapped, writing hashes will fail");
        }
    }

    protected ICPConfig getChainCfg(BlockchainConfig blockchainConfig) {
        return blockchainConfig.getIcpConfig();
    }

    private void initAgent(BlockchainConfig blockchainConfig) {
        ICPConfig config = getChainCfg(blockchainConfig);
        try {
            if (config.getRpcUrl() != null) {
                boolean isSsl = config.getRpcUrl().startsWith("https://");

                ReplicaTransport transport;
                if (isSsl) {
                    SSLContext ssl = SSLContexts.createSystemDefault();
                    if (config.getKeyStore() != null) {
                        try {
                            KeyStore ks = KeyStore.getInstance("JKS");
                            File kf = new File(config.getKeyStore());
                            ks.load(new FileInputStream(kf), config.getKeyStorePass().toCharArray());

                            ssl = SSLContexts.custom()
                                    .loadKeyMaterial(ks, config.getKeyStorePass() != null ? config.getKeyStorePass().toCharArray() : null)
                                    .build();
                        } catch (Exception e) {
                            logger.error("Failed reading keystore", e);
                        }
                    }

                    PoolingAsyncClientConnectionManager connectionManager = PoolingAsyncClientConnectionManagerBuilder.create()
                            .setTlsStrategy(ClientTlsStrategyBuilder.create()
                                    .setSslContext(ssl)
                                    .setHostnameVerifier(config.getKeyStore() != null ? new NoopHostnameVerifier() : new DefaultHostnameVerifier())
                                    .build())
                            .build();

                    CloseableHttpAsyncClient client = HttpAsyncClients.custom()
                            .setConnectionManager(connectionManager)
                            .build();

                    transport = ReplicaApacheHttpTransport.create(config.getRpcUrl(), client);
                } else {
                    transport = ReplicaApacheHttpTransport.create(config.getRpcUrl());
                }

                Identity identity;
                if (config.getPem() != null) {
                    Reader pem = new StringReader(config.getPem());
                    identity = config.isUseSecp256k1() ? Secp256k1Identity.fromPEMFile(pem) : BasicIdentity.fromPEMFile(pem);
                } else if (config.getPemFile() != null) {
                    Reader pem = new FileReader(new File(config.getPemFile()));
                    identity = config.isUseSecp256k1() ? Secp256k1Identity.fromPEMFile(pem) : BasicIdentity.fromPEMFile(pem);
                } else {
                    KeyPair keyPair = new ECIESKeys().readKeys(config.getPrivateKey(), config.getPublicKey());
                    identity = config.isUseSecp256k1() ? Secp256k1Identity.fromKeyPair(keyPair) : BasicIdentity.fromKeyPair(keyPair);
                }

                api = new AgentBuilder()
                        .transport(transport)
                        .identity(identity)
                        .build();
                api.setVerify(false);
            } else {
                logger.error("Failed initializing API, no connection specified");
            }

        } catch (Exception e) {
            logger.error("Failed initializing signer", e);
        }
    }

    private void stop() {
    }

    @Override
    public CompletableFuture<OperationResult> sign(String organization, String account, String scope, Records records, boolean syncSigning) {
        CompletableFuture<OperationResult> result = new CompletableFuture<>();
        String table = records.getTable();

        RecordLocation location = new RecordLocation(organization, scope, table);
        RecordMetadata metadata = new RecordMetadata(account, Instant.now().toString(), null);

        DataLayout tableLayout = getSidechainDataProvider().getTableLayout(location.getOrganization(), account, location.getScope(), location.getTable());
        String contract = contracts.get(location.getScope()).get(location.getTable());

        if (contract != null) {
            try {
                boolean hasInvalidData = false;

                Set<CompletableFuture<OperationResult>> operations = new HashSet<>();

                OutputHashes output = new OutputHashes();
                for (List<Object> record : records.getItems()) {
                    Long id = Records.getLongRecordId(record, tableLayout);

                    if (id == null) {
                        hasInvalidData = true;
                    } else {
                        batchSign(account, location, id, record, metadata, tableLayout, syncSigning, output, operations);
                    }
                }

                boolean asyncWrite = config.isAsyncWrite();
                fillResult(organization, account, scope, records, syncSigning, result, hasInvalidData, asyncWrite, new ArrayList<>(operations), output);
            } catch (Exception e) {
                logger.error("Failed signing", e);
                result.complete(new AccessError(
                        new OperationScope(ApiOperationType.SIGN, organization, account, scope, records.getTable()),
                        e.toString()
                ));
            }
        } else {
            result.complete(new AccessError(
                    new OperationScope(ApiOperationType.SIGN, organization, account, scope, records.getTable()),
                    ChainSigner.NO_CONTRACT_DEFINED_ERR
            ));
        }
        return result;
    }

    @Override
    public CompletableFuture<OperationResult> resetHashes(String organization, String account, String scope, String table) {
        CompletableFuture<OperationResult> pendingOp = new CompletableFuture<>();

        RecordLocation location = new RecordLocation(organization, scope, table);

        try {
            String contract = contracts.get(location.getScope()).get(location.getTable());

            if (contract != null) {
                HashesCanister hashesCanister = getHashesCanister(contract);
                hashesCanister.reset().get();

                pendingOp.complete(new Success(
                        new OperationScope(ApiOperationType.RESET_HASHES, location.getOrganization(), account, location.getScope(), location.getTable()),
                        ""
                ));
            } else {
                pendingOp.complete(new AccessError(
                        new OperationScope(ApiOperationType.RESET_HASHES, location.getOrganization(), account, location.getScope(), location.getTable()),
                        "No contract configured"
                ));
            }
        } catch (Exception e) {
            logger.error("Failed reset hashes", e);
            pendingOp.complete(new AccessError(
                    new OperationScope(ApiOperationType.RESET_HASHES, organization, account, scope, table),
                    e.toString()
            ));
        }
        return pendingOp;
    }

    @Override
    public CompletableFuture<OperationResult> storeRootHash(String organization, String account, String scope, String table, String hash, Long timestamp, String signature, boolean syncSigning) {
        CompletableFuture<OperationResult> pendingOp = new CompletableFuture<>();
        RecordLocation location = new RecordLocation(organization, scope, table);

        try {
            String contract = contracts.get(location.getScope()).get(location.getTable());

            if (contract != null) {
                HashesCanister hashesCanister = getHashesCanister(contract);

                Map<String, String> data = new HashMap<>();
                data.put("hash", hash);
                data.put("ts", timestamp.toString());
                data.put("signature", signature);

                String record = Utils.getGson().toJson(data);
                hashesCanister.store("", record).get();

                pendingOp.complete(new Success(
                        new OperationScope(ApiOperationType.ROOT_HASH, location.getOrganization(), account, location.getScope(), location.getTable()),
                        hash
                ));
            } else {
                pendingOp.complete(new AccessError(
                        new OperationScope(ApiOperationType.ROOT_HASH, location.getOrganization(), account, location.getScope(), location.getTable()),
                        "No contract configured"
                ));
            }
        } catch (Exception e) {
            logger.error("Failed transaction", e);
            pendingOp.complete(new AccessError(
                    new OperationScope(ApiOperationType.ROOT_HASH, location.getOrganization(), account, location.getScope(), location.getTable()),
                    e.toString()
            ));
        } finally {
            if (syncSigning) {
            }
        }

        return pendingOp;
    }

    @Override
    public CompletableFuture<OperationResult> readRootHash(String organization, String account, String scope, String table) {
        CompletableFuture<OperationResult> pendingOp = new CompletableFuture<>();
        RecordLocation location = new RecordLocation(organization, scope, table);

        try {
            String contract = contracts.get(location.getScope()).get(location.getTable());

            HashesCanister hashesCanister = getHashesCanister(contract);
            String result = hashesCanister.get("").get();

            String hash = null;
            if (result != null && !result.isEmpty()) {
                Map<String, Object> items = Utils.getGson().fromJson(result, Map.class);
                hash = ConvertUtils.convertToString(items.get("hash"));
            }

            pendingOp.complete(new Success(
                    new OperationScope(ApiOperationType.ROOT_HASH, location.getOrganization(), account, location.getScope(), location.getTable()),
                    hash
            ));
        } catch (Exception e) {
            logger.error("Failed transaction", e);
            pendingOp.complete(new AccessError(
                    new OperationScope(ApiOperationType.ROOT_HASH, location.getOrganization(), account, location.getScope(), location.getTable()),
                    e.toString()
            ));
        } finally {
        }

        return pendingOp;
    }

    @Override
    public CompletableFuture<OperationResult> sign(String organization, String account, String scope, ThresholdSig thresholdSig, boolean syncSigning) {
        CompletableFuture<OperationResult> result = new CompletableFuture<>();
        String table = thresholdSig.getTable();

        RecordLocation location = new RecordLocation(organization, scope, table);
        RecordMetadata metadata = new RecordMetadata(account, Instant.now().toString(), null);
        chainSignRecord(account, location, metadata.getData(), thresholdSig, result);
        return result;
    }

    @Override
    public CompletableFuture<OperationResult> readThresholdSigPubKey(String organization, String account, String scope, String table) {
        return null;
    }

    @Override
    public CompletableFuture<OperationResult> setThresholdSigPubKey(String organization, String account, String scope, String table, ThresholdSig thresholdSig) {
        CompletableFuture<OperationResult> pendingOp = new CompletableFuture<>();
        pendingOp.complete(new Success(
                new OperationScope(ApiOperationType.SET_THRESHOLD_SIG_PUB_KEY, organization, account, scope, table), null));
        return pendingOp;
    }

    @Override
    protected boolean isStoreIds() {
        return false;
    }

    @Override
    protected void chainSignRecord(String account, RecordLocation location, String ids, Long batchStartId, Long batchEndId, String hash, String metadata, CompletableFuture<OperationResult> pendingOp) {
        try {
            String contract = contracts.get(location.getScope()).get(location.getTable());

            HashesCanister hashesCanister = getHashesCanister(contract);

            Map<String, String> data = new HashMap<>();
            data.put("hash", hash);
            data.put("metadata", metadata);
            data.put("start", batchStartId.toString());
            data.put("end", batchEndId.toString());

            String record = Utils.getGson().toJson(data);

            if (config.isAsyncWrite()) {
                hashesCanister.store(batchStartId.toString(), record).whenComplete((r, ex) -> {
                    if (ex != null) {
                        logger.error("Error storing hash", ex);
                        return;
                    }
                    logger.error("ICPSigner.chainSignRecords() New size {}", r.toString());
                });

            } else {
                //Principal caller = hashesCanister.caller().get();
                //Principal owner = hashesCanister.owner().get();
                BigInteger result = hashesCanister.store(batchStartId.toString(), record).get();
                if (result == null) {
                    pendingOp.complete(new AccessError(
                            new OperationScope(ApiOperationType.SIGN, location.getOrganization(), account, location.getScope(), location.getTable()),
                            "Failed storing hash"
                    ));
                    return;
                }
            }

            pendingOp.complete(new Success(
                    new OperationScope(ApiOperationType.SIGN, location.getOrganization(), account, location.getScope(), location.getTable()),
                    null
            ));
        } catch (Exception e) {
            logger.error("Failed transaction", e);
            pendingOp.complete(new AccessError(
                    new OperationScope(ApiOperationType.SIGN, location.getOrganization(), account, location.getScope(), location.getTable()),
                    e.toString()
            ));
        } finally {
            if (!config.isAsyncWrite()) {
            }
        }
    }

    @Override
    protected void chainSignRecord(String account, RecordLocation location, String metadata, ThresholdSig thresholdSig, CompletableFuture<OperationResult> pendingOp) {
        try {
            String contract = contracts.get(location.getScope()).get(location.getTable());

            HashesCanister hashesCanister = getHashesCanister(contract);

            if (config.isAsyncWrite()) {
                hashesCanister.store(thresholdSig.getBatchStartId().toString(), thresholdSig.getMessage()).whenComplete((r, ex) -> {
                });
            } else {
                BigInteger result = hashesCanister.store(thresholdSig.getBatchStartId().toString(), thresholdSig.getMessage()).get();
                logger.info("chainSignRecord " + result.toString());
            }

            pendingOp.complete(new Success(
                    new OperationScope(ApiOperationType.SIGN, location.getOrganization(), account, location.getScope(), location.getTable()),
                    null
            ));
        } catch (Exception e) {
            logger.error("Failed transaction", e);
            pendingOp.complete(new AccessError(
                    new OperationScope(ApiOperationType.SIGN, location.getOrganization(), account, location.getScope(), location.getTable()),
                    e.toString()
            ));
        } finally {
            if (!config.isAsyncWrite()) {
            }
        }
    }

    @Override
    public CompletableFuture<OperationResult> verify(String organization, String account, String scope, Pair<Records, Map<Long, InMemHash>> recordsAndInMemHashes, ReadContext context, RecordsProvider recordsProvider) {
        CompletableFuture<OperationResult> result = new CompletableFuture<>();

        Records records = recordsAndInMemHashes.getKey();
        Map<Long, InMemHash> hashes = recordsAndInMemHashes.getValue();
        RecordLocation location = new RecordLocation(organization, scope, records.table);
        DataLayout tableLayout = getSidechainDataProvider().getTableLayout(location.getOrganization(), account, location.getScope(), location.getTable());

        try {
            BatchHashChecker checker = new BatchHashChecker(hashes, config.getSignSecret(), getLineageConfig());

            for (List<Object> record : records.getItems()) {
                Long id = Records.getLongRecordId(record, tableLayout);
                String hash = computeHash(record, tableLayout);

                checker.verify(id, hash);
            }

            OperationResult result1 = checker.getResult(account, location, config.isReportErroneusIds(), context);
            result.complete(result1);
        } catch (Exception e) {
            logger.error("Failed verification", e);
            result.complete(new AccessError(
                    new OperationScope(ApiOperationType.VERIFY, organization, account, scope, records.getTable()),
                    e.toString()
            ));
        }
        return result;
    }

    @Override
    public CompletableFuture<OperationResult> verify(String organization, String account, String scope, Records records, ReadContext context, RecordsProvider recordsProvider) {
        CompletableFuture<OperationResult> result = new CompletableFuture<>();
        String table = records.getTable();

        RecordLocation location = new RecordLocation(organization, scope, table);

        DataLayout tableLayout = getSidechainDataProvider().getTableLayout(location.getOrganization(), account, location.getScope(), location.getTable());
        List<Long> ids = records.getItems().stream().map(r -> Records.getLongRecordId(r, tableLayout)).collect(Collectors.toList());
        List<String> contracts = getContracts(location);
        if (contracts.isEmpty() && !ids.isEmpty()) {
            result.complete(new AccessError(
                    new OperationScope(ApiOperationType.VERIFY, organization, account, scope, records.getTable()),
                    "Organization has no data on the blockchain for given ids"));
            return result;
        }


        try {
            Map<Long, InMemHash> hashes = new HashMap<>();
            for (String c : contracts) {
                if (c == null) {
                    continue;
                }
                queryHashes(c, scope, table).forEach((id, hash) -> {
                    if (id != 0L) {
                        hashes.put(id, hash);
                    }
                });
            }


            BatchHashChecker checker = new BatchHashChecker(hashes, config.getSignSecret(), getLineageConfig());

            for (List<Object> record : records.getItems()) {
                Long id = Records.getLongRecordId(record, tableLayout);
                String hash = computeHash(record, tableLayout);

                checker.verify(id, hash);
            }

            OperationResult result1 = checker.getResult(account, location, config.isReportErroneusIds(), context);
            result.complete(result1);
        } catch (Exception e) {
            logger.error("Failed verification", e);
            result.complete(new AccessError(
                    new OperationScope(ApiOperationType.VERIFY, organization, account, scope, records.getTable()),
                    e.toString()
            ));
        }
        return result;
    }

    @NotNull
    private List<String> getContracts(RecordLocation location) {
        String contract = this.contracts.get(location.getScope()).get(location.getTable());
        return contract != null ? Collections.singletonList(contract) : null;
    }

    @Override
    public CompletableFuture<OperationResult> hashes(String organization, String account, String scope, Records records, Filter filter, RecordsProvider recordsProvider) {
        CompletableFuture<OperationResult> result = new CompletableFuture<>();
        String table = records.getTable();

        OperationScope opScope = new OperationScope(ApiOperationType.HASHES, organization, account, scope, records.getTable());

        RecordLocation location = new RecordLocation(organization, scope, table);

        DataLayout tableLayout = getSidechainDataProvider().getTableLayout(location.getOrganization(), account, location.getScope(), location.getTable());
        List<Long> ids = records.getItems().stream().map(r -> Records.getLongRecordId(r, tableLayout)).collect(Collectors.toList());
        List<String> contracts = getContracts(location);

        if (contracts.isEmpty() && !ids.isEmpty()) {
            result.complete(new AccessError(opScope, "Organization has no data on the blockchain for given ids"));
            return result;
        }

        try {
            Map<Long, InMemHash> hashes = new HashMap<>();
            for (String c : contracts) {
                if (c != null) {
                    hashes.putAll(queryHashes(c, scope, table));
                }
            }

            result.complete(new Success(opScope, hashes));
        } catch (Exception e) {
            logger.error("Failed verification", e);
            result.complete(new AccessError(opScope, e.toString()));
        }
        return result;
    }

    private Map<Long, InMemHash> queryHashes(String contract, String scope, String table) throws Exception {
        Map<Long, InMemHash> hashes = new HashMap<>();

        try {
            HashesCanister hashesCanister = getHashesCanister(contract);
            Object data = hashesCanister.readHashes().get();

            if (data instanceof Object[]) {
                for (Object it : (Object[])data) {
                    Map<?, ?> items = (Map<?, ?>)it;
                    Long k = null;
                    Map<String, Object> hdata = null;
                    for (Map.Entry<?, ?> v : items.entrySet()) {
                        String key = v.getKey().toString();
                        String val = v.getValue().toString();

                        if ("0".equals(key)) {
                            k = ConvertUtils.convertToLong(val);
                        } else if ("1".equals(key)) {
                            hdata = (Map<String, Object>)Utils.getGson().fromJson(val, Map.class);
                        }
                    }

                    if (k != null && hdata != null) {
                        hashes.put(k, new InMemHash(
                                scope,
                                table,
                                k,
                                ConvertUtils.convertToString(hdata.get("hash")),
                                new RecordMetadata(
                                        null,
                                        null,
                                        ConvertUtils.convertToString(hdata.get("end"))
                                )
                        ));
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Failed querying hashes", e);
        }

        return hashes;
    }

    private HashesCanister getHashesCanister(String contract) {
        if (contract != null) {
            HashesCanister result = cachedProxies.get(contract);
            if (result == null) {
                String principal = contract.contains(":") ? contract.split(":")[1] : contract;
                result = ProxyBuilder.create(api, Principal.fromString(principal)).getProxy(HashesCanister.class);
                cachedProxies.put(contract, result);
            }
            return result;
        } else {
            return null;
        }
    }
}