import { Plugin } from "@elizaos/core";
import { fetchBalancesAction } from "./actions/fetchBalances";
import { fetchRecentTransactionsAction } from "./actions/fetchRecentTransactions";
import { createSmartWalletAction } from "./actions/createSmartWallet";
import { onRamp } from "./actions/onRamp";
import { stakeETHAction } from "./actions/stakeETH-mETH";
import { fetchMETHBalanceAction } from "./actions/fetchMETHBalance";
import { sendR3wireAction } from "./actions/sendR3wire";

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
    sendR3wireAction,
  ],
  evaluators: [],
  providers: [],
};

export default r3bootPlugin;
