import React from 'react';
import { Lock, Shield, Menu, X } from 'lucide-react';
import { ActiveTab, SiteSettings } from '../types';
import badgeImg from '../assets/images/police_gold_badge_1785941230134.jpg';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openAdminModal: () => void;
  siteSettings?: SiteSettings;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openAdminModal,
  siteSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'about', label: 'عن الأكاديمية' },
    { id: 'rules', label: 'القوانين' },
    { id: 'apply', label: 'التقديم' },
    { id: 'members', label: 'أعضاء الأكاديمية' },
    { id: 'leadership', label: 'إدارة الأكاديمية' },
    { id: 'contact', label: 'تواصل معنا' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090d14]/90 backdrop-blur-md border-b border-[#3a2e10]/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo on Right (RTL Layout) */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-transform group-hover:scale-105">
              <img 
                src={badgeImg} 
                alt="Police Academy Emblem" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-gold-gradient tracking-wide leading-none font-['Cairo']">
                {siteSettings?.siteName || 'أكاديمية الشرطة'}
              </span>
              <span className="text-[10px] tracking-widest text-amber-200/70 font-semibold uppercase mt-1">
                {siteSettings?.siteSubtitle || 'POLICE ACADEMY'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 space-x-reverse">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 text-sm font-bold transition-all relative rounded-md ${
                    isActive
                      ? 'text-yellow-400 font-extrabold'
                      : 'text-gray-300 hover:text-yellow-200 hover:bg-amber-500/10'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 shadow-[0_0_10px_#ffd700] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Left Side: Admin Dashboard Lock Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={openAdminModal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#141108] border border-amber-500/50 text-amber-300 hover:text-white hover:border-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all duration-300 shadow-[0_0_12px_rgba(212,175,55,0.15)] group"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>لوحة الإدارة</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0e17] border-b border-amber-500/30 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-right px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500/20 border border-amber-500/50 text-yellow-300'
                    : 'text-gray-300 hover:bg-amber-500/10 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
