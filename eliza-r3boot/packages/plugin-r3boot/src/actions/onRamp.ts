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
import { onRampExamples } from "../examples";
import { PrimeSdk } from '@etherspot/prime-sdk'; 
import { JsonRpcProvider } from "ethers";

export const onRamp: Action = {
    name: "ONRAMP",
    similes: [
        "BUY_CRYPTO",
        "BUY_MNT",
        "BUY_CRYPTO_WITH_CREDIT_CARD",
        "BUY_MNT_WITH_CREDIT_CARD",
        "BUY_CRYPTO_WITH_BANK_TRANSFER",
        "BUY_MNT_WITH_BANK_TRANSFER",  
        "BUY_CRYPTO_WITH_PAYPAL",
        "BUY_MNT_WITH_PAYPAL",
    ],
    description: "Onramp users to crypto with tradfi.",
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
            const apiKey = process.env.PRIMESDK_API_KEY;
            const rpcUrl = "https://testnet-rpc.etherspot.io/v2/5003?api-key=etherspot_3ZJdtNqp5Q1NjqTLC9FdG5v8";

            const bundlerProvider = {
                ...new JsonRpcProvider(rpcUrl),
                url: rpcUrl,
            };

            const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, { chainId: 5003, rpcProviderUrl: rpcUrl, bundlerProvider });
            const onRampLink = primeSdk.getFiatOnRamp();


            callback({
                text: `Here you can buy MNT with your prefered pay method. Payment Link: ${onRampLink}`,
                content: { success: true, onRampLink },
            });

            return true;
        } catch (error: any) {
            elizaLogger.error("Error getting payment link: ", error.message);
            callback({
                text: `Error getting payment link: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: onRampExamples as ActionExample[][],
} as Action;