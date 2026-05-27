import { z } from "zod";

export const predictSchema = z
    .object({
        location: z.string().min(1, "Location is required").trim(),
        bhk: z.number().int().positive("BHK must be a positive integer"),
        bath: z.number().int().positive("Bathroom count must be a positive integer"),
        total_sqft: z.number()
            .min(300, "Total square footage must be at least 300")
            .max(50000, "Total square footage cannot exceed 50,000"),
    })
    .refine((data) => data.bath <= data.bhk + 2, {
        message: "Bathrooms exceed BHK by more than 2, which is suspicious",
        path: ["bath"]
    })
    .refine((data) => data.total_sqft / data.bhk >= 300, {
        message: "Square Footage per BHK is suspiciously low (minimum 300 sqft/BHK)",
        path: ["total_sqft"]
    })