import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
} from "@elizaos/core";
import { ethers } from "ethers";
import { validateR3bootConfig } from "../environment";
import { fetchMETHBalanceExamples } from "../examples";

export const fetchMETHBalanceAction: Action = {
    name: "FETCH_METH_BALANCE",
    similes: ["FETCH_METH_BALANCE", "GET_METH_BALANCE", "CHECK_METH_BALANCE"],
    description: "Fetch the mETH balance of the configured wallet address.",
    validate: async (runtime: IAgentRuntime) => {
        await validateR3bootConfig(runtime);
        return true;
    },
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        try {
            const config = await validateR3bootConfig(_runtime);

            const METH_TOKEN_ADDRESS = "0x072d71b257ECa6B60b5333626F6a55ea1B0c451c";
            const METH_ABI = [
                "function balanceOf(address) view returns (uint256)",
                "function decimals() view returns (uint8)"
            ];
            const SEPOLIA_RPC_URL = process.env.RPC_SEPOLIA_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY";
            const WALLET_PUBLIC_KEY = process.env.WALLET_PUBLIC_KEY;

            if (!WALLET_PUBLIC_KEY) {
                throw new Error("❌ WALLET_PUBLIC_KEY is not defined in the environment variables.");
            }

            const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
            const methContract = new ethers.Contract(METH_TOKEN_ADDRESS, METH_ABI, provider);

            elizaLogger.info("Fetching mETH balance...");

            const rawBalance = await methContract.balanceOf(WALLET_PUBLIC_KEY);
            const decimals = await methContract.decimals();
            const formattedBalance = ethers.formatUnits(rawBalance, decimals);

            elizaLogger.info(`mETH balance: ${formattedBalance}`);

            callback({
                text: `Your mETH balance is ${formattedBalance}.`,
                content: { balance: formattedBalance },
            });

            return true;
        } catch (error: any) {
            elizaLogger.error("Error fetching mETH balance: ", error.message);
            callback({
                text: `Failed to fetch mETH balance: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: fetchMETHBalanceExamples as ActionExample[][],
} as Action;