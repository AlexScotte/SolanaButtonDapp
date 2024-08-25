import {
    transact,
    Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { Account, useAuthorization } from "../components/providers/AuthorizationProvider";
import {
    PublicKey,
    Transaction,
    TransactionSignature,
    VersionedTransaction,
} from "@solana/web3.js";
import { useCallback, useMemo } from "react";

export interface MobileWallet {
    publicKey: PublicKey;
    signAndSendTransaction<T extends Transaction | VersionedTransaction>(
        transaction: T
    ): Promise<TransactionSignature>;
    signTransaction<T extends Transaction | VersionedTransaction>(
        transaction: T
    ): Promise<T>;
    signAllTransactions<T extends Transaction | VersionedTransaction>(
        transactions: T[]
    ): Promise<T[]>;
    signMessage(message: Uint8Array): Promise<Uint8Array>;
}


export function useMobileWallet(): MobileWallet | undefined {

    const { selectedAccount, authorizeSession } = useAuthorization();
    return useMemo(() => {
        if (!selectedAccount) {
            return;
        }

        return {
            publicKey: selectedAccount.publicKey,

            signAndSendTransaction: async <T extends Transaction | VersionedTransaction>(
                transaction: T
            ) => {
                return await transact(async (wallet: Web3MobileWallet) => {
                    await authorizeSession(wallet);
                    const signatures = await wallet.signAndSendTransactions({
                        transactions: [transaction],
                    });
                    return signatures[0];
                });
            },
            signTransaction: async <T extends Transaction | VersionedTransaction>(
                transaction: T
            ) => {
                return await transact(async (wallet: Web3MobileWallet) => {
                    const signedTransactions = await wallet.signTransactions({
                        transactions: [transaction],
                    });
                    return signedTransactions[0] as T;
                });
            },
            signAllTransactions: async <T extends Transaction | VersionedTransaction>(
                transactions: T[]
            ) => {
                return await transact(async (wallet: Web3MobileWallet) => {
                    const signedTransactions = await wallet.signTransactions({
                        transactions,
                    });
                    return signedTransactions;
                });
            },
            signMessage: async (message: Uint8Array): Promise<Uint8Array> => {
                return await transact(async (wallet: Web3MobileWallet) => {
                    const signedMessages = await wallet.signMessages({
                        addresses: [selectedAccount.address],
                        payloads: [message],
                    });
                    return signedMessages[0];
                });
            },
        };
    }, [selectedAccount]);
}
