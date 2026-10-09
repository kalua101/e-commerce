import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...\n');

  // Create categories
  console.log('📁 Creating categories...');
  
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Cutting-edge electronic devices and gadgets',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop',
    },
  });

  const fashion = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Trendy clothing and accessories',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop',
    },
  });

  const home = await prisma.category.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      name: 'Home & Living',
      slug: 'home',
      description: 'Everything for your home',
      image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&auto=format&fit=crop',
    },
  });

  const sports = await prisma.category.upsert({
    where: { slug: 'sports' },
    update: {},
    create: {
      name: 'Sports & Outdoors',
      slug: 'sports',
      description: 'Gear up for adventure',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop',
    },
  });

  console.log('✅ Categories created!\n');

  // Electronics products
  console.log('📱 Adding Electronics products...');
  
  const electronicProducts = [
    {
      name: 'Wireless Headphones Pro',
      slug: 'wireless-headphones-pro',
      description: 'Premium noise-cancelling wireless headphones with 30-hour battery life. Crystal clear sound quality with deep bass and comfortable ear cushions.',
      price: 199.99,
      comparePrice: 249.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop',
      ]),
      categoryId: electronics.id,
      featured: true,
      inventory: { quantity: 50, lowStockThreshold: 10 },
    },
    {
      name: 'Smart Watch Ultra',
      slug: 'smart-watch-ultra',
      description: 'Advanced fitness tracking with heart rate monitor, GPS, and 5-day battery life. Water-resistant up to 50m.',
      price: 399.99,
      comparePrice: 499.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop',
      ]),
      categoryId: electronics.id,
      featured: false,
      inventory: { quantity: 75, lowStockThreshold: 15 },
    },
    {
      name: '4K Action Camera',
      slug: '4k-action-camera',
      description: 'Capture your adventures in stunning 4K resolution. Waterproof, shockproof, and comes with mounting accessories.',
      price: 279.99,
      comparePrice: 349.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=800&auto=format&fit=crop',
      ]),
      categoryId: electronics.id,
      featured: true,
      inventory: { quantity: 30, lowStockThreshold: 8 },
    },
  ];

  for (const product of electronicProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        inventory: { create: product.inventory },
      },
    });
  }

  // Fashion products
  console.log('👕 Adding Fashion products...');
  
  const fashionProducts = [
    {
      name: 'Classic Leather Jacket',
      slug: 'classic-leather-jacket',
      description: 'Genuine leather jacket with timeless design. Perfect for any season. Available in black and brown.',
      price: 299.99,
      comparePrice: 399.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&auto=format&fit=crop',
      ]),
      categoryId: fashion.id,
      featured: true,
      inventory: { quantity: 40, lowStockThreshold: 10 },
    },
    {
      name: 'Designer Sunglasses',
      slug: 'designer-sunglasses',
      description: 'Premium polarized sunglasses with UV400 protection. Stylish and durable frames.',
      price: 149.99,
      comparePrice: 199.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop',
      ]),
      categoryId: fashion.id,
      featured: false,
      inventory: { quantity: 60, lowStockThreshold: 12 },
    },
    {
      name: 'Premium Canvas Sneakers',
      slug: 'premium-canvas-sneakers',
      description: 'Comfortable all-day wear sneakers with breathable canvas material. Classic design meets modern comfort.',
      price: 89.99,
      comparePrice: 119.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&auto=format&fit=crop',
      ]),
      categoryId: fashion.id,
      featured: true,
      inventory: { quantity: 100, lowStockThreshold: 20 },
    },
  ];

  for (const product of fashionProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        inventory: { create: product.inventory },
      },
    });
  }

  // Home & Living products
  console.log('🏠 Adding Home & Living products...');
  
  const homeProducts = [
    {
      name: 'Modern Table Lamp',
      slug: 'modern-table-lamp',
      description: 'Elegant minimalist table lamp with adjustable brightness. Perfect for reading or ambient lighting.',
      price: 79.99,
      comparePrice: 99.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop',
      ]),
      categoryId: home.id,
      featured: false,
      inventory: { quantity: 45, lowStockThreshold: 10 },
    },
    {
      name: 'Ceramic Coffee Mug Set',
      slug: 'ceramic-coffee-mug-set',
      description: 'Set of 4 handcrafted ceramic mugs. Microwave and dishwasher safe. Each mug holds 12oz.',
      price: 49.99,
      comparePrice: 69.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop',
      ]),
      categoryId: home.id,
      featured: true,
      inventory: { quantity: 80, lowStockThreshold: 15 },
    },
    {
      name: 'Cozy Throw Blanket',
      slug: 'cozy-throw-blanket',
      description: 'Ultra-soft plush throw blanket. Perfect for movie nights and cold evenings. Machine washable.',
      price: 59.99,
      comparePrice: 79.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566044362125-a7b8546455af?w=800&auto=format&fit=crop',
      ]),
      categoryId: home.id,
      featured: false,
      inventory: { quantity: 55, lowStockThreshold: 12 },
    },
  ];

  for (const product of homeProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        inventory: { create: product.inventory },
      },
    });
  }

  // Sports & Outdoors products
  console.log('⚽ Adding Sports & Outdoors products...');
  
  const sportsProducts = [
    {
      name: 'Yoga Mat Pro',
      slug: 'yoga-mat-pro',
      description: 'Extra thick non-slip yoga mat with carrying strap. Eco-friendly material, perfect for all types of yoga and pilates.',
      price: 39.99,
      comparePrice: 59.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&auto=format&fit=crop',
      ]),
      categoryId: sports.id,
      featured: true,
      inventory: { quantity: 70, lowStockThreshold: 15 },
    },
    {
      name: 'Camping Backpack 50L',
      slug: 'camping-backpack-50l',
      description: 'Durable hiking backpack with 50L capacity. Multiple compartments, rain cover included. Ergonomic design.',
      price: 129.99,
      comparePrice: 179.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop',
      ]),
      categoryId: sports.id,
      featured: false,
      inventory: { quantity: 35, lowStockThreshold: 8 },
    },
    {
      name: 'Water Bottle Insulated',
      slug: 'water-bottle-insulated',
      description: 'Stainless steel insulated water bottle. Keeps drinks cold for 24h or hot for 12h. BPA-free, leak-proof.',
      price: 29.99,
      comparePrice: 39.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&auto=format&fit=crop',
      ]),
      categoryId: sports.id,
      featured: true,
      inventory: { quantity: 120, lowStockThreshold: 25 },
    },
  ];

  for (const product of sportsProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        inventory: { create: product.inventory },
      },
    });
  }

  console.log('\n✅ Seed completed successfully!');
  console.log('📊 Summary:');
  console.log('   - 4 categories created');
  console.log('   - 12 products added (3 per category)');
  console.log('   - All products have inventory set up');
  console.log('\n🎉 Your store is ready with sample data!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
