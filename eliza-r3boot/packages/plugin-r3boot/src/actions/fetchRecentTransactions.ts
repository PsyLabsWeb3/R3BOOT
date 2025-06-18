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
import { fetchRecentTransactionsExamples } from "../examples";
import fetch from "node-fetch";
import { ethers } from 'ethers';
import { TransactionEntry } from "../types";

// Generic type for Blockscout API responses
interface BlockscoutResponse<T> {
    status: string;
    message: string;
    result: T;
}

const TOKEN_ADDRESSES: string[] = JSON.parse(
    process.env.TOKEN_ADDRESSES || "[]"
);

export const fetchRecentTransactionsAction: Action = {
    name: "FETCH_TRANSACTIONS",
    similes: [
        "GET_TRANSACTIONS",
        "FETCH_TRANSACTIONS",
        "RETRIEVE_TRANSACTIONS",
        "CHECK_TRANSACTIONS",
        "SHOW_TRANSACTIONS",
        "TRANSACTION",
        "TRANSACTIONS",
        "WALLET_TRANSACTIONS",
        "GET WALLET TRANSACTIONS",
        "FETCH WALLET TRANSACTIONS",
    ],
    description: "Fetch the last 10 native and ERC-20 transactions on Mantle.",
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

        try {
            // Fetch native MNT transactions
            const nativeRes = await fetch(
                `${config.MANTLE_EXPLORER_API_URL}/api?module=account&action=txlist&address=${walletAddress}`
            );
            const nativeJson = (await nativeRes.json()) as BlockscoutResponse<any[]>;
            const nativeTxs: TransactionEntry[] = nativeJson.result.map(
                (tx): TransactionEntry => {
                    const txType: TransactionEntry['type'] =
                        tx.from.toLowerCase() === walletAddress ? "Sent" : "Received";
                    const txStatus: TransactionEntry['status'] =
                        tx.txreceipt_status === "1" ? "Completed" : "Pending";
                    return {
                        type: txType,
                        from: tx.from,
                        to: tx.to,
                        amount: `${(Number(tx.value) / 1e18).toString()} MNT`,
                        status: txStatus,
                        timestamp: Number(tx.timeStamp),
                        link: `${config.MANTLE_EXPLORER_API_URL}/tx/${tx.hash}`,
                    };
                }
            );

            // Fetch ERC-20 token transactions
            const tokenRes = await fetch(
                `${config.MANTLE_EXPLORER_API_URL}/api?module=account&action=tokentx&address=${walletAddress}`
            );
            const tokenJson = (await tokenRes.json()) as BlockscoutResponse<any[]>;
            const tokenTxs: TransactionEntry[] = tokenJson.result
                .filter(tx =>
                    TOKEN_ADDRESSES.map(a => a.toLowerCase()).includes(tx.contractAddress.toLowerCase())
                )
                .map(
                    (tx): TransactionEntry => {
                        const txType: TransactionEntry['type'] =
                            tx.from.toLowerCase() === walletAddress ? "Sent" : "Received";
                        const txStatus: TransactionEntry['status'] =
                            tx.txreceipt_status === "1" ? "Completed" : "Pending";
                        return {
                            type: txType,
                            from: tx.from,
                            to: tx.to,
                            amount: `${(Number(tx.value) / 10 ** Number(tx.tokenDecimal)).toString()} ${tx.tokenSymbol}`,
                            status: txStatus,
                            timestamp: Number(tx.timeStamp),
                            link: `${config.MANTLE_EXPLORER_API_URL}/tx/${tx.hash}`,
                        };
                    }
                );

            // Merge, sort by timestamp desc, take top 10
            const allTxs: TransactionEntry[] = [...nativeTxs, ...tokenTxs]
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 10);

            callback({ text: JSON.stringify(allTxs, null, 2) });
            return true;
        } catch (error: any) {
            console.error("Error fetching transactions:", error.message);
            callback({
                text: `Failed to fetch recent transactions:: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: fetchRecentTransactionsExamples as ActionExample[][],
} as Action;