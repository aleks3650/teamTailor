import { useQuery } from "@tanstack/react-query";
import { queryKeys, fetchCandidates } from "@/api";

export function useCandidates() {
    return useQuery({
        ...queryKeys.candidates.all,
        queryFn: fetchCandidates,
    });
}
