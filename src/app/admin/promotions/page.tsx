'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  Tag, 
  Plus, 
  Check, 
  X, 
  Flame, 
  ShieldCheck, 
  Megaphone,
  Layers,
  Percent,
  PackageCheck
} from 'lucide-react';
import { Coupon, StoreBanner, Category, Product } from '@/types';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function AdminPromotionsPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();

  const [banner, setBanner] = useState<StoreBanner>({
    id: 'b-1',
    text: '🎉 Festive Offer: Flat ₹200 OFF on orders over ₹1499 with coupon RAKHI200!',
    active: true,
    bgGradient: 'from-crimson via-terracotta to-crimson'
  });
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // New/Edit Coupon State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percent',
    discountValue: 10,
    minCartValue: 499,
    usageLimit: 500,
    expiryDate: '2026-12-31',
    active: true,
    applicableCategory: 'All',
    applicableProductIds: []
  });

  // Product Selection Search State
  const [productSearch, setProductSearch] = useState('');

  const [paymentSettings, setPaymentSettings] = useState<{
    upiId: string;
    qrImageUrl: string;
    merchantName: string;
  }>({
    upiId: '9199272836@okbizaxis',
    qrImageUrl: '/upi-qr.png',
    merchantName: 'Anita Gift House'
  });

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login');
      return;
    }
    loadPromotionsData();
  }, [isAdmin, router]);

  const loadPromotionsData = async () => {
    setLoading(true);
    try {
      const [promoRes, prodRes] = await Promise.all([
        fetch('/api/promotions'),
        fetch('/api/products')
      ]);

      const promoJson = await promoRes.json();
      const prodJson = await prodRes.json();

      if (promoJson.success) {
        if (promoJson.banner) setBanner(promoJson.banner);
        if (promoJson.coupons) setCoupons(promoJson.coupons);
        if (promoJson.paymentSettings) setPaymentSettings(promoJson.paymentSettings);
      }
      if (prodJson.success) {
        setProducts(prodJson.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updatePaymentSettings',
          paymentSettings
        })
      });
      const json = await res.json();
      if (json.success) {
        alert('UPI ID & Payment QR Code settings updated successfully!');
      } else {
        alert(json.message || 'Failed to update payment settings');
      }
    } catch {
      alert('Error updating payment settings');
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'banner',
          text: banner.text,
          active: banner.active,
          bgGradient: banner.bgGradient
        })
      });
      const json = await res.json();
      if (json.success) {
        alert('Top Announcement Banner updated successfully in real-time!');
        loadPromotionsData();
      }
    } catch {
      alert('Failed to update announcement banner');
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon.code || !editingCoupon.discountValue) {
      alert('Please enter coupon code and discount value');
      return;
    }

    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'coupon',
          coupon: editingCoupon
        })
      });
      const json = await res.json();
      if (json.success) {
        setIsCouponModalOpen(false);
        setEditingCoupon({
          code: '',
          discountType: 'percent',
          discountValue: 10,
          minCartValue: 499,
          usageLimit: 500,
          expiryDate: '2026-12-31',
          active: true,
          applicableCategory: 'All',
          applicableProductIds: []
        });
        alert('Custom coupon code saved successfully!');
        loadPromotionsData();
      }
    } catch {
      alert('Failed to save coupon');
    }
  };

  const toggleProductIdSelection = (prodId: string) => {
    const current = editingCoupon.applicableProductIds || [];
    if (current.includes(prodId)) {
      setEditingCoupon({
        ...editingCoupon,
        applicableProductIds: current.filter(id => id !== prodId)
      });
    } else {
      setEditingCoupon({
        ...editingCoupon,
        applicableProductIds: [...current, prodId]
      });
    }
  };

  const filteredProductsForCoupon = products.filter(p => 
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream text-espresso font-sans p-4 sm:p-8 space-y-8">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-border pb-6">
        <div>
          <Link href="/admin" className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Admin Control Center
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-espresso flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-terracotta" />
            Promotions & Multi-Coupon Manager
          </h1>
          <p className="text-xs text-espresso/60 mt-1">
            Real-time control over Top Store Announcement Banner and targeted item/category coupons.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCoupon({
              code: '',
              discountType: 'percent',
              discountValue: 10,
              minCartValue: 499,
              usageLimit: 500,
              expiryDate: '2026-12-31',
              active: true,
              applicableCategory: 'All',
              applicableProductIds: []
            });
            setIsCouponModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-terracotta text-cream text-xs font-bold rounded-xl shadow hover:bg-crimson transition"
        >
          <Plus className="w-4 h-4" /> Create Offer Coupon
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* SECTION 1: TOP ANNOUNCEMENT BANNER EDITOR */}
        <div className="bg-cream border border-cream-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-cream-border pb-4">
            <h2 className="text-xl font-serif font-bold text-espresso flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-dark" />
              Storefront Top Announcement Bar (Live Real-Time Editor)
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${banner.active ? 'bg-emerald-100 text-emerald-800' : 'bg-cream-border text-espresso/60'}`}>
              {banner.active ? 'LIVE ON STOREFRONT' : 'DISABLED'}
            </span>
          </div>

          <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-espresso mb-1">Banner Announcement Text *</label>
              <input
                type="text"
                required
                value={banner.text}
                onChange={e => setBanner({ ...banner, text: e.target.value })}
                className="w-full px-4 py-3 bg-cream-muted border border-cream-border rounded-2xl font-medium focus:ring-2 focus:ring-terracotta"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-espresso">
                <input
                  type="checkbox"
                  checked={banner.active}
                  onChange={e => setBanner({ ...banner, active: e.target.checked })}
                  className="rounded text-terracotta focus:ring-terracotta w-4 h-4"
                />
                Show Announcement Banner Above Navbar
              </label>

              <button
                type="submit"
                className="px-6 py-2.5 bg-terracotta text-cream font-bold rounded-xl hover:bg-crimson transition shadow"
              >
                Publish Banner Update
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 1.5: OFFICIAL STORE UPI ID & PAYMENT QR SETTINGS EDITOR */}
        <div className="bg-cream border border-cream-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-cream-border pb-4">
            <h2 className="text-xl font-serif font-bold text-espresso flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-terracotta" />
              Official Store UPI ID & Payment QR Code Settings
            </h2>
            <span className="text-xs text-espresso/60 font-mono">
              Live Customer Checkout Payment QR
            </span>
          </div>

          <form onSubmit={handleSavePaymentSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-espresso mb-1">Merchant Store Name *</label>
                <input
                  type="text"
                  required
                  value={paymentSettings.merchantName}
                  onChange={e => setPaymentSettings({ ...paymentSettings, merchantName: e.target.value })}
                  placeholder="Anita Gift House"
                  className="w-full px-4 py-2.5 bg-cream-muted border border-cream-border rounded-xl font-medium focus:ring-2 focus:ring-terracotta"
                />
              </div>

              <div>
                <label className="block font-bold text-espresso mb-1">Official Merchant UPI VPA ID *</label>
                <input
                  type="text"
                  required
                  value={paymentSettings.upiId}
                  onChange={e => setPaymentSettings({ ...paymentSettings, upiId: e.target.value })}
                  placeholder="9199272836@okbizaxis"
                  className="w-full px-4 py-2.5 bg-cream-muted border border-cream-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-terracotta"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-espresso mb-1">Payment QR Code Image URL / Upload *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={paymentSettings.qrImageUrl}
                  onChange={e => setPaymentSettings({ ...paymentSettings, qrImageUrl: e.target.value })}
                  placeholder="/upi-qr.png or https://res.cloudinary.com/..."
                  className="flex-1 px-4 py-2.5 bg-cream-muted border border-cream-border rounded-xl font-mono text-xs focus:ring-2 focus:ring-terracotta"
                />
                <label className="px-4 py-2.5 bg-cream-muted border border-cream-border text-espresso font-bold rounded-xl hover:bg-cream-border transition cursor-pointer flex items-center gap-1">
                  📁 Replace QR Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => {
                          if (ev.target?.result) {
                            setPaymentSettings({ ...paymentSettings, qrImageUrl: ev.target.result as string });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {paymentSettings.qrImageUrl && (
              <div className="p-3 bg-cream-muted border border-cream-border rounded-2xl flex items-center gap-4">
                <img
                  src={paymentSettings.qrImageUrl}
                  alt="UPI QR Code Preview"
                  className="w-20 h-20 object-contain rounded-xl bg-white border border-cream-border p-1 shadow-xs"
                />
                <div className="space-y-1">
                  <p className="font-bold text-espresso">Live Checkout QR Preview</p>
                  <p className="text-[11px] text-espresso/60 font-mono">UPI ID: {paymentSettings.upiId}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-terracotta text-cream font-bold rounded-xl hover:bg-crimson transition shadow"
              >
                Save Payment & QR Settings
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 2: ACTIVE COUPONS TABLE */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-espresso flex items-center gap-2">
            <Tag className="w-5 h-5 text-terracotta" />
            Active Coupon Offers & Item Scope
          </h2>

          <div className="bg-cream border border-cream-border rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cream-muted border-b border-cream-border text-espresso/70 font-bold uppercase tracking-wider">
                    <th className="p-4">Coupon Code</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Scope / Selected Items</th>
                    <th className="p-4">Min Order</th>
                    <th className="p-4">Used / Limit</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-border">
                  {coupons.map(coupon => {
                    const hasSelectedProducts = coupon.applicableProductIds && coupon.applicableProductIds.length > 0;
                    return (
                      <tr key={coupon.id} className="hover:bg-cream-muted/50 transition">
                        <td className="p-4 font-mono font-extrabold text-crimson text-sm">{coupon.code}</td>
                        <td className="p-4 font-bold text-espresso">
                          {coupon.discountType === 'percent' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                        </td>
                        <td className="p-4 font-semibold text-terracotta">
                          {hasSelectedProducts ? (
                            <span className="px-2.5 py-1 bg-terracotta/10 rounded-lg text-terracotta font-bold">
                              🎯 {coupon.applicableProductIds?.length} Selected Products
                            </span>
                          ) : (
                            coupon.applicableCategory || 'All Store Items'
                          )}
                        </td>
                        <td className="p-4 font-mono">₹{coupon.minCartValue}</td>
                        <td className="p-4 font-mono">{coupon.usageCount} / {coupon.usageLimit}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${coupon.active ? 'bg-emerald-100 text-emerald-800' : 'bg-crimson/15 text-crimson'}`}>
                            {coupon.active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setEditingCoupon(coupon);
                              setIsCouponModalOpen(true);
                            }}
                            className="px-3 py-1 bg-terracotta text-cream text-[10px] font-bold rounded-lg hover:bg-crimson transition"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT COUPON MODAL WITH ITEM PICKER */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-espresso/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-cream border border-cream-border rounded-3xl p-6 w-full max-w-xl space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-cream-border pb-3">
              <h3 className="font-serif font-bold text-lg text-espresso">
                {editingCoupon.id ? 'Edit Coupon Offer & Items' : 'Create Custom Coupon Offer'}
              </h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-espresso/60 hover:text-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-espresso mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={editingCoupon.code || ''}
                    onChange={e => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. RAKHI200"
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-mono uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-espresso mb-1">Discount Type *</label>
                  <select
                    value={editingCoupon.discountType || 'percent'}
                    onChange={e => setEditingCoupon({ ...editingCoupon, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-medium"
                  >
                    <option value="percent">Percentage (%) OFF</option>
                    <option value="flat">Flat Amount (₹) OFF</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-espresso mb-1">
                    Discount Value ({editingCoupon.discountType === 'percent' ? '%' : '₹'}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingCoupon.discountValue || 10}
                    onChange={e => setEditingCoupon({ ...editingCoupon, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-espresso mb-1">Min Order Value (₹) *</label>
                  <input
                    type="number"
                    value={editingCoupon.minCartValue || 0}
                    onChange={e => setEditingCoupon({ ...editingCoupon, minCartValue: Number(e.target.value) })}
                    placeholder="e.g. 499"
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Public Visibility Toggle */}
              <div className="p-3 bg-gold/10 border border-gold/30 rounded-2xl">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-espresso text-xs">
                  <input
                    type="checkbox"
                    checked={editingCoupon.isPublic !== false}
                    onChange={e => setEditingCoupon({ ...editingCoupon, isPublic: e.target.checked })}
                    className="rounded text-terracotta focus:ring-terracotta w-4 h-4"
                  />
                  <span>Show this Coupon Publicly in Customer Cart (1-Click Apply for Shoppers)</span>
                </label>
              </div>

              {/* APPLICABILITY SCOPE: ALL VS CATEGORY VS SPECIFIC SELECTED PRODUCTS */}
              <div className="p-4 bg-cream-muted rounded-2xl border border-cream-border space-y-3">
                <label className="font-bold text-espresso block flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-terracotta" /> Target Item Applicability Scope
                </label>
                
                <select
                  value={editingCoupon.applicableCategory || 'All'}
                  onChange={e => setEditingCoupon({ 
                    ...editingCoupon, 
                    applicableCategory: e.target.value as any,
                    applicableProductIds: e.target.value === 'SelectedProducts' ? (editingCoupon.applicableProductIds || []) : []
                  })}
                  className="w-full px-3 py-2 bg-cream border border-cream-border rounded-xl text-xs font-bold"
                >
                  <option value="All">All Storefront Items (Universal Coupon)</option>
                  <option value="SelectedProducts">Target Specific Selected Products</option>
                  <option value="Gifts">Gifts Category Only</option>
                  <option value="Rakhi">Rakhi Category Only</option>
                  <option value="Toys">Toys Category Only</option>
                  <option value="Handpicked">Handpicked Category Only</option>
                  <option value="Hampers">Hampers Category Only</option>
                </select>

                {/* PRODUCT SELECTION PICKER */}
                {editingCoupon.applicableCategory === 'SelectedProducts' && (
                  <div className="space-y-2 pt-2 border-t border-cream-border">
                    <input
                      type="text"
                      placeholder="Search items to select..."
                      value={productSearch}
                      onChange={e => setProductSearch(e.target.value)}
                      className="w-full px-3 py-1.5 bg-cream border border-cream-border rounded-xl text-xs"
                    />

                    <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-cream rounded-xl border border-cream-border">
                      {filteredProductsForCoupon.map(prod => {
                        const isSelected = (editingCoupon.applicableProductIds || []).includes(prod.id);
                        return (
                          <label key={prod.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-cream-muted cursor-pointer text-xs">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleProductIdSelection(prod.id)}
                              className="rounded text-terracotta focus:ring-terracotta"
                            />
                            <span className="font-bold text-espresso flex-1">{prod.title}</span>
                            <span className="font-mono text-terracotta">₹{prod.price}</span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-espresso/60 font-semibold">
                      Selected: {(editingCoupon.applicableProductIds || []).length} items
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-espresso mb-1">Usage Limit Count</label>
                  <input
                    type="number"
                    value={editingCoupon.usageLimit || 100}
                    onChange={e => setEditingCoupon({ ...editingCoupon, usageLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-espresso mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={editingCoupon.expiryDate || '2026-12-31'}
                    onChange={e => setEditingCoupon({ ...editingCoupon, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-espresso">
                  <input
                    type="checkbox"
                    checked={editingCoupon.active ?? true}
                    onChange={e => setEditingCoupon({ ...editingCoupon, active: e.target.checked })}
                    className="rounded text-terracotta focus:ring-terracotta w-4 h-4"
                  />
                  Enable Coupon Code Immediately
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 border border-cream-border rounded-xl text-espresso hover:bg-cream-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-terracotta text-cream font-bold rounded-xl hover:bg-crimson transition shadow"
                >
                  Save Offer Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
