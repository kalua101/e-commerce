import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: "asc" } });
    return NextResponse.json(categories);
  } catch { return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 }); }
}
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { name, slug, description, image } = await req.json();
    const category = await prisma.category.create({ data: { name, slug, description, image } });
    return NextResponse.json(category, { status: 201 });
  } catch { return NextResponse.json({ error: "Failed to create category" }, { status: 500 }); }
}