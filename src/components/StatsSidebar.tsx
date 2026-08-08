import React from 'react';
import { Star, GraduationCap, Users, Award, Building2 } from 'lucide-react';
import { AcademyStat } from '../types';

interface StatsSidebarProps {
  stats: AcademyStat[];
}

export const StatsSidebar: React.FC<StatsSidebarProps> = ({ stats }) => {
  const getStatIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-amber-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-amber-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-amber-400" />;
      default:
        return <Award className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="gold-card rounded-2xl p-6 h-full flex flex-col justify-between relative overflow-hidden">
      
      {/* Sidebar Header */}
      <div>
        <div className="flex items-center gap-2 pb-4 mb-5 border-b border-amber-500/30">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <h2 className="text-xl font-black text-gold-gradient font-['Cairo']">
            إحصائيات الأكاديمية
          </h2>
        </div>

        {/* Stats Items */}
        <div className="space-y-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-[#0b0e16] border border-amber-500/20 hover:border-amber-400/50 rounded-xl p-3.5 flex items-center justify-between transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] group"
            >
              {/* Left Side (in RTL): Icon & Label */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 group-hover:bg-amber-500/20 group-hover:border-amber-400/60 transition-colors">
                  {getStatIcon(stat.iconName)}
                </div>
                <span className="text-sm font-bold text-gray-200 group-hover:text-amber-200 transition-colors font-['Tajawal']">
                  {stat.label}
                </span>
              </div>

              {/* Right Side (in RTL): Glowing Golden Value */}
              <div className="text-2xl font-black text-gold-gradient font-['Cairo'] tracking-tight pl-2">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Quote or Status */}
      <div className="mt-6 pt-4 border-t border-amber-500/20 text-center">
        <span className="text-[11px] text-amber-300/80 font-medium tracking-wide">
          تحديث تلقائي ومباشر للنظام الميداني
        </span>
      </div>

    </div>
  );
};
