import { Router } from 'express';
import { ModelController } from '../controllers/model.controller.js';
import { asyncHandler } from '../utils/async-handler.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { predictSchema } from '../validations/predict.js';

export const createModelRouter = (): Router => {
    const modelRouter = Router();

    const modelController = new ModelController();

    modelRouter.use(authenticate);
    modelRouter.post(
        '/predict',
        validate(predictSchema),
        asyncHandler(modelController.predict)
    );

    modelRouter.get('/history', asyncHandler(modelController.getHistory));

    modelRouter.patch('/:id/favorite', asyncHandler(modelController.toggleFavorite));
    modelRouter.get('/favorites', asyncHandler(modelController.getFavorites));

    return modelRouter;
}