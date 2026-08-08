import React, { useState } from 'react';
import { X, Headphones, Send, MessageSquare, CheckCircle, Shield, Globe, MessageCircle, Copy, Check, Bot, Zap, Sparkles } from 'lucide-react';
import { ContactTicket, SiteSettings } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendTicket: (ticket: Omit<ContactTicket, 'id' | 'createdAt' | 'status'>) => void;
  siteSettings?: SiteSettings;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSendTicket, siteSettings }) => {
  const [senderName, setSenderName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [subject, setSubject] = useState('استفسار عن القبول والتقديم');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');
  const [autoReplyMessage, setAutoReplyMessage] = useState('');
  const [copiedUser, setCopiedUser] = useState<string | null>(null);
  const [copiedAutoReply, setCopiedAutoReply] = useState(false);

  if (!isOpen) return null;

  const handleCopyDiscord = (username: string) => {
    navigator.clipboard.writeText(username);
    setCopiedUser(username);
    setTimeout(() => setCopiedUser(null), 2000);
  };

  const handleCopyAutoReplyText = () => {
    if (!autoReplyMessage) return;
    navigator.clipboard.writeText(autoReplyMessage);
    setCopiedAutoReply(true);
    setTimeout(() => setCopiedAutoReply(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !contactInfo || !message) return;

    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedTicketId(ticketId);

    // Build Auto Reply text
    const isAutoReplyEnabled = siteSettings?.autoReplyEnabled !== false; // default true
    const template = siteSettings?.autoReplyTemplate || 
      'مرحباً {NAME}، تم استلام استفسارك بنجاح عبر البوابة الإلكترونية لأكاديمية الشرطة برقم تذكرة مرجعي ({TICKET_ID}). سيقوم فريق الدعم أو مشرفي الأكاديمية بمراجعة طلبك والرد عليك عبر الديسكورد في أسرع وقت. للتواصل المباشر يرجى التواصل معنا عبر الديسكورد: iqtpp أو al3mri0201.';

    const replyText = isAutoReplyEnabled
      ? template.replace(/\{NAME\}/g, senderName).replace(/\{TICKET_ID\}/g, ticketId)
      : '';

    setAutoReplyMessage(replyText);

    // Save ticket to system/admin panel
    onSendTicket({
      senderName,
      contactInfo,
      subject,
      message,
      autoReplyMessage: replyText,
    });

    setIsSent(true);
  };

  const handleReset = () => {
    setSenderName('');
    setContactInfo('');
    setMessage('');
    setGeneratedTicketId('');
    setAutoReplyMessage('');
    setIsSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0a0d14] border border-amber-500/40 rounded-2xl p-6 sm:p-8 text-right shadow-[0_0_50px_rgba(212,175,55,0.25)] my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-amber-500/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Headphones className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gold-gradient font-['Cairo']">
                تواصل معنا والدعم الفني | Contact Us
              </h2>
              <p className="text-xs text-amber-300/80 mt-1">
                تواصل مع قيادة الدعم والاستفسارات الخاصة بأكاديمية الشرطة
              </p>
            </div>
          </div>

          {/* Discord Accounts Badges */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            {['iqtpp', 'al3mri0201'].map((username) => (
              <button
                key={username}
                type="button"
                onClick={() => handleCopyDiscord(username)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 text-xs font-bold hover:bg-indigo-500/30 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                title={`انقر لنسخ اسم مستخدم الديسكورد (${username})`}
              >
                <MessageCircle className="w-4 h-4 text-indigo-400" />
                <span>ديسكورد: <strong className="font-mono text-white text-xs dir-ltr">{username}</strong></span>
                {copiedUser === username ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-indigo-300/70 mr-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {isSent ? (
          <div className="py-6 text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle className="w-9 h-9 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-xl font-black text-gold-gradient font-['Cairo']">
                تم إرسال رسالتك وتوثيقها بنجاح!
              </h3>
              <p className="text-xs text-amber-200/80 mt-1 flex items-center justify-center gap-1.5 font-mono">
                <span>رقم التذكرة المرجعي:</span>
                <strong className="text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">{generatedTicketId}</strong>
              </p>
            </div>

            {/* Auto-Reply Box */}
            {autoReplyMessage && (
              <div className="bg-[#0e1320] border border-indigo-500/40 rounded-2xl p-5 text-right space-y-3 shadow-[0_0_20px_rgba(99,102,241,0.15)] relative overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-400/40 text-indigo-300">
                      <Bot className="w-4 h-4 text-indigo-300" />
                    </div>
                    <span className="text-xs font-black text-indigo-200 font-['Cairo'] flex items-center gap-1.5">
                      الرد الآلي الفوري
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-yellow-300 border border-amber-500/40 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400 animate-pulse" /> تم التوليد آلياً
                      </span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAutoReplyText}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-[11px] font-bold text-indigo-300 hover:bg-indigo-500/20 transition-colors"
                    title="نسخ الرد الآلي"
                  >
                    {copiedAutoReply ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ الرد</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 bg-[#121827] rounded-xl border border-indigo-500/20 text-xs text-gray-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {autoReplyMessage}
                </div>

                <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400 border-t border-indigo-500/10">
                  <span>لأي استفسارات عاجلة إضافية تواصل مباشرة مع الإدارة:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-300 font-mono font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">iqtpp</span>
                    <span className="text-indigo-300 font-mono font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">al3mri0201</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleReset}
              className="gold-btn px-8 py-2.5 rounded-xl text-xs font-bold mt-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
            >
              تم | إغلاق النافذة
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1.5 font-['Cairo']">
                  الاسم بالكامل *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ادخل اسمك..."
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111622] border border-amber-500/30 text-gray-200 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1.5 font-['Cairo']">
                  معرف التواصل (Discord / Phone / Email) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="اسم المستخدم في الديسكورد..."
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111622] border border-amber-500/30 text-gray-200 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-200 mb-1.5 font-['Cairo']">
                موضوع الاستفسار
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111622] border border-amber-500/30 text-gray-200 text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="استفسار عن القبول والتقديم">استفسار عن القبول والتقديم</option>
                <option value="متابعة حالة طلب سابق">متابعة حالة طلب سابق</option>
                <option value="تقديم بلاغ أو شكوى إدارية">تقديم بلاغ أو شكوى إدارية</option>
                <option value="دعم فني عام">دعم فني عام</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-200 mb-1.5 font-['Cairo']">
                نص الرسالة أو الاستفسار *
              </label>
              <textarea
                rows={4}
                required
                placeholder="اكتب تفاصيل استفسارك هنا..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111622] border border-amber-500/30 text-gray-200 text-xs focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <div className="pt-4 border-t border-amber-500/30 flex justify-between items-center">
              <button
                type="submit"
                className="gold-btn px-6 py-2.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>إرسال الرسالة</span>
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
