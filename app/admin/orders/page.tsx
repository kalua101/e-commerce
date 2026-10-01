"use client";
import { useEffect, useState } from "react";
import { Search, Eye, Filter, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders?limit=100").then(r => r.json()).then(data => { setOrders(data.orders || []); setLoading(false); });
  }, []);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={40}/></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white">Orders Management</h1>
      
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input type="text" placeholder="Search orders..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:border-indigo-500 outline-none" />
          </div>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm text-white hover:bg-white/10 transition-colors">
            <Filter size={16}/> Filter Status
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-white/5 border-b border-white/10">
              <tr><th className="px-6 py-4">Order ID</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Actions</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-indigo-400">#{o.id.substring(0,8)}</td>
                  <td className="px-6 py-4 text-white">
                    <p className="font-medium">{o.user?.name || "Guest"}</p>
                    <p className="text-xs text-gray-500">{o.user?.email}</p>
                  </td>
                  <td className="px-6 py-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      o.status === "DELIVERED" ? "bg-green-500/20 text-green-400" :
                      o.status === "PENDING" ? "bg-yellow-500/20 text-yellow-400" :
                      o.status === "CANCELLED" ? "bg-red-500/20 text-red-400" :
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">{formatCurrency(o.total)}</td>
                  <td className="px-6 py-4">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/20 transition-colors"><Eye size={16}/></button>
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