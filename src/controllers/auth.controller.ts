import { Request, Response } from "express";

export class AuthController {
    public register = async (req: Request, res: Response): Promise<void> => {
        try {
        } catch (error) {
            res.status(500).json({
                error: error instanceof Error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                } : "An unknown error occurred during registration"
            });
        }
    }
}