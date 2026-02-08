import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { fetchAllCandidates } from "./services/teamtailor.js";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/api/test", async (req, res) => {
    try {
        const { candidates, jobApplications } = await fetchAllCandidates();

        res.json({
            candidatesCount: candidates.length,
            jobApplicationsCount: jobApplications.length,
        });
    } catch (error) {
        console.error("API error:", error);
        res.status(500).json({ error: "Failed to fetch candidates" });
    }
});

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});