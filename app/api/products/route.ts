import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const where: any = { isActive: true };
    if (category) where.category = { slug: category };
    if (featured === "true") where.featured = true;
    if (search) where.OR = [{ name: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }];
    if (minPrice || maxPrice) { where.price = {}; if (minPrice) where.price.gte = parseFloat(minPrice); if (maxPrice) where.price.lte = parseFloat(maxPrice); }
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, include: { category: true, inventory: true, reviews: { select: { rating: true } } }, orderBy: { [sortBy]: sortOrder }, skip: (page - 1) * limit, take: limit }),
      prisma.product.count({ where }),
    ]);
    const productsWithRating = products.map((p) => ({ ...p, avgRating: p.reviews.length > 0 ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length : 0, reviewCount: p.reviews.length }));
    return NextResponse.json({ products: productsWithRating, total, pages: Math.ceil(total / limit), page });
  } catch { return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { name, slug, description, price, comparePrice, images, categoryId, featured, initialStock, lowStockThreshold } = await req.json();
    const product = await prisma.product.create({
      data: { name, slug, description, price: parseFloat(price), comparePrice: comparePrice ? parseFloat(comparePrice) : null, images: images || [], categoryId, featured: featured || false, inventory: { create: { quantity: initialStock || 0, lowStockThreshold: lowStockThreshold || 10 } } },
      include: { category: true, inventory: true },
    });
    return NextResponse.json(product, { status: 201 });
  } catch { return NextResponse.json({ error: "Failed to create product" }, { status: 500 }); }
}
