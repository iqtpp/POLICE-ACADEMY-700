import React, { useState } from 'react';
import { X, Gavel, Search, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AcademyRule } from '../types';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: AcademyRule[];
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, rules }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  if (!isOpen) return null;

  const categories = ['الكل', 'الانضباط', 'عامة', 'الميدان', 'العقوبات'];

  const filteredRules = rules.filter((rule) => {
    const matchesCategory = selectedCategory === 'الكل' || rule.category === selectedCategory;
    const matchesSearch =
      rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0a0d14] border border-amber-500/40 rounded-2xl p-6 sm:p-8 text-right shadow-[0_0_50px_rgba(212,175,55,0.25)] my-8 max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-amber-500/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-amber-500/30">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Gavel className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gold-gradient font-['Cairo']">
              قوانين ولوائح الأكاديمية | Academy Bylaws
            </h2>
            <p className="text-xs text-amber-300/80 mt-1">
              اللوائح المنظمة للعمل الميداني والسلوك العسكري داخل الأكاديمية
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400/70 absolute right-3.5 top-3.5" />
            <input
              type="text"
              placeholder="ابحث في القوانين واللوائح..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#111622] border border-amber-500/30 text-gray-200 text-xs focus:outline-none focus:border-amber-400 placeholder:text-gray-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500/20 border border-amber-400 text-yellow-300 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                    : 'bg-[#111622] border border-amber-500/20 text-gray-400 hover:text-gray-200 hover:bg-amber-500/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Rules List Container */}
        <div className="space-y-3 overflow-y-auto pr-1 pl-2 flex-1 max-h-[50vh]">
          {filteredRules.length > 0 ? (
            filteredRules.map((rule, idx) => (
              <div
                key={rule.id}
                className="bg-[#0e121d] border border-amber-500/20 hover:border-amber-400/50 rounded-xl p-4 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center font-['Cairo']">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-extrabold text-amber-200 font-['Cairo']">
                      {rule.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                      {rule.category}
                    </span>
                    {rule.importance === 'عالي' && (
                      <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        إلزامي
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed pl-8 font-medium">
                  {rule.content}
                </p>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400 text-xs">
              لا توجد قوانين مطابقة للبحث الحالية.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-amber-500/30 flex justify-between items-center">
          <span className="text-xs text-amber-300/70 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            جميع اللوائح معتمدة ومحدثة من قبل القيادة العامة للأكاديمية
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs font-bold hover:bg-gray-700"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
