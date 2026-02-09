import { Router } from "express";
import type { RequestHandler } from "express";
import { fetchAllCandidates } from "../services/teamtailor.js";
import { buildCsvRows, generateCsv } from "../services/csv.js";

export const candidatesRouter = Router();

const listHandler: RequestHandler = async (_req, res, next) => {
    try {
        const { candidates, jobApplications } = await fetchAllCandidates();
        const rows = buildCsvRows(candidates, jobApplications);
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

const exportHandler: RequestHandler = async (_req, res, next) => {
    try {
        const { candidates, jobApplications } = await fetchAllCandidates();
        const rows = buildCsvRows(candidates, jobApplications);
        const csv = generateCsv(rows);

        const filename = `candidates_${new Date().toISOString().split("T")[0]}.csv`;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("X-Total-Rows", String(rows.length));
        res.setHeader("Access-Control-Expose-Headers", "X-Total-Rows");
        res.send(csv);
    } catch (error) {
        next(error);
    }
};

candidatesRouter.get("/", listHandler);
candidatesRouter.get("/export", exportHandler);

