import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { downloadCsv } from "@/api";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function DownloadButton() {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);

        try {
            const blob = await downloadCsv();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `candidates_${new Date().toISOString().split("T")[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);

            toast.success("CSV downloaded successfully!");
        } catch (error) {
            toast.error("Failed to download CSV. Please try again.");
            console.error(error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.div whileTap={{ scale: 0.95 }}>
            <Button
                onClick={handleDownload}
                disabled={isDownloading}
                size="lg"
                className="gap-2"
            >
                {isDownloading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Download className="h-4 w-4" />
                        Download CSV
                    </>
                )}
            </Button>
        </motion.div>
    );
}
