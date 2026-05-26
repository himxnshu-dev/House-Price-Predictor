import { Request, Response } from "express";
import { RegisterSchema } from "../validations/auth.js";
import { hashPassword } from "../lib/hash-password.js";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";

export class AuthController {
    public register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password }: RegisterSchema = req.body;

            const hashedPassword = await hashPassword(password);

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
}