import { z } from "zod";

export const CUSTOMER_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
] as const;

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Valid email is required").max(200),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const customerUpdateSchema = z.object({
  status: z.enum(CUSTOMER_STATUSES),
});

export const signupSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Valid email is required").max(200),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be 72 characters or fewer"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Valid email is required").max(200),
  password: z.string().min(1).max(200),
});
