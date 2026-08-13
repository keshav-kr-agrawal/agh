import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RotateCcw, ShieldCheck, CheckCircle2, MessageCircle, Truck } from 'lucide-react';

export const metadata = {
  title: 'Cancellation & Refund Policy | Anita Gift House',
  description: 'Cancellation and Refund Policy for orders placed on Anita Gift House.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-cream text-espresso flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="border-b border-cream-border pb-6 space-y-2">
          <div className="flex items-center gap-2 text-xs text-terracotta font-bold uppercase tracking-wider">
            <RotateCcw className="w-4 h-4" /> Customer Satisfaction Guarantee
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-espresso">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs text-espresso/70">
            At <strong>Anita Gift House</strong>, we want your celebrations to be joyful and worry-free.
          </p>
          <p className="text-[11px] text-espresso/50 font-mono pt-1">
            Last Updated: August 13, 2026
          </p>
        </div>

        {/* Section Breakdown */}
        <div className="space-y-6 text-xs sm:text-sm text-espresso/85 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              1. Order Cancellation Policy
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                <strong>Before Dispatch:</strong> You can request order cancellation at any time before your parcel is dispatched from our store or before custom gift packaging has commenced.
              </li>
              <li>
                <strong>How to Cancel:</strong> Visit your <Link href="/account" className="text-terracotta font-bold underline">Customer Dashboard</Link> or send a message directly on our official WhatsApp (<strong>+91 9199272836</strong>) with your Order ID.
              </li>
              <li>
                <strong>After Dispatch:</strong> Once a parcel is handed over to our courier partner (Delhivery Express) and dispatched, order cancellation is not permitted in transit.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              2. Refund Mode & Timelines
            </h2>
            <p>
              When an order is cancelled prior to dispatch or approved for a refund:
            </p>
            <div className="p-4 bg-cream-muted border border-cream-border rounded-2xl space-y-2 text-xs font-mono">
              <p><strong>Refund Source:</strong> Refunded directly to your original UPI account (GPay / PhonePe / Paytm) or bank account.</p>
              <p><strong>Processing Time:</strong> Refunds are processed within <strong>3 to 5 business days</strong> from approval.</p>
              <p><strong>Notification:</strong> You will receive confirmation on WhatsApp (+91 9199272836) once the refund is initiated.</p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              3. Damaged or Defective Items Replacement
            </h2>
            <p>
              We take extreme care in multi-layer bubble packaging for fragile brass poojaware and hampers. In the rare event that an item arrives damaged in transit:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs">
              <li>Take a clear photo or short unboxing video of the damaged item within <strong>24 hours of delivery</strong>.</li>
              <li>Send the photo/video along with your Order ID to our official WhatsApp support: <strong>+91 9199272836</strong>.</li>
              <li>Upon verification, we will immediately dispatch a free replacement item or issue a full refund.</li>
            </ol>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              4. Non-Refundable Items
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Perishable food items included in custom hampers (sweets/chocolates) once opened.</li>
              <li>Customized engraved items or personalized message cards unless damaged during shipping.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              5. Contact Support for Refunds
            </h2>
            <div className="p-4 bg-cream-muted border border-gold/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <strong className="block text-espresso text-xs font-serif">Customer Support & Refund Desk</strong>
                <span className="text-xs text-espresso/70 font-mono">+91 9199272836 (WhatsApp & Call)</span>
              </div>
              <a
                href="https://wa.me/919199272836?text=Hi%20Anita%20Gift%20House,%20I%20have%20a%20refund/cancellation%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0"
              >
                <MessageCircle className="w-4 h-4 fill-current" /> Chat on WhatsApp
              </a>
            </div>
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
