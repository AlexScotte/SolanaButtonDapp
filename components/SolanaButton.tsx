import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as anchor from "@coral-xyz/anchor";
import { useConnection } from './providers/ConnectionProvider';
import { useMobileWallet } from '../hooks/useMobileWallet';
import { getSolanaButtonProgram } from '../program/program.idl';

import { ProgramType } from '../program/program.idl';
import {Connection,  sendAndConfirmTransaction} from '@solana/web3.js';
import {Keypair} from '@solana/web3.js';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { fetchGameState, fetchGameVaultState, fetchGlobalState, getGameStatePDA, getGameVaultStatePDA, getGlobalStatePDA } from '../program/programAccounts';
import { clickButton } from '../program/programMethods';
import {
    transact,
    Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";


export const SolanaButton = () => {

    const mobileWallet = useMobileWallet()!;
    const { connection } = useConnection();


    const handlePress = async () => {
        
        try{

            if(!mobileWallet) {
                console.log("Not connected");
            }
            else{
                console.log("Connected: ", mobileWallet);
            }

            console.log("CONNECTION:");

            const connection = new Connection("https://api.devnet.solana.com", "confirmed");
            const provider = new anchor.AnchorProvider(connection, mobileWallet as any, {
                preflightCommitment: "finalized",
            });
            console.log("PROVIDER:");
            console.log(provider);
            const program = getSolanaButtonProgram(provider);
            console.log("PROGRAM ID:", program.programId);
            await clickButton(connection, mobileWallet, program);
            
            const globalStatePda = await getGlobalStatePDA(program);
            const globalStateAcc = await fetchGlobalState(program, globalStatePda);
        
            const gameStatePda = await getGameStatePDA(program, globalStateAcc.activeGameId);
            // const gameStateAccount = await fetchGameState(program, gameStatePda);

          
            console.log("tttt");
            // const tx: anchor.web3.TransactionSignature = await program.methods
            // .verifyGameState()
            // .accounts({
            //     globalState: globalStatePda,
            //     gameState: gameStatePda,
                
            //     systemProgram: anchor.web3.SystemProgram.programId,
            // })
            // .rpc();

            // const instructions = await program.instruction.verifyGameState(
            //     {
            //       accounts: {
            //         globalState: globalStatePda,
            //         gameState: gameStatePda,
            
            //         systemProgram: anchor.web3.SystemProgram.programId,
            //       },
            //     }
            //   );
          
            //   const latestBlockhashInfo = await connection.getLatestBlockhash("confirmed");
          
            //   const transaction = new anchor.web3.Transaction({
            //     blockhash: latestBlockhashInfo.blockhash,
            //     feePayer: adminWallet.publicKey,
            //     lastValidBlockHeight: latestBlockhashInfo.lastValidBlockHeight,
            //   }).add(instructions);
          

            //   const tx = await sendAndConfirmTransaction(connection, transaction, [
            //     adminWallet,
            //   ]);
              
            //   const tx = await mobileWallet.signAndSendTransaction(
            //     transaction
            //   );
              
            // const transactionSignatures = await mobileWallet.signAndSendTransactions({
                //     transactions: [tx],
                //   });
                

            //     const adminWalletSecretKey = bs58.decode("");
            // const adminWallet = Keypair.fromSecretKey(adminWalletSecretKey);
            // const provider = new anchor.AnchorProvider(connection, adminWallet as any, {
            //     preflightCommitment: "finalized",
            //   });
//                 await connection.confirmTransaction(tx);
// console.log("aaaa");
           

            // const gameVaultPda = await getGameVaultStatePDA(program, globalStateAcc.activeGameId);
            // const gameVaultAccount = await fetchGameVaultState(program, gameVaultPda);
        }
        catch(err){
            console.log("error", err);
        }
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.text}>Solana</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#14F195',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    text: {
        color: '#000000',
        fontSize: 24,
        fontWeight: 'bold',
    },
});