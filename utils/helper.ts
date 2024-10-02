import { BN } from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { GameStateAccount } from "../program/programTypes";

export function lamportInSol(lamport: BN): BN {
    return lamport / new BN(LAMPORTS_PER_SOL);
}

export function getShortAddress(address: string): string {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function calculateRemainingTime(gameState: GameStateAccount){

    // const currentTimed = Math.floor((Date.now() - 5 * 1000) / 1000); // current time in seconds

    const lastClickTimeStamp = gameState.lastClickTimestamp ?
        gameState.lastClickTimestamp.toNumber() 
        : Math.floor(Date.now() / 1000);

    const gameDuration = gameState.gameTimeSec;

    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    console.log("Current time: ", currentTime);

    const timeElapsed = currentTime - lastClickTimeStamp; // elapsed time since last click

    const remainingTime = gameDuration - timeElapsed; // remaining time after last click
    
    // console.log("Remaining time: ", remainingTime);
    const hours = Math.floor(remainingTime / 3600); // hours
    const minutes = Math.floor((remainingTime % 3600) / 60); // minutes
    const seconds = remainingTime % 60; // seconds

    
    console.log(`Remaining time: ${hours} hours, ${minutes} minutes and ${seconds} seconds`);
    return remainingTime;
}
  
export function getHourMinuteSecond(remainingTime: number) {
    const hours = Math.floor(remainingTime / 3600); // hours
    const minutes = Math.floor((remainingTime % 3600) / 60); // minutes
    const seconds = remainingTime % 60; // seconds
    return { hours, minutes, seconds };
}