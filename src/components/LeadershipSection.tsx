import React from 'react';
import { Star, ChevronLeft } from 'lucide-react';
import { LeadershipOfficer } from '../types';

interface LeadershipSectionProps {
  officers: LeadershipOfficer[];
  onViewAllClick: () => void;
  onOfficerClick: (officer: LeadershipOfficer) => void;
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({
  officers,
  onViewAllClick,
  onOfficerClick,
}) => {
  return (
    <div className="gold-card rounded-2xl p-6 relative overflow-hidden">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-amber-500/30">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <h2 className="text-xl font-black text-gold-gradient font-['Cairo']">
            إدارة الأكاديمية
          </h2>
        </div>
        <span className="text-xs text-amber-300/70 font-semibold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          الهيكل القيادي العام
        </span>
      </div>

      {/* Officers Cards Horizontal/Grid Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {officers.map((officer) => (
          <div
            key={officer.id}
            onClick={() => onOfficerClick(officer)}
            className="bg-[#0b0e16] border border-amber-500/20 hover:border-amber-400/60 rounded-xl p-4 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] group"
          >
            {/* Avatar Frame with Gold Wreath / Emblem */}
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-b from-amber-300 via-yellow-500 to-amber-700 shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all flex items-center justify-center overflow-hidden">
                {officer.avatarUrl && officer.avatarUrl.trim() !== '' ? (
                  <img
                    src={officer.avatarUrl}
                    alt={officer.titleAr}
                    className="w-full h-full object-cover rounded-full filter contrast-110"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#111622] flex items-center justify-center text-amber-300 font-bold text-xs">
                    {officer.name ? officer.name.slice(0, 2) : 'قائد'}
                  </div>
                )}
              </div>
            </div>

            {/* Officer Main Titles */}
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-['Tajawal']">
              {officer.title}
            </span>
            <h3 className="text-sm font-extrabold text-amber-200 group-hover:text-yellow-300 transition-colors mt-0.5 font-['Cairo']">
              {officer.name}
            </h3>

            {/* Rank / Arabic Title */}
            <span className="text-[11px] font-medium text-amber-400/90 mt-1 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
              {officer.titleAr}
            </span>

            {/* Stars Rating / Rank Badge */}
            <div className="flex items-center gap-1 mt-3 text-amber-400">
              {Array.from({ length: officer.stars }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_#ffd700]"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer View All Leadership Button */}
      <div className="mt-6 pt-4 border-t border-amber-500/20 flex justify-center">
        <button
          onClick={onViewAllClick}
          className="gold-btn px-6 py-2.5 rounded-lg text-xs font-bold inline-flex items-center gap-2 group"
        >
          <span>عرض جميع الإدارة</span>
          <ChevronLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
};
