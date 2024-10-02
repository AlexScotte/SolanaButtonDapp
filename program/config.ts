import * as anchor from "@coral-xyz/anchor";
import { useConnection } from "../components/providers/ConnectionProvider";
import { useMobileWallet } from "../hooks/useMobileWallet";
import { getSolanaButtonProgram, ProgramType } from "./program.idl";

const { connection } = useConnection();
const mobileWallet = useMobileWallet()!;

interface AnchorConfig {
    program: anchor.Program<ProgramType>;
    provider: anchor.AnchorProvider;
}

export function getAnchorConfig(): AnchorConfig {

    const provider = new anchor.AnchorProvider(connection, mobileWallet as any, {
        preflightCommitment: "finalized",
    });
    const program = getSolanaButtonProgram(provider);

    // console.log("🚀 Anchor provider: ", provider);
    // console.log("🆔 Program ID: ", program.programId);

    return {program, provider};
}