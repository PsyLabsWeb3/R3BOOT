import { Plugin } from "@elizaos/core";
import { fetchBalancesAction } from "./actions/fetchBalances";
import { fetchRecentTransactionsAction } from "./actions/fetchRecentTransactions";
import { createSmartWalletAction } from "./actions/createSmartWallet";

export const r3bootPlugin: Plugin = {
  name: "r3boot",
  description: "r3boot plugin for Eliza",
  actions: [
    fetchBalancesAction,
    fetchRecentTransactionsAction,
    createSmartWalletAction,
  ],
  evaluators: [],
  providers: [],
};

export default r3bootPlugin;
