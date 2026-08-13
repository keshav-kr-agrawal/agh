import { Product, Order, FinancialMetrics, Coupon, StoreBanner, MonthlyFinancialSummary, Category, OverheadExpense, PaymentStatus, PaymentSettings } from '@/types';
import { supabase, supabaseRealtime } from './supabase';
import fs from 'fs';
import path from 'path';

// Initial Seed Products (Clean slate - no dummy data)
const initialProducts: Product[] = [];

// Initial Seed Overheads
const initialOverheads: OverheadExpense[] = [];

// Initial Seed Coupons
const initialCoupons: Coupon[] = [];

// Initial Banner
const initialBanner: StoreBanner = {
  id: 'b-1',
  text: '🎉 Welcome to Anita Gift House! Explore our handpicked festive gifts and artisanal hampers.',
  active: true,
  bgGradient: 'from-crimson via-terracotta to-crimson'
};

const BANNER_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'banner.json');

function loadPersistedBanner(): StoreBanner {
  try {
    if (typeof window === 'undefined' && fs.existsSync(BANNER_FILE_PATH)) {
      const raw = fs.readFileSync(BANNER_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.text) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load persisted banner:', err);
  }
  return initialBanner;
}

function savePersistedBanner(banner: StoreBanner) {
  try {
    if (typeof window === 'undefined') {
      const dir = path.dirname(BANNER_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(BANNER_FILE_PATH, JSON.stringify(banner, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Failed to save persisted banner:', err);
  }
}

// Initial Orders
const initialOrders: Order[] = [];

const initialPaymentSettings: PaymentSettings = {
  upiId: '9199272836@okbizaxis',
  qrImageUrl: '/upi-qr.png',
  merchantName: 'Anita Gift House'
};

class DataStore {
  private products: Product[] = [...initialProducts];
  private orders: Order[] = [...initialOrders];
  private coupons: Coupon[] = [...initialCoupons];
  private overheads: OverheadExpense[] = [...initialOverheads];
  private banner: StoreBanner = loadPersistedBanner();
  private paymentSettings: PaymentSettings = { ...initialPaymentSettings };
  private monthlySummaries: MonthlyFinancialSummary[] = [];

  public getProducts(filters?: {
    category?: string;
    search?: string;
    fulfillmentType?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
  }): Product[] {
    let result = [...this.products];

    if (filters?.category && filters.category !== 'All' && filters.category !== 'Special Offers') {
      result = result.filter(p => p.category === filters.category);
    } else if (filters?.category === 'Special Offers') {
      result = result.filter(p => p.urgencyFlag || p.stock <= 5);
    }

    if (filters?.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.keywords.some(k => k.toLowerCase().includes(query)) ||
          p.category.toLowerCase().includes(query)
      );
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters?.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    result.sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      const aUrgent = a.urgencyFlag || a.stock <= 5 ? 1 : 0;
      const bUrgent = b.urgencyFlag || b.stock <= 5 ? 1 : 0;
      if (bUrgent !== aUrgent) {
        return bUrgent - aUrgent;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  public upsertProduct(product: Partial<Product> & { id?: string }): Product {
    if (product.id) {
      const index = this.products.findIndex(p => p.id === product.id);
      if (index !== -1) {
        const updated = { ...this.products[index], ...product };
        this.products[index] = updated;
        
        supabaseRealtime.notify({
          eventType: 'UPDATE',
          table: 'products',
          newRecord: updated
        });

        return updated;
      }
    }

    const newProd: Product = {
      id: product.id || `prod-${Date.now()}`,
      title: product.title || 'Untitled Product',
      description: product.description || '',
      category: product.category || 'Gifts',
      keywords: product.keywords || [],
      costPrice: product.costPrice || 0,
      mrp: product.mrp || 0,
      price: product.price || 0,
      stock: product.stock !== undefined ? product.stock : 10,
      priorityScore: product.priorityScore !== undefined ? product.priorityScore : 50,
      urgencyFlag: product.urgencyFlag || false,
      isHandpickedFeatured: product.isHandpickedFeatured || false,
      images: product.images || [],
      specs: product.specs || {},
      occasion: product.occasion || 'General',
      createdAt: new Date().toISOString()
    };

    this.products.unshift(newProd);

    supabaseRealtime.notify({
      eventType: 'INSERT',
      table: 'products',
      newRecord: newProd
    });

    return newProd;
  }

  public deleteProduct(id: string): boolean {
    const initialCount = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    const wasDeleted = this.products.length < initialCount;

    if (wasDeleted) {
      supabaseRealtime.notify({
        eventType: 'DELETE',
        table: 'products',
        oldRecord: { id }
      });
    }

    return wasDeleted;
  }

  public batchUpdateProducts(ids: string[], action: {
    category?: Category;
    discountPercent?: number;
    priorityScore?: number;
    delete?: boolean;
  }): { updated: number } {
    if (action.delete) {
      const initial = this.products.length;
      this.products = this.products.filter(p => !ids.includes(p.id));
      
      supabaseRealtime.notify({
        eventType: 'DELETE',
        table: 'products'
      });

      return { updated: initial - this.products.length };
    }

    let count = 0;
    this.products.forEach(p => {
      if (ids.includes(p.id)) {
        count++;
        if (action.category) p.category = action.category;
        if (action.priorityScore !== undefined) p.priorityScore = action.priorityScore;
        if (action.discountPercent && action.discountPercent > 0) {
          p.price = Math.round(p.mrp * (1 - action.discountPercent / 100));
        }
      }
    });

    supabaseRealtime.notify({
      eventType: 'UPDATE',
      table: 'products'
    });

    return { updated: count };
  }

  public purgeAllOrders(): void {
    this.orders = [];
    supabaseRealtime.notify({
      eventType: 'DELETE',
      table: 'orders'
    });
  }

  public getOrders(customerPhone?: string): Order[] {
    let result = [...this.orders];
    if (customerPhone) {
      const cleaned = customerPhone.replace(/\s+/g, '');
      result = result.filter(o => o.customerPhone.replace(/\s+/g, '') === cleaned);
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'paymentStatus' | 'orderStage'> & { paymentMethod?: any }): Order {
    const newId = `AGH-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const isPayAtPickup = orderData.paymentMethod === 'pay_at_pickup';

    const newOrder: Order = {
      ...orderData,
      id: newId,
      paymentMethod: orderData.paymentMethod || 'online_upi',
      amountPaid: isPayAtPickup ? 0 : orderData.total,
      paymentStatus: isPayAtPickup ? 'PAY_AT_PICKUP' : 'PENDING_VERIFICATION',
      orderStage: 'PLACED',
      createdAt: now,
      updatedAt: now
    };

    // Deduct inventory stock immediately
    orderData.items.forEach(async (item) => {
      const prod = this.products.find(p => p.id === item.product.id);
      if (prod) {
        const current = Number(prod.stock !== undefined ? prod.stock : 0);
        prod.stock = Math.max(0, current - item.quantity);
        supabaseRealtime.notify({
          eventType: 'UPDATE',
          table: 'products',
          newRecord: prod
        });
        try {
          await supabase.from('products').update({ stock: prod.stock }).eq('id', prod.id);
        } catch (e) {}
      }
    });

    this.orders.unshift(newOrder);

    supabaseRealtime.notify({
      eventType: 'INSERT',
      table: 'orders',
      newRecord: newOrder
    });

    return newOrder;
  }

  public cancelOrder(orderId: string): { success: boolean; message: string; order?: Order } {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    if (order.paymentStatus === 'VERIFIED') {
      return { success: false, message: 'Verified orders cannot be self-cancelled. Contact store admin.' };
    }

    order.paymentStatus = 'CANCELLED';
    order.orderStage = 'CANCELLED';
    order.updatedAt = new Date().toISOString();

    // Restore inventory stock
    order.items.forEach(async (item) => {
      const prod = this.products.find(p => p.id === item.product.id);
      if (prod) {
        prod.stock += item.quantity;
        try {
          await supabase.from('products').update({ stock: prod.stock }).eq('id', prod.id);
        } catch (e) {}
      }
    });

    supabaseRealtime.notify({
      eventType: 'UPDATE',
      table: 'orders',
      newRecord: order
    });

    return { success: true, message: 'Order cancelled successfully. Stock restored.', order };
  }

  public deleteOrder(id: string): boolean {
    const initialLen = this.orders.length;
    this.orders = this.orders.filter(o => o.id !== id);
    
    supabaseRealtime.notify({
      eventType: 'DELETE',
      table: 'orders'
    });

    return this.orders.length < initialLen;
  }

  // EDITABLE PAYMENT STATUS & CUSTOM AMOUNT PAID (Discounts / Partial Payments)
  public updateOrderPaymentStatus(orderId: string, status: PaymentStatus, amountPaid?: number, adminNotes?: string): Order | undefined {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return undefined;

    const previousStatus = order.paymentStatus;
    order.paymentStatus = status;
    order.updatedAt = new Date().toISOString();

    if (amountPaid !== undefined) {
      order.amountPaid = amountPaid;
      if (amountPaid < order.total) {
        order.adminDiscountAdjustment = order.total - amountPaid;
      }
    }

    if (adminNotes) {
      order.adminNotes = adminNotes;
    }

    if ((status === 'VERIFIED' || status === 'PARTIALLY_PAID' || status === 'PAY_AT_PICKUP') && previousStatus !== 'VERIFIED') {
      order.orderStage = 'VERIFIED';
      order.items.forEach(item => {
        const prod = this.products.find(p => p.id === item.product.id);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      });
    }

    supabaseRealtime.notify({
      eventType: 'UPDATE',
      table: 'orders',
      newRecord: order
    });

    return order;
  }

  public verifyPayment(orderId: string, approve: boolean): Order | undefined {
    return this.updateOrderPaymentStatus(orderId, approve ? 'VERIFIED' : 'REJECTED');
  }

  public assignTrackingNumber(orderId: string, trackingNum?: string): Order | undefined {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return undefined;

    const awb = trackingNum || `AGH-TRK-${Math.floor(100000 + Math.random() * 900000)}`;
    order.trackingNumber = awb;
    order.orderStage = 'DISPATCHED';
    order.updatedAt = new Date().toISOString();

    supabaseRealtime.notify({
      eventType: 'UPDATE',
      table: 'orders',
      newRecord: order
    });

    return order;
  }

  public getOverheads(): OverheadExpense[] {
    return [...this.overheads];
  }

  public addOverhead(expense: Omit<OverheadExpense, 'id'>): OverheadExpense {
    const newExpense: OverheadExpense = {
      ...expense,
      id: `ov-${Date.now()}`
    };
    this.overheads.unshift(newExpense);
    return newExpense;
  }

  public getCoupons(): Coupon[] {
    return [...this.coupons];
  }

  public upsertCoupon(coupon: Partial<Coupon> & { id?: string }): Coupon {
    if (coupon.id) {
      const index = this.coupons.findIndex(c => c.id === coupon.id);
      if (index !== -1) {
        const updated = { ...this.coupons[index], ...coupon };
        this.coupons[index] = updated;

        supabaseRealtime.notify({
          eventType: 'UPDATE',
          table: 'coupons',
          newRecord: updated
        });

        return updated;
      }
    }

    const newCoupon: Coupon = {
      id: coupon.id || `c-${Date.now()}`,
      code: (coupon.code || 'SAVE10').toUpperCase().trim(),
      discountType: coupon.discountType || 'percent',
      discountValue: coupon.discountValue || 10,
      minCartValue: coupon.minCartValue || 0,
      usageLimit: coupon.usageLimit || 100,
      usageCount: 0,
      expiryDate: coupon.expiryDate || '2026-12-31',
      active: coupon.active !== undefined ? coupon.active : true,
      isPublic: coupon.isPublic !== undefined ? coupon.isPublic : true
    };

    this.coupons.unshift(newCoupon);

    supabaseRealtime.notify({
      eventType: 'INSERT',
      table: 'coupons',
      newRecord: newCoupon
    });

    return newCoupon;
  }

  public validateCoupon(code: string, cartTotal: number): { valid: boolean; discountAmount: number; message: string; coupon?: Coupon } {
    const cleanCode = code.trim().toUpperCase();
    const coupon = this.coupons.find(c => c.code === cleanCode && c.active);

    if (!coupon) {
      return { valid: false, discountAmount: 0, message: 'Invalid or inactive coupon code' };
    }

    if (cartTotal < coupon.minCartValue) {
      return { valid: false, discountAmount: 0, message: `Minimum cart value of ₹${coupon.minCartValue} required` };
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, discountAmount: 0, message: 'Coupon usage limit reached' };
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percent') {
      discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(cartTotal, discountAmount);

    return {
      valid: true,
      discountAmount,
      message: `Coupon ${coupon.code} applied! Saved ₹${discountAmount}`,
      coupon
    };
  }

  public getBanner(): StoreBanner {
    return this.banner;
  }

  public updateBanner(text: string, active: boolean, bgGradient?: string): StoreBanner {
    this.banner = {
      ...this.banner,
      text,
      active,
      bgGradient: bgGradient || this.banner.bgGradient || 'from-crimson via-terracotta to-crimson'
    };

    savePersistedBanner(this.banner);

    supabaseRealtime.notify({
      eventType: 'UPDATE',
      table: 'banner',
      newRecord: this.banner
    });

    return this.banner;
  }

  public getPaymentSettings(): PaymentSettings {
    return { ...this.paymentSettings };
  }

  public updatePaymentSettings(settings: Partial<PaymentSettings>): PaymentSettings {
    this.paymentSettings = {
      ...this.paymentSettings,
      ...settings
    };
    return { ...this.paymentSettings };
  }

  public purgeMonthData(): { archivedCount: number; archive: any; summary: MonthlyFinancialSummary } {
    const deliveredOrders = this.orders.filter(
      o => o.orderStage === 'DELIVERED' || o.paymentStatus === 'VERIFIED'
    );

    let totalRev = 0;
    let totalCp = 0;

    deliveredOrders.forEach(o => {
      totalRev += (o.amountPaid !== undefined ? o.amountPaid : o.total);
      o.items.forEach(i => {
        totalCp += (i.product.costPrice || 0) * i.quantity;
      });
    });

    const totalOverheads = this.overheads.reduce((sum, ov) => sum + ov.amount, 0);

    const now = new Date();
    const monthYear = now.toLocaleString('default', { month: 'long', year: 'numeric' });

    const archive = {
      monthYear,
      exportedAt: now.toISOString(),
      ordersCount: deliveredOrders.length,
      orders: deliveredOrders,
      overheads: this.overheads
    };

    const summary: MonthlyFinancialSummary = {
      id: `sum-${Date.now()}`,
      monthYear,
      totalRevenue: totalRev,
      totalCost: totalCp,
      totalOverheads,
      grossProfit: totalRev - totalCp,
      netProfit: totalRev - totalCp - totalOverheads,
      totalOrdersCount: this.orders.length,
      purgedOrdersCount: deliveredOrders.length,
      archivedAt: now.toISOString()
    };

    this.monthlySummaries.unshift(summary);
    this.orders = this.orders.filter(o => o.orderStage !== 'DELIVERED');

    supabaseRealtime.notify({
      eventType: 'DELETE',
      table: 'orders'
    });

    return {
      archivedCount: deliveredOrders.length,
      archive,
      summary
    };
  }

  public getMonthlySummaries(): MonthlyFinancialSummary[] {
    return [...this.monthlySummaries];
  }

  public getFinancialMetrics(): FinancialMetrics {
    const verifiedOrders = this.orders.filter(o => o.paymentStatus === 'VERIFIED' || o.paymentStatus === 'PAY_AT_PICKUP' || o.paymentStatus === 'PARTIALLY_PAID');
    let totalRevenue = 0;
    let totalCost = 0;
    let handpickedOrdersCount = 0;
    let parcelOrdersCount = 0;

    const categoryMap: Record<string, { count: number; revenue: number }> = {};
    const itemProfitMap: Record<string, { title: string; revenue: number; profit: number; salesCount: number; cost: number }> = {};

    verifiedOrders.forEach(order => {
      const collected = order.amountPaid !== undefined ? order.amountPaid : order.total;
      totalRevenue += collected;

      if (order.fulfillmentType === 'handpicked') {
        handpickedOrdersCount++;
      } else {
        parcelOrdersCount++;
      }

      order.items.forEach(item => {
        const cp = item.product.costPrice || 0;
        const itemRevenue = item.product.price * item.quantity;
        const itemTotalCost = cp * item.quantity;

        totalCost += itemTotalCost;

        const cat = item.product.category || 'Gifts';
        if (!categoryMap[cat]) categoryMap[cat] = { count: 0, revenue: 0 };
        categoryMap[cat].count += item.quantity;
        categoryMap[cat].revenue += itemRevenue;

        if (!itemProfitMap[item.product.id]) {
          itemProfitMap[item.product.id] = { title: item.product.title, revenue: 0, profit: 0, salesCount: 0, cost: 0 };
        }
        itemProfitMap[item.product.id].revenue += itemRevenue;
        itemProfitMap[item.product.id].cost += itemTotalCost;
        itemProfitMap[item.product.id].profit += (itemRevenue - itemTotalCost);
        itemProfitMap[item.product.id].salesCount += item.quantity;
      });
    });

    const totalOverheads = this.overheads.reduce((sum, ov) => sum + ov.amount, 0);
    const grossProfit = totalRevenue - totalCost;
    const netProfit = grossProfit - totalOverheads;

    const salesByCategory = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      count: data.count,
      revenue: data.revenue
    }));

    const sortedItems = Object.values(itemProfitMap).sort((a, b) => b.profit - a.profit);
    const topProfitableItems = sortedItems.slice(0, 5).map(i => ({
      title: i.title,
      revenue: i.revenue,
      profit: i.profit
    }));

    const fastMovingItems = sortedItems
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5)
      .map(i => ({
        title: i.title,
        salesCount: i.salesCount,
        marginPercent: i.revenue > 0 ? Math.round(((i.revenue - i.cost) / i.revenue) * 100) : 0
      }));

    const dailyMap: Record<string, { date: string; revenue: number; profit: number }> = {};
    verifiedOrders.forEach(o => {
      const d = o.createdAt ? o.createdAt.split('T')[0] : new Date().toISOString().split('T')[0];
      const collected = o.amountPaid !== undefined ? o.amountPaid : o.total;
      const orderCost = (o.items || []).reduce((sum, i) => sum + ((i.product?.costPrice || 0) * i.quantity), 0);
      const orderProfit = collected - orderCost;

      if (!dailyMap[d]) dailyMap[d] = { date: d, revenue: 0, profit: 0 };
      dailyMap[d].revenue += collected;
      dailyMap[d].profit += orderProfit;
    });

    const dailyTrends = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalRevenue,
      totalCost,
      totalOverheads,
      grossProfit,
      netProfit,
      totalOrders: this.orders.length,
      handpickedOrdersCount,
      parcelOrdersCount,
      salesByCategory,
      topProfitableItems,
      fastMovingItems,
      dailyTrends,
      overheads: this.overheads
    };
  }
}

const globalForDataStore = globalThis as unknown as {
  dataStore: DataStore | undefined;
};

export const store = globalForDataStore.dataStore ?? new DataStore();

if (process.env.NODE_ENV !== 'production') {
  globalForDataStore.dataStore = store;
}
