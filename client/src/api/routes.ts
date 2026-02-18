import { API_URL } from "@/lib/config";

export const apiRoutes = {
    candidates: {
        list: () => `${API_URL}/candidates`,
        export: () => `${API_URL}/candidates/export`,
        one: (id: string) => `${API_URL}/candidates/${id}`,
    },
    health: () => `${API_URL}/health`,
};
