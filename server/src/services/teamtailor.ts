import axios from "axios";
import { env } from "../config/env.js";
import {
    CandidatesResponseSchema,
    type Candidate,
    type JobApplication,
} from "../types/index.js";

const API_VERSION = "20240404";

const headers = {
    Authorization: `Token token=${env.TEAMTAILOR_API_KEY}`,
    "X-Api-Version": API_VERSION,
    "Content-Type": "application/vnd.api+json",
};

const client = axios.create({
    baseURL: env.TEAMTAILOR_API_URL,
    timeout: 30000,
    headers,
});

async function fetchPage(url: string) {
    const isFullUrl = url.startsWith("http");
    const response = isFullUrl
        ? await axios.get(url, { headers, timeout: 30000 })
        : await client.get(url);

    return CandidatesResponseSchema.parse(response.data);
}

export async function fetchAllCandidates(): Promise<{
    candidates: Candidate[];
    jobApplications: JobApplication[];
}> {
    const allCandidates: Candidate[] = [];
    const allJobApplications: JobApplication[] = [];

    let nextUrl: string | undefined = "/candidates?include=job-applications&page[size]=30";

    while (nextUrl) {
        const page = await fetchPage(nextUrl);

        allCandidates.push(...page.candidates);
        allJobApplications.push(...page.jobApplications);

        console.log(`Fetched ${allCandidates.length}/${page.meta.recordCount}`);

        nextUrl = page.nextPage;
    }

    return { candidates: allCandidates, jobApplications: allJobApplications };
}
