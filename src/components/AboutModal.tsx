import React from 'react';
import { X, ShieldCheck, Target, Award, BookOpen } from 'lucide-react';
import badgeImg from '../assets/images/police_gold_badge_1785941230134.jpg';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyClick: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onApplyClick }) => {
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
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-amber-500/30">
          <img src={badgeImg} alt="Badge" className="w-14 h-14 rounded-full border border-amber-400 p-0.5" referrerPolicy="no-referrer" />
          <div>
            <h2 className="text-2xl font-black text-gold-gradient font-['Cairo']">
              عن أكاديمية الشرطة | About Academy
            </h2>
            <p className="text-xs text-amber-300/80 mt-1">
              المعهد التأهيلي العسكري للأداء الميداني رفيع المستوى
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <h3 className="text-base font-extrabold text-amber-200 mb-2 font-['Cairo'] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-yellow-400" />
              <span>الرؤية والرسالة</span>
            </h3>
            <p>
              تعد أكاديمية الشرطة الركيزة الأساسية لإعداد وبناء الضباط والمستجدين، حيث توفر بيئة تدريبية احترافية تجمع بين الانضباط التكتيكي الميداني، والتأهيل العلمي والقانوني الشامل. تسعى الأكاديمية لخلق كوادر أمنية قيادية قادرة على التعامل مع كافة الظروف والأزمات بكفاءة واقتدار.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-[#0e121d] p-4 rounded-xl border border-amber-500/20">
              <div className="p-2.5 w-fit rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-amber-200 mb-1 font-['Cairo']">الأهداف الاستراتيجية</h4>
              <p className="text-xs text-gray-400">
                تطوير مهارات القيادة، رفع مستوى الجاهزية الميدانية، وترسيخ قيم الانضباط والالتزام بالأنظمة.
              </p>
            </div>

            <div className="bg-[#0e121d] p-4 rounded-xl border border-amber-500/20">
              <div className="p-2.5 w-fit rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-amber-200 mb-1 font-['Cairo']">الجودة والتميز</h4>
              <p className="text-xs text-gray-400">
                اعتماد أحدث التكتيكات الأمنية ومحاكاة المواقف الميدانية الصعبة لاختبار قدرات المتدربين.
              </p>
            </div>

            <div className="bg-[#0e121d] p-4 rounded-xl border border-amber-500/20">
              <div className="p-2.5 w-fit rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-amber-200 mb-1 font-['Cairo']">المناهج التأهيلية</h4>
              <p className="text-xs text-gray-400">
                برامج مكثفة تغطي الرماية التكتيكية، الإستجابة السريعة، والمداهمات والشؤون القانونية.
              </p>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-amber-500/30 flex justify-between items-center">
          <button
            onClick={() => {
              onClose();
              onApplyClick();
            }}
            className="gold-btn px-6 py-2.5 rounded-lg text-xs font-bold inline-flex items-center gap-2"
          >
            <span>تقديم طلب التحاق بالأكاديمية</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-gray-800 text-gray-300 text-xs font-bold hover:bg-gray-700"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
