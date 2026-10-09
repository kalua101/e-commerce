import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/algolia';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '0');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const inStock = searchParams.get('inStock');
    const featured = searchParams.get('featured');

    // Build Algolia filters
    const filters: string[] = [];
    
    if (category) {
      filters.push(`categorySlug:${category}`);
    }
    
    if (inStock === 'true') {
      filters.push('inStock:true');
    }
    
    if (featured === 'true') {
      filters.push('featured:true');
    }

    // Always show only active products
    filters.push('isActive:true');

    // Search products using Algolia
    const result = await searchProducts(query, {
      page,
      hitsPerPage: limit,
      filters: filters.join(' AND '),
      facets: ['categoryName', 'inStock', 'featured'],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
