import React from 'react';
import { Navbar } from '@/components/Navbar';
import { MerchandisingGrid } from '@/components/MerchandisingGrid';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CustomerReviews } from '@/components/CustomerReviews';
import { FloatingWhatsAppButton } from '@/components/FloatingWhatsAppButton';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Anita Gift House | Handpicked Gifts, Rakhis, Toys & Hampers',
  description: 'Anita Gift House offers curated celebration gifts, royal Kundan Rakhis, brass pooja items, educational toys, and custom hampers with express parcel shipping and handpicked store pickup.',
};

export default function StorefrontPage() {
  return (
    <main className="min-h-screen bg-cream text-espresso flex flex-col font-sans selection:bg-gold selection:text-espresso relative">
      <Navbar />
      <div className="flex-1 space-y-12">
        <MerchandisingGrid />
        <CustomerReviews />
      </div>
      <ProductDetailModal />
      <CartDrawer />
      <FloatingWhatsAppButton />
      <Footer />
    </main>
  );
}
