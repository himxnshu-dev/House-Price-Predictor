import express, { type Application } from 'express';
import cors from 'cors';
import { createApiRouter } from './routes/api.routes.js';

export const createApp = (): Application => {
    const app = express()

    app.use(cors({
        origin: '*',
        credentials: true,
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use((_req: express.Request, res: express.Response) => {
        res.status(404).json({ message: 'Not Found' });
    })

    app.use('/api', createApiRouter());

    return app;
}