import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    generateText,
    ModelClass,
} from "@elizaos/core";
import { validateR3bootConfig } from "../environment";
import { ethers } from "ethers";
import { createSmartWalletExamples } from "../examples";

export const createSmartWalletAction: Action = {
    name: "CREATE_SMART_WALLET",
    similes: [
        "CREATE_WALLET",
        "CREATE_SMART_WALLET",
        "CREATE_ETHERSPOT_WALLET",
        "CREATE_EVM_WALLET",
    ],
    description: "Generate a new Etherspot smart wallet.",
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

            // const privateKey = process.env.WALLET_PRIVATE_KEY;
            // if (!privateKey) {
            //     throw new Error("WALLET_PRIVATE_KEY is not defined in the environment variables.");
            // }

             // Generate a random EOA wallet asynchronously
             const generateRandomEOA = async () => {
                const randomWallet = ethers.Wallet.createRandom();
                return {
                    address: randomWallet.address,
                    privateKey: randomWallet.privateKey,
                };
            };

            const { address: eoaAddress, privateKey } = await generateRandomEOA();

            elizaLogger.info("Generated EOA wallet address: ", eoaAddress);
            elizaLogger.info("Generated private key: ", privateKey);

            const primeSdk = new ethers.Wallet(privateKey);
            const walletAddress = await primeSdk.getAddress();

            elizaLogger.info("Generated smart wallet address: ", walletAddress);

            callback({
                text: `Smart wallet created successfully. Address: ${walletAddress}`,
                content: { success: true, walletAddress },
            });

            return true;
        } catch (error: any) {
            elizaLogger.error("Error creating smart wallet: ", error.message);
            callback({
                text: `Failed to create smart wallet: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: createSmartWalletExamples as ActionExample[][],
} as Action;