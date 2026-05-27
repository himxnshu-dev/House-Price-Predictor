import { z } from "zod";

export const updateMeSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters long").max(100)
    })

export const UpdatePasswordSchema = z
    .object({
        oldPassword: z.string().min(6, "Old password must be at least 6 characters long").max(100),
        newPassword: z.string().min(6, "New password must be at least 6 characters long").max(100),
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
        message: "New password cannot be the same as old password",
        path: ["newPassword"]
    })

export type UpdateMeInput = z.infer<typeof updateMeSchema>;
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;