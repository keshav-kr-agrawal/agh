'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  Trash2, 
  FileSpreadsheet, 
  FileJson, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles,
  Plus,
  Receipt,
  X
} from 'lucide-react';
import { FinancialMetrics, MonthlyFinancialSummary, OverheadExpense } from '@/types';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function AdminReportsPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();

  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [summaries, setSummaries] = useState<MonthlyFinancialSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, router]);

  // Overhead Form Modal State
  const [isOverheadModalOpen, setIsOverheadModalOpen] = useState(false);
  const [newOverhead, setNewOverhead] = useState<{
    title: string;
    amount: number;
    category: 'Packaging' | 'Electricity' | 'Delivery Tips' | 'Rent' | 'Other';
    notes: string;
    date: string;
  }>({
    title: '',
    amount: 500,
    category: 'Packaging',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics/financials');
      const json = await res.json();
      if (json.success) {
        setMetrics(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialData();
  }, []);

  const handleAddOverhead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOverhead.title || !newOverhead.amount) {
      alert('Please enter overhead title and amount');
      return;
    }

    try {
      const res = await fetch('/api/analytics/financials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOverhead)
      });
      const json = await res.json();
      if (json.success) {
        setIsOverheadModalOpen(false);
        setNewOverhead({
          title: '',
          amount: 500,
          category: 'Packaging',
          notes: '',
          date: new Date().toISOString().split('T')[0]
        });
        alert('Overhead expense logged successfully!');
        loadFinancialData();
      }
    } catch {
      alert('Failed to log overhead expense');
    }
  };

  const handleDownloadCSV = (reportType: string) => {
    if (!metrics) return;

    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'daily') {
      csvContent += 'Date,Revenue (INR),Net Profit (INR)\n';
      metrics.dailyTrends.forEach(d => {
        csvContent += `${d.date},${d.revenue},${d.profit}\n`;
      });
    } else if (reportType === 'category') {
      csvContent += 'Category,Items Sold Count,Total Revenue (INR)\n';
      metrics.salesByCategory.forEach(c => {
        csvContent += `${c.category},${c.count},${c.revenue}\n`;
      });
    } else if (reportType === 'overheads') {
      csvContent += 'ID,Date,Title,Category,Amount (INR),Notes\n';
      metrics.overheads.forEach(ov => {
        csvContent += `${ov.id},${ov.date},"${ov.title}",${ov.category},${ov.amount},"${ov.notes || ''}"\n`;
      });
    } else {
      csvContent += 'Metric,Amount (INR)\n';
      csvContent += `Total Revenue,${metrics.totalRevenue}\n`;
      csvContent += `Total Product Cost (CP),${metrics.totalCost}\n`;
      csvContent += `Total Shop Overheads,${metrics.totalOverheads}\n`;
      csvContent += `Gross Profit,${metrics.grossProfit}\n`;
      csvContent += `True Net Profit,${metrics.netProfit}\n`;
      csvContent += `Total Verified Orders,${metrics.totalOrders}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Anita_Gift_House_${reportType}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExecuteMonthPurge = async () => {
    if (!confirm('Execute Month-End Free-Tier Data Purge? Delivered orders will be archived to JSON and cleared from the live database database.')) {
      return;
    }

    try {
      const res = await fetch('/api/admin/purge-month', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        // Trigger file download of full archive JSON
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json.archive, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `${json.archive.monthYear.replace(/\s+/g, '_')}_Full_Archive.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.removeChild(downloadAnchor);

        alert(`Successfully archived and purged ${json.archivedCount} delivered order rows! Free-tier database quota preserved.`);
        loadFinancialData();
      }
    } catch {
      alert('Error executing data purge');
    }
  };

  return (
    <div className="min-h-screen bg-cream text-espresso font-sans p-4 sm:p-8 space-y-8">
      {/* Top Bar Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-border pb-6">
        <div>
          <Link href="/admin" className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Admin Control Center
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-espresso flex items-center gap-2">
            <FileSpreadsheet className="w-7 h-7 text-terracotta" />
            Financial Reports, Overhead Tracker & Free-Tier Data Purge
          </h1>
          <p className="text-xs text-espresso/60 mt-1">
            Manual Shop Overhead Expenses (Selling Price - Cost Price - Overheads math), CSV Financial Exporters & Automated Month-End Sweep.
          </p>
        </div>

        <button
          onClick={() => setIsOverheadModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-terracotta text-cream text-xs font-bold rounded-xl shadow hover:bg-crimson transition"
        >
          <Plus className="w-4 h-4" /> Log Shop Overhead Expense
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* METRICS & NET PROFIT CARDS */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-cream border border-cream-border rounded-3xl p-6 shadow-sm space-y-2">
              <span className="text-xs font-bold text-espresso/60 uppercase tracking-wider">Total Revenue</span>
              <p className="text-3xl font-serif font-extrabold text-crimson font-mono">
                ₹{metrics.totalRevenue.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-espresso/60">Verified Orders</p>
            </div>

            <div className="bg-cream border border-cream-border rounded-3xl p-6 shadow-sm space-y-2">
              <span className="text-xs font-bold text-espresso/60 uppercase tracking-wider">Total Product Cost (CP)</span>
              <p className="text-3xl font-serif font-extrabold text-espresso font-mono">
                ₹{metrics.totalCost.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-espresso/60">Aggregated Item Acquisition</p>
            </div>

            <div className="bg-cream border border-cream-border rounded-3xl p-6 shadow-sm space-y-2">
              <span className="text-xs font-bold text-espresso/60 uppercase tracking-wider">Total Shop Overheads</span>
              <p className="text-3xl font-serif font-extrabold text-terracotta font-mono">
                ₹{metrics.totalOverheads.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-espresso/60">Packaging, Utility & Tips</p>
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
        )}

        {/* OVERHEAD EXPENSES DATA TABLE */}
        {metrics && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-espresso flex items-center gap-2">
                <Receipt className="w-5 h-5 text-terracotta" />
                Manual Shop Overhead Expenses Ledger
              </h2>
              <button
                onClick={() => handleDownloadCSV('overheads')}
                className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Download Overheads CSV
              </button>
            </div>

            <div className="bg-cream border border-cream-border rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-cream-muted border-b border-cream-border text-espresso/70 font-bold uppercase tracking-wider">
                      <th className="p-4">Date</th>
                      <th className="p-4">Expense Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Amount (₹)</th>
                      <th className="p-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-border">
                    {metrics.overheads.map(ov => (
                      <tr key={ov.id} className="hover:bg-cream-muted/50 transition">
                        <td className="p-4 font-mono font-bold text-espresso/70">{ov.date}</td>
                        <td className="p-4 font-bold text-espresso">{ov.title}</td>
                        <td className="p-4 font-semibold text-terracotta">{ov.category}</td>
                        <td className="p-4 font-mono font-bold text-crimson">₹{ov.amount.toLocaleString('en-IN')}</td>
                        <td className="p-4 text-espresso/70 italic">{ov.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: CSV REPORT EXPORT BUTTONS */}
        <div className="bg-cream border border-cream-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-serif font-bold text-espresso flex items-center gap-2">
            <Download className="w-5 h-5 text-terracotta" />
            Financial Report Downloads (CSV Format)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleDownloadCSV('daily')}
              className="p-5 bg-cream-muted border border-cream-border rounded-2xl text-left hover:border-terracotta transition space-y-2 group"
            >
              <FileSpreadsheet className="w-6 h-6 text-terracotta group-hover:scale-110 transition transform" />
              <span className="font-serif font-bold text-sm text-espresso block">Daily Sales & Profit Ledger</span>
              <span className="text-[11px] text-espresso/60 block">Day-by-day revenue vs net profit records.</span>
            </button>

            <button
              onClick={() => handleDownloadCSV('category')}
              className="p-5 bg-cream-muted border border-cream-border rounded-2xl text-left hover:border-terracotta transition space-y-2 group"
            >
              <FileSpreadsheet className="w-6 h-6 text-gold-dark group-hover:scale-110 transition transform" />
              <span className="font-serif font-bold text-sm text-espresso block">Category Revenue Breakdown</span>
              <span className="text-[11px] text-espresso/60 block">Category performance & item volumes.</span>
            </button>

            <button
              onClick={() => handleDownloadCSV('master')}
              className="p-5 bg-cream-muted border border-cream-border rounded-2xl text-left hover:border-terracotta transition space-y-2 group"
            >
              <FileSpreadsheet className="w-6 h-6 text-emerald-800 group-hover:scale-110 transition transform" />
              <span className="font-serif font-bold text-sm text-espresso block">Master Financial P&L Summary</span>
              <span className="text-[11px] text-espresso/60 block">Total revenue, costs, overheads & net profit.</span>
            </button>
          </div>
        </div>

        {/* SECTION 3: MONTH-END FREE TIER AUTOMATED DATA PURGE ENGINE */}
        <div className="bg-gradient-to-br from-espresso to-crimson text-cream border border-gold/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-gold flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-gold animate-pulse" />
                Month-End Automated Free-Tier Data Purge System
              </h2>
              <p className="text-xs text-cream/70 mt-1">
                One-click sweep to export delivered orders to JSON archive and clear database quota.
              </p>
            </div>

            <button
              onClick={handleExecuteMonthPurge}
              className="px-6 py-3 bg-gradient-to-r from-gold to-amberGold text-espresso font-extrabold text-xs rounded-xl shadow-lg hover:brightness-110 transition flex items-center gap-2 uppercase tracking-wider"
            >
              <Trash2 className="w-4 h-4 text-espresso" /> Execute Month-End Data Purge
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-cream/80">
            <div className="p-4 bg-cream/10 rounded-2xl border border-gold/20 space-y-1">
              <span className="font-bold text-gold block font-serif">1. Full JSON Export</span>
              <p className="text-[11px] text-cream/70">Downloads complete order records in Month_Year_Full_Archive.json.</p>
            </div>
            <div className="p-4 bg-cream/10 rounded-2xl border border-gold/20 space-y-1">
              <span className="font-bold text-gold block font-serif">2. DB Row Cleanup</span>
              <p className="text-[11px] text-cream/70">Deletes delivered rows to save database storage quota.</p>
            </div>
            <div className="p-4 bg-cream/10 rounded-2xl border border-gold/20 space-y-1">
              <span className="font-bold text-gold block font-serif">3. Metrics Continuity</span>
              <p className="text-[11px] text-cream/70">Preserves monthly summary totals, catalog, and active pending orders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* LOG OVERHEAD EXPENSE MODAL */}
      {isOverheadModalOpen && (
        <div className="fixed inset-0 z-50 bg-espresso/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-cream border border-cream-border rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-cream-border pb-3">
              <h3 className="font-serif font-bold text-lg text-espresso">Log Shop Overhead Expense</h3>
              <button onClick={() => setIsOverheadModalOpen(false)} className="text-espresso/60 hover:text-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOverhead} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-espresso mb-1">Expense Title *</label>
                <input
                  type="text"
                  required
                  value={newOverhead.title}
                  onChange={e => setNewOverhead({ ...newOverhead, title: e.target.value })}
                  placeholder="e.g. Velvet Gift Boxes & Satin Ribbons"
                  className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-espresso mb-1">Expense Category</label>
                  <select
                    value={newOverhead.category}
                    onChange={e => setNewOverhead({ ...newOverhead, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-medium"
                  >
                    <option value="Packaging">Packaging</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Delivery Tips">Delivery Tips</option>
                    <option value="Rent">Shop Rent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-espresso mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newOverhead.amount}
                    onChange={e => setNewOverhead({ ...newOverhead, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-espresso mb-1">Notes / Description</label>
                <input
                  type="text"
                  value={newOverhead.notes}
                  onChange={e => setNewOverhead({ ...newOverhead, notes: e.target.value })}
                  placeholder="Optional details..."
                  className="w-full px-3 py-2 bg-cream-muted border border-cream-border rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOverheadModalOpen(false)}
                  className="px-4 py-2 border border-cream-border rounded-xl text-espresso hover:bg-cream-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-terracotta text-cream font-bold rounded-xl hover:bg-crimson transition shadow"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
