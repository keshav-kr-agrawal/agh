import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Truck, Store, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery Policy | Anita Gift House',
  description: 'Shipping timelines, courier partners, and store pickup terms for Anita Gift House.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-cream text-espresso flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="border-b border-cream-border pb-6 space-y-2">
          <div className="flex items-center gap-2 text-xs text-terracotta font-bold uppercase tracking-wider">
            <Truck className="w-4 h-4" /> Nationwide Logistics & Pickup
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-espresso">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs text-espresso/70">
            Learn about our express courier delivery and 2-hour handpicked store pickup options.
          </p>
          <p className="text-[11px] text-espresso/50 font-mono pt-1">
            Last Updated: August 13, 2026
          </p>
        </div>

        {/* Section Breakdown */}
        <div className="space-y-6 text-xs sm:text-sm text-espresso/85 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1 flex items-center gap-2">
              <Truck className="w-5 h-5 text-terracotta" /> 1. Express Parcel Shipping (Pan-India)
            </h2>
            <p>
              We partner with India's leading logistics providers (<strong>Delhivery Express</strong>) to ensure your gifts, Rakhis, hampers, and toys arrive safely and on time across all 6-digit pincodes in India.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 bg-cream-muted border border-cream-border rounded-xl">
                <strong className="block text-espresso">Processing Time</strong>
                Orders verified before 3 PM are packed and dispatched on the same business day.
              </div>
              <div className="p-3 bg-cream-muted border border-cream-border rounded-xl">
                <strong className="block text-espresso">Delivery Timeline</strong>
                Standard express shipping takes <strong>3 to 5 business days</strong> depending on pincode.
              </div>
              <div className="p-3 bg-cream-muted border border-cream-border rounded-xl">
                <strong className="block text-espresso">Tracking & SMS Updates</strong>
                Tracking IDs are issued upon dispatch with live tracking at <Link href="/track" className="text-terracotta font-bold underline">Order Tracking</Link>.
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1 flex items-center gap-2">
              <Store className="w-5 h-5 text-crimson" /> 2. Handpicked Store Pickup (Bhagalpur)
            </h2>
            <p>
              For customers located in or near Bhagalpur, Bihar, we offer instant store pickup with zero shipping fee:
            </p>
            <div className="p-4 bg-cream-muted border border-gold/30 rounded-2xl space-y-1.5 text-xs font-mono">
              <p><strong>Pickup Location:</strong> Anita Gift House, Near Budhanath, Bhagalpur, Bihar - 812001</p>
              <p><strong>Pickup Time:</strong> Ready within <strong>2 hours</strong> of order verification</p>
              <p><strong>Store Working Hours:</strong> 10:00 AM to 9:00 PM (Monday to Sunday)</p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              3. Shipping Charges & Rates
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Shipping rates are calculated dynamically based on delivery pincode and parcel weight via Delhivery Express API.</li>
              <li>Free shipping promotional threshold: Free shipping applies on select festive promotional coupons.</li>
              <li>Store pickup is always 100% free of shipping charges.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              4. Safe & Multi-Layer Packaging Guarantee
            </h2>
            <p>
              Gifts and delicate items (brass poojaware, glass decor, luxury hampers) are packed in multi-layered protective bubble wrap, custom gift boxes, and sealed outer cartons to withstand transit conditions.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-cream-border text-center">
          <Link href="/" className="text-xs text-terracotta hover:underline font-bold">
            ← Return to Anita Gift House Storefront
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
