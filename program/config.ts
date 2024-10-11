import * as anchor from "@coral-xyz/anchor";
import { ConnectionContextState, useConnection } from "../components/providers/ConnectionProvider";
import { MobileWallet, useMobileWallet } from "../hooks/useMobileWallet";
import { getSolanaButtonProgram, ProgramType } from "./program.idl";


interface AnchorConfig {
    program: anchor.Program<ProgramType>;
    provider: anchor.AnchorProvider;
}

export function getAnchorConfig(connection: anchor.web3.Connection, mobileWallet: MobileWallet): AnchorConfig {

    const provider = new anchor.AnchorProvider(connection, mobileWallet, {
        preflightCommitment: "finalized",
    });
    const program = getSolanaButtonProgram(provider);

    // console.log("🚀 Anchor provider: ", provider);
    // console.log("🆔 Program ID: ", program.programId);

    return {program, provider};
}