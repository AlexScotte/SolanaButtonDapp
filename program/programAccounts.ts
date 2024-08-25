import * as anchor from "@coral-xyz/anchor";
import { ProgramType } from "./program.idl";
import { GameStateAccount, GameVaultStateAccount, GlobalStateAccount } from "./programTypes";

const SEED_GLOBAL = "global";
const SEED_GAME = "game";
const SEED_VAULT = "vault";
const ERROR_PROGRAM_ID = "Program ID not found";
const ERROR_PDA = "PDA not found";

/**
 * Get the global state account Program Derived Address
 * composed of the seed "global"
 * @param program Solana program
 * @returns Global state Program Derived Address
 */
export async function getGlobalStatePDA(program : anchor.Program<ProgramType>) 
    : Promise<anchor.web3.PublicKey> {
    
    if(!program.programId)
        throw new Error(ERROR_PROGRAM_ID);
    
    try{
        const [globalStatePda] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(SEED_GLOBAL)],
            program.programId
        );
    
        console.log("Global State PDA: ", globalStatePda);
        return globalStatePda;
    }
    catch(err){
        console.log("Error when getting global state PDA: ", err);
        throw err;
    }
}


/**
 * Get the game state account Program Derived Address
 * composed of the seed "game" and the game ID
 * @param program Solana program
 * @param gameId Game ID
 * @returns Game state Program Derived Address
 */
export async function getGameStatePDA(program : anchor.Program<ProgramType>, gameId: number) 
    : Promise<anchor.web3.PublicKey> {
    
    if(!program.programId)
        throw new Error(ERROR_PROGRAM_ID);
    
    try{
        const [gameStatePda] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(SEED_GAME), new anchor.BN(gameId).toArrayLike(Buffer, "le", 8)],
            program.programId
        );
    
        console.log("Game State PDA: ", gameStatePda);
        return gameStatePda;
    }
    catch(err){
        console.log("Error when getting game state PDA: ", err);
        throw err;
    }
}


/**
 * Get the game vault account Program Derived Address
 * composed of the seed "vault" and the game ID
 * @param program Solana program
 * @param gameId Game ID
 * @returns Game vault state Program Derived Address
 */
export async function getGameVaultStatePDA(program : anchor.Program<ProgramType>, gameId: number) 
    : Promise<anchor.web3.PublicKey> {
    
    if(!program.programId)
        throw new Error(ERROR_PROGRAM_ID);
    
    try{
        const [gameVaultStatePda] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(SEED_VAULT), new anchor.BN(gameId).toArrayLike(Buffer, "le", 8)],
            program.programId
        );
    
        console.log("Game Vault State PDA: ", gameVaultStatePda);
        return gameVaultStatePda;
    }
    catch(err){
        console.log("Error when getting game vault state PDA: ", err);
        throw err;
    }
}


/**
 * Fetch the global state account
 * @param program Solana program 
 * @param globalStatePda Global state Program Derived Address
 * @returns Global state account
 */
export async function fetchGlobalState(program : anchor.Program<ProgramType>, globalStatePda: anchor.web3.PublicKey) 
    : Promise<GlobalStateAccount> {
    
    if(!program.programId)
        throw new Error(ERROR_PROGRAM_ID)

    if(!globalStatePda)
        throw new Error(ERROR_PDA);
    
    try{
        const globalStateAccount: GlobalStateAccount = await program.account.globalState.fetch(globalStatePda);
        console.log("📋 Global state account: ", globalStateAccount);
        return globalStateAccount;
    }
    catch(err){
        console.log("Error when fetching global state account: ", err);
        throw err;
    }
}

/**
 * Fetch the game state account
 * @param program Solana program 
 * @param gameStatePda Game state Program Derived Address
 * @returns Game state account
 */
export async function fetchGameState(program : anchor.Program<ProgramType>, gameStatePda: anchor.web3.PublicKey) 
    : Promise<GameStateAccount> {
    
    if(!program.programId)
        throw new Error(ERROR_PROGRAM_ID)

    if(!gameStatePda)
        throw new Error(ERROR_PDA);
    
    try{
        const gameStateAccount: GameStateAccount = await program.account.gameState.fetch(gameStatePda);
        console.log("🎮 Game state account: ", gameStateAccount);
        return gameStateAccount;
    }
    catch(err){
        console.log("Error when fetching game state account: ", err);
        throw err;
    }
}

/**
 * Fetch the game vault account
 * @param program Solana program 
 * @param gameVaultPda Game vault Program Derived Address
 * @returns Game vault account
 */
export async function fetchGameVaultState(program : anchor.Program<ProgramType>, gameVaultPda: anchor.web3.PublicKey) 
    : Promise<GameVaultStateAccount> {
    
    if(!program.programId)
        throw new Error(ERROR_PROGRAM_ID)

    if(!gameVaultPda)
        throw new Error(ERROR_PDA);
    
    try{
        const gameVaultStateAccount: GameVaultStateAccount = await program.account.vault.fetch(gameVaultPda);
        console.log("🪙 Game Vault state account: ", gameVaultStateAccount);
        return gameVaultStateAccount;
    }
    catch(err){
        console.log("Error when fetching game vault state account: ", err);
        throw err;
    }
}