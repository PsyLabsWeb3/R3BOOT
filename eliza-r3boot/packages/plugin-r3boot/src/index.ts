import type { Plugin } from "@elizaos/core";
import { generateSmartWalletAction } from "./actions/createSmartWallet"; // Import the Action object
import { eoaWalletProvider } from "./providers/eoaWallet";

export const r3bootPlugin: Plugin = {
    name: "r3boot",
    description: "R3boot integration plugin",
    providers: [],
    evaluators: [],
    services: [],
    actions: [generateSmartWalletAction], 
};

export default r3bootPlugin;