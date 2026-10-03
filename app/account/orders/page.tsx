import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MyOrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'CANCELLED':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-yellow-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'SHIPPED':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PROCESSING':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Package size={32} className="text-indigo-500" />
          <div>
            <h1 className="text-3xl font-bold text-white">My Orders</h1>
            <p className="text-gray-400">Track and manage your orders</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Package size={64} className="mx-auto mb-4 text-gray-600" />
            <h2 className="text-xl font-semibold text-white mb-2">No orders yet</h2>
            <p className="text-gray-400 mb-6">Start shopping to see your orders here!</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="glass rounded-2xl p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(order.status)}
                      <h3 className="font-semibold text-white">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Placed {formatDistance(new Date(order.createdAt), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">${Number(order.total).toFixed(2)}</p>
                    <p className="text-sm text-gray-400">{order.items.length} items</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                      <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                        <Package size={24} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{item.product.name}</h4>
                        <p className="text-sm text-gray-400">
                          Quantity: {item.quantity} × ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold text-white">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
