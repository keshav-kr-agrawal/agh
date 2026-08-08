import { Product, Order, FinancialMetrics, Coupon, StoreBanner, MonthlyFinancialSummary, Category, OverheadExpense, PaymentStatus, PaymentSettings } from '@/types';
import { supabase, supabaseRealtime } from './supabase';

// Initial Seed Products
const initialProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Royal Kundan & Zardosi Rakhi Hamper',
    description: 'Exquisite handcrafted Royal Kundan Rakhi set accompanied by organic Roli Chawal, artisan roasted dry fruits (Almonds & Cashews 200g), and gold foil greeting card.',
    category: 'Rakhi',
    keywords: ['rakhi', 'kundan', 'zardosi', 'dry fruits', 'festival', 'hamper', 'royal'],
    costPrice: 450,
    mrp: 1499,
    price: 999,
    stock: 8,
    priorityScore: 98,
    urgencyFlag: true,
    isHandpickedFeatured: true,
    images: [],
    specs: {
      'Set Includes': '1 Kundan Rakhi, 1 Lumba Rakhi, 200g Nuts',
      'Packaging': 'Handmade Velvet Gift Box',
      'Material': 'Gold Plated Zari & Precious Kundan Stones'
    },
    occasion: 'Raksha Bandhan',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'prod-2',
    title: 'Grand Heritage Brass Diya & Pooja Box',
    description: 'Pure brass peacock-engraved oil lamps with brass bell, organic camphor, sandalwood paste, and handcrafted brass thali.',
    category: 'Handpicked',
    keywords: ['brass', 'pooja', 'diya', 'diwali', 'festive', 'handcrafted', 'puja thali'],
    costPrice: 800,
    mrp: 2999,
    price: 1899,
    stock: 3,
    priorityScore: 95,
    urgencyFlag: true,
    isHandpickedFeatured: true,
    images: [],
    specs: {
      'Material': '100% Solid Brass',
      'Weight': '1.2 kg',
      'Craft': 'Moradabad Traditional Metalwork'
    },
    occasion: 'Festive / Housewarming',
    createdAt: '2026-08-02T11:30:00Z'
  },
  {
    id: 'prod-3',
    title: 'Luxury Saffron & Dark Chocolate Artisan Gift Trunk',
    description: 'Solid wooden treasure trunk filled with Kashmir Saffron (1g), 70% Dark Belgian Chocolates (12 pcs), Rose Infused Honey, and Brass Spoon.',
    category: 'Hampers',
    keywords: ['chocolate', 'hamper', 'saffron', 'gift box', 'luxury', 'wooden trunk'],
    costPrice: 1200,
    mrp: 3999,
    price: 2799,
    stock: 4,
    priorityScore: 92,
    urgencyFlag: true,
    isHandpickedFeatured: true,
    images: [],
    specs: {
      'Shelf Life': '6 Months',
      'Trunk Material': 'Reclaimed Teak Wood with Brass Latch',
      'Origin': 'Saffron from Pampore, Kashmir'
    },
    occasion: 'Anniversary / Corporate',
    createdAt: '2026-08-03T14:15:00Z'
  },
  {
    id: 'prod-4',
    title: 'Interactive Wooden Educational Steam Railway Train Set',
    description: 'Child-safe non-toxic natural beechwood railway set with 45 tracks, magnetic engines, toll bridge, and interactive sound station.',
    category: 'Toys',
    keywords: ['toys', 'wooden toy', 'kids', 'steam train', 'educational', 'montessori'],
    costPrice: 650,
    mrp: 2499,
    price: 1499,
    stock: 12,
    priorityScore: 88,
    urgencyFlag: false,
    isHandpickedFeatured: false,
    images: [],
    specs: {
      'Age Group': '3 to 10 Years',
      'Material': 'Sustainable Beechwood & Water-Based Colors',
      'Safety Certification': 'BIS & EN71 Certified'
    },
    occasion: 'Birthday / Kids Gift',
    createdAt: '2026-08-04T09:20:00Z'
  },
  {
    id: 'prod-5',
    title: 'Customized Engraved Wooden Keepsake Desk Clock',
    description: 'Personalized solid mahogany desk clock with quartz movement, photo slot, and laser-engraved customized family name/message.',
    category: 'Gifts',
    keywords: ['customized', 'personalized', 'clock', 'wooden clock', 'desk decor', 'anniversary'],
    costPrice: 380,
    mrp: 1499,
    price: 899,
    stock: 15,
    priorityScore: 85,
    urgencyFlag: false,
    isHandpickedFeatured: true,
    images: [],
    specs: {
      'Battery': '1x AA Battery included',
      'Dimensions': '8 x 6 x 2.5 inches',
      'Customization': 'Laser Engraved Text'
    },
    occasion: 'Birthday / Retirement',
    createdAt: '2026-08-04T16:00:00Z'
  },
  {
    id: 'prod-6',
    title: 'Threaded Silver Resham Lumba-Rakhi Duo Set',
    description: 'Elegant sterling silver plated Resham thread Rakhi for brother and matching embellished Lumba for Bhabhi with organic Kumkum Roli kit.',
    category: 'Rakhi',
    keywords: ['rakhi', 'lumba', 'bhabhi rakhi', 'silver rakhi', 'pair rakhi', 'brother bhabhi'],
    costPrice: 220,
    mrp: 999,
    price: 599,
    stock: 2,
    priorityScore: 90,
    urgencyFlag: true,
    isHandpickedFeatured: false,
    images: [],
    specs: {
      'Material': 'Pure Resham Silk Thread & Silver-Plated Motifs',
      'Includes': '1 Bhai Rakhi + 1 Bhabhi Lumba + Roli Chawal Card'
    },
    occasion: 'Raksha Bandhan',
    createdAt: '2026-08-05T08:10:00Z'
  }
];

// Initial Seed Overheads
const initialOverheads: OverheadExpense[] = [];

// Initial Seed Coupons
const initialCoupons: Coupon[] = [
  {
    id: 'c-1',
    code: 'FIRST10',
    discountType: 'percent',
    discountValue: 10,
    minCartValue: 499,
    usageLimit: 500,
    usageCount: 42,
    expiryDate: '2026-12-31',
    active: true,
    isPublic: true
  },
  {
    id: 'c-2',
    code: 'RAKHI200',
    discountType: 'flat',
    discountValue: 200,
    minCartValue: 1499,
    usageLimit: 200,
    usageCount: 88,
    expiryDate: '2026-09-15',
    active: true,
    isPublic: true
  },
  {
    id: 'c-3',
    code: 'HANDPICKED50',
    discountType: 'flat',
    discountValue: 50,
    minCartValue: 299,
    usageLimit: 1000,
    usageCount: 156,
    expiryDate: '2026-12-31',
    active: true,
    isPublic: true
  },
  {
    id: 'c-4',
    code: 'WELCOME100',
    discountType: 'flat',
    discountValue: 100,
    minCartValue: 1,
    usageLimit: 5000,
    usageCount: 12,
    expiryDate: '2026-12-31',
    active: true,
    isPublic: true
  }
];

// Initial Banner
const initialBanner: StoreBanner = {
  id: 'b-1',
  text: '🎉 Festive Offer: Flat ₹200 OFF on orders over ₹1499 with coupon RAKHI200! Free Handpicked Store Pickup.',
  active: true,
  bgGradient: 'from-crimson via-terracotta to-crimson'
};

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
  private banner: StoreBanner = { ...initialBanner };
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

  public deleteProduct(id: string): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    
    supabaseRealtime.notify({
      eventType: 'DELETE',
      table: 'products'
    });

    return this.products.length < initialLen;
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
        prod.stock = Math.max(0, prod.stock - item.quantity);
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

  public updateBanner(text: string, active: boolean): StoreBanner {
    this.banner = { ...this.banner, text, active };

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

    const dailyTrends = [
      { date: 'Aug 01', revenue: 4200, profit: 1850 },
      { date: 'Aug 02', revenue: 5800, profit: 2400 },
      { date: 'Aug 03', revenue: 7900, profit: 3200 },
      { date: 'Aug 04', revenue: 6400, profit: 2750 },
      { date: 'Aug 05', revenue: 9200, profit: 4100 },
      { date: 'Aug 06', revenue: 8500, profit: 3800 },
      { date: 'Aug 07', revenue: totalRevenue > 0 ? Math.max(totalRevenue, 6200) : 6200, profit: netProfit > 0 ? Math.max(netProfit, 2900) : 2900 }
    ];

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
