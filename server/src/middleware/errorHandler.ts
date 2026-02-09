import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AxiosError } from "axios";
import { AppError } from "../errors/index.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof AppError) {
        return res.status(err.status).json({
            error: err.code,
            message: err.message,
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            error: 'VALIDATION_ERROR',
            message: 'Invalid request',
            details: err.issues,
        });
    }

    if (err instanceof AxiosError) {
        return res.status(502).json({
            error: 'API_ERROR',
            message: 'External service failed',
        });
    }

    return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Something went wrong',
    });
};
