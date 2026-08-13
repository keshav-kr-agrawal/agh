'use client';

import React from 'react';
import { Star, CheckCircle2, MessageCircle, Quote, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';
import { getWhatsAppUrl, WHATSAPP_DISPLAY } from './FloatingWhatsAppButton';

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  productName: string;
  comment: string;
  verified: boolean;
}

const reviewsData: Review[] = [
  {
    id: 'r-1',
    name: 'Ananya Sharma',
    location: 'Patna, Bihar',
    rating: 5,
    date: '2 days ago',
    productName: 'Royal Kundan Rakhi & Sweets Combo',
    comment: 'The Rakhi was absolutely stunning and high quality! Packaging was super safe and arrived within 2 days via express delivery. My brother loved it!',
    verified: true
  },
  {
    id: 'r-2',
    name: 'Rajesh Kumar',
    location: 'Bhagalpur, Bihar',
    rating: 5,
    date: '1 week ago',
    productName: 'Artisanal Brass Pooja Diya Set',
    comment: 'Ordered for store pickup in Bhagalpur. Handpicked packaging was so elegant. Anita ji is very polite and helpful. 100% authentic brass work!',
    verified: true
  },
  {
    id: 'r-3',
    name: 'Megha Roy',
    location: 'Kolkata, West Bengal',
    rating: 5,
    date: '2 weeks ago',
    productName: 'Festive Luxury Gourmet Hamper',
    comment: 'Everything in the hamper was freshly packed and premium quality. Shared direct WhatsApp inquiry and got instant response on order status.',
    verified: true
  },
  {
    id: 'r-4',
    name: 'Vikramaditya Singh',
    location: 'New Delhi',
    rating: 5,
    date: '3 weeks ago',
    productName: 'STEM Educational Robotic Car Toy',
    comment: 'Bought this toy for my son\'s birthday. Quality is top notch and works smoothly. Express Delhivery shipping delivered earlier than promised!',
    verified: true
  }
];

export const CustomerReviews: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-cream-border pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-terracotta/10 text-terracotta text-xs font-bold rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Customer Feedback & Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-espresso">
            Loved by Hundreds of Happy Celebrators
          </h2>
          <p className="text-xs text-espresso/70 mt-1">
            Real customer experiences for Anita Gift House luxury hampers, Rakhis & toys.
          </p>
        </div>

        {/* Overall Rating Badge */}
        <div className="flex items-center gap-3 bg-cream-muted border border-cream-border p-3 rounded-2xl shrink-0">
          <div className="text-center">
            <span className="text-2xl font-serif font-extrabold text-espresso">4.9</span>
            <span className="text-[10px] text-espresso/50 block font-mono">out of 5</span>
          </div>
          <div>
            <div className="flex text-gold mb-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 500+ Verified Buyers
            </span>
          </div>
        </div>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviewsData.map(review => (
          <div 
            key={review.id}
            className="bg-cream border border-cream-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Star Rating & Verified Badge */}
              <div className="flex items-center justify-between">
                <div className="flex text-gold">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                {review.verified && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>

              {/* Comment Quote */}
              <p className="text-xs text-espresso/80 leading-relaxed italic relative">
                <Quote className="w-6 h-6 text-terracotta/15 absolute -top-2 -left-1 -z-0" />
                "{review.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-cream-border/60">
              <span className="text-[11px] font-bold text-terracotta block line-clamp-1">
                {review.productName}
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-serif font-bold text-espresso">{review.name}</span>
                <span className="text-[10px] text-espresso/50">{review.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Direct WhatsApp Action Banner */}
      <div className="bg-gradient-to-r from-espresso via-espresso/95 to-espresso text-cream border border-gold/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-serif font-bold text-gold flex items-center justify-center sm:justify-start gap-2">
            <HeartHandshake className="w-5 h-5 text-amberGold" />
            Custom Hamper or Bulk Order Inquiry?
          </h3>
          <p className="text-xs text-cream/80 max-w-xl">
            Talk directly with Anita Tekriwal on WhatsApp ({WHATSAPP_DISPLAY}) for instant order updates, custom hamper personalization, and fast response!
          </p>
        </div>

        <a
          href={getWhatsAppUrl('Hi Anita Gift House! I would like to inquire about a custom gift order.')}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-extrabold uppercase tracking-wider rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 shrink-0 border border-white/20"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          Direct WhatsApp Chat ({WHATSAPP_DISPLAY})
        </a>
      </div>
    </section>
  );
};
