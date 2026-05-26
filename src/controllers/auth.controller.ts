import { Request, Response } from "express";
import { RegisterSchema, LoginSchema } from "../validations/auth.js";
import { hashPassword, verifyPassword } from "../lib/hash-password.js";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { generateAccessToken, generateRefreshToken, verifyJwt } from "../lib/jwt.js";

export class AuthController {
    public register = async (req: Request, res: Response): Promise<void> => {
        const { name, email, password }: RegisterSchema = req.body;

        const hashedPassword = await hashPassword(password);

        try {
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    passwordHash: hashedPassword,
                }
            })
            if (!user) {
                res.status(400).json({ message: "Failed to create user" });
                return;
            }

            res.status(201).json({ message: "User registered successfully", userID: user.id });
        } catch (err) {
            if (
                err instanceof Prisma.PrismaClientKnownRequestError &&
                err.code === 'P2002'
            ) {
                res.status(409).json({ message: "User with this email already exists" });
                return;
            }
            throw err;
        }
    }

    public login = async (req: Request, res: Response): Promise<void> => {
            const { email, password }: LoginSchema = req.body;

            const user = await prisma.user.findUnique({
                where: { email }
            })
            if (!user) {
                res.status(401).json({ message: "Invalid email or password" });
                return;
            }

            const isValidPassword = await verifyPassword(password, user.passwordHash);
            if (!isValidPassword) {
                res.status(401).json({ message: "email or password is incorrect" });
                return;
            }

            const payload = {
                userId: user.id,
                tokenVersion: user.tokenVersion
            };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            res.status(200).json({
                message: "Login successful",
                accessToken,
                refreshToken
            });
    }

    public refresh = async (req: Request, res: Response): Promise<void> => {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: "Refresh token is missing or invalid" });
            return;
        }

        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ message: "Refresh token is missing" });
            return;
        }
        
        const payload = verifyJwt(token);

        const tokenPayload = {
            userId: payload.userId,
            tokenVersion: payload.tokenVersion
        };
        const newAccessToken = generateAccessToken(tokenPayload);
        const newRefreshToken = generateRefreshToken(tokenPayload);

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    }
}