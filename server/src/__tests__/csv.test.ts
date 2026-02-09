import { describe, it, expect } from "vitest";
import { buildCsvRows } from "../services/csv.js";
import type { Candidate, JobApplication } from "../types/index.js";

describe("buildCsvRows", () => {
    it("should create a row for each job application", () => {
        const candidates: Candidate[] = [
            {
                id: "1",
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                jobApplicationIds: ["ja-1", "ja-2"],
            },
        ];

        const jobApplications: JobApplication[] = [
            { id: "ja-1", createdAt: "2024-01-15T10:00:00Z" },
            { id: "ja-2", createdAt: "2024-02-20T14:30:00Z" },
        ];

        const rows = buildCsvRows(candidates, jobApplications);

        expect(rows).toHaveLength(2);
        expect(rows[0]).toEqual({
            candidateId: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            jobApplicationId: "ja-1",
            jobApplicationCreatedAt: "2024-01-15T10:00:00Z",
        });
        expect(rows[1]).toEqual({
            candidateId: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            jobApplicationId: "ja-2",
            jobApplicationCreatedAt: "2024-02-20T14:30:00Z",
        });
    });

    it("should handle candidates with no job applications", () => {
        const candidates: Candidate[] = [
            {
                id: "2",
                firstName: "Jane",
                lastName: "Smith",
                email: "jane@example.com",
                jobApplicationIds: [],
            },
        ];

        const jobApplications: JobApplication[] = [];

        const rows = buildCsvRows(candidates, jobApplications);

        expect(rows).toHaveLength(1);
        expect(rows[0]).toEqual({
            candidateId: "2",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane@example.com",
            jobApplicationId: "",
            jobApplicationCreatedAt: "",
        });
    });

    it("should handle null fields with empty strings", () => {
        const candidates: Candidate[] = [
            {
                id: "3",
                firstName: null,
                lastName: null,
                email: null,
                jobApplicationIds: ["ja-3"],
            },
        ];

        const jobApplications: JobApplication[] = [
            { id: "ja-3", createdAt: "2024-03-01T09:00:00Z" },
        ];

        const rows = buildCsvRows(candidates, jobApplications);

        expect(rows).toHaveLength(1);

        const row = rows[0];
        expect(row).toBeDefined();
        expect(row!.firstName).toBe("");
        expect(row!.lastName).toBe("");
        expect(row!.email).toBe("");
    });

    it("should handle multiple candidates correctly", () => {
        const candidates: Candidate[] = [
            {
                id: "1",
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                jobApplicationIds: ["ja-1"],
            },
            {
                id: "2",
                firstName: "Jane",
                lastName: "Smith",
                email: "jane@example.com",
                jobApplicationIds: ["ja-2", "ja-3"],
            },
        ];

        const jobApplications: JobApplication[] = [
            { id: "ja-1", createdAt: "2024-01-01T00:00:00Z" },
            { id: "ja-2", createdAt: "2024-02-01T00:00:00Z" },
            { id: "ja-3", createdAt: "2024-03-01T00:00:00Z" },
        ];

        const rows = buildCsvRows(candidates, jobApplications);

        expect(rows).toHaveLength(3);
        expect(rows.filter((r) => r.candidateId === "1")).toHaveLength(1);
        expect(rows.filter((r) => r.candidateId === "2")).toHaveLength(2);
    });

    it("should handle missing job application gracefully", () => {
        const candidates: Candidate[] = [
            {
                id: "1",
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                jobApplicationIds: ["ja-nonexistent"],
            },
        ];

        const jobApplications: JobApplication[] = [];

        const rows = buildCsvRows(candidates, jobApplications);

        expect(rows).toHaveLength(1);

        const row = rows[0];
        expect(row).toBeDefined();
        expect(row!.jobApplicationCreatedAt).toBe("");
    });
});
