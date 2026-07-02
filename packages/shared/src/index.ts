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
  id: z.string().uuid().optional(),
  org_id: z.string().uuid().optional(),
  business_unit_id: z.string().uuid(),
  type: z.enum(["income", "expense"]),
  category_id: z.string().uuid(),
  subcategory_id: z.string().uuid().nullable().optional(),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("NGN"),
  description: z.string().min(3, "Description is required"),
  transaction_date: z.string(),
  recorded_by: z.string().uuid().optional().nullable(),
  source: z.enum(["manual", "booking", "order", "sale"]).default("manual"),
  source_ref_id: z.string().uuid().nullable().optional(),
});

export type TransactionInput = z.infer<typeof TransactionSchema>;

export const EventBookingSchema = z.object({
  id: z.string().uuid().optional(),
  business_unit_id: z.string().uuid(),
  client_name: z.string().min(2, "Client name is required"),
  client_contact: z.string().min(8, "Client contact is required"),
  event_date: z.string(),
  package_id: z.string().uuid().nullable().optional(),
  hall_name: z.string().min(2, "Hall name is required"),
  total_quoted: z.number().nonnegative("Total quote must be non-negative"),
  deposit_amount: z.number().nonnegative("Deposit must be non-negative"),
  status: z.enum(["inquiry", "confirmed", "completed", "cancelled"]).default("inquiry"),
});

export type EventBookingInput = z.infer<typeof EventBookingSchema>;

export const EaterySaleSchema = z.object({
  id: z.string().uuid().optional(),
  business_unit_id: z.string().uuid(),
  sale_date: z.string(),
  total_covers: z.number().int().nonnegative("Total covers must be positive"),
  total_revenue: z.number().nonnegative("Total revenue must be positive"),
  recorded_by: z.string().uuid().optional().nullable(),
});

export type EaterySaleInput = z.infer<typeof EaterySaleSchema>;

export const LaundryOrderSchema = z.object({
  id: z.string().uuid().optional(),
  business_unit_id: z.string().uuid(),
  customer_name: z.string().min(2, "Customer name is required"),
  customer_contact: z.string().min(8, "Customer contact is required"),
  items_description: z.string().min(3, "Description is required"),
  drop_off_date: z.string(),
  pickup_date: z.string().optional().nullable(),
  status: z.enum(["received", "in_progress", "ready", "collected"]).default("received"),
  amount_charged: z.number().nonnegative("Amount must be positive"),
});

export type LaundryOrderInput = z.infer<typeof LaundryOrderSchema>;
