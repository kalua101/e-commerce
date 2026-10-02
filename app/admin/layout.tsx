import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, BarChart3, LogOut, Home, Boxes } from "lucide-react";
import { signOut } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") redirect("/");

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 glass border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black">S</div>
            <span className="gradient-text">Shopping</span>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm font-medium group">
              <Icon size={18} className="group-hover:text-indigo-400 transition-colors" />{label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm">
            <Home size={18} />Back to Store
          </Link>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
            <button type="submit" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 transition-all text-sm w-full">
              <LogOut size={18} />Sign Out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-950">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}