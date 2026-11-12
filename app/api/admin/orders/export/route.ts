import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma"; // adjust to your path
import { auth } from "@/lib/auth"; // adjust: your better-auth instance
import { requireAdmin } from "@/actions/customers-actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Admin check (your User model has role: USER | ADMIN)
  const denied = await requireAdmin();
  if (denied) return denied;

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      discountCode: { select: { code: true } },
      items: {
        include: {
          variant: {
            include: { product: { select: { title: true } } },
          },
        },
      },
    },
  });

  const workbook = new ExcelJS.Workbook();

  // ---------- Sheet 1: Orders ----------
  const ordersSheet = workbook.addWorksheet("Orders");
  ordersSheet.columns = [
    { header: "Order ID", key: "id", width: 38 },
    { header: "Date", key: "date", width: 18 },
    { header: "Customer", key: "name", width: 24 },
    { header: "Phone", key: "phone", width: 16 },
    { header: "Email", key: "email", width: 26 },
    { header: "City", key: "city", width: 16 },
    { header: "Address", key: "address", width: 36 },
    { header: "Items", key: "items", width: 48 },
    { header: "Payment", key: "payment", width: 12 },
    { header: "Discount Code", key: "code", width: 16 },
    { header: "Discount", key: "discount", width: 10 },
    { header: "Shipping", key: "shipping", width: 10 },
    { header: "Total", key: "amount", width: 12 },
    { header: "Currency", key: "currency", width: 10 },
    { header: "Status", key: "status", width: 14 },
  ];

  for (const o of orders) {
    ordersSheet.addRow({
      id: o.id,
      date: o.createdAt,
      name: o.customerName,
      phone: o.customerPhone,
      email: o.customerEmail ?? "",
      city: o.city,
      address: o.address,
      items: o.items
        .map(
          (i) =>
            `${i.variant.product.title} (${i.variant.size}/${i.variant.color}) x${i.quantity}`,
        )
        .join(", "),
      payment: o.paymentMethod,
      code: o.discountCode?.code ?? "",
      discount: o.discountAmount,
      shipping: o.shippingFee,
      amount: o.amount,
      currency: o.currency,
      status: o.status,
    });
  }

  // Phone as text so Excel doesn't drop the leading 0
  ordersSheet.getColumn("phone").numFmt = "@";
  ordersSheet.getColumn("date").numFmt = "yyyy-mm-dd hh:mm";

  // ---------- Sheet 2: Order Items ----------
  const itemsSheet = workbook.addWorksheet("Order Items");
  itemsSheet.columns = [
    { header: "Order ID", key: "orderId", width: 38 },
    { header: "Date", key: "date", width: 18 },
    { header: "Customer", key: "name", width: 24 },
    { header: "Product", key: "product", width: 30 },
    { header: "Size", key: "size", width: 8 },
    { header: "Color", key: "color", width: 12 },
    { header: "Qty", key: "qty", width: 6 },
    { header: "Unit Price", key: "price", width: 12 },
    { header: "Line Total", key: "line", width: 12 },
  ];

  for (const o of orders) {
    for (const i of o.items) {
      itemsSheet.addRow({
        orderId: o.id,
        date: o.createdAt,
        name: o.customerName,
        product: i.variant.product.title,
        size: i.variant.size,
        color: i.variant.color,
        qty: i.quantity,
        price: i.priceAtPurchase,
        line: i.priceAtPurchase * i.quantity,
      });
    }
  }
  itemsSheet.getColumn("date").numFmt = "yyyy-mm-dd hh:mm";

  // ---------- Styling ----------
  for (const sheet of [ordersSheet, itemsSheet]) {
    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: sheet.columnCount },
    };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = `orders-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer as ArrayBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
