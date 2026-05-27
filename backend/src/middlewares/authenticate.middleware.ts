import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../lib/jwt.js";
import { prisma } from "../lib/prisma.js";

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Authorization header missing or malformed" });
        return;
    }
    const token = authHeader.split(" ")[1];
    
    try {
        const payload = verifyJwt(token);
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { tokenVersion: true }
        })
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (user?.tokenVersion !== payload.tokenVersion) {
            res.status(401).json({ message: "Please login again" });
            return;
        }

        req.user = { userId: payload.userId };
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}