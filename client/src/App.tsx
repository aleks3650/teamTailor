import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CandidateTable, DownloadButton, ThemeToggle } from "@/components";
import { useCandidates } from "@/hooks";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

function App() {
    const { data: candidates } = useCandidates();

    return (
        <div className="min-h-svh bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8 transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
                <motion.header
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
                            TeamTailor Export
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground">
                            View and export candidate data
                        </p>
                    </div>
                    <ThemeToggle />
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Candidates
                                </CardTitle>
                                <CardDescription>
                                    {candidates
                                        ? `${candidates.length} records found`
                                        : "Loading candidates..."}
                                </CardDescription>
                            </div>
                            <DownloadButton />
                        </CardHeader>
                        <CardContent>
                            <CandidateTable />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

export default App;