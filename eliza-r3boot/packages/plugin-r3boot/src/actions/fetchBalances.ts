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

        if (!walletAddress || walletAddress.length == 0 || !ethers.isAddress(walletAddress)) {
            callback({ text: "Please provide a valid wallet address." });
            return false;
        }

        // Initialize ethers provider for Mantle
        const provider = new ethers.JsonRpcProvider(config.MANTLE_RPC_URL);

        try {
            // Fetch native MNT balance
            const balanceWei = await provider.getBalance(walletAddress);
            const balanceMNT = ethers.formatEther(balanceWei);
            let resultText = `Mantle (MNT) balance: ${balanceMNT}\n`;

            // Fetch ERC-20 token balances
            const erc20Abi = [
                "function balanceOf(address) view returns (uint256)",
                "function symbol() view returns (string)",
                "function decimals() view returns (uint8)"
            ];

            const tokenAddresses = [
                '0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111',   // ETH (wETH)
                '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',   // USDC
                '0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE'    // USDT
            ];

            for (const tokenAddr of tokenAddresses) {
                const tokenContract = new ethers.Contract(tokenAddr, erc20Abi, provider);
                const [rawBal, symbol, decimals] = await Promise.all([
                    tokenContract.balanceOf(walletAddress),
                    tokenContract.symbol(),
                    tokenContract.decimals()
                ]);
                const formatted = ethers.formatUnits(rawBal, decimals);
                if (rawBal.gt(0)) {
                    resultText += `${symbol} balance: ${formatted}\n`;
                }
            }

            // Return the balances to the agent
            callback({ text: resultText || "No token balances found." });
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