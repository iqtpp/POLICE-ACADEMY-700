import React, { useState } from 'react';
import { X, Search, FileText, Award, Calendar, Download, Eye, ShieldCheck, UserCheck, CheckCircle2, ChevronLeft, FileSpreadsheet } from 'lucide-react';
import { Trainee, TraineeReport } from '../types';

interface TraineesModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainees: Trainee[];
}

export const TraineesModal: React.FC<TraineesModalProps> = ({ isOpen, onClose, trainees }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('الكل');
  const [activeTrainee, setActiveTrainee] = useState<Trainee | null>(null);
  const [selectedReport, setSelectedReport] = useState<TraineeReport | null>(null);

  if (!isOpen) return null;

  const statuses = ['الكل', 'Cadet', 'Solo Cadet'];

  const filteredTrainees = trainees.filter((t) => {
    const matchesStatus = selectedStatus === 'الكل' || t.status === selectedStatus;
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.batch.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0a0d14] border border-amber-500/40 rounded-2xl p-6 sm:p-8 text-right shadow-[0_0_50px_rgba(212,175,55,0.25)] my-8 max-h-[90vh] flex flex-col">
        
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
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gold-gradient font-['Cairo']">
              سجل المتدربين والتقارير الميدانية | Trainees & PDF Reports
            </h2>
            <p className="text-xs text-amber-300/80 mt-1">
              استعراض ملفات المتدربين والتقارير والتقييمات المرفقة بصيغة PDF
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400/70 absolute right-3.5 top-3.5" />
            <input
              type="text"
              placeholder="ابحث باسم المتدرب، الرقم العسكري، أو الدفعة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#111622] border border-amber-500/30 text-gray-200 text-xs focus:outline-none focus:border-amber-400 placeholder:text-gray-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-amber-500/20 border border-amber-400 text-yellow-300 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                    : 'bg-[#111622] border border-amber-500/20 text-gray-400 hover:text-gray-200 hover:bg-amber-500/10'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Trainees Grid */}
        <div className="overflow-y-auto flex-1 max-h-[50vh] pr-1 pl-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredTrainees.length > 0 ? (
              filteredTrainees.map((t) => (
                <div
                  key={t.id}
                  className="bg-[#0e121d] border border-amber-500/20 hover:border-amber-400/60 rounded-xl p-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-extrabold text-amber-200 font-['Cairo']">
                          {t.name}
                        </h3>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Award className="w-3 h-3 text-amber-400" />
                          {t.batch}
                        </p>
                      </div>

                      <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                        {t.badgeNumber}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 my-3 bg-[#131927] p-2 rounded-lg border border-amber-500/10">
                      <span>رتبة / حالة المتدرب:</span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        t.status === 'Solo Cadet'
                          ? 'bg-amber-500/20 text-yellow-300 border border-amber-400/50 shadow-[0_0_8px_rgba(212,175,55,0.3)]'
                          : t.status === 'Cadet'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTrainee(t)}
                    className="w-full mt-2 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-600/30 to-yellow-600/30 border border-amber-500/40 text-yellow-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-amber-500/40 transition-all"
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>التقارير الخاصة ({t.reports?.length || 0})</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-400 text-xs">
                لا يوجد متدربين مطابقين للبحث.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-amber-500/30 flex justify-between items-center">
          <span className="text-xs text-amber-300/70 font-medium">
            إجمالي المتدربين المسجلين: {filteredTrainees.length} متدرب
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs font-bold hover:bg-gray-700"
          >
            إغلاق
          </button>
        </div>

      </div>

      {/* Trainee Reports Drawer / Modal */}
      {activeTrainee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#0d111a] border border-amber-500/50 rounded-2xl p-6 text-right shadow-[0_0_60px_rgba(212,175,55,0.3)] my-6 max-h-[85vh] flex flex-col">
            
            <button
              onClick={() => setActiveTrainee(null)}
              className="absolute top-4 left-4 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-amber-500/20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-amber-500/30">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gold-gradient font-['Cairo']">
                  تقارير المتدرب: {activeTrainee.name}
                </h3>
                <p className="text-xs text-amber-200/70">
                  الدفعة: {activeTrainee.batch} | الرقم العسكري: {activeTrainee.badgeNumber}
                </p>
              </div>
            </div>

            {/* Reports List */}
            <div className="overflow-y-auto flex-1 pr-1 pl-1 space-y-3">
              {activeTrainee.reports && activeTrainee.reports.length > 0 ? (
                activeTrainee.reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="bg-[#111622] border border-amber-500/25 rounded-xl p-4 hover:border-amber-400/50 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-amber-500/10">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-amber-200 font-['Cairo']">
                          {rep.title}
                        </span>
                        <span className="text-[10px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                          {rep.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{rep.date}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300 my-2">
                      <div>
                        المُقَيِّم: <span className="text-amber-300 font-medium">{rep.evaluator}</span>
                      </div>
                      {rep.score && (
                        <div>
                          النتيجة / التقدير: <span className="text-emerald-400 font-bold">{rep.score}</span>
                        </div>
                      )}
                    </div>

                    {rep.notes && (
                      <p className="text-xs text-gray-400 bg-[#0a0d14] p-2.5 rounded-lg border border-amber-500/10 my-2 leading-relaxed">
                        ملاحظات التقرير: "{rep.notes}"
                      </p>
                    )}

                    {/* PDF Attachment Box */}
                    <div className="mt-3 pt-3 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-2 bg-[#090c13] p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-xs text-amber-200">
                        <FileText className="w-4 h-4 text-red-400" />
                        <span className="font-mono text-[11px] text-gray-300">
                          {rep.pdfName || `${rep.title}.pdf`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => setSelectedReport(rep)}
                          className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-amber-500/30 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>معاينة PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-gray-400 text-xs">
                  لا يوجد تقارير مرفوعة لهذا المتدرب حالياً.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-amber-500/30 text-left">
              <button
                onClick={() => setActiveTrainee(null)}
                className="px-4 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-xs font-bold hover:bg-gray-700"
              >
                رجوع
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl p-6 sm:p-8 text-right shadow-2xl my-6 max-h-[90vh] flex flex-col overflow-y-auto dir-rtl font-['Cairo']">
            
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  PDF
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {selectedReport.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedReport.pdfName || 'report_document.pdf'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedReport.pdfUrl ? (
                  <a
                    href={selectedReport.pdfUrl}
                    download={selectedReport.pdfName || 'report.pdf'}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-amber-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل الملف</span>
                  </a>
                ) : (
                  <button
                    onClick={() => alert('تم بدء تنزيل النسخة المعتمدة من التقرير (PDF)')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-amber-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تنزيل PDF</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simulated Official PDF Page */}
            {selectedReport.pdfUrl && selectedReport.pdfUrl.startsWith('data:application/pdf') ? (
              <iframe
                src={selectedReport.pdfUrl}
                className="w-full h-[600px] rounded-xl border border-slate-300"
                title="PDF Document"
              />
            ) : (
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-8 space-y-6 shadow-inner relative">
                
                {/* Official Police Academy PDF Header */}
                <div className="flex justify-between items-center border-b-2 border-slate-800 pb-4">
                  <div className="text-right space-y-1">
                    <p className="text-xs font-bold text-slate-800">الأكاديمية العسكرية والأمنية</p>
                    <p className="text-[11px] text-slate-600">إدارة شؤون القبول والتدريب الميداني</p>
                    <p className="text-[10px] text-slate-500 font-mono">الرقم المرجعي: REF-PDF-2026-904</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-amber-600 bg-amber-50 flex items-center justify-center mx-auto text-amber-700 font-black text-xs">
                      شعار رسمـي
                    </div>
                  </div>

                  <div className="text-left text-xs font-mono text-slate-600 space-y-1">
                    <p>التاريخ: {selectedReport.date}</p>
                    <p>التصنيف: {selectedReport.category}</p>
                  </div>
                </div>

                {/* PDF Title */}
                <div className="text-center py-2 bg-slate-900 text-amber-300 rounded-lg font-black text-lg">
                  {selectedReport.title}
                </div>

                {/* Body Details */}
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-800 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <div>
                    <span className="font-bold text-slate-500">المُقَيِّم المسؤول:</span> {selectedReport.evaluator}
                  </div>
                  <div>
                    <span className="font-bold text-slate-500">النتيجة المعتمدة:</span> <span className="font-bold text-emerald-700">{selectedReport.score || 'مكتمل'}</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2 bg-white p-4 rounded-lg border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900">ملاحظات والتوصيات الميدانية:</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {selectedReport.notes || 'تم الفحص الميداني واجتياز المتطلبات المحددة بنجاح وفق اللوائح المعتمدة.'}
                  </p>
                </div>

                {/* Official Stamp & Signatures */}
                <div className="pt-6 border-t border-slate-300 flex justify-between items-end text-xs">
                  <div className="space-y-1 text-slate-700">
                    <p className="font-bold">ختم الاعتماد الرسمي</p>
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-red-500/60 bg-red-500/5 flex items-center justify-center text-red-600 text-[10px] font-bold rotate-[-12deg]">
                      مُعْتَمَد - أكاديمية الشرطة
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <p className="font-bold text-slate-800">توقيع رئيس اللجنة التدريبية</p>
                    <div className="h-10 text-amber-800 font-serif italic text-lg">
                      ~ Police Academy ~
                    </div>
                  </div>
                </div>

              </div>
            )}

            <div className="mt-6 text-left">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-5 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-700"
              >
                إغلاق معاينة PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
