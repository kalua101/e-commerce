import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const inventory = await prisma.inventory.findMany({ include: { product: { select: { name: true, slug: true, images: true, category: { select: { name: true } } } }, historyEntries: { orderBy: { createdAt: "desc" }, take: 5 } }, orderBy: { quantity: "asc" } });
    return NextResponse.json(inventory);
  } catch { return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 }); }
}
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { productId, quantity, reason } = await req.json();
    const inv = await prisma.inventory.findUnique({ where: { productId } });
    if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const diff = quantity - inv.quantity;
    const inventory = await prisma.inventory.update({ where: { productId }, data: { quantity, historyEntries: { create: { change: diff, reason: reason || "Manual adjustment" } } } });
    return NextResponse.json(inventory);
  } catch { return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 }); }
}