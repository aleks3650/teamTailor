import { z } from "zod";

const ApiResourceIdSchema = z.object({
    type: z.string(),
    id: z.string(),
});

const ApiCandidateSchema = z.object({
    id: z.string(),
    type: z.literal("candidates"),
    attributes: z.object({
        "first-name": z.string().nullable(),
        "last-name": z.string().nullable(),
        email: z.string().nullable(),
        "created-at": z.string(),
    }),
    relationships: z.object({
        "job-applications": z.object({
            data: z.array(ApiResourceIdSchema),
        }),
    }),
});

const ApiJobApplicationSchema = z.object({
    id: z.string(),
    type: z.literal("job-applications"),
    attributes: z.object({
        "created-at": z.string(),
    }),
});

export const CandidateSchema = ApiCandidateSchema.transform((api) => ({
    id: api.id,
    firstName: api.attributes["first-name"],
    lastName: api.attributes["last-name"],
    email: api.attributes.email,
    jobApplicationIds: api.relationships["job-applications"].data.map((r) => r.id),
}));

export const JobApplicationSchema = ApiJobApplicationSchema.transform((api) => ({
    id: api.id,
    createdAt: api.attributes["created-at"],
}));

export const CandidatesResponseSchema = z
    .object({
        data: z.array(ApiCandidateSchema),
        included: z.array(ApiJobApplicationSchema).optional(),
        meta: z.object({
            "record-count": z.number(),
            "page-count": z.number(),
        }),
        links: z.object({
            next: z.string().optional(),
        }),
    })
    .transform((api) => ({
        candidates: api.data.map((candidate) => CandidateSchema.parse(candidate)),
        jobApplications: (api.included ?? []).map((jobApplication) => JobApplicationSchema.parse(jobApplication)),
        meta: {
            recordCount: api.meta["record-count"],
            pageCount: api.meta["page-count"],
        },
        nextPage: api.links.next,
    }));

export type Candidate = z.infer<typeof CandidateSchema>;
export type JobApplication = z.infer<typeof JobApplicationSchema>;
export type CandidatesResponse = z.infer<typeof CandidatesResponseSchema>;

export interface CandidateCsvRow {
    candidateId: string;
    firstName: string;
    lastName: string;
    email: string;
    jobApplicationId: string;
    jobApplicationCreatedAt: string;
}
