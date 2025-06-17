import { Plugin } from "@elizaos/core";
import { fetchBalancesAction } from "./actions/fetchBalances";
import { fetchRecentTransactionsAction } from "./actions/fetchRecentTransactions";
import { createSmartWalletAction } from "./actions/createSmartWallet";
import { onRamp } from "./actions/onRamp";
import { stakeETHAction } from "./actions/stakeETH-mETH";
import { fetchMETHBalanceAction } from "./actions/fetchMETHBalance";

export const r3bootPlugin: Plugin = {
  name: "r3boot",
  description: "r3boot plugin for Eliza",
  actions: [
    fetchBalancesAction,
    fetchRecentTransactionsAction,
    createSmartWalletAction,
    onRamp,
    stakeETHAction,
    fetchMETHBalanceAction,
  ],
  evaluators: [],
  providers: [],
};

export default r3bootPlugin;
