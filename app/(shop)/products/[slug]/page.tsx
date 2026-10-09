"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Star, Check, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatCurrency, getDiscountPercent } from "@/lib/utils";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    fetch(`/api/products/${params.slug}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        setProduct({ error: 'Failed to load product' });
        setLoading(false);
      });
  }, [params.slug]);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>;
  if (product.error) return <div className="h-[60vh] flex items-center justify-center flex-col gap-4">
    <AlertCircle className="text-red-500" size={48} />
    <h2 className="text-2xl font-bold">Product not found</h2>
    <Link href="/products" className="text-indigo-400 hover:underline">Back to products</Link>
  </div>;

  const inStock = product.inventory && product.inventory.quantity > 0;
  const discount = product.comparePrice ? getDiscountPercent(product.price, product.comparePrice) : 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    setAdding(true);
    addItem({ id: product.id, name: product.name, price: Number(product.price), image: product.images[0] || "", slug: product.slug });
    setTimeout(() => { setAdding(false); openCart(); }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Products
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden glass">
            {product.images[0] ? <Image src={product.images[0]} alt={product.name} fill className="object-cover" unoptimized/> : <div className="w-full h-full flex items-center justify-center bg-gray-900"><ShoppingCart size={64} className="text-gray-700"/></div>}
            {discount > 0 && <span className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1.5 rounded-full shadow-lg text-sm">-{discount}% OFF</span>}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((img: string, i: number) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden glass hover:border-indigo-500 cursor-pointer">
                  <Image src={img} alt="" fill className="object-cover" unoptimized/>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          {product.category && <Link href={`/products?category=${product.category.slug}`} className="text-indigo-400 font-semibold mb-2 hover:underline">{product.category.name}</Link>}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            {product.avgRating > 0 ? (
              <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1">
                <Star className="fill-yellow-400 text-yellow-400" size={16} />
                <span className="font-bold text-white">{product.avgRating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
              </div>
            ) : <span className="text-sm text-gray-400">No reviews yet</span>}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${inStock ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
              {inStock ? <><Check size={14} /> In Stock ({product.inventory.quantity})</> : <><AlertCircle size={14} /> Out of Stock</>}
            </div>
          </div>
          <div className="flex items-end gap-3 mb-8">
            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{formatCurrency(product.price)}</span>
            {product.comparePrice && <span className="text-2xl text-gray-500 line-through mb-1.5">{formatCurrency(product.comparePrice)}</span>}
          </div>
          <p className="text-gray-300 text-lg leading-relaxed mb-10">{product.description}</p>
          <div className="mt-auto">
            <button onClick={handleAddToCart} disabled={!inStock || adding} className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${!inStock ? "bg-gray-800 text-gray-500 cursor-not-allowed" : adding ? "bg-green-500 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/30 hover:scale-[1.02]"}`}>
              {adding ? <><Check size={24}/> Added to Cart</> : <><ShoppingCart size={24}/> Add to Cart</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}