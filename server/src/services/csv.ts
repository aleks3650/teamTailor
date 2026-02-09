import { stringify } from "csv-stringify/sync";
import type { Candidate, JobApplication, CandidateCsvRow } from "../types/index.js";
import { CSV_HEADERS } from "../config/constants.js";

export function buildCsvRows(
    candidates: Candidate[],
    jobApplications: JobApplication[]
): CandidateCsvRow[] {
    const jaMap = new Map(jobApplications.map((ja) => [ja.id, ja]));

    const rows: CandidateCsvRow[] = [];

    for (const candidate of candidates) {
        if (!candidate.jobApplicationIds.length) {
            rows.push({
                candidateId: candidate.id,
                firstName: candidate.firstName ?? "",
                lastName: candidate.lastName ?? "",
                email: candidate.email ?? "",
                jobApplicationId: "",
                jobApplicationCreatedAt: "",
            });
            continue;
        }

        for (const jaId of candidate.jobApplicationIds) {
            const ja = jaMap.get(jaId);
            rows.push({
                candidateId: candidate.id,
                firstName: candidate.firstName ?? "",
                lastName: candidate.lastName ?? "",
                email: candidate.email ?? "",
                jobApplicationId: jaId,
                jobApplicationCreatedAt: ja?.createdAt ?? "",
            });
        }
    }

    return rows;
}

export function generateCsv(rows: CandidateCsvRow[]): string {
    return stringify(rows, {
        header: true,
        columns: CSV_HEADERS,
    });
}
