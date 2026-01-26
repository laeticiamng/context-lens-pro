import { z } from "zod";

// Auth validation schemas
export const emailSchema = z
  .string()
  .trim()
  .email({ message: "Please enter a valid email address" })
  .max(255, { message: "Email must be less than 255 characters" });

export const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" })
  .max(128, { message: "Password must be less than 128 characters" });

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
});

// Contact form validation
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: emailSchema,
  subject: z
    .string()
    .trim()
    .min(1, { message: "Subject is required" })
    .max(200, { message: "Subject must be less than 200 characters" }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(5000, { message: "Message must be less than 5000 characters" }),
});

// Script validation
export const scriptSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title must be less than 200 characters" }),
  content: z
    .string()
    .max(50000, { message: "Content must be less than 50,000 characters" }),
  tags: z.array(z.string().max(50)).max(10, { message: "Maximum 10 tags allowed" }),
});

// Device validation
export const deviceSchema = z.object({
  device_name: z
    .string()
    .trim()
    .min(1, { message: "Device name is required" })
    .max(100, { message: "Device name must be less than 100 characters" }),
  device_type: z.string().min(1, { message: "Device type is required" }),
  manufacturer: z.string().max(100).optional(),
  tier: z.number().min(0).max(3),
});

// Profile validation
export const profileSchema = z.object({
  display_name: z
    .string()
    .trim()
    .max(100, { message: "Display name must be less than 100 characters" })
    .optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

// Waitlist validation
export const waitlistSchema = z.object({
  email: emailSchema,
  source: z.string().max(100).optional(),
});

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ScriptInput = z.infer<typeof scriptSchema>;
export type DeviceInput = z.infer<typeof deviceSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type WaitlistInput = z.infer<typeof waitlistSchema>;
