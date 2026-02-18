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
import { sleep } from "../utils/sleep.js";
// import { sleep } from "../utils/index.js";

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

let rateLimitReset = 0
let rateLimitRemaining = 0
async function fetchPage<T>(path: string): Promise<T> {
    return withRetry<T>(async () => {
        try {

            const response = await client.get(path);
            if (rateLimitRemaining <= 5) {
                // console.log("Rate limit approaching, waiting for reset");
                // console.log(rateLimitReset, rateLimitRemaining);
                await sleep(rateLimitReset * 1000);
            }
            rateLimitReset = Number(response.headers['x-rate-limit-reset']);
            rateLimitRemaining = Number(response.headers['x-rate-limit-remaining']);
            // console.log(rateLimitReset, rateLimitRemaining);
            return response.data
        } catch (error) {
            console.log(error);
            throw new Error("Failed to fetch page");
        }
    });
}

export async function fetchAllCandidates(): Promise<{
    candidates: Candidate[];
    jobApplications: JobApplication[];
}> {
    console.log("Fetching all candidates");
    const firstPage = await fetchPage<CandidatesResponse>(`/candidates?include=job-applications&page[size]=${PAGE_SIZE}`);
    console.log("First page fetched");
    const parsed = CandidatesResponseSchema.parse(firstPage);


    const allCandidates: Candidate[] = [...parsed.candidates];
    const allJobApplications: JobApplication[] = [...parsed.jobApplications];
    const totalPages = parsed.meta.pageCount;

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
            const page = await fetchPage<CandidatesResponse>(url);
            const parsed = CandidatesResponseSchema.parse(page);
            return parsed;
        })
    );

    for (const pagePromise of pagePromises) {
        const page = await pagePromise;
        console.log(page, "asd");
        allCandidates.push(...page.candidates);
        allJobApplications.push(...page.jobApplications);
    }
    // const pages = await Promise.all(pagePromises);

    // for (const page of pages) {
    //     allCandidates.push(...page.candidates);
    //     allJobApplications.push(...page.jobApplications);
    // }

    return { candidates: allCandidates, jobApplications: allJobApplications };
}

export async function fetchOneCandidate(id: string): Promise<Candidate> {
    const candidate = await fetchPage<Candidate>(`/candidates/${id}`);
    return candidate;
}