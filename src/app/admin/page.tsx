'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Printer, 
  Sliders, 
  AlertTriangle, 
  Store, 
  DollarSign, 
  Eye, 
  EyeOff,
  Sparkles,
  Edit3,
  X,
  Check,
  Camera,
  Save,
  CreditCard,
  Trash2
} from 'lucide-react';
import { Product, Order, FinancialMetrics, Category, PaymentStatus } from '@/types';
import { Navbar } from '@/components/Navbar';
import { DynamicRecharts } from '@/components/DynamicRecharts';
import { CameraCaptureModal } from '@/components/CameraCaptureModal';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdmin, updateAdminPin } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders' | 'pos'>('analytics');
  
  // Password Change Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, router]);

  const handleChangeAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin !== confirmPin) {
      alert('New password and confirmation do not match.');
      return;
    }

    const result = updateAdminPin(currentPin, newPin);
    if (result.success) {
      alert(result.message);
      setIsPasswordModalOpen(false);
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    } else {
      alert(result.message);
    }
  };
  
  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Camera Capture Modal State
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Product Form Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Proof Preview Modal State
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);

  // Order Payment & Amount Paid Edit Modal State
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editStatus, setEditStatus] = useState<PaymentStatus>('VERIFIED');
  const [editAmountPaid, setEditAmountPaid] = useState<number>(0);
  const [editAdminNotes, setEditAdminNotes] = useState<string>('');

  // Order Filtering, Multi-Metric Sorting & Search State
  const [orderFilterTab, setOrderFilterTab] = useState<'all' | 'action_required' | 'verified' | 'pay_at_pickup' | 'cancelled'>('all');
  const [orderSortBy, setOrderSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc' | 'profit_desc' | 'profit_asc'>('date_desc');
  const [orderDateFilter, setOrderDateFilter] = useState<'all' | 'today' | '7days' | 'month'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  const calculateOrderProfit = (order: Order): number => {
    const itemCost = (order.items || []).reduce((sum, item) => {
      const cp = item.product?.costPrice || 0;
      return sum + (cp * item.quantity);
    }, 0);
    const collected = order.amountPaid !== undefined && order.amountPaid > 0 ? order.amountPaid : order.total;
    return collected - itemCost;
  };

  // POS Walk-In Form State
  const [posProductId, setPosProductId] = useState('');
  const [posQty, setPosQty] = useState(1);
  const [posCustomerName, setPosCustomerName] = useState('Walk-In Customer');
  const [posCustomerPhone, setPosCustomerPhone] = useState('+91 99999 00000');

  const handleAdminCancelOrder = async (orderId: string) => {
    if (!confirm(`Are you sure you want to cancel order ${orderId}? Item stock will be restored immediately.`)) return;
    try {
      const res = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action: 'cancel' })
      });
      const json = await res.json();
      if (json.success) {
        alert('Order cancelled and stock restored successfully.');
        refreshAdminData();
      } else {
        alert(json.message || 'Failed to cancel order.');
      }
    } catch {
      alert('Error cancelling order.');
    }
  };

  const handleAdminDeleteOrder = async (orderId: string) => {
    if (!confirm(`CAUTION: Permanently delete order ${orderId}? This action cannot be undone.`)) return;
    try {
      const res = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action: 'delete' })
      });
      const json = await res.json();
      if (json.success) {
        alert('Order permanently deleted.');
        refreshAdminData();
      } else {
        alert(json.message || 'Failed to delete order.');
      }
    } catch {
      alert('Error deleting order.');
    }
  };

  const handleAdminDeleteProduct = async (productId: string) => {
    if (!confirm(`CAUTION: Are you sure you want to permanently delete product ${productId}?`)) return;
    try {
      setProducts(prev => prev.filter(p => p.id !== productId));

      const res = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        alert('Product deleted successfully.');
      } else {
        alert(json.message || 'Failed to delete product.');
        refreshAdminData();
      }
    } catch {
      alert('Error deleting product.');
      refreshAdminData();
    }
  };

  const handlePurgeAllOrders = async () => {
    if (!confirm('CAUTION: Are you sure you want to purge ALL sales orders and reset revenue data to ₹0?')) return;
    try {
      const res = await fetch('/api/analytics/financials', {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        alert('All order sales and revenue data purged cleanly.');
        refreshAdminData();
      } else {
        alert(json.message || 'Failed to purge orders.');
      }
    } catch {
      alert('Error purging orders.');
    }
  };

  const handlePurgeAllProducts = async () => {
    if (!confirm('CAUTION: Are you sure you want to delete ALL catalog products and start fresh?')) return;
    try {
      setProducts([]);

      const res = await fetch('/api/products?id=all', {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        alert('All catalog products purged successfully.');
      } else {
        alert(json.message || 'Failed to purge products.');
        refreshAdminData();
      }
    } catch {
      alert('Error purging products.');
      refreshAdminData();
    }
  };

  const refreshAdminData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes, finRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders/create?all=true'),
        fetch('/api/analytics/financials')
      ]);

      const prodJson = await prodRes.json();
      const finJson = await finRes.json();
      const ordJson = await ordRes.json();

      if (prodJson.success) setProducts(prodJson.data);
      if (finJson.success) setMetrics(finJson.data);
      if (ordJson.success) setOrders(ordJson.data);
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAdminData();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || !editingProduct?.price) {
      alert('Please enter product title and selling price');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      const json = await res.json();
      if (json.success) {
        setIsProductModalOpen(false);
        setEditingProduct(null);
        alert('Product saved!');
        refreshAdminData();
      }
    } catch {
      alert('Error saving product');
    }
  };

  const handleSaveOrderPaymentAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      const res = await fetch('/api/orders/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: editingOrder.id,
          status: editStatus,
          amountPaid: editAmountPaid,
          adminNotes: editAdminNotes,
          approve: editStatus === 'VERIFIED'
        })
      });
      const json = await res.json();
      if (json.success) {
        setEditingOrder(null);
        alert(`Order #${editingOrder.id} payment updated to ${editStatus}. Collected amount: ₹${editAmountPaid}`);
        refreshAdminData();
      }
    } catch {
      alert('Error updating order payment');
    }
  };

  const handleGenerateShipment = async (orderId: string) => {
    try {
      const res = await fetch('/api/shipping/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode: '110001', orderId })
      });
      const json = await res.json();
      if (json.success) {
        alert(`Assigned Parcel Tracking Number: ${json.data.awbNumber}`);
        refreshAdminData();
      }
    } catch {
      alert('Failed to generate shipment');
    }
  };

  const handleCreatePosOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === posProductId);
    if (!prod) {
      alert('Please select a product for the POS order');
      return;
    }

    try {
      const subtotal = prod.price * posQty;
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: posCustomerName,
          customerPhone: posCustomerPhone,
          fulfillmentType: 'handpicked',
          paymentMethod: 'pay_at_pickup',
          items: [{ product: prod, quantity: posQty }],
          subtotal,
          shippingFee: 0,
          discount: 0,
          total: subtotal
        })
      });
      const json = await res.json();
      if (json.success) {
        alert(`POS Walk-In Order #${json.data.id} created! Stock updated.`);
        setPosProductId('');
        setPosQty(1);
        refreshAdminData();
      }
    } catch {
      alert('Error creating POS order');
    }
  };

  return (
    <div className="min-h-screen bg-cream text-espresso font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-border pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-espresso">
              Admin Control Center
            </h1>
            <p className="text-xs text-espresso/60">
              Financial Accounting Ledger, Customizable Order Payments & Photo Upload Management
            </p>
          </div>

          <div className="flex items-center gap-2 bg-cream-muted p-1 rounded-2xl border border-cream-border text-xs font-bold flex-wrap">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl transition ${
                activeTab === 'analytics' ? 'bg-terracotta text-cream shadow-sm' : 'text-espresso/70 hover:text-espresso'
              }`}
            >
              📊 Profit Analytics
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-xl transition ${
                activeTab === 'inventory' ? 'bg-terracotta text-cream shadow-sm' : 'text-espresso/70 hover:text-espresso'
              }`}
            >
              📦 Products & Photos
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl transition ${
                activeTab === 'orders' ? 'bg-terracotta text-cream shadow-sm' : 'text-espresso/70 hover:text-espresso'
              }`}
            >
              🧾 Payment Queue & Discounts
            </button>
            <button
              onClick={() => setActiveTab('pos')}
              className={`px-4 py-2 rounded-xl transition ${
                activeTab === 'pos' ? 'bg-crimson text-cream shadow-sm' : 'text-espresso/70 hover:text-espresso'
              }`}
            >
              🏪 Walk-In POS Order
            </button>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gold/20 text-espresso font-bold border border-gold/40 hover:bg-gold transition flex items-center gap-1"
            >
              🔐 Change Password
            </button>
            <button
              onClick={handlePurgeAllOrders}
              className="px-3.5 py-2 rounded-xl bg-crimson/10 text-crimson font-bold border border-crimson/20 hover:bg-crimson hover:text-cream transition flex items-center gap-1"
              title="Purge test sales orders and reset revenue metrics to ₹0"
            >
              🧹 Reset Sales Data (₹0)
            </button>
          </div>
        </div>

        {/* TAB 1: DATA ANALYTICS & PROFIT DASHBOARD */}
        {activeTab === 'analytics' && metrics && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-cream border border-cream-border rounded-3xl p-6 shadow-sm space-y-2">
                <span className="text-xs font-bold text-espresso/60 uppercase tracking-wider">Total Revenue</span>
                <p className="text-3xl font-serif font-extrabold text-crimson font-mono">
                  ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold">100% Verified Payments & Custom Amounts</p>
              </div>

              <div className="bg-cream border border-cream-border rounded-3xl p-6 shadow-sm space-y-2">
                <span className="text-xs font-bold text-espresso/60 uppercase tracking-wider">Total Product Cost (CP)</span>
                <p className="text-3xl font-serif font-extrabold text-espresso font-mono">
                  ₹{metrics.totalCost.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-espresso/60 font-medium">Aggregated Item Acquisition</p>
              </div>

              <div className="bg-cream border border-cream-border rounded-3xl p-6 shadow-sm space-y-2">
                <span className="text-xs font-bold text-espresso/60 uppercase tracking-wider">Shop Overheads</span>
                <p className="text-3xl font-serif font-extrabold text-terracotta font-mono">
                  ₹{metrics.totalOverheads.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-espresso/60 font-medium">Packaging & Utilities</p>
              </div>

              <div className="bg-cream border-2 border-gold/40 bg-gradient-to-br from-cream to-gold/10 rounded-3xl p-6 shadow-md space-y-2">
                <span className="text-xs font-bold text-espresso uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-gold-dark" /> True Net Profit
                </span>
                <p className="text-3xl font-serif font-extrabold text-emerald-800 font-mono">
                  ₹{metrics.netProfit.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-emerald-800 font-semibold">
                  Net Margin: {metrics.totalRevenue > 0 ? Math.round((metrics.netProfit / metrics.totalRevenue) * 100) : 0}%
                </p>
              </div>
            </div>

            {/* Recharts Analytics Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-cream border border-cream-border rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-serif font-bold text-espresso flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-terracotta" />
                  Daily Revenue vs Net Profit Over Time
                </h3>
                <DynamicRecharts metrics={metrics} type="line" />
              </div>

              <div className="bg-cream border border-cream-border rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-serif font-bold text-espresso flex items-center gap-2">
                  <Package className="w-5 h-5 text-gold-dark" />
                  Category Revenue Split
                </h3>
                <DynamicRecharts metrics={metrics} type="pie" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY & PHOTO MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xl font-serif font-bold text-espresso">
                Catalogue Inventory & Photo Management
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePurgeAllProducts}
                  className="flex items-center gap-1.5 px-3 py-2 bg-crimson/10 border border-crimson/20 text-crimson text-xs font-bold rounded-xl hover:bg-crimson hover:text-cream transition shadow-xs"
                >
                  <Trash2 className="w-4 h-4" /> Purge All Products
                </button>
                <button
                  onClick={() => {
                    setEditingProduct({
                      title: '',
                      category: 'Gifts',
                      costPrice: 500,
                      mrp: 1499,
                      price: 999,
                      stock: 10,
                      priorityScore: 50,
                      urgencyFlag: false,
                      isHandpickedFeatured: false,
                      images: []
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-terracotta text-cream text-xs font-bold rounded-xl shadow hover:bg-crimson transition"
                >
                  <Plus className="w-4 h-4" /> Add Product (With Photo Snap)
                </button>
              </div>
            </div>

            {/* Inventory Table with Clickable Photos */}
            <div className="bg-cream border border-cream-border rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-cream-muted border-b border-cream-border text-espresso/70 font-bold uppercase tracking-wider">
                      <th className="p-4">Product Details & Photo</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">CP / MRP / SP</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Priority Rank</th>
                      <th className="p-4 text-right">Product Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-border">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-cream-muted/50 transition">
                        <td className="p-4">
                          <div 
                            onClick={() => {
                              setEditingProduct(product);
                              setIsProductModalOpen(true);
                            }}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-cream-muted border border-cream-border overflow-hidden shrink-0 flex items-center justify-center font-serif font-bold text-xs text-terracotta group-hover:scale-105 transition shadow-xs">
                              {product.images && product.images[0] ? (
                                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                product.category.substring(0, 2)
                              )}
                            </div>
                            <div>
                              <span className="font-serif font-bold text-espresso block group-hover:text-terracotta transition">{product.title}</span>
                              <span className="text-[10px] text-espresso/50 font-mono">Click photo to edit</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-terracotta">{product.category}</td>
                        <td className="p-4 font-mono">
                          <div className="text-crimson font-bold">SP: ₹{product.price}</div>
                          <div className="text-espresso/50 text-[10px]">CP: ₹{product.costPrice} | MRP: ₹{product.mrp}</div>
                        </td>
                        <td className="p-4 font-mono font-bold text-espresso">{product.stock}</td>
                        <td className="p-4 font-mono">
                          <span className="px-2.5 py-1 bg-terracotta/10 text-terracotta font-bold rounded-lg">
                            {product.priorityScore} / 100
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setIsProductModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-terracotta text-cream font-bold text-xs rounded-xl hover:bg-crimson transition inline-flex items-center gap-1 shadow-xs"
                              title="Edit product details & pricing"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setIsProductModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-cream-muted border border-cream-border text-espresso font-bold text-xs rounded-xl hover:bg-cream-border transition inline-flex items-center gap-1 shadow-xs"
                              title="Upload or camera snap photos"
                            >
                              <Camera className="w-3.5 h-3.5 text-gold-dark" /> Photos
                            </button>
                            <button
                              onClick={() => handleAdminDeleteProduct(product.id)}
                              className="px-2.5 py-1.5 bg-crimson/10 border border-crimson/20 text-crimson font-bold text-xs rounded-xl hover:bg-crimson hover:text-cream transition inline-flex items-center gap-1 shadow-xs"
                              title="Permanently remove product"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MASTER ORDER LEDGER & FINANCIAL CONTROL */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cream-border pb-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-espresso flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-terracotta" />
                  Master Order Ledger & Payment Control
                </h2>
                <p className="text-xs text-espresso/60 mt-0.5">
                  Filter by Date, Amount, or Profitability. Confirm UPI proofs, manage Pay at Pickup bookings, and adjust financials.
                </p>
              </div>

              {/* Order Summary Metric Badges */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="px-3 py-1.5 bg-cream-muted border border-cream-border rounded-xl">
                  <span className="text-espresso/60 block text-[10px]">Total Orders:</span>
                  <span className="font-bold text-espresso">{orders.length}</span>
                </div>
                <div className="px-3 py-1.5 bg-emerald-100/60 border border-emerald-300 rounded-xl">
                  <span className="text-emerald-900/70 block text-[10px]">Total Profit:</span>
                  <span className="font-bold text-emerald-800">
                    ₹{orders
                      .filter(o => o.paymentStatus === 'VERIFIED' || o.paymentStatus === 'PAY_AT_PICKUP')
                      .reduce((sum, o) => sum + calculateOrderProfit(o), 0)
                      .toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* MULTI-METRIC FILTER & SORT TOOLBAR */}
            <div className="bg-cream border border-cream-border p-4 rounded-2xl shadow-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {/* 1. Search Box */}
                <div>
                  <label className="block font-bold text-espresso mb-1">Search Orders</label>
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={e => setOrderSearchQuery(e.target.value)}
                    placeholder="Search Order ID, Name, Phone..."
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-medium focus:ring-2 focus:ring-terracotta"
                  />
                </div>

                {/* 2. Date Range Filter */}
                <div>
                  <label className="block font-bold text-espresso mb-1">📅 Date Filter</label>
                  <select
                    value={orderDateFilter}
                    onChange={e => setOrderDateFilter(e.target.value as any)}
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-semibold"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today Only</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                {/* 3. Multi-Metric Sort Dropdown */}
                <div>
                  <label className="block font-bold text-espresso mb-1">📊 Sort Orders By</label>
                  <select
                    value={orderSortBy}
                    onChange={e => setOrderSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-bold text-terracotta"
                  >
                    <option value="date_desc">📅 Date: Newest First</option>
                    <option value="date_asc">📅 Date: Oldest First</option>
                    <option value="amount_desc">💰 Amount: Highest Total Bill</option>
                    <option value="amount_asc">💰 Amount: Lowest Total Bill</option>
                    <option value="profit_desc">📈 Profit: Highest Net Profit</option>
                    <option value="profit_asc">📈 Profit: Lowest Net Profit</option>
                  </select>
                </div>

                {/* 4. Status Filter Tabs */}
                <div>
                  <label className="block font-bold text-espresso mb-1">Payment Status Filter</label>
                  <select
                    value={orderFilterTab}
                    onChange={e => setOrderFilterTab(e.target.value as any)}
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-semibold"
                  >
                    <option value="all">All Statuses ({orders.length})</option>
                    <option value="action_required">Action Required ({orders.filter(o => o.paymentStatus !== 'VERIFIED' && o.paymentStatus !== 'CANCELLED').length})</option>
                    <option value="verified">Verified ({orders.filter(o => o.paymentStatus === 'VERIFIED').length})</option>
                    <option value="pay_at_pickup">Pay at Pickup ({orders.filter(o => o.paymentStatus === 'PAY_AT_PICKUP').length})</option>
                    <option value="cancelled">Cancelled ({orders.filter(o => o.paymentStatus === 'CANCELLED').length})</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-cream border border-cream-border rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-cream-muted border-b border-cream-border text-espresso/70 font-bold uppercase tracking-wider">
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Customer Info</th>
                      <th className="p-4">Purchased Items</th>
                      <th className="p-4">Bill Total / Collected</th>
                      <th className="p-4">Calculated Profit</th>
                      <th className="p-4">Payment Status</th>
                      <th className="p-4 text-right">Financial Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-border">
                    {orders
                      .filter(order => {
                        // 1. Status Filter
                        if (orderFilterTab === 'action_required') {
                          if (order.paymentStatus === 'VERIFIED' || order.paymentStatus === 'CANCELLED') return false;
                        } else if (orderFilterTab === 'verified') {
                          if (order.paymentStatus !== 'VERIFIED') return false;
                        } else if (orderFilterTab === 'pay_at_pickup') {
                          if (order.paymentStatus !== 'PAY_AT_PICKUP') return false;
                        } else if (orderFilterTab === 'cancelled') {
                          if (order.paymentStatus !== 'CANCELLED') return false;
                        }

                        // 2. Date Filter
                        const orderDate = new Date(order.createdAt);
                        const now = new Date();
                        if (orderDateFilter === 'today') {
                          if (orderDate.toDateString() !== now.toDateString()) return false;
                        } else if (orderDateFilter === '7days') {
                          const diffTime = Math.abs(now.getTime() - orderDate.getTime());
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          if (diffDays > 7) return false;
                        } else if (orderDateFilter === 'month') {
                          if (orderDate.getMonth() !== now.getMonth() || orderDate.getFullYear() !== now.getFullYear()) return false;
                        }

                        // 3. Search Query
                        if (orderSearchQuery) {
                          const q = orderSearchQuery.toLowerCase();
                          const matchId = order.id.toLowerCase().includes(q);
                          const matchName = order.customerName.toLowerCase().includes(q);
                          const matchPhone = order.customerPhone.toLowerCase().includes(q);
                          const matchItems = (order.items || []).some(i => i.product.title.toLowerCase().includes(q));
                          if (!matchId && !matchName && !matchPhone && !matchItems) return false;
                        }

                        return true;
                      })
                      .sort((a, b) => {
                        if (orderSortBy === 'date_desc') {
                          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        }
                        if (orderSortBy === 'date_asc') {
                          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                        }
                        if (orderSortBy === 'amount_desc') {
                          return (b.amountPaid || b.total) - (a.amountPaid || a.total);
                        }
                        if (orderSortBy === 'amount_asc') {
                          return (a.amountPaid || a.total) - (b.amountPaid || b.total);
                        }
                        if (orderSortBy === 'profit_desc') {
                          return calculateOrderProfit(b) - calculateOrderProfit(a);
                        }
                        if (orderSortBy === 'profit_asc') {
                          return calculateOrderProfit(a) - calculateOrderProfit(b);
                        }
                        return 0;
                      })
                      .map(order => {
                        const amountPaid = order.amountPaid !== undefined ? order.amountPaid : order.total;
                        const orderProfit = calculateOrderProfit(order);
                        const marginPercent = amountPaid > 0 ? Math.round((orderProfit / amountPaid) * 100) : 0;
                        const hasAdminDiscount = order.adminDiscountAdjustment && order.adminDiscountAdjustment > 0;

                        return (
                          <tr key={order.id} className="hover:bg-cream-muted/50 transition">
                            <td className="p-4">
                              <span className="font-mono font-bold text-crimson text-sm block">{order.id}</span>
                              <span className="text-[10px] text-espresso/50">{new Date(order.createdAt).toLocaleString()}</span>
                              {order.adminNotes && (
                                <span className="text-[10px] font-bold text-amberGold block mt-1">
                                  Note: {order.adminNotes}
                                </span>
                              )}
                            </td>

                            <td className="p-4">
                              <div className="font-bold text-espresso">{order.customerName}</div>
                              <div className="text-[10px] text-espresso/60 font-mono">{order.customerPhone}</div>
                              <span className="text-[10px] text-terracotta capitalize font-semibold block mt-0.5">
                                {order.fulfillmentType === 'handpicked' ? 'Store Pickup' : 'Parcel Delivery'}
                              </span>
                            </td>

                            <td className="p-4">
                              <div className="space-y-1">
                                {(order.items || []).map((item, idx) => (
                                  <div key={idx} className="text-espresso text-[11px]">
                                    • {item.product.title} <span className="font-mono font-bold text-terracotta">x{item.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </td>

                            <td className="p-4 font-mono">
                              <div className="font-bold text-espresso">Bill: ₹{order.total}</div>
                              <div className="text-emerald-800 font-extrabold">Collected: ₹{amountPaid}</div>
                              {hasAdminDiscount && (
                                <span className="text-[10px] font-bold text-crimson block">
                                  Discounted ₹{order.adminDiscountAdjustment}
                                </span>
                              )}
                            </td>

                            {/* CALCULATED PROFIT COLUMN */}
                            <td className="p-4 font-mono">
                              <div className="font-extrabold text-emerald-800 text-sm">₹{orderProfit}</div>
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                marginPercent >= 40 ? 'bg-emerald-100 text-emerald-800' : 'bg-gold/20 text-espresso'
                              }`}>
                                {marginPercent}% Margin
                              </span>
                            </td>

                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                order.paymentStatus === 'VERIFIED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.paymentStatus === 'PARTIALLY_PAID'
                                  ? 'bg-amberGold/30 text-espresso'
                                  : order.paymentStatus === 'PAY_AT_PICKUP'
                                  ? 'bg-crimson/15 text-crimson'
                                  : order.paymentStatus === 'CANCELLED'
                                  ? 'bg-crimson text-cream'
                                  : 'bg-cream-border text-espresso/60'
                              }`}>
                                {order.paymentStatus}
                              </span>
                            </td>

                            <td className="p-4 text-right space-x-1.5">
                              <button
                                onClick={() => {
                                  setEditingOrder(order);
                                  setEditStatus(order.paymentStatus);
                                  setEditAmountPaid(order.amountPaid !== undefined ? order.amountPaid : order.total);
                                  setEditAdminNotes(order.adminNotes || '');
                                }}
                                className="px-2.5 py-1.5 bg-terracotta text-cream text-[11px] font-bold rounded-lg hover:bg-crimson transition inline-flex items-center gap-1 shadow-xs"
                                title="Edit Financials & Confirm Payment"
                              >
                                <CreditCard className="w-3.5 h-3.5 text-gold" /> Financials
                              </button>

                              <Link
                                href={`/invoice/${order.id}`}
                                target="_blank"
                                className="p-1.5 text-espresso/70 hover:text-espresso inline-block border border-cream-border rounded-lg"
                                title="Print Invoice PDF"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </Link>

                              {order.paymentStatus !== 'CANCELLED' && (
                                <button
                                  onClick={() => handleAdminCancelOrder(order.id)}
                                  className="px-2 py-1.5 bg-crimson/10 text-crimson hover:bg-crimson hover:text-cream text-[11px] font-bold rounded-lg transition inline-flex items-center gap-1 border border-crimson/20"
                                  title="Cancel Order & Restore Inventory Stock"
                                >
                                  <XCircle className="w-3.5 h-3.5" /> Cancel
                                </button>
                              )}

                              <button
                                onClick={() => handleAdminDeleteOrder(order.id)}
                                className="p-1.5 text-crimson/70 hover:text-crimson inline-block border border-crimson/20 rounded-lg hover:bg-crimson/10"
                                title="Permanently Delete Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
        )}



        {/* TAB 4: MANUAL OFFLINE POS ORDER CREATOR */}
        {activeTab === 'pos' && (
          <div className="max-w-xl mx-auto bg-cream border border-cream-border rounded-3xl p-8 shadow-sm space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-serif font-bold text-espresso flex items-center gap-2">
                <Store className="w-5 h-5 text-crimson" />
                Manual Offline Store POS Order Creator
              </h2>
              <p className="text-xs text-espresso/60 mt-1">
                Record walk-in sales to sync financial accounting & live inventory stock in real time.
              </p>
            </div>

            <form onSubmit={handleCreatePosOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-espresso mb-1">Select Catalogue Item *</label>
                <select
                  required
                  value={posProductId}
                  onChange={e => setPosProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-medium focus:ring-2 focus:ring-terracotta"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} (Stock: {p.stock}) - ₹{p.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-espresso mb-1">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  value={posQty}
                  onChange={e => setPosQty(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-mono focus:ring-2 focus:ring-terracotta"
                />
              </div>

              <div>
                <label className="block font-bold text-espresso mb-1">Walk-In Customer Name</label>
                <input
                  type="text"
                  value={posCustomerName}
                  onChange={e => setPosCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-espresso mb-1">Customer Phone</label>
                <input
                  type="tel"
                  value={posCustomerPhone}
                  onChange={e => setPosCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-crimson text-cream font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-crimson-dark transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-gold" />
                Record Walk-In Sale & Deduct Stock
              </button>
            </form>
          </div>
        )}
      </main>

      {/* EDIT ORDER FINANCIALS & PAYMENT STATUS MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-espresso/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-cream border border-cream-border rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-cream-border pb-3">
              <h3 className="font-serif font-bold text-lg text-espresso">
                Edit Order Financials: #{editingOrder.id}
              </h3>
              <button onClick={() => setEditingOrder(null)} className="text-espresso/60 hover:text-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrderPaymentAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-espresso mb-1">Payment Status *</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as PaymentStatus)}
                  className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-bold"
                >
                  <option value="VERIFIED">VERIFIED (100% Paid)</option>
                  <option value="PAY_AT_PICKUP">PAY_AT_PICKUP (Store Collect)</option>
                  <option value="PARTIALLY_PAID">PARTIALLY_PAID (Custom Amount)</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="CANCELLED">CANCELLED (Restore Stock)</option>
                </select>
              </div>

              <div className="p-3 bg-cream-muted border border-cream-border rounded-2xl space-y-2">
                <div className="flex justify-between font-mono text-espresso">
                  <span>Original Bill Total:</span>
                  <span className="font-bold">₹{editingOrder.total}</span>
                </div>

                <div>
                  <label className="block font-bold text-espresso mb-1">Actual Amount Collected (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editAmountPaid}
                    onChange={e => setEditAmountPaid(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-cream border border-terracotta rounded-xl font-mono font-extrabold text-crimson text-sm"
                  />
                  <p className="text-[10px] text-espresso/60 mt-1">
                    e.g., If original bill is ₹895 and customer paid ₹880 asking for a discount, enter 880.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-espresso mb-1">Admin Accounting Notes</label>
                <input
                  type="text"
                  value={editAdminNotes}
                  onChange={e => setEditAdminNotes(e.target.value)}
                  placeholder="e.g. ₹15 walk-in discount given per customer request"
                  className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 border border-cream-border rounded-xl text-espresso hover:bg-cream-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-terracotta text-cream font-bold rounded-xl hover:bg-crimson transition shadow"
                >
                  Save Financials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT EDIT / ADD MODAL WITH CAMERA SNAP & MULTI FILE SELECTOR */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-espresso/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-cream border border-cream-border rounded-3xl p-6 w-full max-w-xl space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-cream-border pb-3">
              <h3 className="font-serif font-bold text-lg text-espresso">
                {editingProduct.id ? 'Edit Product Merchandising & Photos' : 'Add New Catalogue Item'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-espresso/60 hover:text-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-espresso mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-espresso mb-1">Category *</label>
                  <select
                    value={editingProduct.category || 'Gifts'}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as Category })}
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-medium"
                  >
                    <option value="Gifts">Gifts</option>
                    <option value="Rakhi">Rakhi</option>
                    <option value="Toys">Toys</option>
                    <option value="Handpicked">Handpicked</option>
                    <option value="Hampers">Hampers</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-espresso mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    value={editingProduct.stock ?? 10}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              {/* CP, MRP, SP */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-cream-muted rounded-2xl border border-cream-border">
                <div>
                  <label className="block font-bold text-espresso mb-1">Cost Price (CP) ₹ *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.costPrice ?? 0}
                    onChange={e => setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-cream border border-cream-border rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-espresso mb-1">Max Price (MRP) ₹</label>
                  <input
                    type="number"
                    value={editingProduct.mrp ?? 0}
                    onChange={e => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-cream border border-cream-border rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-crimson mb-1">Selling Price (SP) ₹ *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price ?? 0}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-cream border border-terracotta rounded-lg font-mono font-bold text-crimson text-xs"
                  />
                </div>
              </div>

              {/* Media Upload & Camera Snap Trigger */}
              <div className="space-y-2 p-3 bg-cream-muted rounded-2xl border border-cream-border">
                <label className="block font-bold text-espresso">Product Photos (Camera Snap or Multi-File Upload)</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-crimson text-cream rounded-xl text-xs font-bold hover:bg-crimson-dark transition shadow"
                  >
                    <Camera className="w-4 h-4 text-gold" /> Snap Camera Photo
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => {
                          const result = ev.target?.result as string;
                          if (result) {
                            setEditingProduct(prev => ({
                              ...prev!,
                              images: [result, ...(prev?.images || [])]
                            }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-espresso/70 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cream file:text-espresso"
                  />
                </div>

                {/* Photo Thumbnails */}
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 overflow-x-auto">
                    {editingProduct.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-cream-border shrink-0">
                        <img src={img} alt="Photo" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setEditingProduct(prev => ({
                            ...prev!,
                            images: prev?.images?.filter((_, i) => i !== idx)
                          }))}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-crimson text-cream rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Priority Rank Slider */}
              <div className="p-4 bg-terracotta/10 border border-terracotta/20 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-terracotta flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" /> Admin Merchandising Priority Score (1 - 100)
                  </label>
                  <span className="font-mono font-extrabold text-sm text-crimson bg-cream px-2 py-0.5 rounded border border-terracotta/30">
                    {editingProduct.priorityScore ?? 50}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={editingProduct.priorityScore ?? 50}
                  onChange={e => setEditingProduct({ ...editingProduct, priorityScore: Number(e.target.value) })}
                  className="w-full accent-terracotta cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-cream-border rounded-xl text-espresso hover:bg-cream-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-terracotta text-cream font-bold rounded-xl hover:bg-crimson transition shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CAMERA SNAP MODAL */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => {
          if (editingProduct) {
            setEditingProduct(prev => ({
              ...prev!,
              images: [dataUrl, ...(prev?.images || [])]
            }));
          }
        }}
      />

      {/* CHANGE ADMIN PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-espresso/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-cream border border-cream-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-cream-border pb-3">
              <h3 className="text-lg font-serif font-bold text-espresso flex items-center gap-2">
                🔐 Update Admin Passcode
              </h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-espresso/60 hover:text-espresso font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleChangeAdminPassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-espresso mb-1">Current Password / PIN *</label>
                <div className="relative">
                  <input
                    type={showCurrentPin ? 'text' : 'password'}
                    required
                    value={currentPin}
                    onChange={e => setCurrentPin(e.target.value)}
                    placeholder="Enter current PIN (e.g. 9199)"
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-mono text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPin(!showCurrentPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/60 hover:text-espresso"
                  >
                    {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-espresso mb-1">New Secret Password / PIN *</label>
                <div className="relative">
                  <input
                    type={showNewPin ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={newPin}
                    onChange={e => setNewPin(e.target.value)}
                    placeholder="Enter new secret password"
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-mono text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPin(!showNewPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/60 hover:text-espresso"
                  >
                    {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-espresso mb-1">Confirm New Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPin ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value)}
                    placeholder="Re-enter new secret password"
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-mono text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/60 hover:text-espresso"
                  >
                    {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 border border-cream-border rounded-xl text-espresso hover:bg-cream-muted font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-terracotta text-cream font-bold rounded-xl hover:bg-crimson transition shadow"
                >
                  Update Admin Passcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
