"use client";
import { useEffect, useState } from "react";
import { Search, Edit, RefreshCw, Loader2 } from "lucide-react";

export default function AdminInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/inventory").then(r => r.json()).then(data => { setInventory(data.inventory || []); setLoading(false); });
  }, []);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={40}/></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Inventory Control</h1>
        <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm text-white hover:bg-white/10 transition-colors">
          <RefreshCw size={16}/> Sync All
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input type="text" placeholder="Search SKU or product..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:border-indigo-500 outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-white/5 border-b border-white/10">
              <tr><th className="px-6 py-4">Product / SKU</th><th className="px-6 py-4">Location</th><th className="px-6 py-4">Current Stock</th><th className="px-6 py-4">Reserved</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Action</th></tr>
            </thead>
            <tbody>
              {inventory.map(inv => (
                <tr key={inv.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white">
                    <p className="font-medium truncate max-w-[200px]">{inv.product.name}</p>
                    <p className="text-xs text-indigo-400 font-mono mt-0.5">{inv.sku}</p>
                  </td>
                  <td className="px-6 py-4">{inv.location || "Main Warehouse"}</td>
                  <td className="px-6 py-4 font-bold text-white text-lg">{inv.quantity}</td>
                  <td className="px-6 py-4">{inv.reservedQuantity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${inv.quantity === 0 ? "bg-red-500/20 text-red-400" : inv.quantity <= 10 ? "bg-orange-500/20 text-orange-400" : "bg-green-500/20 text-green-400"}`}>
                      {inv.quantity === 0 ? "Out of Stock" : inv.quantity <= 10 ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"><Edit size={14}/> Update</button>
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