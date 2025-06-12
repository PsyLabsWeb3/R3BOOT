import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    generateText,
    ModelClass
} from "@elizaos/core";
import { validateR3bootConfig } from "../environment";
import { fetchBalancesExamples } from "../examples";
import { ethers } from 'ethers';
import { BalanceEntry } from "../types";
import { erc20Abi, tokenIconMap } from "../constants";

const TOKEN_ADDRESSES: string[] = JSON.parse(
    process.env.TOKEN_ADDRESSES || "[]"
);

export const fetchBalancesAction: Action = {
    name: "FETCH_BALANCES",
    similes: [
        "GET_BALANCES",
        "FETCH_BALANCES",
        "RETRIEVE_BALANCES",
        "CHECK_BALANCES",
        "SHOW_BALANCES",
        "BALANCE",
        "BALANCES",
        "WALLET_BALANCE",
        "GET WALLET BALANCE",
        "FETCH WALLET BALANCE",
    ],
    description: "Fetch native and ERC-20 balances on the Mantle Network for a wallet.",
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
        const config = await validateR3bootConfig(_runtime);

        const context = `Extract the user's wallet address from the user's message. The message is:
            ${_message.content.text}

            Only respond with the user's wallet address, do not include any other text.`;

        const walletAddress = await generateText({
            runtime: _runtime,
            context,
            modelClass: ModelClass.SMALL,
            stop: ["\n"],
        });

        elizaLogger.info("Extracted wallet address: ", walletAddress);

        if (!walletAddress || walletAddress.length == 0 || !ethers.isAddress(walletAddress)) {
            callback({ text: "Please provide a valid wallet address." });
            return false;
        }

        // Initialize ethers provider for Mantle
        const provider = new ethers.JsonRpcProvider(config.MANTLE_RPC_URL);
        const results: BalanceEntry[] = [];

        try {
            // Fetch native MNT balance
            const balanceWei = await provider.getBalance(walletAddress);
            const balanceMNT = ethers.formatEther(balanceWei);
            results.push({
                sku: "MNT",
                balance: balanceMNT,
                icon: tokenIconMap["MNT"] ?? null
            });

            // Fetch ERC-20 token balances
            for (const addr of TOKEN_ADDRESSES) {
                const contract = new ethers.Contract(addr, erc20Abi, provider);
                let raw: bigint;
                try {
                    raw = await contract.balanceOf(walletAddress);
                } catch {
                    continue;
                }
                if (raw === 0n) continue;

                let symbol: string;
                let decimals: number;

                try {
                    [symbol, decimals] = await Promise.all([
                        contract.symbol(),
                        contract.decimals(),
                    ]);
                } catch {
                    continue;
                }

                const formattedBalance = ethers.formatUnits(raw, decimals);
                results.push({
                    sku: symbol,
                    balance: formattedBalance,
                    icon: tokenIconMap[symbol] ?? null
                });
            }

            // Return the balances to the agent
            callback({ text: JSON.stringify(results, null, 2) });
            return true;
        } catch (error: any) {
            elizaLogger.error("Error fetching balances: ", error.message);
            callback({
                text: `Failed to fetch balances. Check the address and network configuration: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: fetchBalancesExamples as ActionExample[][],
} as Action;