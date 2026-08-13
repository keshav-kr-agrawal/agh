'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Heart, ShieldCheck, MapPin, ExternalLink, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-espresso text-cream pt-16 pb-16 border-t border-gold/20 select-none font-sans overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Intro Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/agh.png"
                alt="Anita Gift House Logo"
                className="h-10 w-auto object-contain rounded-xl bg-cream p-1 border border-gold/40 shadow-md group-hover:scale-105 transition"
              />
              <span className="text-xl font-serif font-bold text-cream tracking-tight group-hover:text-gold transition">
                Anita Gift House
              </span>
            </Link>
            <p className="text-xs text-cream/70 leading-relaxed">
              Bringing warmth, tradition, and joyous celebrations through handpicked luxury gifts, festive Rakhis, educational toys, and bespoke hampers.
            </p>
            {/* FOUNDED & OWNED BY ANITA TEKRIWAL */}
            <div className="flex items-center gap-2 pt-1 text-gold">
              <Award className="w-4 h-4 text-amberGold" />
              <span className="text-xs font-serif font-bold text-gold tracking-wide">
                Founded & Owned by Anita Tekriwal
              </span>
            </div>
          </div>

          {/* Quick Collections */}
          <div>
            <h4 className="text-sm font-serif font-bold text-gold uppercase tracking-wider mb-4 border-b border-cream/10 pb-2">
              Handpicked Collections
            </h4>
            <ul className="space-y-2 text-xs text-cream/80">
              <li><Link href="/" className="hover:text-gold transition">Royal Kundan Rakhis</Link></li>
              <li><Link href="/" className="hover:text-gold transition">Handmade Brass Pooja Items</Link></li>
              <li><Link href="/" className="hover:text-gold transition">Luxury Artisan Hampers</Link></li>
              <li><Link href="/" className="hover:text-gold transition">Educational & STEM Toys</Link></li>
              <li><Link href="/" className="hover:text-gold transition">Personalized Engraved Keepsakes</Link></li>
            </ul>
          </div>

          {/* Customer Support & Portals */}
          <div>
            <h4 className="text-sm font-serif font-bold text-gold uppercase tracking-wider mb-4 border-b border-cream/10 pb-2">
              Customer Portal
            </h4>
            <ul className="space-y-2 text-xs text-cream/80">
              <li><Link href="/account" className="hover:text-gold transition">Customer Dashboard & Orders</Link></li>
              <li><Link href="/login" className="hover:text-gold transition">Customer Login / Account Access</Link></li>
              <li>
                <Link href="/admin/login" className="text-gold font-bold hover:underline transition flex items-center gap-1.5 mt-1">
                  🔐 Admin Control Center Login
                </Link>
              </li>
              <li><span className="text-cream/60">Store Hours: 10 AM - 9 PM Daily</span></li>
            </ul>
          </div>

          {/* Official Business Contact Compliance */}
          <div className="space-y-3 text-xs text-cream/80">
            <h4 className="text-sm font-serif font-bold text-gold uppercase tracking-wider mb-4 border-b border-cream/10 pb-2">
              Official Support
            </h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
              <span>Anita Gift House, Near Budhanath, Bhagalpur, Bihar - 812001</span>
            </div>
            {/* OFFICIAL ADMIN PHONE & DIRECT WHATSAPP REDIRECTION +91 9199272836 */}
            <a
              href="https://wa.me/919199272836?text=Hello%20Anita%20Gift%20House!%20I%20have%20an%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-3 bg-cream/10 rounded-2xl border border-gold/30 hover:bg-gold/20 transition group"
              title="Click to chat directly on WhatsApp (+91 9199272836)"
            >
              <Phone className="w-4 h-4 text-gold shrink-0 animate-pulse group-hover:scale-110 transition" />
              <div>
                <span className="font-mono font-bold text-cream text-sm block">+91 9199272836</span>
                <span className="text-[10px] text-gold font-semibold">Click to Chat on WhatsApp →</span>
              </div>
            </a>
          </div>
        </div>

        {/* Legal Policies (DPDP Act 2023 Compliant) */}
        <div className="pt-6 border-t border-cream/10 flex flex-wrap items-center justify-center gap-4 text-[11px] text-cream/70">
          <Link href="/privacy" className="hover:text-gold transition font-medium">
            Privacy Policy (DPDP Act 2023)
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-gold transition font-medium">
            Terms & Conditions
          </Link>
          <span>•</span>
          <Link href="/refund-policy" className="hover:text-gold transition font-medium">
            Cancellation & Refund Policy
          </Link>
          <span>•</span>
          <Link href="/shipping-policy" className="hover:text-gold transition font-medium">
            Shipping & Delivery Policy
          </Link>
        </div>

        {/* Bottom Rights Bar with Made & Maintained by Hikity in Center */}
        <div className="pt-6 border-t border-cream/10 flex flex-col items-center justify-center text-center text-xs text-cream/70 gap-2">
          <p>© {new Date().getFullYear()} Anita Gift House. Founded by Anita Tekriwal. All rights reserved.</p>
          <div className="flex items-center justify-center gap-1.5 font-medium">
            <span>Technical Partner:</span>
            <a
              href="https://hikity.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold font-bold hover:underline inline-flex items-center gap-1"
            >
              Hikity <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER ARCHITECTURAL WATERMARK REQUIREMENT:
          Large background watermark reading "AGH".
          font-size: clamp(10rem, 22vw, 28rem), font-weight: 900.
          30% hidden/embedded below the bottom viewport (transform: translateY(35%)), opacity: 0.07 with mix-blend-mode: overlay.
      */}
      <div 
        className="absolute bottom-0 left-1/2 pointer-events-none select-none text-gold font-black tracking-tighter leading-none z-0"
        style={{
          fontSize: 'clamp(10rem, 22vw, 28rem)',
          fontWeight: 900,
          letterSpacing: '-0.05em',
          transform: 'translate(-50%, 35%)',
          color: 'rgba(212, 175, 55, 0.12)',
          textShadow: '0 0 40px rgba(212, 175, 55, 0.06)'
        }}
      >
        AGH
      </div>
    </footer>
  );
};
