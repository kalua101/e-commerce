import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin user
  const adminPassword = await bcrypt.hash("Admin@123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@store.com" },
    update: {},
    create: { name: "Admin User", email: "admin@store.com", password: adminPassword, role: "ADMIN" },
  });
  console.log("Admin created:", admin.email);

  // Test user
  const userPassword = await bcrypt.hash("User@123456", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@store.com" },
    update: {},
    create: { name: "John Doe", email: "user@store.com", password: userPassword, role: "USER" },
  });
  console.log("Test user created:", user.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "electronics" }, update: {}, create: { name: "Electronics", slug: "electronics", description: "Latest tech gadgets and devices", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400" } }),
    prisma.category.upsert({ where: { slug: "clothing" }, update: {}, create: { name: "Clothing", slug: "clothing", description: "Fashion for everyone", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400" } }),
    prisma.category.upsert({ where: { slug: "home-garden" }, update: {}, create: { name: "Home & Garden", slug: "home-garden", description: "Everything for your home", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400" } }),
    prisma.category.upsert({ where: { slug: "sports" }, update: {}, create: { name: "Sports", slug: "sports", description: "Gear for active lifestyles", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400" } }),
    prisma.category.upsert({ where: { slug: "books" }, update: {}, create: { name: "Books", slug: "books", description: "Knowledge at your fingertips", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400" } }),
  ]);
  console.log("Categories created:", categories.length);

  const [electronics, clothing, homeGarden, sports, books] = categories;

  // Products
  const products = [
    { name: "ProBook Laptop 15\"", slug: "probook-laptop-15", description: "High-performance laptop with Intel Core i7, 16GB RAM, 512GB SSD. Perfect for professionals and students.", price: 1299.99, comparePrice: 1599.99, images: JSON.stringify( ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600","https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600"]), featured: true, categoryId: electronics.id, stock: 45 },
    { name: "Wireless Noise-Cancel Headphones", slug: "wireless-noise-cancel-headphones", description: "Premium over-ear headphones with 30-hour battery and active noise cancellation.", price: 249.99, comparePrice: 349.99, images: JSON.stringify( ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600","https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600"]), featured: true, categoryId: electronics.id, stock: 120 },
    { name: "4K Smart TV 55\"", slug: "4k-smart-tv-55", description: "Crystal-clear 4K display with HDR, built-in streaming apps, and voice control.", price: 699.99, comparePrice: 899.99, images: JSON.stringify( ["https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600"]), featured: false, categoryId: electronics.id, stock: 30 },
    { name: "SmartWatch Pro X1", slug: "smartwatch-pro-x1", description: "Advanced fitness tracking, GPS, heart rate monitor, and 7-day battery life.", price: 399.99, comparePrice: 499.99, images: JSON.stringify( ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600","https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600"]), featured: true, categoryId: electronics.id, stock: 8 },
    { name: "Premium Cotton T-Shirt", slug: "premium-cotton-tshirt", description: "Ultra-soft 100% organic cotton. Available in multiple colors.", price: 29.99, comparePrice: 49.99, images: JSON.stringify( ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"]), featured: false, categoryId: clothing.id, stock: 200 },
    { name: "Slim Fit Chino Pants", slug: "slim-fit-chino-pants", description: "Versatile slim-fit chinos perfect for casual and smart-casual occasions.", price: 79.99, comparePrice: 109.99, images: JSON.stringify( ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600"]), featured: false, categoryId: clothing.id, stock: 5 },
    { name: "Running Sneakers Ultra", slug: "running-sneakers-ultra", description: "Lightweight and responsive running shoes with superior cushioning.", price: 129.99, comparePrice: 179.99, images: JSON.stringify( ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600","https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600"]), featured: true, categoryId: sports.id, stock: 75 },
    { name: "Yoga Mat Premium", slug: "yoga-mat-premium", description: "Non-slip, eco-friendly 6mm thick yoga mat with alignment lines.", price: 49.99, comparePrice: 79.99, images: JSON.stringify( ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600"]), featured: false, categoryId: sports.id, stock: 3 },
    { name: "Ceramic Coffee Mug Set", slug: "ceramic-coffee-mug-set", description: "Set of 4 handcrafted ceramic mugs. Dishwasher and microwave safe.", price: 34.99, comparePrice: 54.99, images: JSON.stringify( ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600"]), featured: false, categoryId: homeGarden.id, stock: 60 },
    { name: "Smart LED Desk Lamp", slug: "smart-led-desk-lamp", description: "Eye-care desk lamp with adjustable color temperature, USB charging port, and touch control.", price: 59.99, comparePrice: 89.99, images: JSON.stringify( ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"]), featured: true, categoryId: homeGarden.id, stock: 40 },
    { name: "The Art of Clean Code", slug: "the-art-of-clean-code", description: "A comprehensive guide to writing maintainable, efficient code that stands the test of time.", price: 39.99, comparePrice: 59.99, images: JSON.stringify( ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600"]), featured: false, categoryId: books.id, stock: 150 },
    { name: "Bluetooth Mechanical Keyboard", slug: "bluetooth-mechanical-keyboard", description: "Compact TKL layout with RGB backlight and tactile switches. Works across 3 devices.", price: 149.99, comparePrice: 199.99, images: JSON.stringify( ["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600"]), featured: true, categoryId: electronics.id, stock: 55 },
  ];

  for (const p of products) {
    const { stock, ...productData } = p;
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: { ...productData, inventory: { create: { quantity: stock, lowStockThreshold: 10 } } },
    });
  }
  console.log("Products created:", products.length);

  // Sample reviews
  const allProducts = await prisma.product.findMany({ take: 4 });
  for (const product of allProducts) {
    await prisma.review.upsert({
      where: { userId_productId: { userId: user.id, productId: product.id } },
      update: {},
      create: { userId: user.id, productId: product.id, rating: 5, title: "Excellent product!", comment: "Really impressed with the quality. Would definitely recommend to anyone looking for a reliable option." },
    });
  }
  console.log("Reviews created");

  console.log("\nSeeding complete!");
  console.log("Admin: admin@store.com / Admin@123456");
  console.log("User: user@store.com / User@123456");
}

main().catch(console.error).finally(() => prisma.$disconnect());
