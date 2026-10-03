import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // @ts-ignore - session.user is checked above
    const userId = session.user.id;
    const { id } = await params;
    const order = await prisma.order.findUnique({ 
      where: { id }, 
      include: { 
        items: { include: { product: { select: { name: true, images: true, slug: true, price: true } } } }, 
        user: { select: { name: true, email: true } }, 
        address: true 
      } 
    });
    
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    const isAdmin = (session.user as any).role === "ADMIN";
    if (!isAdmin && order.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    return NextResponse.json(order);
  } catch { 
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 }); 
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // @ts-ignore - session.user is checked above
    if ((session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = await params;
    const { status } = await req.json();
    const order = await prisma.order.update({ where: { id }, data: { status } });
    return NextResponse.json(order);
  } catch { 
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 }); 
  }
}