import z from "zod";
import { GOVERNORATE_VALUES } from "./shipping";

const productSizes = [
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "40",
  "42",
  "44",
  "46",
  "48",
  "50",
] as const;

export const ProductVariantSchema = z.object({
  id: z.string().optional(),
  size: z.enum(productSizes, { error: "Invalid size" }),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid color format"),
  stock: z.coerce
    .number({ error: "Stock must be a number" })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
});

function parseJsonField<T extends z.ZodType>(schema: T, label: string) {
  return z
    .string()
    .transform((val, ctx) => {
      try {
        return JSON.parse(val);
      } catch {
        ctx.addIssue({
          code: "custom",
          message: `Invalid ${label} format`,
        });
        return z.NEVER;
      }
    })
    .pipe(schema);
}

export const ProductSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),

  price: z.coerce
    .number({ error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  discountPercent: z.coerce.number().min(0).max(100).nullable().optional(),
  categories: parseJsonField(
    z
      .array(z.string().min(1, "Category cannot be empty"))
      .min(1, "At least one category is required"),
    "categories",
  ),

  variants: parseJsonField(
    z.array(ProductVariantSchema).min(1, "At least one variant is required"),
    "variants",
  ),

  images: parseJsonField(
    z
      .array(z.string().url("Invalid image URL"))
      .min(1, "At least one image is required"),
    "images",
  ),
});

export type ProductFormInput = z.input<typeof ProductSchema>;
export type ProductFormData = z.output<typeof ProductSchema>;

export const checkoutSchema = z.object({
  name: z.string().min(3, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  address: z.string().min(10, "Address is too short"),
  city: z.enum(GOVERNORATE_VALUES, {
    error: "Select your governorate",
  }),
  paymentMethod: z.enum(["CASH", "INSTAPAY"], {
    error: "Select a payment method",
  }),
  discountCode: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
