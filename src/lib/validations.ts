import { z } from "zod";

// XSS Sanitization helper
const sanitizeString = (val: string) => {
  return val
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

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

// Contact form validation with sanitization
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .transform((val) => sanitizeString(val)),
  email: emailSchema,
  subject: z
    .string()
    .trim()
    .min(1, { message: "Subject is required" })
    .max(200, { message: "Subject must be less than 200 characters" })
    .refine((val) => !/<[^>]*>/.test(val), { message: "Invalid characters in subject" }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(5000, { message: "Message must be less than 5000 characters" }),
});

// Script validation with XSS protection
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
    .refine((val) => !val || !/<[^>]*>/.test(val), { message: "Invalid characters" })
    .optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

// Waitlist validation
export const waitlistSchema = z.object({
  email: emailSchema,
  source: z.string().max(100).optional(),
});

// MRI Cabinet validation
export const cabinetSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(200, { message: "Name must be less than 200 characters" }),
  siret: z
    .string()
    .regex(/^\d{14}$/, { message: "SIRET must be exactly 14 digits" })
    .optional()
    .or(z.literal("")),
  email: emailSchema.optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^(\+?\d{1,4}[\s-]?)?(\d{2,4}[\s-]?){2,4}\d{2,4}$/, { message: "Invalid phone format" })
    .optional()
    .or(z.literal("")),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  postal_code: z
    .string()
    .regex(/^\d{5}$/, { message: "Postal code must be 5 digits" })
    .optional()
    .or(z.literal("")),
  country: z.string().max(100).optional(),
});

// MRI Device validation
export const mriDeviceSchema = z.object({
  manufacturer: z
    .string()
    .trim()
    .min(1, { message: "Manufacturer is required" })
    .max(100),
  model: z
    .string()
    .trim()
    .min(1, { message: "Model is required" })
    .max(100),
  serial_number: z
    .string()
    .trim()
    .min(1, { message: "Serial number is required" })
    .max(100),
  device_type: z.string().min(1, { message: "Device type is required" }),
  ip_address: z
    .string()
    .regex(/^(\d{1,3}\.){3}\d{1,3}$/, { message: "Invalid IP address" })
    .optional()
    .or(z.literal("")),
});

// Patient reference validation (sanitized for medical data)
export const patientRefSchema = z
  .string()
  .trim()
  .min(3, { message: "Patient reference must be at least 3 characters" })
  .max(100, { message: "Patient reference must be less than 100 characters" })
  .transform((val) => sanitizeString(val));

// Patient scan input validation
export const patientScanSchema = z.object({
  patient_reference: z
    .string()
    .trim()
    .min(3, { message: "Patient reference is required (min 3 characters)" })
    .max(100, { message: "Patient reference must be less than 100 characters" })
    .transform((val) => sanitizeString(val)),
  protocol_id: z.string().min(1, { message: "Protocol is required" }),
});

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ScriptInput = z.infer<typeof scriptSchema>;
export type DeviceInput = z.infer<typeof deviceSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type WaitlistInput = z.infer<typeof waitlistSchema>;
export type CabinetInput = z.infer<typeof cabinetSchema>;
export type MRIDeviceInput = z.infer<typeof mriDeviceSchema>;
export type PatientRefInput = z.infer<typeof patientRefSchema>;
export type PatientScanInput = z.infer<typeof patientScanSchema>;
