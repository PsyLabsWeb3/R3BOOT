import { Plugin } from "@elizaos/core";
import { fetchBalancesAction } from "./actions/fetchBalances";

export const r3bootPlugin: Plugin = {
    name: "r3boot",
    description: "r3boot plugin for Eliza",
    actions: [fetchBalancesAction],
    evaluators: [],
    providers: [],
};

export default r3bootPlugin;