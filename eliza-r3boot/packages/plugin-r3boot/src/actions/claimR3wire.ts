import { ethers, randomBytes, solidityPackedKeccak256, parseEther } from 'ethers';
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
import { r3wireABI } from "../constants.ts"; // Adjust the path as necessary
import { claimR3wireExamples } from "../examples.ts"; // Adjust the path as necessary

export const claimR3wireAction: Action = {
    name: "CLAIM_R3WIRE",
    similes: ["REDEEM_R3WIRE", "CLAIM_REWIRE", "REDEEM_REWIRE"],
    description: "Redeem a R3wire transaction.",
    validate: async (_runtime: IAgentRuntime) => {
        // Add any necessary validation logic here
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
            const RPC_URL = process.env.MANTLE_RPC_URL;
            const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
            const CONTRACT_ADDR = "0xe68F9c15Fe0e0Fcaece955cdc775ec609A693691";
            const ABI = r3wireABI;

            if (!PRIVATE_KEY || !CONTRACT_ADDR) {
                throw new Error("Missing required environment variables: PRIVATE_KEY or CONTRACT_ADDR.");
            }

            const provider = new ethers.JsonRpcProvider(RPC_URL);
            const signer = new ethers.Wallet(PRIVATE_KEY, provider);
            const r3wire = new ethers.Contract(CONTRACT_ADDR, ABI, signer);

            // Extract secret from the user's message
            const secretContext = `Extract the secret from the user's message. The message is: ${_message.content.text} return only the secret without any additional text. Make sure to clean up any spaces at the beginning or end and trim any apostrophes.`;
            const secret = await generateText({
                runtime: _runtime,
                context: secretContext,
                modelClass: ModelClass.SMALL,
                stop: ["\n"],
            });

            elizaLogger.info(`Extracted secret: ${secret}`);

            // Extract salt from the user's message
            const saltContext = `Extract the salt from the user's message. The message is: ${_message.content.text} return only the salt without any additional text. Make sure to clean up any spaces at the beginning or end and trim any apostrophes.`;
            const salt = await generateText({
                runtime: _runtime,
                context: secretContext,
                modelClass: ModelClass.SMALL,
                stop: ["\n"],
            });

            elizaLogger.info(`Extracted salt: ${salt}`);

            // Claim R3wire transaction
            const txCreate = await r3wire.claimR3wire(secret, salt);

            elizaLogger.info(`Tx claimR3wire hash: ${txCreate.hash}`);
            await txCreate.wait();
            elizaLogger.info('R3wire claimed successfully');

            callback({
                text: `R3wire claimed successfully. Check your balance to confirm your new funds.`,
                content: { success: true, createTxHash: txCreate.hash },
            });

            return true;
        } catch (error: any) {
            elizaLogger.error("Error in claimR3wireAction: ", error.message);
            callback({
                text: `Failed to execute R3wire action: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: claimR3wireExamples as ActionExample[][],
} as Action;