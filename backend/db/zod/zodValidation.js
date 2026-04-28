import { z } from "zod";

export const SignupSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.email(),  
    password: z.string().min(7).max(50),
})

export const SigninSchema = z.object({
    email: z.email(),
    password: z.string().min(7).max(50),
})  