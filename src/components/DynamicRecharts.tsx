'use client';

import React, { useEffect, useState } from 'react';
import { FinancialMetrics } from '@/types';

interface DynamicRechartsProps {
  metrics: FinancialMetrics;
  type: 'line' | 'pie' | 'bar';
}

const CATEGORY_COLORS: Record<string, string> = {
  Rakhi: '#7A1C1C',
  Handpicked: '#8B3A2B',
  Hampers: '#D4AF37',
  Toys: '#E5A93C',
  Gifts: '#221C1B',
  'Special Offers': '#982727'
};

export const DynamicRecharts: React.FC<DynamicRechartsProps> = ({ metrics, type }) => {
  const [RechartsModule, setRechartsModule] = useState<any>(null);

  useEffect(() => {
    import('recharts').then(mod => {
      setRechartsModule(mod);
    }).catch(err => console.error('Failed to load recharts', err));
  }, []);

  if (!RechartsModule) {
    return (
      <div className="h-72 w-full bg-cream-muted border border-cream-border rounded-2xl flex items-center justify-center text-xs text-espresso/50 font-mono animate-pulse">
        Loading Real-Time Analytics Graph...
      </div>
    );
  }

  const {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid
  } = RechartsModule;

  if (type === 'line') {
    return (
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics.dailyTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D8" />
            <XAxis dataKey="date" stroke="#665A57" fontSize={11} />
            <YAxis stroke="#665A57" fontSize={11} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#7A1C1C" strokeWidth={3} name="Revenue (₹)" />
            <Line type="monotone" dataKey="profit" stroke="#D4AF37" strokeWidth={3} name="Net Profit (₹)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'pie') {
    return (
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={metrics.salesByCategory}
              dataKey="revenue"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {metrics.salesByCategory.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || '#8B3A2B'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'bar') {
    return (
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={metrics.topProfitableItems}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D8" />
            <XAxis dataKey="title" stroke="#665A57" fontSize={10} />
            <YAxis stroke="#665A57" fontSize={11} />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8B3A2B" name="Total Revenue (₹)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="profit" fill="#E5A93C" name="Gross Profit (₹)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
};
