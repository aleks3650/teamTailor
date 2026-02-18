import { createQueryKeyStore } from "@lukemorales/query-key-factory";

export const queryKeys = createQueryKeyStore({
    candidates: {
        all: null,
        one: (id: string) => [id],
    },
});
