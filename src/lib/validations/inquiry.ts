import { z } from "zod";

export const createInquirySchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters.")
    .trim(),
  email: z
    .string({ required_error: "Email is required." })
    .email("Please provide a valid email address.")
    .max(150, "Email cannot exceed 150 characters.")
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .max(35, "Phone number cannot exceed 35 characters.")
    .regex(/^[\d\s+\-().]{0,35}$/, "Please enter a valid phone number.")
    .optional()
    .nullable()
    .or(z.literal("")),
  country: z.string().max(100, "Country name is too long.").optional().nullable(),
  tourSlug: z.string().max(120, "Tour identifier is too long.").optional().nullable(),
  travelers: z.string().max(50, "Travelers field is too long.").optional().nullable(),
  travelDate: z.string().max(100, "Travel date is too long.").optional().nullable(),
  duration: z.string().max(50, "Duration field is too long.").optional().nullable(),
  budget: z.string().max(100, "Budget field is too long.").optional().nullable(),
  message: z.string().max(3000, "Message cannot exceed 3000 characters.").optional().nullable(),
  // Honeypot field for bot spam detection (must be empty from real humans)
  website: z.string().max(200).optional().nullable(),
});

export const updateInquirySchema = z.object({
  status: z
    .enum(["New", "In Progress", "Contacted", "Booked", "Archived"], {
      errorMap: () => ({
        message: "Status must be one of: New, In Progress, Contacted, Booked, Archived.",
      }),
    })
    .optional(),
  notes: z.string().max(5000, "Notes cannot exceed 5000 characters.").optional().nullable(),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>;