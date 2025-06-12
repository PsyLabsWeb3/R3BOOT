import { formatEther } from "viem";
import { PrimeSdk } from "@etherspot/prime-sdk";
import {
    type Action,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    type State,
} from "@elizaos/core";
import { eoaWalletProvider } from "../providers/eoaWallet";

export class CreateSmartWallet {
    constructor(private eoaWallet: eoaWalletProvider) {}

    async generateEtherspotWallet(): Promise<string> {
        const privateKey = process.env.WALLET_PRIVATE_KEY;
        if (!privateKey) {
            throw new Error("WALLET_PRIVATE_KEY is not defined in the environment variables.");
        }

        const primeSdk = new PrimeSdk({ privateKey }, { chainId: 5000, projectKey: "" });
        const address = await primeSdk.getCounterFactualAddress();

        console.log("\x1b[33m%s\x1b[0m", `EtherspotWallet address: ${address}`);
        return address;
    }
}

export const generateSmartWalletAction: Action = {
    name: "generateSmartWallet",
    description: "Generate a new Etherspot smart wallet",

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: any,
        callback?: HandlerCallback
    ) => {
        try {
            if (!state) {
                state = (await runtime.composeState(message)) as State;
            } else {
                state = await runtime.updateRecentMessageState(state);
            }

            console.log("smartWallet action handler called");

            const eoaWallet = new eoaWalletProvider();
            const smartWallet = new CreateSmartWallet(eoaWallet);

            const walletAddress = await smartWallet.generateEtherspotWallet();

            console.log(`Generated smart wallet address: ${walletAddress}`);

            // Example: Add logic for transfer or other operations here
            // const paramOptions = await buildTransferDetails(state, runtime, walletAddress);
            // const transferResp = await action.transfer(paramOptions);

            if (callback) {
                callback({
                    text: `Smart wallet created successfully. Address: ${walletAddress}`,
                    content: { success: true, walletAddress },
                });
            }

            return true;
        } catch (error) {
            console.error("Error in generateSmartWalletAction handler:", error);
            if (callback) {
                callback({
                    text: `Error creating smart wallet: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },

    validate: async (runtime: IAgentRuntime) => {
        const privateKey = runtime.getSetting("EVM_PRIVATE_KEY");
        return typeof privateKey === "string" && privateKey.startsWith("0x");
    },

    examples: [
        [
            {
                user: "assistant",
                content: {
                    text: "Create a new smart wallet",
                    action: "CREATE_SMART_WALLET",
                },
            },
            {
                user: "user",
                content: {
                    text: "Create a new crypto wallet",
                    action: "CREATE_SMART_WALLET",
                },
            },
        ],
    ],

    similes: ["CREATE_WALLET", "CREATE_SMART_WALLET", "CREATE_ETHERSPOT_WALLET", "CREATE_EVM_WALLET"],
};