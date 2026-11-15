'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import ThreeDCard from '@/components/common/ThreeDCard';

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  onClick?: () => void;
}

export default function StatsCard({
  label,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconBg,
  iconColor,
  onClick,
}: StatsCardProps) {
  return (
    <ThreeDCard
      intensity={9}
      depth={12}
      onClick={onClick}
      className={`h-full ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-indigo-300 card-3d-lift h-full flex flex-col justify-between">
        <div className="flex items-center justify-between" style={{ transform: 'translateZ(10px)' }}>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </span>
          <div
            className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 shadow-sm`}
            style={{ transform: 'translateZ(16px)' }}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-2" style={{ transform: 'translateZ(14px)' }}>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
          {change && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {change}
            </span>
          )}
        </div>
      </div>
    </ThreeDCard>
  );
}
