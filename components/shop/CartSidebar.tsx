"use client";
import { useCartStore } from "@/lib/store/cart";
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const total = getTotalPrice();
  const shipping = total >= 50 ? 0 : 9.99;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={closeCart} />}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md z-50 glass border-l border-white/10 flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingCart size={20} className="text-indigo-400"/>Shopping Cart ({items.length})</h2>
          <button onClick={closeCart} className="p-2 rounded-full hover:bg-white/10 transition-colors"><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <ShoppingCart size={64} className="opacity-20"/>
              <p className="text-lg font-medium">Your cart is empty</p>
              <button onClick={closeCart} className="text-indigo-400 hover:text-indigo-300 text-sm">Continue Shopping →</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-3 glass rounded-xl p-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-800">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-100 truncate">{item.name}</p>
                  <p className="text-indigo-400 font-bold text-sm mt-0.5">{formatCurrency(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><Minus size={12}/></button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><Plus size={12}/></button>
                    <button onClick={() => removeItem(item.id)} className="ml-auto text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>{formatCurrency(total)}</span></div>
              <div className="flex justify-between text-gray-400"><span>Shipping</span><span>{shipping === 0 ? <span className="text-green-400">Free</span> : formatCurrency(shipping)}</span></div>
              {total < 50 && <p className="text-xs text-gray-500">Add {formatCurrency(50 - total)} more for free shipping</p>}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-white/10"><span>Total</span><span className="text-indigo-400">{formatCurrency(total + shipping)}</span></div>
            </div>
            <Link href="/checkout" onClick={closeCart} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/30">
              Checkout <ArrowRight size={16}/>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}