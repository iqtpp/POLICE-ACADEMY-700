import React, { useState } from 'react';
import { X, Users, Search, Shield, Award, Calendar } from 'lucide-react';
import { AcademyMember } from '../types';

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: AcademyMember[];
}

export const MembersModal: React.FC<MembersModalProps> = ({ isOpen, onClose, members }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('الكل');

  if (!isOpen) return null;

  const departments = [
    'الكل',
    'القيادة العامة',
    'المشرف العام',
    'إدارة الأكاديمية',
    'عضو أكاديمية',
    'شؤون القبول',
    'جناح التدريب',
  ];

  const filteredMembers = members.filter((member) => {
    const matchesDept = selectedDept === 'الكل' || member.department === selectedDept;
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
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
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gold-gradient font-['Cairo']">
              أعضاء وكادر الأكاديمية | Academy Staff & Ranks
            </h2>
            <p className="text-xs text-amber-300/80 mt-1">
              سجل ضباط وأعضاء الأكاديمية المعتمدين بالرتب والأرقام العسكرية
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400/70 absolute right-3.5 top-3.5" />
            <input
              type="text"
              placeholder="ابحث بالاسم، الرتبة، أو الرقم العسكري..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#111622] border border-amber-500/30 text-gray-200 text-xs focus:outline-none focus:border-amber-400 placeholder:text-gray-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 overflow-x-auto">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDept === dept
                    ? 'bg-amber-500/20 border border-amber-400 text-yellow-300 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                    : 'bg-[#111622] border border-amber-500/20 text-gray-400 hover:text-gray-200 hover:bg-amber-500/10'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Members Table / Grid */}
        <div className="overflow-y-auto flex-1 max-h-[50vh] pr-1 pl-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((m) => (
                <div
                  key={m.id}
                  className="bg-[#0e121d] border border-amber-500/20 hover:border-amber-400/60 rounded-xl p-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] group relative"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 p-0.5 flex-shrink-0 overflow-hidden relative shadow-md">
                        {m.avatarUrl && m.avatarUrl.trim() !== '' ? (
                          <img
                            src={m.avatarUrl}
                            alt={m.name}
                            className="w-full h-full object-cover rounded-full"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-[#090c13] flex items-center justify-center text-amber-300 font-extrabold text-xs">
                            <Shield className="w-6 h-6 text-amber-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-amber-200 group-hover:text-yellow-300 font-['Cairo']">
                          {m.name}
                        </h3>
                        <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {m.rank}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                      {m.badgeNumber}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="bg-[#141a29] px-2 py-0.5 rounded text-gray-300">
                      {m.department}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.status === 'نشط'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : m.status === 'مترقي حديثاً'
                          ? 'bg-amber-500/20 text-yellow-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-400 text-xs">
                لا يوجد أعضاء مطابقين للبحث الحالية.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-amber-500/30 flex justify-between items-center">
          <span className="text-xs text-amber-300/70 font-medium">
            إجمالي الكادر المعروض: {filteredMembers.length} ضابط وأحد القوة
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs font-bold hover:bg-gray-700"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
