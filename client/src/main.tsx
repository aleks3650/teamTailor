import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "@/providers/Providers";
import "./index.css";
import App from "./App.tsx";
import { Route, Routes } from "react-router";
import Candidate from "./components/pages/candidate.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Providers>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/candidate/:id" element={<Candidate />} />
            </Routes>
        </Providers>
    </StrictMode>
);
