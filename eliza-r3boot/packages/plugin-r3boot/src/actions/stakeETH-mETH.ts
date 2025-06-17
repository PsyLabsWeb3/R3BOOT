import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    generateText,
    ModelClass,
} from "@elizaos/core";
import { ethers } from "ethers";
import { validateR3bootConfig } from "../environment";
import { stakeETHExamples } from "../examples";



export const stakeETHAction: Action = {
    name: "STAKE_ETH",
    similes: ["STAKE_ETH", "STAKE_ETH_TOKENS", "STAKE_ETH_METH", "STAKE_ETH_SEPOLIA"],
    description: "Stake ETH into the staking contract.",
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
        try {
            const config = await validateR3bootConfig(_runtime);

            const STAKING_CONTRACT_ADDRESS = process.env.STAKING_CONTRACT_ADDRESS;
            const STAKING_ABI = ["function stake(uint256 minMETHAmount)"];
            const SEPOLIA_RPC_URL = process.env.RPC_SEPOLIA_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY";
            const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

            if (!PRIVATE_KEY) {
                throw new Error("❌ WALLET_PRIVATE_KEY is not defined in the environment variables.");
            }

            const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
            const signer = new ethers.Wallet(PRIVATE_KEY, provider);
            const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);


            const amountContext = `Extract the user's requested amount to transfer from the user's message. The message is: ${_message.content.text} return only the numeric value clean up any spaces at the beginning or end.`;
            let amount = await generateText({
                runtime: _runtime,
                context: amountContext,
                modelClass: ModelClass.SMALL,
                stop: ["\n"],
            });

            elizaLogger.info(`Extracted RAW amount: ${amount}`);


            // Sanitize and validate the amount
            // amount= amount.replace(/[^\d]/g, ''); // Remove non-numeric characters
            // if (!amount) {
            //     throw new Error("Invalid amount extracted from the message.");
            // }

            elizaLogger.info(`Extracted amount: ${amount}`);
            const balance = await provider.getBalance("0x1f2210714e351de0cacb2d86fd7b6d9a72e272ea");
            elizaLogger.info(`Balance: ${ethers.formatEther(balance)} ETH`);
            
            // const transferAmount = BigInt(amount);

            const stakeAmount = ethers.parseEther(amount); // Convert to BigNumber in wei
            elizaLogger.info(`Stake amount in wei: ${stakeAmount.toString()}`);
            elizaLogger.info(`Stake amount in ETH: ${ethers.formatEther(stakeAmount)}`);

            if (!stakeAmount) {
                throw new Error("❌ Stake amount is not provided in the options.");
            }

            const minMETH = ethers.parseEther("0.01"); // Assuming minMETH is the same as stakeAmount for simplicity

            const tx = await stakingContract.stake(
                
                minMETH,
                {value: stakeAmount, gasLimit: 30000000 }
              );
            await tx.wait();

            elizaLogger.info(`Successfully staked ${ethers.formatEther(stakeAmount)} ETH. Transaction hash: ${tx.hash}`);

            callback({
                text: `Successfully staked ${ethers.formatEther(stakeAmount)} ETH. Transaction hash: ${tx.hash}`,
                content: { success: true, transactionHash: tx.hash },
            });

            return true;
        } catch (error: any) {
            elizaLogger.error("Error staking ETH: ", error.message);
            callback({
                text: `Failed to stake ETH: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: stakeETHExamples as ActionExample[][],
} as Action;