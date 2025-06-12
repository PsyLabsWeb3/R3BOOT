import { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const r3bootEnvSchema = z.object({
    MANTLE_RPC_URL: z.string().min(1, "Mantle RPC URL required"),
});

export type r3bootConfig = z.infer<typeof r3bootEnvSchema>;

export async function validateR3bootConfig(
    runtime: IAgentRuntime
): Promise<r3bootConfig> {
    try {
        const config = {
            MANTLE_RPC_URL: runtime.getSetting("MANTLE_RPC_URL"),
        };
        return r3bootEnvSchema.parse(config);
    } catch (error) {
        console.log("error::::", error);
        if(error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `R3boot configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}