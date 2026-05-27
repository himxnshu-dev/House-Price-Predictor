import { Router } from "express";
import { createAuthRouter } from "./auth.routes.js";
import { createUserRouter } from "./user.routes.js";

export const createApiRouter = (): Router => {
    const apiRouter = Router();

    apiRouter.use('/auth', createAuthRouter());
    apiRouter.use('/users', createUserRouter())

    return apiRouter;
} 