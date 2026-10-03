import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // @ts-ignore - session.user is checked above
    const user = session.user;
    const userId = user.id;
    const isAdmin = (user as any).role === "ADMIN";
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const where: any = isAdmin ? {} : { userId };
    if (status) where.status = status;
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({ 
        where, 
        include: { 
          items: { include: { product: { select: { name: true, images: true, slug: true } } } }, 
          user: { select: { name: true, email: true } }, 
          address: true 
        }, 
        orderBy: { createdAt: "desc" }, 
        skip: (page - 1) * limit, 
        take: limit 
      }),
      prisma.order.count({ where }),
    ]);
    
    return NextResponse.json({ orders, total, pages: Math.ceil(total / limit), page });
  } catch { 
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 }); 
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // @ts-ignore - session.user.id is checked above
    const userId = session.user.id;
    const { items, address, paymentMethod } = await req.json();
    
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }
    
    let addressId: string | undefined;
    if (address) { 
      const addr = await prisma.address.create({ data: { ...address, userId } }); 
      addressId = addr.id; 
    }
    
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({ 
      where: { id: { in: productIds } }, 
      include: { inventory: true } 
    });
    
    let subtotal = 0;
    const orderItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (!product.inventory || product.inventory.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      const price = Number(product.price); 
      subtotal += price * item.quantity;
      return { productId: item.productId, quantity: item.quantity, price };
    });
    
    const shippingCost = subtotal >= 50 ? 0 : 9.99;
    const total = subtotal + shippingCost;
    const paymentId = `SIM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const order = await prisma.order.create({ 
      data: { 
        userId, 
        addressId, 
        subtotal, 
        shippingCost, 
        total, 
        paymentId, 
        paymentMethod: paymentMethod || "card", 
        status: "PROCESSING", 
        items: { create: orderItems } 
      }, 
      include: { items: { include: { product: true } }, address: true } 
    });
    
    await Promise.all(
      items.map((item: any) => 
        prisma.inventory.update({ 
          where: { productId: item.productId }, 
          data: { 
            quantity: { decrement: item.quantity }, 
            historyEntries: { create: { change: -item.quantity, reason: `Order #${order.id}` } } 
          } 
        })
      )
    );
    
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) { 
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 }); 
  }
}