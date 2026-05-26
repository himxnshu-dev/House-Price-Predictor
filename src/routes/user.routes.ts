import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { UserController } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateMeSchema, UpdatePasswordSchema } from "../validations/user.js";

export const createUserRouter = (): Router => {
    const userRouter = Router();

    const userController = new UserController();
    
    userRouter.use(authenticate);
    userRouter.route('/me')
        .get(asyncHandler(userController.me))
        .patch(
            validate(updateMeSchema),
            asyncHandler(userController.updateMe)
        );

    userRouter.route('/me/password')
        .patch(
            validate(UpdatePasswordSchema),
            asyncHandler(userController.updatePassword)
        );

    return userRouter;
}