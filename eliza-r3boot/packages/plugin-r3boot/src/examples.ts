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
    ]
];