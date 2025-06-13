import { ActionExample } from "@elizaos/core";

export const fetchBalancesExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Please fetch the balances for my wallet: 0x1234567890abcdef1234567890abcdef12345678",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me fetch your wallet's balances.",
                action: "FETCH_BALANCES",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Fetch the balances for this wallet: 0x1234567890abcdef1234567890abcdef12345678",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me fetch the wallet's balances.",
                action: "FETCH_BALANCES",
            },
        }
    ],
];

export const fetchRecentTransactionsExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Please fetch the lastest transactions for my wallet: 0x1234567890abcdef1234567890abcdef12345678",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me fetch your wallet's lastest transactions.",
                action: "FETCH_TRANSACTIONS",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Fetch the lastest transactions for this wallet: 0x1234567890abcdef1234567890abcdef12345678",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me fetch the wallet's lastest transactions.",
                action: "FETCH_TRANSACTIONS",
            },
        }
    ],
];