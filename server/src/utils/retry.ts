import { AxiosError } from "axios";
import { sleep } from "./sleep.js";

export async function withRetry<T>(
    fn: () => Promise<T>,
    retries = 3
): Promise<T> {
    let lastError;

    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;

            if (!(err instanceof AxiosError)) break;
            if (err.response?.status && err.response.status < 500) break;

            await sleep(2 ** i * 500);
        }
    }

    throw lastError;
}
