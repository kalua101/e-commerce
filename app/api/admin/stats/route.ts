import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [totalRevenue, totalOrders, totalProducts, totalUsers, recentOrders, lowStockItems, topProductItems] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
      prisma.order.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } }, items: { select: { quantity: true, price: true } } } }),
      prisma.inventory.findMany({ where: { quantity: { lte: 10 } }, include: { product: { select: { name: true, images: true, slug: true } } }, take: 10 }),
      prisma.orderItem.groupBy({ by: ["productId"], _sum: { quantity: true }, orderBy: { _sum: { quantity: "desc" } }, take: 5 }),
    ]);
    const salesLast30Days = await prisma.order.findMany({ where: { createdAt: { gte: thirtyDaysAgo }, status: { not: "CANCELLED" } }, select: { createdAt: true, total: true }, orderBy: { createdAt: "asc" } });
    const dailySales: Record<string, number> = {};
    salesLast30Days.forEach((o) => {
      const day = o.createdAt.toISOString().split("T")[0];
      dailySales[day] = (dailySales[day] || 0) + Number(o.total);
    });
    const salesChart = Object.entries(dailySales).map(([date, revenue]) => ({ date, revenue }));
    const topProducts = await Promise.all(topProductItems.map(async (item) => {
      const product = await prisma.product.findUnique({ where: { id: item.productId }, select: { name: true, images: true, price: true } });
      return { productId: item.productId, totalSold: item._sum.quantity || 0, product };
    }));
    return NextResponse.json({ totalRevenue: totalRevenue._sum.total || 0, totalOrders, totalProducts, totalUsers, recentOrders, lowStockItems, salesChart, topProducts });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 }); }
}