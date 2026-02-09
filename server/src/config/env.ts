import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default("3000").transform(Number),
    TEAMTAILOR_API_KEY: z.string().min(1, "TEAMTAILOR_API_KEY is required"),
    TEAMTAILOR_API_URL: z
        .string()
        .url()
        .default("https://api.teamtailor.com/v1"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variables:");
    console.error(parsed.error.format());
    process.exit(1);
}

export const env = parsed.data;