import express, { NextFunction, Response, Request, type Application } from 'express';
import cors from 'cors';
import { createApiRouter } from './routes/api.routes.js';

export const createApp = (): Application => {
    const app = express()

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api', createApiRouter());
    
    app.use((_req: express.Request, res: express.Response) => {
        res.status(404).json({ message: 'Not Found' });
    })

    app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error(error);
        res.status(500).json({
            error: process.env.NODE_ENV === 'development' ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
            } : 'An unknown error occurred',
        });
    });

    return app;
}