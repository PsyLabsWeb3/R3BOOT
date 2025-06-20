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
import { sendR3wireExamples } from "../examples.ts"; // Adjust the path as necessary

export const claimR3wireAction: Action = {
    name: "SEND_R3WIRE",
    similes: ["CREATE_REWIRE", "CREATE_R3WIRE", "SEND_REWIRE"],
    description: "Create and redeem a R3wire transaction.",
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
            const CONTRACT_ADDR = "0x95C5E4274336983600c1079a1f1D0c1Bd9Bc7415";
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

            
            const amountContext = `Extract the user's requested amount to transfer from the user's message. The message is: ${_message.content.text} return only the numeric value clean up any spaces at the beginning or end.`;
            let amount = await generateText({
                runtime: _runtime,
                context: amountContext,
                modelClass: ModelClass.SMALL,
                stop: ["\n"],
            });

            elizaLogger.info(`Extracted RAW amount: ${amount}`);

            const amountInEther = amount.trim();
            const value = parseEther(amountInEther);

            elizaLogger.info(`Amount in Ether: ${value}`);

            elizaLogger.info(`Extracted secret: ${secret}`);

            // Create salt using random bytes
            const hexSalt = Buffer.from(randomBytes(16)).toString("hex");

            // Hash the secret
            const secretHash = solidityPackedKeccak256(["string", "string"], [secret, hexSalt]);
            elizaLogger.info(`Generated secretHash: ${secretHash}`);

            // Create R3wire transaction
            const txCreate = await r3wire.createR3wire(secretHash, {
                value
            });
            elizaLogger.info(`Tx createR3wire hash: ${txCreate.hash}`);
            await txCreate.wait();
            elizaLogger.info('R3wire created successfully');


            callback({
                text: `R3wire created successfully. Share the secret with the recipient to redeem it, as well as the salt: ${hexSalt}.`,
                content: { success: true, createTxHash: txCreate.hash },
            });

            return true;
        } catch (error: any) {
            elizaLogger.error("Error in sendr3wireAction: ", error.message);
            callback({
                text: `Failed to execute R3wire action: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: sendR3wireExamples as ActionExample[][],
} as Action;