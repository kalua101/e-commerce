import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { slug: id }, include: { category: true, inventory: true, reviews: { include: { user: { select: { name: true, image: true } } }, orderBy: { createdAt: "desc" } } } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const avgRating = product.reviews.length > 0 ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length : 0;
    return NextResponse.json({ ...product, avgRating, reviewCount: product.reviews.length });
  } catch { return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 }); }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const product = await prisma.product.update({ where: { id }, data: body, include: { category: true, inventory: true } });
    return NextResponse.json({...product, images: JSON.parse(product.images)});
  } catch { return NextResponse.json({ error: "Failed to update product" }, { status: 500 }); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed to delete product" }, { status: 500 }); }
}
