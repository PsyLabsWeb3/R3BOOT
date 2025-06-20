import { ethers, solidityKeccak256, solidityPacked, toUtf8Bytes, randomBytes } from 'ethers';
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
import { rewireABI } from "../constants.ts"; // Adjust the path as necessary
import { sendRewireExamples } from "../examples.ts"; // Adjust the path as necessary

export const sendRewireAction: Action = {
    name: "SEND_REWIRE",
    similes: ["CREATE_REWIRE", "SEND_REWIRE"],
    description: "Create and redeem a ReWire transaction.",
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
            const CONTRACT_ADDR = "0x1Ecc9Cfe5557c78AB20c80D4546AA0465b76Fe07";
            const ABI = rewireABI;

            if (!PRIVATE_KEY || !CONTRACT_ADDR || !ABI.length) {
                throw new Error("❌ Missing required environment variables: PRIVATE_KEY, CONTRACT_ADDR, or REWIRE_ABI.");
            }

            const provider = new ethers.JsonRpcProvider(RPC_URL);
            const signer = new ethers.Wallet(PRIVATE_KEY, provider);
            const rewire = new ethers.Contract(CONTRACT_ADDR, ABI, signer);

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

            elizaLogger.info(`Extracted secret: ${secret}`);

            // Create salt using random bytes
            const salt = randomBytes(32);
            const hexSalt = Buffer.from(randomBytes(16)).toString("hex");

            // Hash the secret
            const secretHash = keccak256(["string", "string"], [secret, hexSalt]);
            elizaLogger.info(`Generated secretHash: ${secretHash}`);

            // Create ReWire transaction
            const txCreate = await rewire.createReWire(secretHash, {
                value: amount,
                gasLimit: 300000000,
            });
            elizaLogger.info(`Tx createReWire hash: ${txCreate.hash}`);
            await txCreate.wait();
            elizaLogger.info('✅ ReWire created successfully');


            callback({
                text: `ReWire created and redeemed successfully.`,
                content: { success: true, createTxHash: txCreate.hash },
            });

            return true;
        } catch (error: any) {
            elizaLogger.error("Error in sendRewireAction: ", error.message);
            callback({
                text: `Failed to execute ReWire action: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: sendRewireExamples as ActionExample[][],
} as Action;