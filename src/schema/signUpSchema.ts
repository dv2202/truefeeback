import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(2, "Usernames must be at least 2 characters long")
    .max(20,"Usernames must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9]+$/, "Usernames can only contain letters and numbers");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(8, {message: "Passwords must be at least 8 characters long"}),
})