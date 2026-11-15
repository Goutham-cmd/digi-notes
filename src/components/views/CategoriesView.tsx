'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { mockCategories } from '@/data/mockData';
import {
  Cpu,
  BrainCircuit,
  Binary,
  Zap,
  Globe,
  ShieldCheck,
  Wrench,
  Briefcase,
  LayoutGrid,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export default function CategoriesView() {
  const { navigateToSubject } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return Cpu;
      case 'BrainCircuit':
        return BrainCircuit;
      case 'Binary':
        return Binary;
      case 'Zap':
        return Zap;
      case 'Globe':
        return Globe;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Wrench':
        return Wrench;
      case 'Briefcase':
        return Briefcase;
      default:
        return LayoutGrid;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Browse by Academic Departments & Faculties
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Select an academic discipline to discover course-specific lecture slides, exam solutions,
          and peer-submitted summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {mockCategories.map((category) => {
          const Icon = getIcon(category.iconName);

          return (
            <div
              key={category.id}
              onClick={() => navigateToSubject(category.name.split('&')[0].trim())}
              className="group bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-indigo-300 card-3d-lift cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header with Icon and Count badge */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${category.iconBg} flex items-center justify-center transition-transform group-hover:scale-105`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${category.badgeBg} ${category.badgeColor}`}
                  >
                    {category.resourceCount} Notes
                  </span>
                </div>

                {/* Category Name */}
                <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {category.name}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>

                {/* Popular Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {category.popularTags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {category.popularTags.length > 3 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{category.popularTags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action footer */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
                <span>{category.coursesCount} active courses</span>
                <span className="flex items-center gap-1 text-indigo-600">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
