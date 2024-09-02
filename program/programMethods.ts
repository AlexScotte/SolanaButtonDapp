import * as anchor from "@coral-xyz/anchor";
import { ProgramType } from "./program.idl";
import { fetchGameState, fetchGameVaultState, fetchGlobalState, getGameStatePDA, getGameVaultStatePDA, getGlobalStatePDA } from "./programAccounts";
import { GameStateAccount, GameVaultStateAccount, GlobalStateAccount } from "./programTypes";
import { useConnection } from '../components/providers/ConnectionProvider';
import { useMobileWallet, MobileWallet } from '../hooks/useMobileWallet';

/**
 * Call the program to verify the game state
 * @param program Solana program
 * @returns Transaction signature
 */
export async function verifyGameState(connection: anchor.web3.Connection, program: anchor.Program<ProgramType>)
    : Promise<anchor.web3.TransactionSignature> {

    try {
        console.log("⌛ Trying to verify the game state");

        const globalStatePda: anchor.web3.PublicKey = await getGlobalStatePDA(program);
        const globaleStateAccount: GlobalStateAccount = await fetchGlobalState(program, globalStatePda);

        const gameStatePda: anchor.web3.PublicKey = await getGameStatePDA(program, globaleStateAccount.activeGameId);

        const tx: anchor.web3.TransactionSignature = await program.methods
            .verifyGameState()
            .accounts({
                globalState: globalStatePda,
                gameState: gameStatePda,
            })
            .rpc();

            console.log("📝 Transaction signature: ", tx);

            await connection.confirmTransaction(tx);

            console.log("✅ Game verified successfully");

            return tx;
    }
    catch (err) {
        console.log("Error when verifying game state: ", err);
        throw err;
    }
}

/**
 * Call the program to perform a click button
 * @param program Solana Program
 * @returns Transaction signature
 */
export async function clickButton(connection: anchor.web3.Connection, mobileWallet: MobileWallet, program: anchor.Program<ProgramType>)
    : Promise<anchor.web3.TransactionSignature> {

    try {
        console.log("⌛ Trying to click on the button");

        const globalStatePda: anchor.web3.PublicKey = await getGlobalStatePDA(program);
        const globaleStateAccount: GlobalStateAccount = await fetchGlobalState(program, globalStatePda);

        const gameStatePda: anchor.web3.PublicKey = await getGameStatePDA(program, globaleStateAccount.activeGameId);

        const gameVaultPda: anchor.web3.PublicKey = await getGameVaultStatePDA(program, globaleStateAccount.activeGameId);
        const gameVaultAccount: GameVaultStateAccount = await fetchGameVaultState(program, gameVaultPda);

        // const tx: anchor.web3.TransactionSignature = await program.methods
        //     .verifyGameState()
        //     .accounts({
        //         globalState: globalStatePda,
        //         gameState: gameStatePda,

        //         systemProgram: anchor.web3.SystemProgram.programId,
        //     })
        //     .rpc();

  const instructions = await program.instruction.verifyGameState(
            {
              accounts: {
                globalState: globalStatePda,
                gameState: gameStatePda,
        
                systemProgram: anchor.web3.SystemProgram.programId,
              },
            }
          );




        // const tx: anchor.web3.TransactionSignature = await program.methods
        //     .clickButton(new anchor.BN(gameVaultAccount.depositAmount))
        //     .accounts({
        //         globalState: globalStatePda,
        //         gameState: gameStatePda,
        //         vault: gameVaultPda,
        //         user: mobileWallet.publicKey,

        //         systemProgram: anchor.web3.SystemProgram.programId,
        //     })
        //     .rpc();

        // const instructions = await program.instruction.clickButton(
        //     new anchor.BN(gameVaultAccount.depositAmount),
        //     {
        //       accounts: {
        //         globalState: globalStatePda,
        //         gameState: gameStatePda,
        //         vault: gameVaultPda,
        //         user: mobileWallet.publicKey,
        
        //         systemProgram: anchor.web3.SystemProgram.programId,
        //       },
        //     }
        //   );
      
          const latestBlockhashInfo = await connection.getLatestBlockhash("confirmed");
      
          const transaction = new anchor.web3.Transaction({
            blockhash: latestBlockhashInfo.blockhash,
            feePayer: mobileWallet.publicKey,
            lastValidBlockHeight: latestBlockhashInfo.lastValidBlockHeight,
          }).add(instructions);
      
          console.log(mobileWallet);
          const tx = await mobileWallet.signAndSendTransaction(
            transaction
          );

            console.log("📝 Transaction signature", tx);

            await connection.confirmTransaction(tx);

            console.log("✅ Click button done successfully");

            return tx;
    }
    catch (err) {
        console.log("Error when clicking on the button: ", err);
        throw err;
    }
}

/**
 * Call the program to claim the reward
 * @param program Solana Program
 * @param gameStatePda Game state Program Derived Address (user can claim reward from past game state)
 * @param gameVaultPda Game vault Program Derived Address (user can claim reward from past game state)
 * @returns Transaction signature
 */
export async function claimReward(connection: anchor.web3.Connection, mobileWallet: MobileWallet, program: anchor.Program<ProgramType>, gameStatePda: anchor.web3.PublicKey, gameVaultPda: anchor.web3.PublicKey)
    : Promise<anchor.web3.TransactionSignature> {

    try {
        console.log("⌛ Trying to claim the reward");

        const tx: anchor.web3.TransactionSignature = await program.methods
            .claimReward()
            .accounts({
                gameState: gameStatePda,
                vault: gameVaultPda,
                user: mobileWallet.publicKey,

                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

            console.log("📝 Transaction signature", tx);

            await connection.confirmTransaction(tx);

            console.log("✅ Reward claimed successfully");

            return tx;
    }
    catch (err) {
        console.log("Error when claiming the reward: ", err);
        throw err;
    }
}