"use client";
import { useEffect, useState } from "react";
import { DollarSign, Package, ShoppingBag, Users, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(setStats);
  }, []);

  if (!stats) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={40}/></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl border-l-4 border-indigo-500">
          <div className="flex items-center gap-4 text-indigo-400 mb-2"><DollarSign size={20}/><h3 className="font-semibold">Total Revenue</h3></div>
          <p className="text-3xl font-black text-white">{formatCurrency(stats.totalRevenue)}</p>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-purple-500">
          <div className="flex items-center gap-4 text-purple-400 mb-2"><ShoppingBag size={20}/><h3 className="font-semibold">Total Orders</h3></div>
          <p className="text-3xl font-black text-white">{stats.totalOrders}</p>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-pink-500">
          <div className="flex items-center gap-4 text-pink-400 mb-2"><Package size={20}/><h3 className="font-semibold">Products</h3></div>
          <p className="text-3xl font-black text-white">{stats.totalProducts}</p>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-blue-500">
          <div className="flex items-center gap-4 text-blue-400 mb-2"><Users size={20}/><h3 className="font-semibold">Customers</h3></div>
          <p className="text-3xl font-black text-white">{stats.totalUsers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Revenue Over Time (30 Days)</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.salesChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickFormatter={(v) => v.substring(5)} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem' }} />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Low Stock Alerts</h2>
          {stats.lowStockItems.length === 0 ? (
            <p className="text-gray-400 text-sm">No low stock alerts at this time.</p>
          ) : (
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              {stats.lowStockItems.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-red-500/30">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-medium text-white truncate">{item.product.name}</p>
                    <p className="text-xs text-red-400 font-bold mt-1">{item.quantity} left in stock</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}