"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { useRouter } from "next/navigation";
import { CreditCard, Truck, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<"address" | "payment" | "success">("address");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [address, setAddress] = useState({
    name: "", street: "", city: "", state: "", postalCode: "", country: ""
  });

  const total = getTotalPrice();
  const shipping = total >= 50 ? 0 : 9.99;
  const grandTotal = total + shipping;

  if (items.length === 0 && step !== "success") {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-6">
        <h2 className="text-3xl font-bold text-white">Your cart is empty</h2>
        <p className="text-gray-400">Add some products to your cart before checking out.</p>
        <Link href="/products" className="inline-block bg-indigo-600 px-6 py-3 rounded-full text-white font-medium hover:bg-indigo-500 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
          address,
          paymentMethod: "card_simulation"
        })
      });

      if (res.ok) {
        clearCart();
        setStep("success");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-6 animate-fade-in">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-bold text-white">Order Confirmed!</h1>
        <p className="text-gray-400 text-lg">Thank you for your purchase. Your order is being processed and will be shipped soon.</p>
        <div className="pt-6">
          <Link href="/account/orders" className="inline-block bg-indigo-600 px-8 py-4 rounded-xl text-white font-bold text-lg hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/30">
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/cart" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Cart
      </Link>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-8">
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-8">
            <span className={`flex items-center gap-2 ${step === "address" ? "text-indigo-400" : "text-gray-300"}`}><span className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-xs">1</span> Shipping</span>
            <div className="w-12 h-px bg-white/10" />
            <span className={`flex items-center gap-2 ${step === "payment" ? "text-indigo-400" : "text-gray-500"}`}><span className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-xs">2</span> Payment</span>
          </div>

          {step === "address" && (
            <div className="glass p-8 rounded-2xl animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Truck className="text-indigo-400" /> Shipping Address</h2>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div><label className="block text-sm text-gray-400 mb-1">Full Name</label><input required type="text" value={address.name} onChange={e=>setAddress({...address,name:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"/></div>
                <div><label className="block text-sm text-gray-400 mb-1">Street Address</label><input required type="text" value={address.street} onChange={e=>setAddress({...address,street:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"/></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm text-gray-400 mb-1">City</label><input required type="text" value={address.city} onChange={e=>setAddress({...address,city:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"/></div>
                  <div><label className="block text-sm text-gray-400 mb-1">State</label><input required type="text" value={address.state} onChange={e=>setAddress({...address,state:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"/></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm text-gray-400 mb-1">Postal Code</label><input required type="text" value={address.postalCode} onChange={e=>setAddress({...address,postalCode:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"/></div>
                  <div><label className="block text-sm text-gray-400 mb-1">Country</label><input required type="text" value={address.country} onChange={e=>setAddress({...address,country:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"/></div>
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold mt-6 transition-colors">Continue to Payment</button>
              </form>
            </div>
          )}

          {step === "payment" && (
            <div className="glass p-8 rounded-2xl animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><CreditCard className="text-indigo-400" /> Payment Details</h2>
              <div className="bg-orange-500/10 border border-orange-500/50 text-orange-400 p-4 rounded-xl text-sm mb-6 flex items-start gap-3">
                <CheckCircle2 className="shrink-0 mt-0.5" size={18} />
                <p>This is a simulated checkout. No real payment will be processed. You can just click "Pay Now" to complete the test order.</p>
              </div>
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="glass p-6 rounded-xl border-indigo-500/30 border">
                  <div className="flex items-center gap-3 mb-4">
                    <input type="radio" checked readOnly className="text-indigo-500 accent-indigo-500 w-4 h-4" />
                    <span className="font-medium text-white">Simulated Credit Card</span>
                  </div>
                  <div className="space-y-4 opacity-50 pointer-events-none">
                    <input type="text" placeholder="Card Number (4242 4242 4242 4242)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM/YY" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
                      <input type="text" placeholder="CVC" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep("address")} className="px-6 py-4 rounded-xl font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">Back</button>
                  <button type="submit" disabled={loading} className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-70">
                    {loading ? <Loader2 className="animate-spin" /> : <>Pay {formatCurrency(grandTotal)}</>}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <div className="glass p-6 rounded-2xl sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-900 border border-white/10">
                    <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized/>
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-700 text-xs font-bold rounded-full flex items-center justify-center text-white">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 line-clamp-2">{item.name}</p>
                    <p className="text-indigo-400 font-bold text-sm mt-1">{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-gray-400"><span>Subtotal</span><span className="text-gray-200">{formatCurrency(total)}</span></div>
              <div className="flex justify-between text-gray-400"><span>Shipping</span><span className="text-gray-200">{shipping === 0 ? "Free" : formatCurrency(shipping)}</span></div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-end">
                <span className="text-gray-300 font-medium">Total</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}