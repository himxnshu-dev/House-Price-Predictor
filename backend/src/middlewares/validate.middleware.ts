import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { logger } from "../utils/logger.js";

export const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            logger.warn(`Validation failed: ${result.error.issues.map(issue => issue.message).join(", ")}`);
            res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues
                    .map(issue => issue.message)
                    .join(", ")
            });
            return;
        }
        req.body = result.data;
        next();
    }
}