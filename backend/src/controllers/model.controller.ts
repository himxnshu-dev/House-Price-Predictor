import { Request, Response } from "express";
// import { prisma } from "../lib/prisma.js";
import axios from "axios";
import { logger } from "../utils/logger.js";
import { prisma } from "../lib/prisma.js";

interface AuthRequest extends Request {
    user?: { userId: string }
}

export class ModelController {
    public predict = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
        let mlResponse: { data: { price_lakhs: number } };
        try {
            mlResponse = await axios.post(`${PYTHON_SERVICE_URL}/predict`, req.body, {
                timeout: 6000
            })
        } catch (axiosError: any) {
            if (axiosError.response) {
                logger.error({ error: axiosError.response.data }, "Python ML Service returned an error");
                res.status(400).json({ success: false, error: "Prediction engine rejected the data" });
                return;
            } else if (axiosError.code === 'ECONNABORTED') {
                logger.error("Python ML Service timed out");
                res.status(504).json({ success: false, error: "Prediction engine timed out. Please try again later." });
                return;
            } else {
                logger.error({ error: axiosError.message }, "Failed to connect to Python ML Service");
                res.status(503).json({ success: false, error: "Prediction engine is temporarily unavailable." });
                return;
            }
        }

        const predictedPrice = mlResponse.data.price_lakhs;

        if (typeof predictedPrice !== 'number') {
            logger.error({ responseData: mlResponse.data }, "Invalid response format from ML Service");
            res.status(502).json({ success: false, error: "Invalid response from prediction engine" });
            return;
        }

        prisma.predictionHistory.create({
            data: {
                userId,
                location: req.body.location,
                bhk: req.body.bhk,
                bath: req.body.bath,
                total_sqft: req.body.total_sqft,
                predictedPrice: predictedPrice
            }
        }).catch((error) => {
            logger.error({ error, userId }, "Failed to save prediction to database in background");
        });

        res.status(200).json({ success: true, price_lakhs: predictedPrice });
    }
}