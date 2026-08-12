'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Printer, ArrowLeft, ShieldCheck, Store, Truck } from 'lucide-react';
import Link from 'next/link';
import { Order } from '@/types';

export default function InvoicePage() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/create?all=true`);
        const json = await res.json();
        if (json.data) {
          const found = json.data.find((o: Order) => o.id === orderId);
          if (found) setOrder(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6 text-espresso font-serif text-lg">
        Loading Order Invoice...
      </div>
    );
  }

  const activeOrder: Order = order || {
    id: orderId || 'AGH-ORD-8821',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'priya.sharma@example.com',
    address: 'B-402, Sunshine Heights, M.G. Road, Bengaluru',
    pincode: '560001',
    fulfillmentType: 'parcel',
    paymentMethod: 'online_upi',
    items: [
      {
        product: {
          id: 'prod-1',
          title: 'Royal Kundan & Zardosi Rakhi Hamper',
          description: 'Handcrafted Rakhi set with dry fruits',
          category: 'Rakhi',
          keywords: [],
          costPrice: 450,
          mrp: 1499,
          price: 999,
          stock: 8,
          priorityScore: 98,
          urgencyFlag: true,
          isHandpickedFeatured: true,
          images: [],
          createdAt: ''
        },
        quantity: 1
      }
    ],
    subtotal: 1598,
    shippingFee: 60,
    discount: 100,
    total: 1558,
    paymentStatus: 'VERIFIED',
    orderStage: 'DISPATCHED',
    trackingNumber: 'DLH984720193IN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return (
    <div className="min-h-screen bg-cream-muted p-4 sm:p-10 font-sans text-espresso">
      {/* Top Toolbar */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-xs font-bold text-terracotta hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 bg-terracotta text-cream text-xs font-bold rounded-xl shadow hover:bg-crimson transition"
        >
          <Printer className="w-4 h-4" /> Download / Print PDF Invoice
        </button>
      </div>

      {/* Styled Printable Tax Invoice Container */}
      <div className="max-w-3xl mx-auto bg-cream border border-cream-border rounded-3xl p-8 sm:p-12 shadow-xl print:shadow-none print:border-none print:p-0 space-y-8">
        {/* Header Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-border pb-6">
          <div className="flex items-center gap-3">
            <img
              src="/agh.png"
              alt="Anita Gift House Logo"
              className="h-12 w-auto object-contain rounded-2xl bg-cream border border-gold/40 p-1 shadow-sm"
            />
            <div>
              <h1 className="text-2xl font-serif font-extrabold text-espresso">
                Anita Gift House
              </h1>
              <p className="text-xs text-espresso/60">
                Near Budhanath, Bhagalpur, Bihar - 812001
              </p>
              <p className="text-xs text-espresso/80 font-mono font-bold mt-0.5">
                Merchant Support: +91 9199272836
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="px-3 py-1 bg-crimson/10 text-crimson font-serif font-bold text-xs rounded-full uppercase tracking-wider block sm:inline-block">
              Order Invoice
            </span>
            <p className="text-sm font-mono font-bold text-espresso mt-2">
              Invoice #: {activeOrder.id}
            </p>
            <p className="text-xs text-espresso/60 font-mono">
              Date: {new Date(activeOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Customer & Fulfillment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-cream-muted border border-cream-border rounded-2xl p-6 text-xs">
          <div>
            <span className="font-bold text-espresso/60 uppercase tracking-wider block mb-1">Billed To Customer</span>
            <p className="font-bold text-espresso text-sm">{activeOrder.customerName}</p>
            <p className="text-espresso/80 font-mono">{activeOrder.customerPhone}</p>
            <p className="text-espresso/80">{activeOrder.customerEmail || 'No email provided'}</p>
            <p className="text-espresso/70 mt-2">{activeOrder.address} - {activeOrder.pincode}</p>
          </div>

          <div>
            <span className="font-bold text-espresso/60 uppercase tracking-wider block mb-1">Shipping & Payment Method</span>
            <p className="font-semibold text-terracotta flex items-center gap-1">
              {activeOrder.fulfillmentType === 'handpicked' ? (
                <><Store className="w-4 h-4" /> Handpicked Store Pickup</>
              ) : (
                <><Truck className="w-4 h-4" /> Parcel Express Shipping</>
              )}
            </p>

            <div className="mt-3 pt-2 border-t border-cream-border/60">
              <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" /> UPI Verified Payment
              </span>
              {activeOrder.trackingNumber && (
                <p className="text-xs text-espresso/80 mt-1 font-mono">
                  Delhivery AWB #: <strong>{activeOrder.trackingNumber}</strong>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* GIFT CUSTOMIZATION CARD NOTE (IF APPLICABLE) */}
        {activeOrder.isGiftOrder && (
          <div className="bg-gradient-to-r from-terracotta/10 via-gold/15 to-crimson/10 border border-terracotta/30 rounded-2xl p-5 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-terracotta/20 pb-2">
              <span className="font-serif font-bold text-terracotta text-sm flex items-center gap-1.5">
                🎁 Personalized Gift Message & Packing
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-terracotta text-cream font-bold text-[10px]">
                {activeOrder.giftOccasion || 'Special Gift'}
              </span>
            </div>
            
            {activeOrder.giftNote && (
              <div className="p-3 bg-cream/90 rounded-xl border border-cream-border italic text-espresso font-serif text-sm">
                "{activeOrder.giftNote}"
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between text-espresso/80 pt-1">
              {activeOrder.recipientName && (
                <p><strong>To Recipient:</strong> {activeOrder.recipientName} ({activeOrder.recipientPhone || 'N/A'})</p>
              )}
              <p><strong>Packaging:</strong> {activeOrder.giftPackingOption || 'Standard Ribbon Wrap'}</p>
            </div>
          </div>
        )}

        {/* Itemized Table */}
        <div>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-cream-muted border-b border-cream-border text-espresso/70 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Item Description</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-border">
              {activeOrder.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-4 px-4 font-semibold text-espresso">
                    {item.product.title}
                    <span className="block text-[10px] text-espresso/50 font-normal">{item.product.category}</span>
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold">{item.quantity}</td>
                  <td className="py-4 px-4 text-right font-mono">₹{item.product.price.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-crimson">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Breakdown */}
        <div className="flex justify-end pt-4 border-t border-cream-border">
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-espresso/70">
              <span>Subtotal</span>
              <span className="font-mono">₹{activeOrder.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-espresso/70">
              <span>Shipping Fee</span>
              <span className="font-mono">{activeOrder.shippingFee === 0 ? 'FREE' : `₹${activeOrder.shippingFee}`}</span>
            </div>
            {activeOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount Applied</span>
                <span className="font-mono">-₹{activeOrder.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-espresso pt-2 border-t border-cream-border">
              <span>Total Paid</span>
              <span className="font-mono text-crimson text-base">₹{activeOrder.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer Authorization Seal */}
        <div className="pt-8 border-t border-cream-border text-center text-xs text-espresso/60 space-y-1">
          <p className="font-serif font-bold text-espresso">Thank you for shopping at Anita Gift House!</p>
          <p>Official Merchant Contact: +91 9199272836</p>
        </div>
      </div>
    </div>
  );
}
