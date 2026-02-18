import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter } from "react-router";

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ThemeProvider>
            <QueryProvider>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
                <Toaster richColors position="bottom-right" />
            </QueryProvider>
        </ThemeProvider>
    );
}
