import React from 'react';
import { X, Star, BadgeCheck, Shield, ChevronLeft } from 'lucide-react';
import { LeadershipOfficer } from '../types';

interface LeadershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  officers: LeadershipOfficer[];
}

export const LeadershipModal: React.FC<LeadershipModalProps> = ({ isOpen, onClose, officers }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0a0d14] border border-amber-500/40 rounded-2xl p-6 sm:p-8 text-right shadow-[0_0_50px_rgba(212,175,55,0.25)] my-8 max-h-[90vh] overflow-y-auto">
        
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
            <BadgeCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gold-gradient font-['Cairo']">
              إدارة الأكاديمية والهيكل القيادي | Leadership Board
            </h2>
            <p className="text-xs text-amber-300/80 mt-1">
              القيادات العليا والمسؤولون عن التطوير والتخطيط الميداني في أكاديمية الشرطة
            </p>
          </div>
        </div>

        {/* Officers Cards List */}
        <div className="space-y-4">
          {officers.map((officer) => (
            <div
              key={officer.id}
              className="bg-[#0e121d] border border-amber-500/20 hover:border-amber-400/50 rounded-xl p-5 flex flex-col md:flex-row items-center md:items-start gap-5 transition-all"
            >
              {/* Officer Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-b from-amber-300 via-yellow-500 to-amber-700 shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center overflow-hidden">
                  {officer.avatarUrl && officer.avatarUrl.trim() !== '' ? (
                    <img
                      src={officer.avatarUrl}
                      alt={officer.titleAr}
                      className="w-full h-full object-cover rounded-full filter contrast-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#111622] flex items-center justify-center text-amber-300 font-bold text-sm">
                      {officer.name ? officer.name.slice(0, 2) : 'قائد'}
                    </div>
                  )}
                </div>
              </div>

              {/* Officer Info */}
              <div className="flex-1 text-center md:text-right space-y-1.5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-['Tajawal']">
                      {officer.rank}
                    </span>
                    <h3 className="text-xl font-black text-gold-gradient font-['Cairo']">
                      {officer.titleAr} ({officer.name})
                    </h3>
                  </div>

                  <div className="flex items-center justify-center md:justify-end gap-1 text-amber-400">
                    {Array.from({ length: officer.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-gray-400 pt-1">
                  <span className="bg-[#141a29] px-2.5 py-1 rounded text-amber-300 border border-amber-500/20">
                    القسم: {officer.department}
                  </span>
                  <span className="bg-[#141a29] px-2.5 py-1 rounded text-gray-300 font-mono">
                    الكود العسكري: {officer.badgeNumber}
                  </span>
                </div>

                {officer.bio && (
                  <p className="text-xs text-gray-300 pt-2 leading-relaxed font-medium">
                    {officer.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-amber-500/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-xs font-bold hover:bg-gray-700"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
