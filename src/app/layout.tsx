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
  metadataBase: new URL('https://anita-gift-house.vercel.app'),
  title: 'Anita Gift House | Handpicked Gifts, Rakhis, Toys & Custom Hampers',
  description: 'Anita Gift House is a premium culturally vibrant e-commerce store offering handcrafted Rakhis, brass pooja thalis, luxury hampers, and educational toys.',
  keywords: ['Anita Gift House', 'Rakhis', 'Handpicked Gifts', 'Toys', 'Brass Diyas', 'Diwali Hampers', 'India Gifting'],
  openGraph: {
    title: 'Anita Gift House | Premium Artisanal Gifts & Hampers',
    description: 'Explore artisanal gifts, handcrafted Rakhis, brass diyas, educational toys & custom festive gift hampers at Anita Gift House.',
    url: 'https://anita-gift-house.vercel.app',
    siteName: 'Anita Gift House',
    images: [
      {
        url: '/agh.png',
        width: 1200,
        height: 630,
        alt: 'Anita Gift House Showcase'
      }
    ],
    locale: 'en_IN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anita Gift House | Premium Artisanal Gifts & Hampers',
    description: 'Explore artisanal gifts, handcrafted Rakhis, brass diyas, educational toys & custom festive gift hampers.',
    images: ['/agh.png']
  }
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
