import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy (DPDP Act 2023 Compliant) | Anita Gift House',
  description: 'Anita Gift House Privacy Policy in strict compliance with the Digital Personal Data Protection (DPDP) Act 2023 of India.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-cream text-espresso flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="border-b border-cream-border pb-6 space-y-2">
          <div className="flex items-center gap-2 text-xs text-terracotta font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Legal Compliance Notice
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-espresso">
            Privacy Policy
          </h1>
          <p className="text-xs text-espresso/70">
            Compliant with the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> (Government of India).
          </p>
          <p className="text-[11px] text-espresso/50 font-mono pt-1">
            Last Updated & Effective Date: August 13, 2026 | Data Fiduciary: Anita Gift House
          </p>
        </div>

        {/* DPDP Act Notice Box */}
        <div className="p-4 sm:p-6 bg-cream-muted border border-gold/40 rounded-3xl space-y-3 shadow-xs">
          <h3 className="font-serif font-bold text-base text-espresso flex items-center gap-2">
            <Lock className="w-5 h-5 text-gold-dark" /> DPDP Act 2023 Data Principal Rights Notice
          </h3>
          <p className="text-xs text-espresso/80 leading-relaxed">
            Under the Digital Personal Data Protection Act, 2023 of India, you as a <strong>Data Principal</strong> have explicit rights regarding your personal data processed by <strong>Anita Gift House</strong> (Data Fiduciary). We collect and process personal data solely for legitimate business purposes with your informed consent.
          </p>
        </div>

        {/* Section Breakdown */}
        <div className="space-y-6 text-xs sm:text-sm text-espresso/85 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              1. Personal Data We Collect
            </h2>
            <p>
              To process your orders, arrange delivery, and provide customer support, we collect the following personal data:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Contact Information:</strong> Full Name, Mobile Phone Number, and Email Address.</li>
              <li><strong>Delivery Information:</strong> Street Address, City, State, and 6-digit Pincode.</li>
              <li><strong>Order & Transaction Records:</strong> Purchased items, gift notes, fulfillment preference (Parcel Shipping or Store Pickup), and UPI payment confirmation screenshots/reference IDs.</li>
              <li><strong>Technical Data:</strong> IP address, device type, and browser session data stored locally for shopping cart persistence.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              2. Purpose of Personal Data Processing
            </h2>
            <p>
              We process your personal data strictly for specified, explicit, and legitimate purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Fulfilling and packing your gift, Rakhi, toy, or hamper orders.</li>
              <li>Generating tax-inclusive legal invoices and dispatching express parcels via courier partners (Delhivery Express).</li>
              <li>Notifying you of order status updates, store pickup readiness, and order tracking via SMS/WhatsApp.</li>
              <li>Verifying UPI payment transactions and preventing fraudulent activities.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              3. Consent & Right to Withdraw Consent
            </h2>
            <p>
              By placing an order or registering an account on Anita Gift House, you provide consent for data processing for order fulfillment. You have the right to withdraw your consent at any time by contacting our Data Protection Officer. Upon consent withdrawal, we will cease processing your personal data, except where retention is legally mandated for tax and auditing purposes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              4. Data Sharing & Third-Party Processors
            </h2>
            <p>
              We <strong>do not sell, rent, or trade</strong> your personal data to any third parties or marketing agencies. We share necessary data only with trusted infrastructure providers:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Logistics Partners:</strong> Delivery details shared with Delhivery Express for parcel shipping.</li>
              <li><strong>Cloud Storage & Database:</strong> Encrypted data storage powered by Supabase and Cloudinary CDN.</li>
              <li><strong>Legal Compliance:</strong> Sharing data if required by Indian law enforcement or regulatory authorities under due legal process.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              5. Protection of Minors (Children's Personal Data)
            </h2>
            <p>
              In accordance with Section 9 of the DPDP Act 2023, we do not knowingly process personal data of children under 18 years of age without verifiable parental or legal guardian consent. Our catalog of educational toys and gifts is intended for purchase by adults.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              6. Your Rights as a Data Principal
            </h2>
            <p>Under the DPDP Act 2023, you enjoy the following rights:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 bg-cream-muted border border-cream-border rounded-xl">
                <strong className="block text-terracotta">Right to Summary & Access</strong>
                Obtain a summary of personal data processed by us.
              </div>
              <div className="p-3 bg-cream-muted border border-cream-border rounded-xl">
                <strong className="block text-terracotta">Right to Correction & Erasure</strong>
                Request correction of inaccurate data or deletion of account records.
              </div>
              <div className="p-3 bg-cream-muted border border-cream-border rounded-xl">
                <strong className="block text-terracotta">Right to Grievance Redressal</strong>
                File grievances regarding data processing with our Data Protection Officer.
              </div>
              <div className="p-3 bg-cream-muted border border-cream-border rounded-xl">
                <strong className="block text-terracotta">Right to Nominate</strong>
                Nominate another individual to exercise rights in case of incapacity.
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-espresso border-b border-cream-border/60 pb-1">
              7. Data Protection Officer & Grievance Redressal
            </h2>
            <p>
              In compliance with Section 10 of the DPDP Act 2023, for any privacy queries, data access requests, or grievance complaints, please contact our Data Protection Officer:
            </p>
            <div className="p-4 bg-cream-muted border border-gold/30 rounded-2xl space-y-1.5 font-mono text-xs">
              <p><strong>Data Protection Officer:</strong> Anita Tekriwal (Founder & Owner)</p>
              <p><strong>Data Fiduciary:</strong> Anita Gift House</p>
              <p><strong>Physical Address:</strong> Near Budhanath, Bhagalpur, Bihar - 812001</p>
              <p><strong>Official Phone & WhatsApp:</strong> +91 9199272836</p>
              <p><strong>Redressal Response Time:</strong> Within 7 business days</p>
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
