import { API_URL } from "@/lib/config";

export const apiRoutes = {
    candidates: {
        list: () => `${API_URL}/candidates`,
        export: () => `${API_URL}/candidates/export`,
    },
    health: () => `${API_URL}/health`,
};
