import {z} from 'zod'

export const SignInSchema = z.object({
    email: z.string().email("Invalid Email address").nonempty("Email is required"),
    password: z.string().min(6, "Password must be atleast 6 characters")
})