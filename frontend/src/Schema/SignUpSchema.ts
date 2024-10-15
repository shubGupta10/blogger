import { z } from 'zod';

export const SignupSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  gender: z.string().min(3, "Gender must be either 'male' or 'female'"), 
  profilePicture: z.string().optional(),
  confirmPassword:z.string().min(6, "Password must be at least 6 characters long"),
});
