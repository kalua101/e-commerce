import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";
import { ArrowRight, Truck, ShieldCheck, RefreshCw } from "lucide-react";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true, isActive: true },
    include: { inventory: true, category: true, reviews: { select: { rating: true } } },
    take: 4,
  });
  
  const categories = await prisma.category.findMany({ take: 3 });

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000')] bg-cover bg-center" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-xl leading-tight">
            Discover the <span className="gradient-text">Extraordinary</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Shop the latest trends, newest gadgets, and premium essentials curated just for you.
          </p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-white text-indigo-950 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl shadow-white/10">
            Shop Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 -mt-24 relative z-30">
        <div className="glass p-6 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400"><Truck size={24} /></div>
          <div><h3 className="font-bold text-white">Free Shipping</h3><p className="text-sm text-gray-400">On orders over $50</p></div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400"><ShieldCheck size={24} /></div>
          <div><h3 className="font-bold text-white">Secure Checkout</h3><p className="text-sm text-gray-400">100% protected payments</p></div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center text-pink-400"><RefreshCw size={24} /></div>
          <div><h3 className="font-bold text-white">Easy Returns</h3><p className="text-sm text-gray-400">30-day money-back guarantee</p></div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Featured Products</h2>
            <p className="text-gray-400">Handpicked selections just for you.</p>
          </div>
          <Link href="/products" className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 group">
            View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
             const avgRating = product.reviews.length > 0 ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length : 0;
             return (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={Number(product.price)}
                comparePrice={product.comparePrice ? Number(product.comparePrice) : null}
                images={JSON.parse(product.images)}
                avgRating={avgRating}
                reviewCount={product.reviews.length}
                inventory={product.inventory}
                category={product.category}
              />
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <h2 className="text-3xl font-bold text-white mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className="group relative h-64 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gray-900">
                {cat.image && <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80" unoptimized/>}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
