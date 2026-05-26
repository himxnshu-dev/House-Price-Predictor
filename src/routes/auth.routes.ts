import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema } from "../validations/auth.js";
import { AuthController } from "../controllers/auth.controller.js";

export const createAuthRouter = (): Router => {
    const authRouter = Router();
    const authController = new AuthController();

    authRouter.post('/register', validate(registerSchema), authController.register);

    return authRouter;
}