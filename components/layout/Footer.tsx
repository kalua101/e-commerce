import Link from "next/link";
export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24 py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-xl mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black">S</div>
            <span className="gradient-text">ShopVerse</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">Your premium destination for modern shopping. Quality products, fast delivery, exceptional service.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-4 text-gray-200">Shop</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {["electronics","clothing","sports","home-garden","books"].map(c => (
              <li key={c}><Link href={`/products?category=${c}`} className="hover:text-white capitalize transition-colors">{c.replace("-"," ")}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4 text-gray-200">Account</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
            <li><Link href="/account/orders" className="hover:text-white transition-colors">My Orders</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4 text-gray-200">Info</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><span className="hover:text-white transition-colors cursor-pointer">Free shipping over $50</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">30-day returns</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Secure checkout</span></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 text-center text-sm text-gray-500">
        © 2024 ShopVerse. All rights reserved. Built with Next.js, Prisma & PostgreSQL.
      </div>
    </footer>
  );
}