'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DynamicQrCode } from './DynamicQrCode';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  CheckCircle2, 
  QrCode, 
  Upload, 
  MessageSquare, 
  Store, 
  Truck, 
  ArrowLeft,
  DollarSign,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { PaymentMethod } from '@/types';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    fulfillmentType,
    setFulfillmentType,
    getSubtotal,
    getShippingFee,
    getTotal
  } = useCartStore();

  const [step, setStep] = useState<'cart' | 'details' | 'payment' | 'confirmation'>('cart');
  
  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('110001');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online_upi');

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Payment Proof State
  const [isUploading, setIsUploading] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);
  const [upiPayload, setUpiPayload] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Store Payment Settings (UPI ID & QR Image)
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
    fetch('/api/promotions')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.paymentSettings) {
          setPaymentSettings(json.paymentSettings);
        }
      })
      .catch(() => {});
  }, []);

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const shippingFee = fulfillmentType === 'handpicked' ? 0 : getShippingFee();
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal + shippingFee - couponDiscount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'validate',
          code: couponInput,
          cartTotal: subtotal
        })
      });
      const json = await res.json();
      if (json.valid) {
        setAppliedCoupon({ code: json.coupon.code, discount: json.discountAmount });
        setCouponSuccess(json.message);
      } else {
        setCouponError(json.message || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Failed to validate coupon');
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = useAuthStore.getState().user;
    if (!user) {
      closeCart();
      useCartStore.getState().openAuthRequiredModal();
      return;
    }

    if (!customerName || !customerPhone) {
      alert('Please fill in your name and phone number.');
      return;
    }

    if (fulfillmentType === 'parcel' && (!address || !pincode)) {
      alert('Please enter your shipping address and pincode.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          address: fulfillmentType === 'handpicked' ? 'Anita Gift House Store Pickup (Handpicked)' : address,
          pincode: fulfillmentType === 'handpicked' ? '110001' : pincode,
          fulfillmentType,
          paymentMethod,
          items: cart,
          subtotal,
          shippingFee,
          discount: couponDiscount,
          couponCode: appliedCoupon?.code || '',
          total,
          paymentProofUrl: paymentScreenshot || ''
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setCreatedOrderId(json.data.id);
        setUpiPayload(json.upiPayload || `upi://pay?pa=anitagifthouse@upi&pn=Anita%20Gift%20House&am=${total}&tn=Order%20${json.data.id}`);

        if (paymentMethod === 'pay_at_pickup') {
          // Pay at Pickup: Direct confirmation
          clearCart();
          setStep('confirmation');
        } else {
          // Pay Online: Proceed to UPI QR Step
          setStep('payment');
        }
      }
    } catch {
      alert('Error creating order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPaymentScreenshot(event.target?.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmPayment = () => {
    clearCart();
    setStep('confirmation');
  };

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(
      `Hello Anita Gift House (+91 9199272836),\nI have placed Order #${createdOrderId} for ₹${total} (${fulfillmentType === 'handpicked' ? 'Store Pickup' : 'Parcel Shipping'}).\nName: ${customerName}\nPhone: ${customerPhone}\nPayment Method: ${paymentMethod === 'pay_at_pickup' ? 'Pay at Pickup' : 'Online UPI'}`
    );
    window.open(`https://wa.me/919199272836?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-espresso/60 backdrop-blur-xs transition-opacity" onClick={closeCart} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream text-espresso shadow-2xl flex flex-col border-l border-cream-border">
          {/* Header */}
          <div className="p-6 border-b border-cream-border flex items-center justify-between bg-cream-muted">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-terracotta" />
              <h2 className="text-lg font-serif font-bold text-espresso">
                {step === 'cart' && 'Your Shopping Bag'}
                {step === 'details' && 'Checkout & Fulfillment'}
                {step === 'payment' && 'Online UPI Payment'}
                {step === 'confirmation' && 'Order Booking Confirmed!'}
              </h2>
            </div>
            <button onClick={closeCart} className="p-2 rounded-full text-espresso/60 hover:text-espresso">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {step === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <ShoppingBag className="w-12 h-12 text-espresso/30 mx-auto" />
                    <p className="text-sm font-medium text-espresso/70">Your cart is empty</p>
                    <button
                      onClick={closeCart}
                      className="px-6 py-2 bg-terracotta text-cream font-bold text-xs rounded-full shadow hover:bg-crimson transition"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex gap-4 p-3 bg-cream-muted border border-cream-border rounded-2xl">
                        <div className="w-16 h-16 rounded-xl bg-cream border border-cream-border overflow-hidden shrink-0">
                          <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif font-bold text-xs text-espresso line-clamp-1">{item.product.title}</h4>
                            <span className="text-xs font-mono font-bold text-crimson">₹{item.product.price}</span>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center border border-cream-border rounded-lg bg-cream font-mono text-xs">
                              <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-0.5 text-espresso/70">-</button>
                              <span className="px-2 font-bold">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-0.5 text-espresso/70">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.product.id)} className="text-crimson/70 hover:text-crimson">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {step === 'details' && (
              <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-espresso mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Priya Sharma"
                    className="w-full px-3 py-2 bg-cream border border-cream-border rounded-xl focus:ring-2 focus:ring-terracotta"
                  />
                </div>

                <div>
                  <label className="block font-bold text-espresso mb-1">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-cream border border-cream-border rounded-xl focus:ring-2 focus:ring-terracotta font-mono"
                  />
                </div>

                {/* PAYMENT METHOD SELECTOR: PAY AT PICKUP VS ONLINE UPI */}
                <div className="space-y-2 p-3 bg-cream-muted border border-cream-border rounded-2xl">
                  <label className="block font-bold text-espresso uppercase tracking-wider text-[11px]">Select Payment Option *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online_upi')}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        paymentMethod === 'online_upi'
                          ? 'border-terracotta bg-terracotta/10 font-bold text-espresso'
                          : 'border-cream-border bg-cream text-espresso/70'
                      }`}
                    >
                      <span className="flex items-center gap-1 font-bold text-xs"><QrCode className="w-3.5 h-3.5 text-terracotta" /> Pay Online (UPI QR)</span>
                      <span className="text-[10px] text-espresso/60 mt-1">Instant QR Code & Screenshot</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pay_at_pickup')}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        paymentMethod === 'pay_at_pickup'
                          ? 'border-crimson bg-crimson/10 font-bold text-espresso'
                          : 'border-cream-border bg-cream text-espresso/70'
                      }`}
                    >
                      <span className="flex items-center gap-1 font-bold text-xs"><Store className="w-3.5 h-3.5 text-crimson" /> Pay at Pickup</span>
                      <span className="text-[10px] text-espresso/60 mt-1">Cash / UPI at Store</span>
                    </button>
                  </div>
                </div>

                {fulfillmentType === 'parcel' ? (
                  <>
                    <div>
                      <label className="block font-bold text-espresso mb-1">Delivery Address *</label>
                      <textarea
                        required
                        rows={3}
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="House No, Street, Landmark..."
                        className="w-full px-3 py-2 bg-cream border border-cream-border rounded-xl focus:ring-2 focus:ring-terracotta"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-espresso mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={pincode}
                        onChange={e => setPincode(e.target.value)}
                        placeholder="110001"
                        className="w-full px-3 py-2 bg-cream border border-cream-border rounded-xl focus:ring-2 focus:ring-terracotta font-mono"
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-crimson/10 border border-crimson/20 rounded-2xl text-crimson space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-xs">
                      <Store className="w-4 h-4" /> Handpicked Store Pickup Location
                    </p>
                    <p className="text-[11px]">Anita Gift House, Main Market Chowk, Shop #14, Sector 15. Ready within 2 hours!</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-terracotta text-cream font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-crimson transition flex items-center justify-center gap-2"
                >
                  {isSubmitting
                    ? 'Creating Order...'
                    : paymentMethod === 'pay_at_pickup'
                    ? 'Confirm Order & Pay at Pickup'
                    : 'Proceed to UPI Payment QR'}
                  <ArrowRight className="w-4 h-4 text-gold" />
                </button>
              </form>
            )}

            {step === 'payment' && (
              <div className="space-y-5 text-center">
                <div className="p-6 bg-cream-muted border-2 border-gold/40 rounded-3xl space-y-3 shadow-inner">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 text-espresso rounded-full text-xs font-bold">
                    <QrCode className="w-4 h-4 text-terracotta" />
                    Dynamic Instant UPI QR Code
                  </div>

                  <div className="bg-cream p-4 rounded-2xl inline-block shadow-md border border-cream-border mx-auto">
                    <img
                      src={paymentSettings.qrImageUrl || '/upi-qr.png'}
                      alt={`${paymentSettings.merchantName} Official UPI QR Code`}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/upi-qr.svg';
                      }}
                      className="w-48 h-48 object-contain rounded-xl border border-gold/30 mx-auto"
                    />
                    <p className="text-[10px] text-espresso/60 mt-2 font-mono">Scan via GPay / PhonePe / Paytm / BHIM</p>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="font-bold text-espresso text-base">Payable Total: <span className="text-crimson font-mono font-extrabold">₹{total}</span></p>
                    <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-espresso/80">
                      <span>VPA: <strong>{paymentSettings.upiId}</strong></span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(paymentSettings.upiId);
                          alert(`UPI ID ${paymentSettings.upiId} copied to clipboard!`);
                        }}
                        className="px-2 py-0.5 bg-cream-muted border border-cream-border rounded text-[10px] font-bold hover:bg-gold transition"
                      >
                        📋 Copy UPI
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-cream-border rounded-2xl p-4 bg-cream text-left space-y-3">
                  <label className="block text-xs font-bold text-espresso flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-terracotta" />
                    Upload Payment Screenshot Proof
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="proof-upload"
                  />

                  <label
                    htmlFor="proof-upload"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-cream-muted border border-cream-border rounded-xl cursor-pointer hover:bg-cream-border transition text-xs font-semibold text-espresso"
                  >
                    {isUploading ? 'Uploading...' : paymentScreenshot ? '✓ Screenshot Attached' : 'Choose Image File'}
                  </label>

                  {paymentScreenshot && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gold mx-auto">
                      <img src={paymentScreenshot} alt="Proof" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleConfirmPayment}
                    className="w-full py-3 bg-emerald-700 text-cream font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-emerald-800 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-gold" />
                    I Have Completed Payment
                  </button>

                  <button
                    onClick={handleWhatsAppSend}
                    className="w-full py-2.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl hover:bg-emerald-200 transition flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send Payment Proof via WhatsApp (+91 9199272836)
                  </button>
                </div>
              </div>
            )}

            {step === 'confirmation' && (
              <div className="py-8 text-center space-y-6 animate-fadeIn">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-xl font-serif font-bold text-espresso">Order #{createdOrderId} Confirmed!</h3>
                  <p className="text-xs text-espresso/70 mt-1">
                    {paymentMethod === 'pay_at_pickup'
                      ? 'Your order is recorded for Store Pickup. You can pay cash or UPI at the store desk!'
                      : 'Thank you! Store admin (+91 9199272836) is verifying your payment proof.'}
                  </p>
                </div>

                <div className="p-4 bg-cream-muted border border-cream-border rounded-2xl text-xs text-left space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-espresso/60">Total Amount:</span>
                    <span className="font-bold text-crimson">₹{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-espresso/60">Fulfillment Mode:</span>
                    <span className="font-bold text-espresso capitalize">{fulfillmentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-espresso/60">Payment Option:</span>
                    <span className="font-bold text-emerald-800 uppercase">{paymentMethod}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => router.push(`/invoice/${createdOrderId}`)}
                    className="w-full py-3 bg-terracotta text-cream font-bold text-xs rounded-xl shadow hover:bg-crimson transition"
                  >
                    View & Print Order Invoice PDF
                  </button>

                  <button
                    onClick={() => {
                      closeCart();
                      setStep('cart');
                    }}
                    className="w-full py-2.5 border border-cream-border text-espresso font-semibold text-xs rounded-xl hover:bg-cream-muted"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary Bar */}
          {step === 'cart' && cart.length > 0 && (
            <div className="p-6 border-t border-cream-border bg-cream-muted space-y-4">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Coupon (e.g. RAKHI200)"
                  className="flex-1 px-3 py-1.5 bg-cream border border-cream-border rounded-xl text-xs font-mono uppercase"
                />
                <button type="submit" className="px-4 py-1.5 bg-espresso text-cream font-bold text-xs rounded-xl hover:bg-black">
                  Apply
                </button>
              </form>

              {couponSuccess && <p className="text-[11px] font-semibold text-emerald-700">{couponSuccess}</p>}
              {couponError && <p className="text-[11px] font-semibold text-crimson">{couponError}</p>}

              <div className="space-y-1.5 text-xs text-espresso/80 font-mono">
                <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between"><span>Shipping Fee:</span><span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span></div>
                {appliedCoupon && <div className="flex justify-between text-emerald-700"><span>Coupon Discount ({appliedCoupon.code}):</span><span>-₹{couponDiscount}</span></div>}
                <div className="flex justify-between text-sm font-bold text-espresso pt-2 border-t border-cream-border font-serif">
                  <span>Payable Total:</span>
                  <span className="text-crimson font-mono text-base">₹{total}</span>
                </div>
              </div>

              <button
                onClick={() => setStep('details')}
                className="w-full py-3 bg-terracotta text-cream font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-crimson transition flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4 text-gold" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
