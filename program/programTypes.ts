import * as anchor from "@coral-xyz/anchor";

export type GlobalStateAccount = {
    authority: anchor.web3.PublicKey;
    nextGameId: anchor.BN;
    activeGameId: anchor.BN;
}

export type GameStateAccount = {
    lastClicker: anchor.web3.PublicKey;
    gameId: anchor.BN;
    clickNumber: anchor.BN;
    isActive: boolean;
    hasEnded: boolean;
    lastClickTimestamp: any;
    gameTimeSec: anchor.BN;
}

export type GameVaultStateAccount = {
    gameId: anchor.BN;
    balance: anchor.BN;
    depositAmount: anchor.BN;
}