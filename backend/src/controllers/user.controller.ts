import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { hashPassword, verifyPassword } from "../lib/hash-password.js";
import { UpdatePasswordInput, UpdateMeInput } from "../validations/user.js";

export class UserController {
    public me = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true, updatedAt: true,
            }
        })
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ user });
    }

    public updateMe = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const existingUser = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
        if (!existingUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const { name }: UpdateMeInput = req.body;
        if (name === existingUser.name) {
            res.status(400).json({ message: "Name is already in use" });
            return;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name },
            select: {
                id: true,
                name: true,
                createdAt: true, updatedAt: true,
            }
        })

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    }

    public updatePassword = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const existingUser = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
        if (!existingUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        
        const { oldPassword, newPassword }: UpdatePasswordInput = req.body;

        const isOldPasswordCorrect = await verifyPassword(oldPassword, existingUser.passwordHash);
        if (!isOldPasswordCorrect) {
            res.status(401).json({ message: "Old password is incorrect" });
            return;
        }

        const newPasswordHash = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash: newPasswordHash,
                tokenVersion: {
                    increment: 1
                }
            },
        })

        res.status(200).json({ message: "Password updated successfully" });
    }
}