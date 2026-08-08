import React from 'react';
import { ChevronLeft, Award, Shield } from 'lucide-react';
import { SiteSettings } from '../types';
import badgeImg from '../assets/images/police_gold_badge_1785941230134.jpg';
import heroBgImg from '../assets/images/police_hero_bg_1785941214189.jpg';

interface HeroSectionProps {
  onApplyClick: () => void;
  siteSettings?: SiteSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onApplyClick, siteSettings }) => {
  return (
    <section className="relative min-h-[440px] lg:min-h-[480px] w-full rounded-2xl overflow-hidden border border-[#3a2e10] my-6 shadow-[0_0_35px_rgba(0,0,0,0.8)]">
      
      {/* Background Image with Dark & Golden Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgImg}
          alt="Police Patrol Night City Skyline"
          className="w-full h-full object-cover object-center scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Dark Gradient Overlay matching image framing */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080d] via-[#090d15]/85 to-[#06080d]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-transparent to-black/50" />
        
        {/* Subtle Police Emergency Beacon Lights Ambient Glow */}
        <div className="absolute top-1/4 right-10 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl animate-beacon-blue pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-red-600/15 rounded-full blur-3xl animate-beacon-red pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 lg:py-14 h-full flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side (in RTL): Large Gold Emblem Badge */}
        <div className="flex-shrink-0 flex justify-center order-1 md:order-1">
          <div className="relative group">
            {/* Rotating Outer Glow Effect */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 opacity-30 blur-xl group-hover:opacity-60 transition duration-700 animate-pulse" />
            
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full p-1.5 bg-gradient-to-b from-yellow-200 via-amber-500 to-amber-800 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              <img
                src={badgeImg}
                alt="Police Academy Seal"
                className="w-full h-full object-cover rounded-full filter drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Right Side / Center Text Content */}
        <div className="flex-1 text-right max-w-2xl order-2 md:order-2">
          
          {/* Main Title Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3 backdrop-blur-sm">
            <Shield className="w-3.5 h-3.5 text-yellow-400" />
            <span>{siteSettings?.heroBadgeText || 'الصرح الأمني القيادي الأول'}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gold-gradient tracking-tight font-['Cairo'] uppercase leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            {siteSettings?.heroHeadline || 'POLICE ACADEMY'}
          </h1>

          <h2 className="text-xl sm:text-2xl font-bold text-amber-200/90 mt-2 tracking-wide font-['Tajawal']">
            {siteSettings?.heroSubtitle || 'نصنع القادة .. تحمي المستقبل'}
          </h2>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-4 font-medium max-w-xl text-shadow-sm">
            {siteSettings?.heroDescription || 'تلتزم أكاديمية الشرطة بتدريب وتطوير أفضل الكوادر الأمنية وفق أعلى المعايير المهنية والانضباطية.'}
          </p>

          {/* CTA Action Button */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              onClick={onApplyClick}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-b from-[#1c160a] to-[#0a0804] border border-amber-400/80 text-yellow-300 hover:text-white hover:border-yellow-300 hover:bg-amber-500/20 text-base font-extrabold transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] group"
            >
              <span>{siteSettings?.recruitmentOpen === false ? 'رابط القبول' : 'تقديم الآن'}</span>
              <ChevronLeft className="w-5 h-5 text-amber-400 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>

    </section>
  );
};
