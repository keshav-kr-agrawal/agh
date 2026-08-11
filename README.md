<div align="center">

  <img src="public/agh.png" alt="Anita Gift House Logo" width="160" style="border-radius: 20px; margin-bottom: 15px;" />

  # 🎁 Anita Gift House (AGH)
  ### *Next-Gen Full-Stack E-Commerce & Retail POS Platform for Artisanal Gifts, Hampers & Festive Collections*

  [![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN_Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
  [![License](https://img.shields.io/badge/License-MIT-gold?style=for-the-badge)](LICENSE)

  <p align="center">
    <strong>A high-performance, culturally vibrant, end-to-end e-commerce store & retail management system engineered for high-speed online ordering, live camera inventory capture, profit margin accounting, and instant WhatsApp dispatch.</strong>
  </p>

  <p align="center">
    <a href="#-key-features">Key Features</a> •
    <a href="#-architecture--tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-environment-variables">Environment Setup</a> •
    <a href="#-security--hardening">Security</a> •
    <a href="#-vercel-deployment">Deployment</a>
  </p>

  ---
</div>

## 🌟 Key Features

### 🛍️ 1. Culturally Vibrant Storefront & Search Engine
- **Dynamic Merchandising**: Category filtering (`Gifts`, `Rakhi`, `Toys`, `Handpicked`, `Hampers`, `🔥 Special Offers`), full-text search, and real-time inventory status badges.
- **Fulfillment Engine**: Seamless toggle between **Parcel Express Shipping** and **Handpicked Store Pickup**.
- **Quick-View Product Modal**: Full product specification breakdown, high-resolution media galleries, and stock availability indicators.

### 🎁 2. Gift Customization Engine ("Ordering for Someone Else?")
- **Personalized Gift Cards**: Customers can add custom card notes (e.g. *"Happy Birthday Sneha! Best wishes from Rahul"*).
- **Occasion Selectors**: Birthday 🎂, Anniversary 💍, Rakhi 🪡, Festival / Diwali 🪔, Just Because 💖, Special Surprise 🎁.
- **Packaging Options**: Standard Ribbon Wrap 🎀, Premium Hamper Box 🎁, Custom Budget Packing ✨.
- **Direct Recipient Delivery**: Dedicated inputs for recipient name, phone number, and delivery address.

### 🏪 3. Merchant Walk-In POS (Point of Sale)
- **Offline & Store Counter Ordering**: Record walk-in customer sales instantly and deduct inventory stock in real time.
- **Live Device Camera Snap**: Capture product photos directly using your phone or laptop camera and upload instantly to Cloudinary.

### 📊 4. Financial & Profit Margin Accounting Dashboard
- **Profit Tracking**: Automated Cost Price (CP), Selling Price (SP), Max Retail Price (MRP), and Gross Margin percentage calculations.
- **Overhead Expense Logger**: Track operational overheads (Rent, Packaging, Electricity, Delivery Tips) to calculate exact Net Profit.
- **Interactive Recharts Visuals**: Real-time sales breakdown by category, fast-moving items leaderboard, and daily revenue trends.
- **Monthly Financial Archival**: Clean monthly archival system with revenue reset and history logs.

### 🛡️ 5. Production-Grade Enterprise Security
- **HMAC SHA-256 JWT Admin Auth**: Secure admin session management via signed tokens & `HTTP-Only` cookies (`agh_admin_token`).
- **Server-Side Price Anti-Tampering**: Unit prices and cart totals are recalculated on the server to prevent client-side price tampering.
- **IP Rate Limiting**: Anti-DoS protection on order creation (15 req/min) and image uploads (20 req/min).

### ⚡ 6. Cloudinary CDN & Supabase Free Tier Optimization
- **Signed Cloudinary Uploads**: Direct REST API signed image uploads returning WebP CDN URLs (`https://res.cloudinary.com/...`).
- **Zero Database Bloat**: Database stores only 80-byte CDN links, preserving **100% permanent compatibility with Supabase Free Tier quotas**.

### 📱 7. Amazon-Style Rich Social Link Previews
- **OpenGraph & Twitter Card SEO**: Paste product URLs on WhatsApp, Instagram DMs, iMessage, or Facebook to generate rich preview cards with brand logo, title, and price.

### 🚚 8. Shipping & Digital PDF Invoices
- **Delhivery Pincode Checker**: Integrated express shipping rate estimation.
- **Printable Invoices (`/invoice/[orderId]`)**: Professional digital invoice page complete with itemized breakdown, tax details, gift notes, and 1-click PDF print/download capabilities.
- **WhatsApp Dispatcher**: 1-click WhatsApp order confirmation link generator.

---

## 🏗️ Architecture & Tech Stack

```
Anita Gift House (AGH)
 ├── 🎨 Frontend Layer        : Next.js 15 (App Router), React 19, Tailwind CSS 3.4
 ├── ⚡ State Management     : Zustand (AuthStore, CartStore)
 ├── 🗄️ Database & Realtime  : Supabase PostgreSQL & Supabase Realtime
 ├── 🖼️ Media & CDN Engine   : Cloudinary API (Signed WebP Uploads & Transformations)
 ├── 🔒 Security Guard Layer : HMAC SHA-256 JWT, HTTP-Only Cookies, Custom IP Rate Limiter
 ├── 📊 Data Visualization  : Recharts Dynamic Financial Engine
 ├── 🚚 Logistics & Invoices : Delhivery API Integration & Print-Ready PDF Invoice System
 └── 🚀 Deployment          : Vercel Serverless Edge Platform
```

---

## 📁 Repository Structure

```
AGH/
├── public/                     # Static assets (Logos, Icons, UPI QR Code)
├── src/
│   ├── app/
│   │   ├── (storefront)/       # Homepage, Product Catalog, Search & Filters
│   │   ├── account/            # Customer Account Dashboard & Orders
│   │   ├── admin/              # Merchant Control Center, Analytics, POS, Products
│   │   │   ├── login/          # Secure Admin Passcode Portal
│   │   │   ├── products/       # Catalogue & Photo Upload Manager
│   │   │   ├── promotions/     # Announcement Bar & Coupon Manager
│   │   │   └── reports/        # Financial Reports & Monthly Archival
│   │   ├── api/                # Production REST API Handlers
│   │   │   ├── admin/          # JWT Session Login & Logout Guard
│   │   │   ├── analytics/      # Financial Metrics & Profit Calculations
│   │   │   ├── orders/         # Order Creation, Anti-Tampering & Payment Verification
│   │   │   ├── products/       # Catalogue CRUD & Batch Imports
│   │   │   ├── promotions/     # Coupon Engine & Announcement Bar API
│   │   │   ├── shipping/       # Delhivery Pincode Rates API
│   │   │   └── upload/         # Signed Cloudinary CDN Upload Handler
│   │   ├── invoice/[orderId]/  # Printable Digital Invoice Page
│   │   ├── track/[orderId]/    # Delhivery Shipping Tracker
│   │   ├── login/              # Customer Dual Login (Email / Phone)
│   │   └── signup/             # Customer Registration
│   ├── components/             # Reusable UI Components (Navbar, ProductCard, CartDrawer)
│   ├── lib/                    # Security Guards, Rate Limiters, Supabase & Cloudinary Clients
│   ├── store/                  # Zustand Global Auth & Cart State Stores
│   └── types/                  # TypeScript Data Models & Schema Interfaces
├── .env.local                  # Local Secret Environment Variables
└── next.config.js              # Next.js Build Configuration
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **Package Manager**: `npm` (v9+) or `yarn` / `pnpm`

### 1. Clone the Repository
```bash
git clone https://github.com/keshav-kr-agrawal/agh.git
cd AGH
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Local Environment Variables
Create a `.env.local` file in the project root:

```env
# Admin Portal Credentials
NEXT_PUBLIC_ADMIN_ID="HKW1321"
NEXT_PUBLIC_ADMIN_PHONE="+91 9199272836"
NEXT_PUBLIC_ADMIN_PIN="9199"
ADMIN_PIN="9199"

# Security & JWT Tokens
ADMIN_JWT_SECRET="agh_super_secret_admin_token_key_2026"

# Supabase Database Connection
NEXT_PUBLIC_SUPABASE_URL="https://jhdxtpbyawubsvzacffz.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key_here"

# Cloudinary WebP Media CDN
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="h0uczsof"
CLOUDINARY_API_KEY="574861568286536"
CLOUDINARY_API_SECRET="PU6nyy-cJwM1uwNaj5wIM-kct-w"
CLOUDINARY_URL="cloudinary://574861568286536:PU6nyy-cJwM1uwNaj5wIM-kct-w@h0uczsof"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Test
```bash
npm run build
npm run start
```

---

## 🔑 Default Admin Credentials

| Parameter | Value |
| :--- | :--- |
| **Admin ID** | `HKW1321` |
| **Authorized Phone** | `+91 9199272836` |
| **Default Passcode / PIN** | `9199` |
| **Admin Login URL** | `/admin/login` |

---

## 🚀 Vercel Deployment Guide

1. Push your repository to GitHub (`main` branch).
2. Import the project into your **[Vercel Dashboard](https://vercel.com/dashboard)**.
3. In **Project Settings → Environment Variables**, add the keys from your `.env.local`:
   - `NEXT_PUBLIC_ADMIN_ID`
   - `NEXT_PUBLIC_ADMIN_PHONE`
   - `NEXT_PUBLIC_ADMIN_PIN`
   - `ADMIN_PIN`
   - `ADMIN_JWT_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `CLOUDINARY_URL`
4. Click **Deploy**. Vercel will build and serve your application globally on Edge locations!

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

<div align="center">
  <sub>Built with ❤️ for <strong>Anita Gift House</strong> by Advanced Agentic AI Engineering.</sub>
</div>
