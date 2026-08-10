import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { AuthRequiredModal } from '@/components/AuthRequiredModal';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Anita Gift House | Handpicked Gifts, Rakhis, Toys & Custom Hampers',
  description: 'Anita Gift House is a premium culturally vibrant e-commerce store offering handcrafted Rakhis, brass pooja thalis, luxury hampers, and educational toys.',
  keywords: ['Anita Gift House', 'Rakhis', 'Handpicked Gifts', 'Toys', 'Brass Diyas', 'Diwali Hampers', 'India Gifting'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="font-sans bg-cream text-espresso antialiased">
        {children}
        <AuthRequiredModal />
      </body>
    </html>
  );
}
