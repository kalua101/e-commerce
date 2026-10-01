"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=100").then(r => r.json()).then(data => { setProducts(data.products || []); setLoading(false); });
  }, []);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={40}/></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Products Management</h1>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={16} /> Add New Product
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input type="text" placeholder="Search products..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:border-indigo-500 outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-white/5 border-b border-white/10">
              <tr><th className="px-6 py-4 font-semibold">Product</th><th className="px-6 py-4 font-semibold">Category</th><th className="px-6 py-4 font-semibold">Price</th><th className="px-6 py-4 font-semibold">Stock</th><th className="px-6 py-4 font-semibold">Actions</th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    {p.images[0] && <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-800" />}
                    <span className="truncate max-w-[200px]">{p.name}</span>
                  </td>
                  <td className="px-6 py-4">{p.category?.name}</td>
                  <td className="px-6 py-4 font-medium text-indigo-400">{formatCurrency(p.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${!p.inventory || p.inventory.quantity === 0 ? "bg-red-500/20 text-red-400" : p.inventory.quantity <= 10 ? "bg-orange-500/20 text-orange-400" : "bg-green-500/20 text-green-400"}`}>
                      {p.inventory?.quantity || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/20 transition-colors"><Edit size={16}/></button>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}