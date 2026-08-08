'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Package, 
  Trash2, 
  Tag, 
  Check, 
  Sliders, 
  AlertTriangle,
  Percent,
  Layers,
  Edit3,
  Plus,
  Camera,
  Save,
  X
} from 'lucide-react';
import { Product, Category } from '@/types';
import { CameraCaptureModal } from '@/components/CameraCaptureModal';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function BatchProductsAdminPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, router]);

  // Camera Capture Modal State
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // New/Edit Product Form State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({
    title: '',
    category: 'Gifts',
    costPrice: 500,
    mrp: 1499,
    price: 999,
    stock: 10,
    priorityScore: 50,
    urgencyFlag: false,
    isHandpickedFeatured: false,
    images: [],
    keywords: ['gifts']
  });

  // Inline Fast Editing State
  const [inlineEdits, setInlineEdits] = useState<Record<string, { price: number; stock: number; priorityScore: number }>>({});

  // Batch Control Form State
  const [batchCategory, setBatchCategory] = useState<Category>('Gifts');
  const [batchDiscount, setBatchDiscount] = useState<number>(10);
  const [batchPriorityScore, setBatchPriorityScore] = useState<number>(80);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
        const edits: Record<string, { price: number; stock: number; priorityScore: number }> = {};
        json.data.forEach((p: Product) => {
          edits[p.id] = { price: p.price, stock: p.stock, priorityScore: p.priorityScore };
        });
        setInlineEdits(edits);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.title || !editingProduct.price) {
      alert('Please fill product title and selling price');
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
        alert('Product saved successfully!');
        fetchProducts();
      }
    } catch {
      alert('Error saving product');
    }
  };

  const handleInlineSave = async (id: string) => {
    const edit = inlineEdits[id];
    if (!edit) return;

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...edit })
      });
      const json = await res.json();
      if (json.success) {
        alert(`Inline saved product #${id}`);
        fetchProducts();
      }
    } catch {
      alert('Failed to save inline edit');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchAction = async (action: 'delete' | 'updateCategory' | 'applyDiscount' | 'updatePriority') => {
    if (selectedIds.length === 0) {
      alert('Please select at least one product using the checkboxes.');
      return;
    }

    if (action === 'delete' && !confirm(`Are you sure you want to delete ${selectedIds.length} selected products?`)) {
      return;
    }

    try {
      if (action === 'updatePriority') {
        await Promise.all(
          selectedIds.map(id => 
            fetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, priorityScore: batchPriorityScore })
            })
          )
        );
        alert(`Updated priority score to ${batchPriorityScore} for ${selectedIds.length} items.`);
        setSelectedIds([]);
        fetchProducts();
        return;
      }

      const res = await fetch('/api/products/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          ids: selectedIds,
          category: batchCategory,
          discountPercent: batchDiscount
        })
      });
      const json = await res.json();
      if (json.success) {
        alert(`Batch ${action} completed successfully for ${json.count} products!`);
        setSelectedIds([]);
        fetchProducts();
      }
    } catch {
      alert('Failed to process batch action');
    }
  };

  return (
    <div className="min-h-screen bg-cream text-espresso font-sans p-4 sm:p-8 space-y-8">
      {/* Header Toolbar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-border pb-6">
        <div>
          <Link href="/admin" className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Admin Control Center
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-espresso flex items-center gap-2">
            <Package className="w-7 h-7 text-terracotta" />
            Product Catalogue & Fast Merchandiser
          </h1>
          <p className="text-xs text-espresso/60 mt-1">
            Live Device Camera Capture, Priority Score Sliders (1-100), CP/MRP/SP Pricing & Inline Table Edits.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
                images: [],
                keywords: ['gifts']
              });
              setIsProductModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-terracotta text-cream text-xs font-bold rounded-xl shadow hover:bg-crimson transition"
          >
            <Plus className="w-4 h-4" /> Add Product (With Camera Snap)
          </button>
        </div>
      </div>

      {/* Batch Control Toolbar */}
      <div className="max-w-7xl mx-auto bg-cream border border-cream-border rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-espresso uppercase tracking-wider">
            Selected Items ({selectedIds.length} of {products.length})
          </span>
          <button
            onClick={toggleSelectAll}
            className="text-xs font-bold text-terracotta hover:underline"
          >
            {selectedIds.length === products.length ? 'Deselect All' : 'Select All Items'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Priority Score Batch Action */}
          <div className="bg-cream-muted p-4 rounded-2xl border border-cream-border space-y-2">
            <label className="font-bold text-xs text-espresso block flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-terracotta" /> Set Merchandising Priority (1 - 100)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="100"
                value={batchPriorityScore}
                onChange={e => setBatchPriorityScore(Number(e.target.value))}
                className="w-24 px-3 py-1.5 bg-cream border border-cream-border rounded-xl font-mono text-xs font-bold"
              />
              <button
                onClick={() => handleBatchAction('updatePriority')}
                className="flex-1 px-3 py-1.5 bg-terracotta text-cream text-xs font-bold rounded-xl hover:bg-crimson transition"
              >
                Apply Priority
              </button>
            </div>
          </div>

          {/* Discount Batch Action */}
          <div className="bg-cream-muted p-4 rounded-2xl border border-cream-border space-y-2">
            <label className="font-bold text-xs text-espresso block flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-crimson" /> Apply % Discount to Selected
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="90"
                value={batchDiscount}
                onChange={e => setBatchDiscount(Number(e.target.value))}
                className="w-24 px-3 py-1.5 bg-cream border border-cream-border rounded-xl font-mono text-xs font-bold"
              />
              <button
                onClick={() => handleBatchAction('applyDiscount')}
                className="flex-1 px-3 py-1.5 bg-crimson text-cream text-xs font-bold rounded-xl hover:bg-crimson-dark transition"
              >
                Apply Discount
              </button>
            </div>
          </div>

          {/* Category Batch Action */}
          <div className="bg-cream-muted p-4 rounded-2xl border border-cream-border space-y-2">
            <label className="font-bold text-xs text-espresso block flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-gold-dark" /> Update Category Assignment
            </label>
            <div className="flex gap-2">
              <select
                value={batchCategory}
                onChange={e => setBatchCategory(e.target.value as Category)}
                className="w-full px-3 py-1.5 bg-cream border border-cream-border rounded-xl text-xs font-medium"
              >
                <option value="Gifts">Gifts</option>
                <option value="Rakhi">Rakhi</option>
                <option value="Toys">Toys</option>
                <option value="Handpicked">Handpicked</option>
                <option value="Hampers">Hampers</option>
              </select>
              <button
                onClick={() => handleBatchAction('updateCategory')}
                className="px-4 py-1.5 bg-espresso text-cream text-xs font-bold rounded-xl hover:bg-black transition whitespace-nowrap"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleBatchAction('delete')}
              className="px-4 py-2 bg-crimson/15 text-crimson font-bold text-xs rounded-xl border border-crimson/30 hover:bg-crimson hover:text-cream transition flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" /> Delete Selected ({selectedIds.length}) Items
            </button>
          </div>
        )}
      </div>

      {/* Catalogue Table with Inline Fast Edits */}
      <div className="max-w-7xl mx-auto bg-cream border border-cream-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-cream-muted border-b border-cream-border text-espresso/70 font-bold uppercase tracking-wider">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === products.length && products.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded text-terracotta focus:ring-terracotta"
                  />
                </th>
                <th className="p-4">Item Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">CP / MRP</th>
                <th className="p-4 w-28">Inline Price (SP ₹)</th>
                <th className="p-4 w-24">Inline Stock</th>
                <th className="p-4 w-28">Priority (1-100)</th>
                <th className="p-4 text-right">Inline Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-border">
              {products.map(product => {
                const isSelected = selectedIds.includes(product.id);
                const edit = inlineEdits[product.id] || { price: product.price, stock: product.stock, priorityScore: product.priorityScore };

                return (
                  <tr key={product.id} className={`transition ${isSelected ? 'bg-terracotta/5' : 'hover:bg-cream-muted/50'}`}>
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(product.id)}
                        className="rounded text-terracotta focus:ring-terracotta"
                      />
                    </td>
                    <td className="p-4 font-bold text-espresso">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cream-muted border border-cream-border overflow-hidden shrink-0 flex items-center justify-center font-serif font-bold text-xs text-terracotta">
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            product.category.substring(0, 2)
                          )}
                        </div>
                        <div>
                          <span>{product.title}</span>
                          <span className="block text-[10px] text-espresso/50 font-mono font-normal">ID: {product.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-terracotta">{product.category}</td>
                    <td className="p-4 font-mono text-espresso/70">
                      <div>CP: ₹{product.costPrice}</div>
                      <div>MRP: ₹{product.mrp}</div>
                    </td>
                    {/* Inline Fast Price Edit */}
                    <td className="p-4 font-mono">
                      <input
                        type="number"
                        value={edit.price}
                        onChange={e => setInlineEdits({
                          ...inlineEdits,
                          [product.id]: { ...edit, price: Number(e.target.value) }
                        })}
                        className="w-24 px-2 py-1 bg-cream border border-terracotta rounded-lg font-bold text-crimson text-xs font-mono"
                      />
                    </td>
                    {/* Inline Fast Stock Edit */}
                    <td className="p-4 font-mono">
                      <input
                        type="number"
                        value={edit.stock}
                        onChange={e => setInlineEdits({
                          ...inlineEdits,
                          [product.id]: { ...edit, stock: Number(e.target.value) }
                        })}
                        className="w-20 px-2 py-1 bg-cream border border-cream-border rounded-lg font-bold text-espresso text-xs font-mono"
                      />
                    </td>
                    {/* Inline Fast Priority Score Edit */}
                    <td className="p-4 font-mono">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={edit.priorityScore}
                        onChange={e => setInlineEdits({
                          ...inlineEdits,
                          [product.id]: { ...edit, priorityScore: Number(e.target.value) }
                        })}
                        className="w-20 px-2 py-1 bg-terracotta/10 border border-terracotta rounded-lg font-extrabold text-terracotta text-xs font-mono"
                      />
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleInlineSave(product.id)}
                        className="p-1.5 bg-emerald-700 text-cream rounded-lg hover:bg-emerald-800 transition shadow-xs"
                        title="Save Inline Edit"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setIsProductModalOpen(true);
                        }}
                        className="p-1.5 text-terracotta hover:bg-terracotta/10 rounded-lg transition"
                        title="Edit Full Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL PRODUCT EDIT / ADD MODAL WITH CAMERA SNAP */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-espresso/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-cream border border-cream-border rounded-3xl p-6 w-full max-w-xl space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-cream-border pb-3">
              <h3 className="font-serif font-bold text-lg text-espresso">
                {editingProduct.id ? 'Edit Product Details' : 'Add New Catalogue Item'}
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

              {/* CP, MRP, SP - Strictly NO Tax/GST fields */}
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

              {/* Priority Rank Slider (1 - 100) */}
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

              {/* Media Upload & Camera Snap Trigger */}
              <div className="space-y-2">
                <label className="block font-bold text-espresso">Product Photos & Device Camera</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-crimson text-cream rounded-xl text-xs font-bold hover:bg-crimson-dark transition shadow"
                  >
                    <Camera className="w-4 h-4 text-gold" /> Snap Live Camera Photo
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
                              ...prev,
                              images: [result, ...(prev.images || [])]
                            }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-espresso/70 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cream-muted file:text-espresso"
                  />
                </div>

                {/* Photo Previews */}
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 overflow-x-auto">
                    {editingProduct.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-cream-border shrink-0">
                        <img src={img} alt="Photo" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setEditingProduct(prev => ({
                            ...prev,
                            images: prev.images?.filter((_, i) => i !== idx)
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

              {/* Urgency & Handpicked Flags */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-espresso">
                  <input
                    type="checkbox"
                    checked={editingProduct.urgencyFlag || false}
                    onChange={e => setEditingProduct({ ...editingProduct, urgencyFlag: e.target.checked })}
                    className="rounded text-crimson focus:ring-crimson"
                  />
                  Force Urgency Flag
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-espresso">
                  <input
                    type="checkbox"
                    checked={editingProduct.isHandpickedFeatured || false}
                    onChange={e => setEditingProduct({ ...editingProduct, isHandpickedFeatured: e.target.checked })}
                    className="rounded text-terracotta focus:ring-terracotta"
                  />
                  Featured in Handpicked
                </label>
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
          setEditingProduct(prev => ({
            ...prev,
            images: [dataUrl, ...(prev.images || [])]
          }));
        }}
      />
    </div>
  );
}
