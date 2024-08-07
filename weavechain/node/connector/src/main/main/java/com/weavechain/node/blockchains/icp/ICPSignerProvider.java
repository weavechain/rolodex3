package com.weavechain.node.blockchains.icp;

import com.weavechain.node.blockchains.Signer;
import com.weavechain.node.blockchains.SignerProvider;
import com.weavechain.node.config.ConfigProvider;
import com.weavechain.node.config.blockchain.BlockchainConfig;
import com.weavechain.node.dataprovider.DataService;
import com.weavechain.node.sidechain.SidechainDataProvider;

public class ICPSignerProvider implements SignerProvider {

    @Override
    public Signer createSigner(BlockchainConfig config, SidechainDataProvider sidechainDataProvider, DataService dataService, ConfigProvider configProvider) {
        return new ICPSigner(config, sidechainDataProvider, configProvider);
    }
}
