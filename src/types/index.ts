export type Category = 'Gifts' | 'Rakhi' | 'Toys' | 'Handpicked' | 'Hampers';

export interface Product {
  id: string;
  title: string;
  description: string;
  category: Category;
  keywords: string[];
  costPrice: number; // CP
  mrp: number;       // MRP
  price: number;     // SP (Selling Price)
  stock: number;
  priorityScore: number; // 1-100 merchandising rank
  urgencyFlag: boolean;
  isHandpickedFeatured: boolean;
  images: string[];
  specs?: Record<string, string>;
  occasion?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type FulfillmentType = 'handpicked' | 'parcel';
export type PaymentMethod = 'online_upi' | 'pay_at_pickup';
export type PaymentStatus = 'PENDING' | 'PENDING_VERIFICATION' | 'PAY_AT_PICKUP' | 'VERIFIED' | 'PARTIALLY_PAID' | 'REJECTED' | 'CANCELLED';
export type OrderStage = 'PLACED' | 'VERIFIED' | 'PACKED' | 'DISPATCHED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  pincode: string;
  fulfillmentType: FulfillmentType;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  adminDiscountAdjustment?: number; // Custom admin discount/round-off
  couponCode?: string;
  total: number;
  amountPaid?: number; // Final actual collected amount
  paymentStatus: PaymentStatus;
  orderStage: OrderStage;
  trackingNumber?: string;
  paymentProofUrl?: string;
  adminNotes?: string;
  isGiftOrder?: boolean;
  recipientName?: string;
  recipientPhone?: string;
  recipientAddress?: string;
  recipientPincode?: string;
  giftOccasion?: string;
  giftNote?: string;
  giftPackingOption?: string;
  giftPackingBudget?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSettings {
  upiId: string;
  qrImageUrl: string;
  merchantName: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percent' | 'flat';
  discountValue: number;
  minCartValue: number;
  usageLimit: number;
  usageCount: number;
  expiryDate: string;
  active: boolean;
  isPublic?: boolean;
  applicableCategory?: Category | 'All' | 'SelectedProducts';
  applicableProductIds?: string[];
}

export interface StoreBanner {
  id: string;
  text: string;
  active: boolean;
  bgGradient?: string;
}

export interface OverheadExpense {
  id: string;
  title: string;
  amount: number;
  category: 'Packaging' | 'Electricity' | 'Delivery Tips' | 'Rent' | 'Other';
  notes?: string;
  date: string;
}

export interface UserSession {
  phone: string;
  name: string;
  email?: string;
  role: 'admin' | 'customer';
  savedAddresses?: Array<{
    name: string;
    phone: string;
    address: string;
    pincode: string;
  }>;
}

export interface MonthlyFinancialSummary {
  id: string;
  monthYear: string;
  totalRevenue: number;
  totalCost: number;
  totalOverheads: number;
  grossProfit: number;
  netProfit: number;
  totalOrdersCount: number;
  purgedOrdersCount: number;
  archivedAt: string;
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalCost: number;
  totalOverheads: number;
  grossProfit: number;
  netProfit: number;
  totalOrders: number;
  handpickedOrdersCount: number;
  parcelOrdersCount: number;
  salesByCategory: Array<{ category: string; count: number; revenue: number }>;
  topProfitableItems: Array<{ title: string; revenue: number; profit: number }>;
  fastMovingItems: Array<{ title: string; salesCount: number; marginPercent: number }>;
  dailyTrends: Array<{ date: string; revenue: number; profit: number }>;
  overheads: OverheadExpense[];
}
