"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Eye } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatCurrency, getDiscountPercent } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  avgRating?: number;
  reviewCount?: number;
  inventory?: { quantity: number } | null;
  category?: { name: string };
}

export default function ProductCard({ id, name, slug, price, comparePrice, images, avgRating = 0, reviewCount = 0, inventory, category }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [adding, setAdding] = useState(false);
  const discount = comparePrice ? getDiscountPercent(price, Number(comparePrice)) : 0;
  const inStock = !inventory || inventory.quantity > 0;
  const lowStock = inventory && inventory.quantity > 0 && inventory.quantity <= 10;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock) return;
    setAdding(true);
    addItem({ id, name, price, image: images[0] || "", slug });
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <Link href={`/products/${slug}`} className="group relative glass rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-900">
        {images[0] ? (
          <Image src={images[0]} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700"><ShoppingCart size={40}/></div>
        )}
        {discount > 0 && <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{discount}%</span>}
        {lowStock && <span className="absolute top-3 right-3 bg-orange-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">Low Stock</span>}
        {!inStock && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-gray-300 font-semibold">Out of Stock</span></div>}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="glass px-3 py-1.5 rounded-full text-xs flex items-center gap-1 text-gray-200"><Eye size={12}/>View</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        {category && <span className="text-xs text-indigo-400 font-medium">{category.name}</span>}
        <h3 className="font-semibold text-sm leading-snug text-gray-100 group-hover:text-white transition-colors line-clamp-2">{name}</h3>
        {avgRating > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} size={12} className={i <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"} />)}</div>
            <span className="text-xs text-gray-400">({reviewCount})</span>
          </div>
        )}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-lg font-bold text-white">{formatCurrency(price)}</span>
          {comparePrice && <span className="text-sm text-gray-500 line-through">{formatCurrency(Number(comparePrice))}</span>}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!inStock || adding}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            !inStock ? "bg-gray-700 text-gray-500 cursor-not-allowed" :
            adding ? "bg-green-600 text-white" :
            "bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-500/30"
          }`}
        >
          <ShoppingCart size={16}/>{adding ? "Added!" : inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </Link>
  );
}