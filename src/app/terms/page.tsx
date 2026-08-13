import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FileText, ShieldCheck, ShoppingBag, Store, Truck } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Anita Gift House',
  description: 'Terms of Service and Conditions governing online shopping, gift orders, store pickup, and parcel delivery at Anita Gift House.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-cream text-espresso flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="border-b border-cream-border pb-6 space-y-2">
          <div className="flex items-center gap-2 text-xs text-terracotta font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" /> Customer Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-espresso">
            Terms & Conditions
          </h1>
          <p className="text-xs text-espresso/70">
            Please read these terms carefully before placing orders on <strong>Anita Gift House</strong>.
          </p>
          <p className="text-[11px] text-espresso/50 font-mono pt-1">
            Effective Date: August 13, 2026 | Owned & Operated by Anita Tekriwal
          </p>
        </div>

        {/* Section Breakdown */}
        <div className="space-y-6 text-xs sm:text-sm text-espresso/85 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing our website, browsing products, or placing an order on Anita Gift House, you agree to be bound by these Terms & Conditions, our DPDP Act 2023 Compliant Privacy Policy, and all applicable laws of India. If you do not agree with any part of these terms, please do not use our website.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              2. Products, Pricing & Accuracy
            </h2>
            <p>
              All products listed on Anita Gift House (handpicked hampers, Kundan Rakhis, brass poojaware, and educational toys) are subject to availability.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Inclusive Prices:</strong> All Selling Prices (SP) displayed on the website are inclusive of all taxes and standard charges. No hidden charges are applied at checkout.</li>
              <li><strong>Cost Price & MRP:</strong> Max Retail Prices (MRP) and promotional savings are indicated accurately.</li>
              <li><strong>Product Images:</strong> We upload multi-photo previews to depict actual products accurately. Minor color variations may occur due to screen settings or handcrafted artisanal variations.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              3. Fulfillment Options & Delivery Terms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 bg-cream-muted border border-cream-border rounded-2xl space-y-2">
                <h3 className="font-bold text-terracotta text-xs flex items-center gap-1.5 uppercase tracking-wider">
                  <Truck className="w-4 h-4" /> Express Parcel Shipping
                </h3>
                <p className="text-xs">
                  Shipped via courier partners (Delhivery Express). Standard delivery timeline is <strong>3 to 5 business days</strong> depending on delivery pincode across India.
                </p>
              </div>
              <div className="p-4 bg-cream-muted border border-cream-border rounded-2xl space-y-2">
                <h3 className="font-bold text-crimson text-xs flex items-center gap-1.5 uppercase tracking-wider">
                  <Store className="w-4 h-4" /> 2-Hour Handpicked Store Pickup
                </h3>
                <p className="text-xs">
                  Available for pickup at our physical boutique store (Near Budhanath, Bhagalpur, Bihar - 812001) within 2 hours of order verification. Zero shipping fee.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              4. Payment & Order Verification
            </h2>
            <p>
              We accept payments via <strong>Online UPI</strong> (GPay, PhonePe, Paytm, BHIM) using our official merchant UPI ID (`9199272836@okbizaxis`) or <strong>Pay at Store Pickup</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Orders paid via Online UPI are placed in `PENDING_VERIFICATION` status until payment proof/reference is confirmed by our admin.</li>
              <li>Anita Gift House reserves the right to cancel orders with unverified or fraudulent payment proofs.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              5. Data Protection Compliance (DPDP Act 2023)
            </h2>
            <p>
              Your personal data is collected and processed strictly in compliance with the Digital Personal Data Protection (DPDP) Act 2023 of India. Please refer to our <Link href="/privacy" className="text-terracotta font-bold underline">Privacy Policy</Link> for details regarding your rights as a Data Principal.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              6. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Bhagalpur, Bihar.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              7. Contact Information
            </h2>
            <p>For any questions regarding these terms, please contact:</p>
            <div className="p-4 bg-cream-muted border border-gold/30 rounded-2xl font-mono text-xs space-y-1">
              <p><strong>Business Name:</strong> Anita Gift House (Proprietor: Anita Tekriwal)</p>
              <p><strong>Address:</strong> Near Budhanath, Bhagalpur, Bihar - 812001</p>
              <p><strong>Contact Phone / WhatsApp:</strong> +91 9199272836</p>
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
