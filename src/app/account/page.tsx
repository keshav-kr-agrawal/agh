'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  ShoppingBag, 
  Truck, 
  Printer, 
  LogOut, 
  Store,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Order } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function CustomerAccountPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomerOrders = async () => {
    try {
      const res = await fetch(`/api/orders/create?all=true`);
      const json = await res.json();
      if (json.data) {
        const userDigits = user!.phone.replace(/\D/g, '').slice(-10);
        const filtered = json.data.filter((o: Order) => {
          const orderDigits = (o.customerPhone || '').replace(/\D/g, '').slice(-10);
          const matchEmail = Boolean(user!.email && o.customerEmail && user!.email.toLowerCase() === o.customerEmail.toLowerCase());
          return (userDigits && orderDigits === userDigits) || (o.customerName && o.customerName.trim().toLowerCase() === user!.name.trim().toLowerCase()) || matchEmail;
        });
        setOrders(filtered);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCustomerOrders();
  }, [user, router]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order? Item stock will be restored immediately.')) {
      return;
    }

    try {
      const res = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const json = await res.json();
      if (json.success) {
        alert('Order cancelled successfully. Stock restored.');
        fetchCustomerOrders();
      } else {
        alert(json.message || 'Failed to cancel order');
      }
    } catch {
      alert('Error processing order cancellation');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cream text-espresso flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Customer Header */}
        <div className="bg-cream border border-cream-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-terracotta to-crimson text-gold flex items-center justify-center font-serif font-bold text-2xl shadow">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-espresso">
                Welcome, {user.name}
              </h1>
              <p className="text-xs text-espresso/60 font-mono mt-0.5">
                {user.phone} {user.email && `• ${user.email}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="flex items-center gap-2 px-4 py-2 border border-cream-border rounded-xl text-xs font-bold text-espresso hover:bg-crimson hover:text-cream transition"
          >
            <LogOut className="w-4 h-4" /> Log Out Session
          </button>
        </div>

        {/* Orders History & Cancellation */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-cream-border pb-3">
            <h2 className="text-xl font-serif font-bold text-espresso flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-terracotta" />
              Your Order History & Live Parcel Tracking
            </h2>
            <span className="text-xs text-espresso/60 font-mono">
              {orders.length} Orders Recorded
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-espresso/60">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-cream-muted rounded-3xl border border-cream-border space-y-3">
              <ShoppingBag className="w-10 h-10 text-espresso/30 mx-auto" />
              <p className="text-xs text-espresso/70">No orders placed yet under this account</p>
              <Link href="/" className="px-5 py-2 bg-terracotta text-cream text-xs font-bold rounded-full inline-block shadow">
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-cream border border-cream-border rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-cream-border/60 pb-3">
                    <div>
                      <span className="font-mono font-bold text-crimson text-sm block">Order #{order.id}</span>
                      <span className="text-[11px] text-espresso/50">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.paymentStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.paymentStatus === 'CANCELLED'
                          ? 'bg-crimson/15 text-crimson'
                          : 'bg-amberGold/30 text-espresso'
                      }`}>
                        {order.paymentStatus}
                      </span>
                      <span className="font-mono font-extrabold text-sm text-espresso">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-bold text-espresso/60 uppercase text-[10px] tracking-wider block mb-1">Purchased Items</span>
                      <div className="space-y-1">
                        {order.items.map((i, idx) => (
                          <div key={idx} className="text-espresso font-medium">
                            • {i.product.title} <span className="font-mono font-bold text-terracotta">x{i.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-espresso/60 uppercase text-[10px] tracking-wider block mb-1">Fulfillment Mode</span>
                      <p className="font-semibold text-terracotta flex items-center gap-1">
                        {order.fulfillmentType === 'handpicked' ? (
                          <><Store className="w-3.5 h-3.5" /> Handpicked Store Pickup</>
                        ) : (
                          <><Truck className="w-3.5 h-3.5" /> Parcel Shipping</>
                        )}
                      </p>
                      <p className="text-espresso/70 text-[11px] mt-1">{order.address}</p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-cream-border/60 flex flex-wrap items-center justify-between gap-2.5 text-[11px] sm:text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/track/${order.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-terracotta text-cream font-bold rounded-xl shadow hover:bg-crimson transition shrink-0"
                      >
                        <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold shrink-0" /> Live Tracking
                      </Link>

                      <Link
                        href={`/invoice/${order.id}`}
                        target="_blank"
                        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-cream-muted border border-cream-border font-bold text-espresso rounded-xl hover:bg-cream-border transition shrink-0"
                      >
                        <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-terracotta shrink-0" /> Order Invoice PDF
                      </Link>
                    </div>

                    {/* Order Cancellation Logic */}
                    {order.paymentStatus !== 'VERIFIED' && order.paymentStatus !== 'CANCELLED' ? (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-crimson/15 text-crimson font-bold rounded-xl border border-crimson/30 hover:bg-crimson hover:text-cream transition shrink-0"
                      >
                        <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> Cancel Order
                      </button>
                    ) : order.paymentStatus === 'VERIFIED' ? (
                      <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        Confirmed by Store Admin • Contact +91 9199272836 to modify
                      </span>
                    ) : (
                      <span className="text-[10px] sm:text-[11px] font-bold text-crimson bg-crimson/10 px-2.5 py-1.5 rounded-xl border border-crimson/20">
                        ✕ Order Cancelled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
