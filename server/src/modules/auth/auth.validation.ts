import { z } from "zod";

export const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),

    email: z.string().email(),

    password: z.string().min(6),

    avatar: z.string().url().optional(),

    bio: z.string().max(500).optional(),
  }),
});

export const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),

    password: z.string().min(6),
  }),
});
