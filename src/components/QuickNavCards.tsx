import React from 'react';
import { ShieldCheck, Gavel, ClipboardList, Users, BadgeCheck, Headphones } from 'lucide-react';
import { ActiveTab, QuickFeatureCard } from '../types';

interface QuickNavCardsProps {
  cards: QuickFeatureCard[];
  onCardClick: (id: ActiveTab) => void;
}

export const QuickNavCards: React.FC<QuickNavCardsProps> = ({ cards, onCardClick }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform duration-300" />;
      case 'Gavel':
        return <Gavel className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform duration-300" />;
      case 'ClipboardList':
        return <ClipboardList className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform duration-300" />;
      case 'Users':
        return <Users className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform duration-300" />;
      case 'BadgeCheck':
        return <BadgeCheck className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform duration-300" />;
      case 'Headphones':
        return <Headphones className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform duration-300" />;
      default:
        return <ShieldCheck className="w-8 h-8 text-amber-400" />;
    }
  };

  return (
    <section className="my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => onCardClick(card.id)}
            className="gold-card rounded-xl p-5 cursor-pointer flex flex-col items-center text-center group relative overflow-hidden"
          >
            {/* Top Gold Corner Glow Accent */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-400/20 transition-all duration-300" />

            {/* Icon Box */}
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/30 group-hover:border-amber-400/60 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all">
              {getIcon(card.iconName)}
            </div>

            {/* Title */}
            <h3 className="text-base font-extrabold text-amber-200 group-hover:text-yellow-300 transition-colors font-['Cairo']">
              {card.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-gray-400 mt-2 leading-relaxed font-medium group-hover:text-gray-300">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
