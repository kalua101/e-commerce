import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if tables exist (simplified for SQLite)
    const userCount = await prisma.user.count();
    
    // If database is empty, seed it
    if (userCount === 0) {
      // Create admin user
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("Admin@123456", 10);
      
      await prisma.user.create({
        data: {
          email: "admin@store.com",
          name: "Admin User",
          password: hashedPassword,
          role: "admin",
          emailVerified: new Date()
        }
      });
      
      // Create categories
      const electronics = await prisma.category.create({
        data: {
          name: "Electronics",
          slug: "electronics",
          description: "Electronic devices and accessories"
        }
      });
      
      // Create sample products
      const product1 = await prisma.product.create({
        data: {
          name: "Premium Laptop",
          slug: "premium-laptop",
          description: "High-performance laptop for professionals",
          price: 1299.99,
          comparePrice: 1499.99,
          image: "/placeholder.svg",
          images: ["/placeholder.svg"],
          categoryId: electronics.id,
          featured: true,
          isActive: true
        }
      });
      
      await prisma.inventory.create({
        data: {
          productId: product1.id,
          stock: 50,
          lowStockThreshold: 10
        }
      });
      
      return NextResponse.json({ 
        success: true,
        message: "Database seeded successfully!",
        created: {
          users: 1,
          categories: 1,
          products: 1
        }
      });
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Database already seeded",
      users: userCount
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: error.message,
      message: "Setup failed"
    }, { status: 500 });
  }
}
