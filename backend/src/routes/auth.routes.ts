import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.js";
import { AuthController } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createAuthRouter = (): Router => {
    const authRouter = Router();
    const authController = new AuthController();

    authRouter.post('/register', validate(registerSchema), asyncHandler(authController.register));
    authRouter.post('/login', validate(loginSchema), asyncHandler(authController.login));
    authRouter.post('/refresh', asyncHandler(authController.refresh));

    return authRouter;
}