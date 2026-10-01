"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingCart, Search, Menu, X, User, LogOut, LayoutDashboard, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const { getTotalItems, toggleCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) { router.push(`/products?search=${encodeURIComponent(search)}`); setSearch(""); }
  };

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-lg shadow-black/20" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black">S</div>
          <span className="gradient-text">ShopVerse</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 pr-10 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all" />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"><Search size={16} /></button>
        </form>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <Link href="/products?category=electronics" className="hover:text-white transition-colors">Electronics</Link>
          <Link href="/products?category=clothing" className="hover:text-white transition-colors">Clothing</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={toggleCart} className="relative p-2 rounded-full hover:bg-white/10 transition-colors" id="cart-toggle-btn">
            <ShoppingCart size={20} />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full text-xs flex items-center justify-center font-bold animate-pulse-glow">{getTotalItems()}</span>
            )}
          </button>

          {session ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/10 transition-colors" id="user-menu-btn">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">{session.user?.name?.[0] || "U"}</div>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-12 glass rounded-xl p-2 w-48 shadow-xl shadow-black/40 animate-fade-in" onClick={() => setUserMenuOpen(false)}>
                  <p className="px-3 py-2 text-xs text-gray-400 border-b border-white/10 mb-1">{session.user?.email}</p>
                  <Link href="/account/orders" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-sm transition-colors"><Package size={14} />My Orders</Link>
                  {isAdmin && <Link href="/admin/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-sm transition-colors"><LayoutDashboard size={14} />Admin Panel</Link>}
                  <button onClick={() => signOut()} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 text-sm w-full transition-colors"><LogOut size={14} />Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-colors">
              <User size={14} />Sign In
            </Link>
          )}
          <button className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={20}/> : <Menu size={20}/>}</button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/10 px-4 py-4 space-y-3 animate-fade-in" onClick={() => setMobileOpen(false)}>
          <form onSubmit={handleSearch} className="flex relative">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 pr-10 text-sm focus:outline-none" />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={16}/></button>
          </form>
          <Link href="/products" className="block py-2 text-gray-300 hover:text-white">Products</Link>
          <Link href="/products?category=electronics" className="block py-2 text-gray-300 hover:text-white">Electronics</Link>
          <Link href="/products?category=clothing" className="block py-2 text-gray-300 hover:text-white">Clothing</Link>
        </div>
      )}
    </header>
  );
}