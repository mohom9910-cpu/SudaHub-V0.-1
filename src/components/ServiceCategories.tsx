import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  Satellite, 
  Crown, 
  Palette, 
  Layers,
  LayoutGrid
} from 'lucide-react';
import { ServiceCategory } from '../types.ts';

interface ServiceCategoriesProps {
  selectedCategory: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
  counts: Record<ServiceCategory, number>;
}

export const ServiceCategories: React.FC<ServiceCategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
  counts
}) => {
  const categories: { id: ServiceCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'ALL', label: 'جميع الخدمات', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'AI_SUBSCRIPTIONS', label: 'أدوات الذكاء الاصطناعي', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'SOFTWARE', label: 'البرمجيات والمطورين', icon: <Terminal className="w-4 h-4" /> },
    { id: 'STARLINK', label: 'ستارلينك وإنترنت الفضاء', icon: <Satellite className="w-4 h-4" /> },
    { id: 'STREAMING_CREATIVE', label: 'التصميم والإنتاجية', icon: <Palette className="w-4 h-4" /> },
    { id: 'VIP_SERVICES', label: 'خدمات خاصة VIP', icon: <Crown className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = counts[cat.id] || 0;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            id={`category-tab-${cat.id.toLowerCase()}`}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
              isSelected
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            <span className={isSelected ? 'text-slate-950' : 'text-emerald-400'}>
              {cat.icon}
            </span>
            <span>{cat.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
