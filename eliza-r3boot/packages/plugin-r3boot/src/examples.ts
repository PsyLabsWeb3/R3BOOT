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
    },
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
    },
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
    },
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
    },
  ],
];

export const createSmartWalletExamples: ActionExample[][] = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "Can you create a smart wallet for me?",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Sure, I will create a smart wallet for you. Your smart wallet address is 0x1234567890abcdef1234567890abcdef12345678",
        action: "CREATE_SMART_WALLET",
      },
    },
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "I need a new smart wallet. Can you set it up?",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me set up a new smart wallet for you. Your smart wallet address is 0x1234567890abcdef1234567890abcdef12345678",
        action: "CREATE_SMART_WALLET",
      },
    },
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Please create a smart wallet for my transactions.",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Creating a smart wallet for your transactions. Your smart wallet address is 0x1234567890abcdef1234567890abcdef12345678",
        action: "CREATE_SMART_WALLET",
      },
    },
  ],
];


export const onRampExamples: ActionExample[][] = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "Can I buy crypto with my credit card?",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Yes, you can buy crypto using your credit card. Please provide the amount and the cryptocurrency you want to purchase.",
        action: "ONRAMP",
      },
    },
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "I want to buy MNT using PayPal. Can you help?",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Sure, I can assist you with buying MNT using PayPal. Please confirm the amount you'd like to purchase.",
        action: "ONRAMP",
      },
    },
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Help me purchase Ethereum in Mantle network with my credit card.",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "I can help you buy Ethereum in Mantle network using your credit card. Let me know the amount you'd like to purchase.",
        action: "ONRAMP",
      },
    },
  ],
];