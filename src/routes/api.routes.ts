import { Router } from "express";
import { createAuthRouter } from "./auth.routes.js";

export const createApiRouter = (): Router => {
    const apiRouter = Router();

    apiRouter.use('/auth', createAuthRouter());

    return apiRouter;
} 