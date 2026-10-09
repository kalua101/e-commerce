"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Star, Check, AlertCircle, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatCurrency, getDiscountPercent } from "@/lib/utils";

interface ProductModalProps {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ slug, isOpen, onClose }: ProductModalProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    if (isOpen && slug) {
      setLoading(true);
      fetch(`/api/products/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
          setSelectedImage(0);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          setProduct({ error: "Failed to load product" });
          setLoading(false);
        });
    }
  }, [slug, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    if (!inStock) return;
    setAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images[0] || "",
      slug: product.slug,
    });
    setTimeout(() => {
      setAdding(false);
      openCart();
    }, 600);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={handleBackdropClick}
      >
        <div className="glass rounded-2xl p-8">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
      </div>
    );
  }

  if (product?.error) {
    return (
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={handleBackdropClick}
      >
        <div className="glass rounded-2xl p-8 max-w-md mx-4 text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Product not found</h2>
          <p className="text-gray-400 mb-4">This product may have been removed or is unavailable.</p>
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const inStock = product.inventory && product.inventory.quantity > 0;
  const discount = product.comparePrice
    ? getDiscountPercent(product.price, product.comparePrice)
    : 0;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="glass rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 glass hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-300" />
        </button>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden glass">
                {product.images[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <ShoppingCart size={64} className="text-gray-700" />
                  </div>
                )}
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1.5 rounded-full shadow-lg text-sm">
                    -{discount}% OFF
                  </span>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative aspect-square rounded-xl overflow-hidden glass hover:border-indigo-500 cursor-pointer transition-all ${
                        selectedImage === i ? "border-indigo-500 border-2" : ""
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="flex flex-col">
              {product.category && (
                <Link
                  href={`/products?category=${product.category.slug}`}
                  onClick={onClose}
                  className="text-indigo-400 font-semibold mb-2 hover:underline inline-block w-fit"
                >
                  {product.category.name}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                {product.avgRating > 0 ? (
                  <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1">
                    <Star className="fill-yellow-400 text-yellow-400" size={16} />
                    <span className="font-bold text-white">
                      {product.avgRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">No reviews yet</span>
                )}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                    inStock
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {inStock ? (
                    <>
                      <Check size={14} /> In Stock ({product.inventory.quantity})
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} /> Out of Stock
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  {formatCurrency(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-xl text-gray-500 line-through mb-1">
                    {formatCurrency(product.comparePrice)}
                  </span>
                )}
              </div>
              <p className="text-gray-300 text-base leading-relaxed mb-8">
                {product.description}
              </p>
              <div className="mt-auto space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || adding}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                    !inStock
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : adding
                      ? "bg-green-500 text-white"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/30 hover:scale-[1.02]"
                  }`}
                >
                  {adding ? (
                    <>
                      <Check size={24} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={24} /> Add to Cart
                    </>
                  )}
                </button>
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="block text-center text-indigo-400 hover:text-indigo-300 text-sm py-2 transition-colors"
                >
                  View full product page →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
