import { Request, Response } from "express";
import { RegisterSchema, LoginSchema } from "../validations/auth.js";
import { hashPassword, verifyPassword } from "../lib/hash-password.js";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { generateAccessToken, generateRefreshToken } from "../lib/jwt.js";

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

            const payload = { userId: user.id };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            res.status(200).json({
                message: "Login successful",
                accessToken,
                refreshToken
            });
    }
}