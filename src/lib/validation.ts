import { z } from "zod";

export const CITY_VALUES = [
  "Chandigarh",
  "Mohali",
  "Zirakpur",
  "Panchkula",
  "Other",
] as const;

export const PROPERTY_TYPE_VALUES = [
  "Apartment",
  "Villa",
  "Plot",
  "Office",
  "Retail",
] as const;

export const BHK_VALUES = ["ONE", "TWO", "THREE", "FOUR", "STUDIO"] as const;

export const PURPOSE_VALUES = ["Buy", "Rent"] as const;

export const TIMELINE_VALUES = [
  "ZERO_TO_3M",
  "THREE_TO_6M",
  "MORE_THAN_6M",
  "EXPLORING",
] as const;

export const SOURCE_VALUES = [
  "Website",
  "Referral",
  "Walk_in",
  "Call",
  "Other",
] as const;

export const STATUS_VALUES = [
  "New",
  "Qualified",
  "Contacted",
  "Visited",
  "Negotiation",
  "Converted",
  "Dropped",
] as const;

export const CITY = z.enum(CITY_VALUES);
export const PROPERTY_TYPE = z.enum(PROPERTY_TYPE_VALUES);
export const BHK = z.enum(BHK_VALUES);
export const PURPOSE = z.enum(PURPOSE_VALUES);
export const TIMELINE = z.enum(TIMELINE_VALUES);
export const SOURCE = z.enum(SOURCE_VALUES);
export const STATUS = z.enum(STATUS_VALUES);

const preprocessEmptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => (val === "" ? undefined : val), schema);

const optionalInt = () =>
  preprocessEmptyToUndefined(z.coerce.number().int());

export const buyerBaseSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." })
    .max(80, { message: "Full name must be at most 80 characters." }),

  email: preprocessEmptyToUndefined(
    z.string().email({ message: "Invalid email address." })
  ).optional(),

  phone: z
    .string()
    .regex(/^\d+$/, { message: "Phone number must be numeric." })
    .min(10, { message: "Phone must be 10 to 15 digits." })
    .max(15, { message: "Phone must be 10 to 15 digits." }),

  city: CITY,
  propertyType: PROPERTY_TYPE,
  bhk: preprocessEmptyToUndefined(BHK.optional()),
  purpose: PURPOSE,

  budgetMin: optionalInt().optional(),
  budgetMax: optionalInt().optional(),

  timeline: TIMELINE,
  source: SOURCE,
  status: STATUS.optional(),

  notes: preprocessEmptyToUndefined(
    z.string().max(1000, { message: "Notes must be 1000 characters or less." })
  ).optional(),

  tags: z.array(z.string()).optional(),
});

export const buyerCreateSchema = buyerBaseSchema.superRefine((data, ctx) => {
  if (!data.city) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["city"], message: "City is required." });
  }
  if (!data.propertyType) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["propertyType"], message: "Property type is required." });
  }
  if (!data.purpose) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["purpose"], message: "Purpose is required." });
  }
  if (!data.timeline) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["timeline"], message: "Timeline is required." });
  }
  if (!data.source) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["source"], message: "Source is required." });
  }

  if (
    (data.propertyType === "Apartment" || data.propertyType === "Villa") &&
    !data.bhk
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["bhk"],
      message: "BHK is required when property type is Apartment or Villa.",
    });
  }

  if (data.budgetMin !== undefined && data.budgetMax !== undefined) {
    if (data.budgetMax < data.budgetMin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["budgetMax"],
        message: "Max budget must be greater than or equal to min budget.",
      });
    }
  }
});

export const buyerUpdateSchema = buyerBaseSchema.partial().superRefine((data, ctx) => {
  if (data.budgetMin !== undefined && data.budgetMax !== undefined) {
    if (data.budgetMax < data.budgetMin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["budgetMax"],
        message: "Max budget must be greater than or equal to min budget.",
      });
    }
  }
});

export const csvRowSchema = buyerBaseSchema.partial();

export type BuyerCreateInput = z.infer<typeof buyerCreateSchema>;
export type BuyerUpdateInput = z.infer<typeof buyerUpdateSchema>;
export type CsvRow = z.infer<typeof csvRowSchema>;
export type City = z.infer<typeof CITY>;
export type PropertyType = z.infer<typeof PROPERTY_TYPE>;
export type BHK = z.infer<typeof BHK>;
export type Purpose = z.infer<typeof PURPOSE>;
export type Timeline = z.infer<typeof TIMELINE>;
export type Source = z.infer<typeof SOURCE>;
export type Status = z.infer<typeof STATUS>;