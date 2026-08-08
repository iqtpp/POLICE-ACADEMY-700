import React, { useState } from 'react';
import { X, ClipboardList, CheckCircle, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';
import { RecruitmentApplication, SiteSettings } from '../types';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitApp: (app: Omit<RecruitmentApplication, 'id' | 'status' | 'submittedAt'>) => Promise<void>;
  siteSettings?: SiteSettings;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmitApp,
  siteSettings,
}) => {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [discordId, setDiscordId] = useState('');
  const [gameId, setGameId] = useState('');
  const [experience, setExperience] = useState('');
  const [whyJoin, setWhyJoin] = useState('');
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!fullName || !age || !discordId || !whyJoin) {
      setErrorMsg('يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح.');
      return;
    }

    if (!acceptedRules) {
      setErrorMsg('يجب الموافقة على قوانين ولوائح الأكاديمية للمتابعة.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await onSubmitApp({
        fullName,
        age: Number(age),
        discordId,
        gameId: gameId || '-',
        experience,
        whyJoin,
        acceptedRules,
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit academy application:', error);
      setErrorMsg(
        error instanceof Error
          ? error.message
          : 'تعذر إرسال الطلب حالياً. حاول مرة أخرى.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFullName('');
    setAge('');
    setDiscordId('');
    setGameId('');
    setExperience('');
    setWhyJoin('');
    setAcceptedRules(false);
    setIsSubmitted(false);
    setErrorMsg('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0a0d14] border border-amber-500/40 rounded-2xl p-6 sm:p-8 text-right shadow-[0_0_50px_rgba(212,175,55,0.25)] my-8 max-h-[90vh] overflow-y-auto">
        
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
            <ClipboardList className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gold-gradient font-['Cairo']">
              استمارة التقديم على أكاديمية الشرطة
            </h2>
            <p className="text-xs text-amber-300/80 mt-1">
              انضم لصفوف الأكاديمية وإبدأ رحلتك التدريبية الاحترافية
            </p>
          </div>
        </div>

        {siteSettings?.recruitmentOpen === false ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-red-300 font-['Cairo']">
              التقديم مغلق حالياً
            </h3>

            <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
              {siteSettings?.recruitmentNotice || 'استمارة التقديم على الأكاديمية مغلقة حالياً بقرار من إدارة القبول والتدريب.'}
            </p>

            <button
              onClick={onClose}
              className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold mt-2"
            >
              إغلاق النافذة
            </button>
          </div>
        ) : isSubmitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(212,175,55,0.3)] animate-bounce">
              <CheckCircle className="w-10 h-10 text-amber-400" />
            </div>

            <h3 className="text-2xl font-black text-gold-gradient font-['Cairo']">
              تم تقديم طلبك بنجاح!
            </h3>

            <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
              تم تسليم طلب الالتحاق إلى لجنة القبول والتسجيل في الأكاديمية. سيتم مراجعة الطلب التواصل معك عبر الديسكورد لاستكمال إجراءات المقابلة الميدانية.
            </p>

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 max-w-md mx-auto font-medium">
              ملاحظة: يمكنك متابعة حالة الطلب من خلال التواصل مع لجنة القبول والتسجيل أو لوحة الإدارة.
            </div>

            <button
              onClick={handleReset}
              className="gold-btn px-8 py-3 rounded-xl text-xs font-bold mt-4"
            >
              العودة للرئيسية
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1.5 font-['Cairo']">
                  الاسم الثلاثي (العسكري / باللغة العربية) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: خالد بن سلطان العتيبي"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111622] border border-amber-500/30 text-gray-200 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1.5 font-['Cairo']">
                  العمر *
                </label>
                <input
                  type="number"
                  required
                  min={18}
                  max={60}
                  placeholder="مثال: 22"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111622] border border-amber-500/30 text-gray-200 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-amber-200 mb-1.5 font-['Cairo']">
                  معرف الديسكورد (Discord ID / Username) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: officer_khalid#1234"
                  value={discordId}
                  onChange={(e) => setDiscordId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111622] border border-amber-500/30 text-gray-200 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

            </div>

            <div>
              <label className="block text-xs font-bold text-amber-200 mb-1.5 font-['Cairo']">
                الخبرات السابقة في المجال العسكري أو القيادي
              </label>
              <textarea
                rows={2}
                placeholder="اذكر القطاعات أو الدورات الأمنية التي أتممتها سابقاً..."
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111622] border border-amber-500/30 text-gray-200 text-xs focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-200 mb-1.5 font-['Cairo']">
                سبب الرغبة في الانضمام لأكاديمية الشرطة *
              </label>
              <textarea
                rows={3}
                required
                placeholder="تحدث بشكل مختصر عن دوافعك للالتحاق بالأكاديمية ورؤيتك للتطوير..."
                value={whyJoin}
                onChange={(e) => setWhyJoin(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111622] border border-amber-500/30 text-gray-200 text-xs focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <input
                type="checkbox"
                id="acceptedRules"
                checked={acceptedRules}
                onChange={(e) => setAcceptedRules(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
              <label htmlFor="acceptedRules" className="text-xs text-gray-300 cursor-pointer font-medium">
                أتعهد بالالتزام التام بكافة قوانين ولوائح أكاديمية الشرطة واحترام السلسلة القيادية العسكرية.
              </label>
            </div>

            <div className="pt-4 border-t border-amber-500/30 flex justify-between items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="gold-btn px-8 py-3 rounded-xl text-xs font-extrabold inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال طلب التقديم'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-xs font-bold hover:bg-gray-700"
              >
                إلغاء
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
