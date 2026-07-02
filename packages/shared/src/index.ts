import { z } from "zod";

export const PublicEnquirySchema = z.object({
  business_unit_id: z.string().uuid().nullable().optional(),
  type: z.enum(["event_enquiry", "laundry_pickup", "eatery_order", "contact", "notify_me"]),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(5, "Message must be at least 5 characters").optional().or(z.literal("")),
  metadata: z.record(z.any()).optional().default({}),
});

export type PublicEnquiryInput = z.infer<typeof PublicEnquirySchema>;

export const TransactionSchema = z.object({
  business_unit_id: z.string().uuid(),
  type: z.enum(["income", "expense"]),
  category_id: z.string().uuid(),
  subcategory_id: z.string().uuid().nullable().optional(),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("NGN"),
  description: z.string().min(3, "Description is required"),
  transaction_date: z.string(),
  recorded_by: z.string().uuid(),
  source: z.enum(["manual", "booking", "order", "sale"]).default("manual"),
  source_ref_id: z.string().uuid().nullable().optional(),
});

export type TransactionInput = z.infer<typeof TransactionSchema>;
