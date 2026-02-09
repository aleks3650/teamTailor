import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useCandidates } from "@/hooks";
import { formatDate } from "@/lib/utils";
import type { CandidateRow } from "@/types";
import { motion } from "framer-motion";

function TableSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
    );
}

export function CandidateTable() {
    const { data: candidates, isLoading, isError } = useCandidates();

    if (isLoading) {
        return <TableSkeleton />;
    }

    if (isError) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Failed to load candidates. Please try again.
            </div>
        );
    }

    if (!candidates?.length) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No candidates found.
            </div>
        );
    }

    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Applied At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {candidates.map((row: CandidateRow, index: number) => (
                        <motion.tr
                            key={`${row.candidateId}-${row.jobApplicationId}-${index}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                            className="border-b transition-colors hover:bg-muted/50"
                        >
                            <TableCell className="font-medium">
                                {row.firstName} {row.lastName}
                                {!row.firstName && !row.lastName && (
                                    <span className="text-muted-foreground">No name</span>
                                )}
                            </TableCell>
                            <TableCell>
                                {row.email || <span className="text-muted-foreground">—</span>}
                            </TableCell>
                            <TableCell>
                                {row.jobApplicationId ? (
                                    <Badge variant="secondary">{row.jobApplicationId}</Badge>
                                ) : (
                                    <span className="text-muted-foreground">No application</span>
                                )}
                            </TableCell>
                            <TableCell>{formatDate(row.jobApplicationCreatedAt)}</TableCell>
                        </motion.tr>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
