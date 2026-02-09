import { describe, it, expect } from "vitest";
import { CandidateSchema, JobApplicationSchema, CandidatesResponseSchema } from "../types/schemas.js";

describe("CandidateSchema", () => {
    it("should transform API candidate to domain model", () => {
        const apiCandidate = {
            id: "123",
            type: "candidates" as const,
            attributes: {
                "first-name": "John",
                "last-name": "Doe",
                email: "john@example.com",
                "created-at": "2024-01-15T10:00:00Z",
            },
            relationships: {
                "job-applications": {
                    data: [
                        { type: "job-applications", id: "ja-1" },
                        { type: "job-applications", id: "ja-2" },
                    ],
                },
            },
        };

        const result = CandidateSchema.parse(apiCandidate);

        expect(result).toEqual({
            id: "123",
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            jobApplicationIds: ["ja-1", "ja-2"],
        });
    });

    it("should handle null values in attributes", () => {
        const apiCandidate = {
            id: "456",
            type: "candidates" as const,
            attributes: {
                "first-name": null,
                "last-name": null,
                email: null,
                "created-at": "2024-01-15T10:00:00Z",
            },
            relationships: {
                "job-applications": {
                    data: [],
                },
            },
        };

        const result = CandidateSchema.parse(apiCandidate);

        expect(result.firstName).toBeNull();
        expect(result.lastName).toBeNull();
        expect(result.email).toBeNull();
    });
});

describe("JobApplicationSchema", () => {
    it("should transform API job application to domain model", () => {
        const apiJobApplication = {
            id: "ja-123",
            type: "job-applications" as const,
            attributes: {
                "created-at": "2024-02-20T14:30:00Z",
            },
        };

        const result = JobApplicationSchema.parse(apiJobApplication);

        expect(result).toEqual({
            id: "ja-123",
            createdAt: "2024-02-20T14:30:00Z",
        });
    });
});

describe("CandidatesResponseSchema", () => {
    it("should transform full API response", () => {
        const apiResponse = {
            data: [
                {
                    id: "1",
                    type: "candidates" as const,
                    attributes: {
                        "first-name": "Alice",
                        "last-name": "Wonder",
                        email: "alice@example.com",
                        "created-at": "2024-01-01T00:00:00Z",
                    },
                    relationships: {
                        "job-applications": {
                            data: [{ type: "job-applications", id: "ja-1" }],
                        },
                    },
                },
            ],
            included: [
                {
                    id: "ja-1",
                    type: "job-applications",
                    attributes: {
                        "created-at": "2024-01-02T00:00:00Z",
                    },
                },
            ],
            meta: {
                "record-count": 100,
                "page-count": 4,
            },
            links: {
                next: "https://api.teamtailor.com/v1/candidates?page[number]=2",
            },
        };

        const result = CandidatesResponseSchema.parse(apiResponse);

        expect(result.candidates).toHaveLength(1);
        expect(result.jobApplications).toHaveLength(1);
        expect(result.meta.recordCount).toBe(100);
        expect(result.meta.pageCount).toBe(4);
        expect(result.nextPage).toBe("https://api.teamtailor.com/v1/candidates?page[number]=2");

        const candidate = result.candidates[0];
        expect(candidate).toBeDefined();
        expect(candidate!.firstName).toBe("Alice");

        const jobApp = result.jobApplications[0];
        expect(jobApp).toBeDefined();
        expect(jobApp!.id).toBe("ja-1");
    });

    it("should handle response without included resources", () => {
        const apiResponse = {
            data: [],
            meta: {
                "record-count": 0,
                "page-count": 0,
            },
            links: {},
        };

        const result = CandidatesResponseSchema.parse(apiResponse);

        expect(result.candidates).toHaveLength(0);
        expect(result.jobApplications).toHaveLength(0);
        expect(result.nextPage).toBeUndefined();
    });
});
