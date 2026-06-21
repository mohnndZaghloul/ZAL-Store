import z from "zod";

const productSizes = ["S", "M", "L", "XL", "XXL"] as const;

export const ProductVariantSchema = z.object({
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
