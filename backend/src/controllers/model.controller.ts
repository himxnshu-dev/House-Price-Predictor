import { Request, Response } from "express";
import axios from "axios";
import { logger } from "../utils/logger.js";
import { prisma } from "../lib/prisma.js";
import { PaginationQuery, paginationSchema } from "../validations/pagination.js";

interface AuthRequest extends Request {
    user?: { userId: string }
}

let cachedLocations: string[] | null = null;

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

    public getLocations = async (_req: AuthRequest, res: Response): Promise<void> => {
        if (cachedLocations) {
            res.status(200).json({ success: true, locations: cachedLocations });
            return;
        }

        const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
        try {
            const response = await axios.get(`${PYTHON_SERVICE_URL}/locations`);

            if (response.data && response.data.success && Array.isArray(response.data.locations)) {
                cachedLocations = response.data.locations;
                res.status(200).json({
                    success: true,
                    locations: cachedLocations
                });
            } else {
                throw new Error("Invalid response format from ML Service for locations");
            }
        } catch (error) {
            logger.error({ error }, "Failed to fetch locations from Python ML Service");
            res.status(503).json({
                success: false,
                error: "Location data is temporarily unavailable."
            });
        }
    }

    public getHistory = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const queryValidation = paginationSchema.safeParse(req.query);
        if (!queryValidation.success) {
            res.status(400).json({ success: false, error: "Invalid pagination parameters" });
            return;
        }
        const { page, limit }: PaginationQuery = queryValidation.data;
        const skip = (page - 1) * limit;

        const [total, history] = await prisma.$transaction([
            prisma.predictionHistory.count({
                where: { userId }
            }),
            prisma.predictionHistory.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            })
        ])
        if (history.length === 0) {
            res.status(200).json({ success: true, history: [], message: "No prediction history found" });
            return;
        }

        res.status(200).json({
            success: true,
            history,
            meta: {
                totalRecords: total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    }

    public toggleFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const predictionId = req.params.id;

        const prediction = await prisma.predictionHistory.findFirst({
            where: { id: predictionId as string, userId }
        });
        if (!prediction) {
            res.status(404).json({ success: false, error: "Prediction not found" });
            return;
        }

        const addToFavorites = await prisma.predictionHistory.update({
            where: { id: predictionId as string },
            data: { isFavorite: !prediction.isFavorite }
        })
        res.status(200).json({
            success: true,
            message: addToFavorites.isFavorite ? "Added to favorites" : "Removed from favorites",
        });
    }

    public getFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const favorites = await prisma.predictionHistory.findMany({
            where: { userId, isFavorite: true },
            orderBy: { createdAt: 'desc' }
        });
        if (favorites.length === 0) {
            res.status(200).json({ success: true, favorites: [], message: "No favorites found" });
            return;
        }

        res.status(200).json({ success: true, favorites });
    }
}