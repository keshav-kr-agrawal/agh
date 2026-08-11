<div align="center">

  <br />

  <img src="public/agh.png" alt="Anita Gift House Logo" width="180" style="border-radius: 28px; box-shadow: 0 20px 40px rgba(0,0,0,0.25); border: 2px solid rgba(255,255,255,0.2);" />

  <br />
  <br />

  # 🎁 Anita Gift House
  ### *Artisanal Gifts, Custom Hampers & Modern Retail E-Commerce Platform*

  <br />

  [![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

  <br />

  <p align="center">
    <strong>A high-performance e-commerce platform and retail management system engineered for high-speed online ordering, personalized gift packing, profit margin analytics, and instant WhatsApp dispatch.</strong>
  </p>

  <br />

  ---

</div>

<br />

## 🌟 Executive Overview

**Anita Gift House** is a full-featured e-commerce ecosystem designed to elevate artisanal gift retail. Combining a culturally vibrant customer-facing store with an advanced merchant dashboard, the platform seamlessly connects online shoppers with physical store operations.

```
                  ┌──────────────────────────────────────────┐
                  │          Anita Gift House Platform       │
                  └─────────────────────┬────────────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼                            ▼                            ▼
┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
│ 🛍️ Customer Store   │      │ 🎁 Gift Customizer  │      │ 🏪 Merchant POS     │
│  Fast Catalog & Cart│      │  Personal Note & Box│      │  Instant Counter Sale│
└─────────────────────┘      └─────────────────────┘      └─────────────────────┘
           │                            │                            │
           └────────────────────────────┼────────────────────────────┘
                                        ▼
                  ┌──────────────────────────────────────────┐
                  │ 📊 Financial Engine & Cloudinary CDN     │
                  └──────────────────────────────────────────┘
```

<br />

---

## ✨ Feature Showcase

### 🛍️ 1. Culturally Vibrant Storefront
* **Dynamic Merchandising Engine**: Category filtering across *Gifts*, *Rakhi*, *Toys*, *Handpicked*, *Hampers*, and *🔥 Special Offers*.
* **Smart Search**: Real-time full-text search indexing title, description, and custom search keywords.
* **Fulfillment Selector**: Instant switching between **Express Parcel Delivery** and **Handpicked Store Pickup**.
* **Quick View Modal**: Interactive product preview featuring high-definition galleries, stock availability badges, and specifications.

<br />

### 🎁 2. Gift Customization Engine (*"Ordering for Someone Else?"*)
* **Personalized Card Notes**: Custom gift messages formatted directly onto customer invoices (e.g. *"Happy Birthday Sneha! Best wishes from Rahul"*).
* **Occasion Selectors**: Birthday 🎂, Anniversary 💍, Rakhi 🪡, Festival / Diwali 🪔, Just Because 💖, Special Surprise 🎁.
* **Custom Hamper Packing**: Standard Ribbon Wrap 🎀, Premium Hamper Box 🎁, Custom Budget Packing ✨.
* **Direct Recipient Delivery**: Dedicated shipping inputs for recipient name, mobile number, and delivery address.

<br />

### 🏪 3. Walk-In Retail POS (Point of Sale)
* **Store Counter Checkout**: Record walk-in customer sales instantly and deduct inventory stock in real time.
* **Live Camera Snap**: Capture product photos directly using a phone or laptop camera with direct Cloudinary CDN upload.

<br />

### 📊 4. Financial & Profit Margin Accounting Dashboard
* **Real-Time Analytics**: Automatic Cost Price (CP), Selling Price (SP), Max Retail Price (MRP), and Gross Margin percentage tracking.
* **Overhead Expense Logger**: Log business overheads (Rent, Packaging, Electricity, Delivery Tips) to calculate exact Net Profit.
* **Visual Analytics**: Dynamic revenue trends, category sales distributions, and fast-moving items leaderboards powered by Recharts.
* **Monthly Financial Archival**: Clean monthly archival system with revenue reset and history logs.

<br />

### 📱 5. Rich Social Link Previews
* **Amazon-Style Open Graph Cards**: Pasting product links on WhatsApp, Instagram DMs, iMessage, or Facebook displays rich preview cards with brand logo, title, and price.

<br />

### 🚚 6. Shipping & Digital PDF Invoices
* **Delhivery Pincode Checker**: Integrated express shipping rate estimation.
* **Printable Invoices**: Professional digital invoice page with itemized breakdown, tax details, gift notes, and 1-click PDF print/download.
* **WhatsApp Dispatcher**: 1-click WhatsApp order confirmation link generator.

<br />

---

## 🛠️ Technology Stack

<br />

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (App Router)** | High-performance server-rendered e-commerce pages |
| **UI Library** | **React 19** | Dynamic reactive component architecture |
| **Styling & Layout** | **Tailwind CSS 3.4** | Modern responsive visual design system |
| **State Management** | **Zustand 5** | Lightweight reactive global store |
| **Database & Realtime** | **Supabase PostgreSQL** | Cloud data storage & realtime channel sync |
| **Media CDN Engine** | **Cloudinary API** | WebP media transformations & global CDN delivery |
| **Data Analytics** | **Recharts** | Real-time financial revenue graphs & profit metrics |
| **Logistics** | **Delhivery Integration** | Pincode express delivery rate engine |

<br />

---

## 🛡️ Enterprise Quality & Security Standards

- **HMAC SHA-256 JWT Admin Authentication**: Secure session management via signed tokens & HTTP-Only cookies.
- **Server-Side Anti-Tampering**: Unit prices and totals recalculated on the server to prevent client payload manipulation.
- **IP Rate Limiting**: Anti-DoS protection on order creation and upload endpoints.
- **Cloudinary CDN Optimization**: Storing lightweight CDN links to maintain **100% permanent compatibility with Supabase Free Tier quotas**.

<br />

---

<div align="center">

  <br />

  ### 🎁 **Anita Gift House**
  *Handcrafted Gifts • Luxury Hampers • Artisanal Collections*

  <br />

  Distributed under the **MIT License**.

  <br />

</div>
