import pLimit from "p-limit";
import axios from "axios";
import { env } from "../config/env.js";
import { API_VERSION, PAGE_SIZE, CONCURRENT_REQUESTS, REQUEST_TIMEOUT } from "../config/constants.js";
import { withRetry } from "../utils/index.js";
import {
    CandidatesResponseSchema,
    type Candidate,
    type JobApplication,
    type CandidatesResponse,
} from "../types/index.js";

const headers = {
    Authorization: `Token token=${env.TEAMTAILOR_API_KEY}`,
    "X-Api-Version": API_VERSION,
    "Content-Type": "application/vnd.api+json",
};

const client = axios.create({
    baseURL: env.TEAMTAILOR_API_URL,
    timeout: REQUEST_TIMEOUT,
    headers,
});

async function fetchPage(path: string): Promise<CandidatesResponse> {
    return withRetry(async () => {
        const response = await client.get(path);
        return CandidatesResponseSchema.parse(response.data);
    });
}

export async function fetchAllCandidates(): Promise<{
    candidates: Candidate[];
    jobApplications: JobApplication[];
}> {
    const firstPage = await fetchPage(`/candidates?include=job-applications&page[size]=${PAGE_SIZE}`);

    const allCandidates: Candidate[] = [...firstPage.candidates];
    const allJobApplications: JobApplication[] = [...firstPage.jobApplications];
    const totalPages = firstPage.meta.pageCount;

    if (totalPages <= 1) {
        return { candidates: allCandidates, jobApplications: allJobApplications };
    }

    const pageUrls: string[] = [];
    for (let page = 2; page <= totalPages; page++) {
        pageUrls.push(`/candidates?include=job-applications&page[size]=${PAGE_SIZE}&page[number]=${page}`);
    }

    const limit = pLimit(CONCURRENT_REQUESTS);
    const pagePromises = pageUrls.map((url) =>
        limit(async () => {
            const page = await fetchPage(url);
            return page;
        })
    );

    const pages = await Promise.all(pagePromises);

    for (const page of pages) {
        allCandidates.push(...page.candidates);
        allJobApplications.push(...page.jobApplications);
    }

    return { candidates: allCandidates, jobApplications: allJobApplications };
}
