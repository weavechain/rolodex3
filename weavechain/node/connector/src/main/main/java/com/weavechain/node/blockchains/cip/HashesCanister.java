package com.weavechain.node.blockchains.icp;

import java.math.BigInteger;
import java.util.concurrent.CompletableFuture;

import org.ic4j.agent.annotations.QUERY;
import org.ic4j.agent.annotations.Waiter;
import org.ic4j.agent.annotations.UPDATE;
import org.ic4j.agent.annotations.Argument;
import org.ic4j.candid.annotations.Name;
import org.ic4j.candid.types.Type;
import org.ic4j.types.Principal;

public interface HashesCanister {

    int TIMEOUT_SEC = 60;

    @Name("caller") @Waiter(timeout = TIMEOUT_SEC)
    CompletableFuture<Principal> caller();

    @Name("owner") @Waiter(timeout = TIMEOUT_SEC)
    CompletableFuture<Principal> owner();

    @UPDATE @Name("setOwner") @Waiter(timeout = TIMEOUT_SEC)
    CompletableFuture<Principal> setOwner(@Argument(Type.TEXT)String owner);

    @QUERY @Name("get") @Waiter(timeout = TIMEOUT_SEC)
    CompletableFuture<String> get(@Argument(Type.TEXT)String id);

    @QUERY @Name("readHashes") @Waiter(timeout = TIMEOUT_SEC)
    CompletableFuture<String> readHashes();

    @UPDATE @Name("reset") @Waiter(timeout = TIMEOUT_SEC)
    CompletableFuture<BigInteger> reset();

    @UPDATE @Name("store") @Waiter(timeout = TIMEOUT_SEC)
    CompletableFuture<BigInteger> store(@Argument(Type.TEXT)String id, @Argument(Type.TEXT)String hash);

    @UPDATE @Name("delete") @Waiter(timeout = TIMEOUT_SEC)
    CompletableFuture<BigInteger> delete(@Argument(Type.TEXT)String id);
}
