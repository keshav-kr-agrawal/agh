<div align="center">

  <img src="public/agh.png" alt="Anita Gift House Logo" width="160" style="border-radius: 24px; margin-bottom: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.15);" />

  # 🎁 Anita Gift House
  ### *Artisanal Gifts, Custom Hampers & Modern Retail E-Commerce Platform*

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN_Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

  <p align="center">
    <strong>A high-performance e-commerce platform and retail management system engineered for high-speed online ordering, personalized gift packing, profit margin analytics, and instant WhatsApp dispatch.</strong>
  </p>

  ---
</div>

## ✨ Platform Highlights

### 🛍️ 1. Culturally Vibrant Storefront
- **Dynamic Merchandising**: Instant category filters (`Gifts`, `Rakhi`, `Toys`, `Handpicked`, `Hampers`, `🔥 Special Offers`), live search, and real-time stock availability badges.
- **Fulfillment Modes**: Flexible ordering for **Express Parcel Delivery** or **Store Pickup**.
- **Interactive Quick Preview**: High-definition image galleries, detailed specifications, and instant cart additions.

### 🎁 2. Gift Customization Engine ("Ordering for Someone Else?")
- **Personalized Gift Cards**: Customers can include custom card messages (e.g. *"Happy Birthday Sneha! Best wishes from Rahul"*).
- **Occasion Selectors**: Birthday 🎂, Anniversary 💍, Rakhi 🪡, Festival / Diwali 🪔, Just Because 💖, Special Surprise 🎁.
- **Custom Hamper Packing**: Standard Ribbon Wrap 🎀, Premium Hamper Box 🎁, Custom Budget Packing ✨.
- **Direct Recipient Delivery**: Dedicated inputs for recipient name, mobile number, and delivery address.

### 🏪 3. Merchant Walk-In POS (Point of Sale)
- **Store Counter Checkout**: Record walk-in customer sales instantly and deduct inventory stock in real time.
- **Live Camera Snap**: Capture product photos directly using a phone or laptop camera with direct Cloudinary CDN upload.

### 📊 4. Financial & Profit Accounting Dashboard
- **Real-Time Analytics**: Automatic Cost Price (CP), Selling Price (SP), Max Retail Price (MRP), and Gross Margin percentage tracking.
- **Overhead Expense Logger**: Log business overheads (Rent, Packaging, Electricity, Delivery Tips) to calculate Net Profit.
- **Visual Analytics**: Dynamic revenue trends, category sales distributions, and fast-moving items leaderboards.
- **Monthly Financial Archival**: Clean monthly archival system with revenue reset and history logs.

### ⚡ 5. High-Performance CDN & Free Tier Optimization
- **Cloudinary Media Engine**: Automatic WebP image compression and high-speed global CDN delivery.
- **Lightweight Database Payload**: Engineered for maximum performance and permanent compatibility with Supabase Free Tier quotas.

### 📱 6. Rich Social Link Previews
- **Amazon-Style Social Cards**: Pasting product links on WhatsApp, Instagram DMs, iMessage, or Facebook displays rich preview cards with brand logo, title, and price.

### 📄 7. Invoices & Order Tracking
- **Delhivery Pincode Checker**: Integrated express shipping rate estimation.
- **Printable Invoices**: Professional digital invoice page with itemized breakdown, tax details, gift notes, and 1-click PDF print/download.
- **WhatsApp Dispatcher**: 1-click WhatsApp order confirmation link generator.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **UI Library** | React 19 |
| **Styling** | Vanilla CSS & Tailwind CSS |
| **Language** | TypeScript |
| **State Management** | Zustand |
| **Database & Realtime** | Supabase PostgreSQL |
| **Media CDN** | Cloudinary API |
| **Logistics** | Delhivery API |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.17.0` or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/keshav-kr-agrawal/agh.git
   cd AGH
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and define your credentials:
   ```env
   NEXT_PUBLIC_ADMIN_ID="your_admin_id"
   NEXT_PUBLIC_ADMIN_PHONE="your_admin_phone"
   NEXT_PUBLIC_ADMIN_PIN="your_admin_pin"
   ADMIN_PIN="your_admin_pin"
   ADMIN_JWT_SECRET="your_jwt_secret"

   NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_cloudinary_api_key"
   CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
   CLOUDINARY_URL="your_cloudinary_url"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

5. **Build for Production**
   ```bash
   npm run build
   npm run start
   ```

---

## 📜 License

Distributed under the **MIT License**.

---

<div align="center">
  <sub>Designed & Developed for <strong>Anita Gift House</strong>.</sub>
</div>
