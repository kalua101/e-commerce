import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";
import { Filter } from "lucide-react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : '';
  const category = typeof params.category === 'string' ? params.category : '';

  // Build where clause
  const where: any = {
    isActive: true,
  };

  // For category filtering
  if (category) {
    where.category = { slug: category };
  }

  // Fetch products and categories
  const [allProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        inventory: true,
        category: true,
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  // Client-side case-insensitive search filtering (SQLite doesn't support mode: 'insensitive')
  const products = search
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      )
    : allProducts;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          {category
            ? categories.find(c => c.slug === category)?.name || 'Products'
            : search
            ? `Search Results for "${search}"`
            : 'All Products'}
        </h1>
        <p className="text-gray-400">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar - Categories */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="glass rounded-xl p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-indigo-400" />
              <h2 className="font-bold text-white">Categories</h2>
            </div>
            <div className="space-y-2">
              <a
                href="/products"
                className={`block px-3 py-2 rounded-lg transition-colors ${
                  !category
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                All Products
              </a>
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    category === cat.slug
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center">
              <p className="text-gray-400 text-lg">No products found.</p>
              <p className="text-gray-500 text-sm mt-2">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const avgRating =
                  product.reviews.length > 0
                    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                      product.reviews.length
                    : 0;
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    price={Number(product.price)}
                    comparePrice={
                      product.comparePrice ? Number(product.comparePrice) : null
                    }
                    images={JSON.parse(product.images)}
                    avgRating={avgRating}
                    reviewCount={product.reviews.length}
                    inventory={product.inventory}
                    category={product.category}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
