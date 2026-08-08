'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  Package, 
  MapPin, 
  ShoppingBag, 
  ArrowLeft,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';
import { Order, OrderStage } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const STAGES: { stage: OrderStage; label: string; description: string }[] = [
  { stage: 'PLACED', label: 'Order Placed', description: 'Order & UPI payment proof received' },
  { stage: 'VERIFIED', label: 'Payment Verified', description: 'Verified by Anita Gift House finance team' },
  { stage: 'PACKED', label: 'Packed with Care', description: 'Hand-packed in gift box with bubble wrapping' },
  { stage: 'DISPATCHED', label: 'Dispatched via Delhivery', description: 'Handed over to Delhivery Surface Express' },
  { stage: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', description: 'Courier agent is arriving at destination' },
  { stage: 'DELIVERED', label: 'Delivered', description: 'Gift successfully delivered to customer' }
];

export default function OrderTrackingPage() {
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
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  const activeOrder: Order = order || {
    id: orderId || 'AGH-ORD-8821',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'priya.sharma@example.com',
    address: 'B-402, Sunshine Heights, M.G. Road, Bengaluru',
    pincode: '560001',
    fulfillmentType: 'parcel',
    paymentMethod: 'online_upi',
    items: [],
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

  const getStageIndex = (stage: OrderStage) => {
    const map: Record<OrderStage, number> = {
      PLACED: 0,
      VERIFIED: 1,
      PACKED: 2,
      DISPATCHED: 3,
      OUT_FOR_DELIVERY: 4,
      DELIVERED: 5,
      CANCELLED: -1
    };
    return map[stage] ?? 0;
  };

  const currentStageIndex = getStageIndex(activeOrder.orderStage);

  return (
    <div className="min-h-screen bg-cream text-espresso flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Navigation Top */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-terracotta hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </Link>

        {/* Tracking Header Card */}
        <div className="bg-cream border border-cream-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-border pb-4">
            <div>
              <span className="text-xs font-bold text-terracotta uppercase tracking-wider">Live Order Status</span>
              <h1 className="text-2xl font-serif font-bold text-espresso">
                Order #{activeOrder.id}
              </h1>
              <p className="text-xs text-espresso/60 mt-0.5 font-mono">
                Placed on {new Date(activeOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                <ShieldCheck className="w-4 h-4" /> Payment {activeOrder.paymentStatus}
              </span>
              {activeOrder.trackingNumber && (
                <p className="text-xs text-espresso/80 font-mono mt-2">
                  Delhivery AWB: <strong className="text-crimson">{activeOrder.trackingNumber}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Visual Step Progress Bar */}
          <div className="pt-6 pb-2">
            <div className="relative flex items-center justify-between">
              {/* Connector Bar */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-cream-border z-0" />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-terracotta to-crimson z-0 transition-all duration-500"
                style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
              />

              {STAGES.map((s, idx) => {
                const isCompleted = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={s.stage} className="relative z-10 flex flex-col items-center group">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        isCompleted
                          ? 'bg-gradient-to-br from-terracotta to-crimson text-gold shadow-md ring-4 ring-cream'
                          : 'bg-cream-muted text-espresso/40 border border-cream-border'
                      } ${isCurrent ? 'scale-110 ring-4 ring-gold/40' : ''}`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>

                    <span className={`text-[11px] font-bold mt-2 text-center max-w-[80px] hidden sm:block ${
                      isCompleted ? 'text-espresso' : 'text-espresso/40'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Stage Highlight Box */}
          <div className="bg-cream-muted border border-cream-border rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-espresso">
                {STAGES[currentStageIndex]?.label}
              </h4>
              <p className="text-xs text-espresso/70">
                {STAGES[currentStageIndex]?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-cream border border-cream-border rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-serif font-bold text-sm text-espresso flex items-center gap-2">
              <MapPin className="w-4 h-4 text-terracotta" />
              Delivery Destination
            </h3>
            <div className="text-xs text-espresso/80 space-y-1">
              <p className="font-bold text-espresso">{activeOrder.customerName}</p>
              <p>{activeOrder.address}</p>
              <p className="font-mono">Pincode: {activeOrder.pincode}</p>
              <p className="font-mono pt-1">Phone: {activeOrder.customerPhone}</p>
            </div>
          </div>

          <div className="bg-cream border border-cream-border rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-serif font-bold text-sm text-espresso flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-gold-dark" />
              Order Summary
            </h3>
            <div className="text-xs space-y-1.5">
              <div className="flex justify-between text-espresso/70">
                <span>Total Amount Paid</span>
                <span className="font-mono font-bold text-crimson text-sm">₹{activeOrder.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-espresso/70">
                <span>Fulfillment Type</span>
                <span className="font-semibold uppercase text-terracotta">{activeOrder.fulfillmentType}</span>
              </div>
              <div className="pt-2">
                <Link
                  href={`/invoice/${activeOrder.id}`}
                  target="_blank"
                  className="text-terracotta hover:underline font-bold text-xs inline-block"
                >
                  📄 Download Order Invoice PDF
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
