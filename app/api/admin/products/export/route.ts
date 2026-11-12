import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/actions/customers-actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const products = await prisma.product.findMany({
    orderBy: { createAt: "desc" },
    include: {
      categories: { select: { name: true } },
      variants: { orderBy: [{ color: "asc" }, { size: "asc" }] },
    },
  });

  const workbook = new ExcelJS.Workbook();

  // ---------- Sheet 1: Products ----------
  const productsSheet = workbook.addWorksheet("Products");
  productsSheet.columns = [
    { header: "Product ID", key: "id", width: 38 },
    { header: "Title", key: "title", width: 32 },
    { header: "Description", key: "description", width: 50 },
    { header: "Categories", key: "categories", width: 24 },
    { header: "Tags", key: "tags", width: 24 },
    { header: "Price", key: "price", width: 10 },
    { header: "Discount %", key: "discount", width: 12 },
    { header: "Price After Discount", key: "final", width: 20 },
    { header: "Total Stock", key: "stock", width: 12 },
    { header: "Variants", key: "variants", width: 8 },
    { header: "Images", key: "images", width: 60 },
    { header: "Created", key: "created", width: 18 },
    { header: "Updated", key: "updated", width: 18 },
  ];

  for (const p of products) {
    const discount = p.discountPercent ?? 0;
    productsSheet.addRow({
      id: p.id,
      title: p.title,
      description: p.description,
      categories: p.categories.map((c) => c.name).join(", "),
      tags: p.tags.join(", "),
      price: p.price,
      discount,
      final: Math.round(p.price * (1 - discount / 100) * 100) / 100,
      stock: p.variants.reduce((sum, v) => sum + v.stock, 0),
      variants: p.variants.length,
      images: p.images.join("\n"),
      created: p.createAt,
      updated: p.UpdateAt,
    });
  }
  productsSheet.getColumn("created").numFmt = "yyyy-mm-dd hh:mm";
  productsSheet.getColumn("updated").numFmt = "yyyy-mm-dd hh:mm";

  // ---------- Sheet 2: Variants (stock per size/color) ----------
  const variantsSheet = workbook.addWorksheet("Variants");
  variantsSheet.columns = [
    { header: "Product ID", key: "productId", width: 38 },
    { header: "Product", key: "product", width: 32 },
    { header: "Variant ID", key: "variantId", width: 38 },
    { header: "Size", key: "size", width: 8 },
    { header: "Color", key: "color", width: 14 },
    { header: "Stock", key: "stock", width: 8 },
    { header: "Price Modifier", key: "modifier", width: 14 },
    { header: "Variant Price", key: "price", width: 14 },
  ];

  for (const p of products) {
    for (const v of p.variants) {
      const row = variantsSheet.addRow({
        productId: p.id,
        product: p.title,
        variantId: v.id,
        size: v.size,
        color: v.color,
        stock: v.stock,
        modifier: v.priceModifier,
        price: p.price + v.priceModifier,
      });
      // Highlight out-of-stock rows
      if (v.stock === 0) {
        row.getCell("stock").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFC7CE" },
        };
      }
    }
  }

  // ---------- Styling ----------
  for (const sheet of [productsSheet, variantsSheet]) {
    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: sheet.columnCount },
    };
  }
  productsSheet.getColumn("description").alignment = {
    wrapText: true,
    vertical: "top",
  };
  productsSheet.getColumn("images").alignment = {
    wrapText: true,
    vertical: "top",
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = `products-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer as ArrayBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
