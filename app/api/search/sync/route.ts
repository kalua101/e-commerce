import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { syncProductsToAlgolia, configureAlgoliaIndex } from '@/lib/algolia';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Check if user is admin
    const session = await auth();
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 Starting Algolia sync...');

    // Configure index settings first
    await configureAlgoliaIndex();

    // Fetch all active products
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        inventory: true,
      },
    });

    console.log(`📦 Found ${products.length} products to sync`);

    // Sync products to Algolia
    await syncProductsToAlgolia(products);

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${products.length} products to Algolia`,
      count: products.length,
    });
  } catch (error) {
    console.error('❌ Algolia sync failed:', error);
    return NextResponse.json(
      { error: 'Failed to sync products to Algolia' },
      { status: 500 }
    );
  }
}
