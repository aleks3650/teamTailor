import axios from "axios";
import { apiRoutes } from "./routes";
import type { CandidateRow } from "@/types";

export async function fetchCandidates(): Promise<CandidateRow[]> {
    const response = await axios.get<CandidateRow[]>(apiRoutes.candidates.list());
    return response.data;
}

export async function downloadCsv(): Promise<Blob> {
    const response = await axios.get(apiRoutes.candidates.export(), {
        responseType: "blob",
    });
    return response.data;
}
