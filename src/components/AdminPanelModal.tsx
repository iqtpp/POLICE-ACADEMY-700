import React, { useState } from 'react';
import { X, Lock, Unlock, CheckCircle, XCircle, Users, BarChart3, Shield, Plus, Trash2, Key, Edit3, FileText, Upload, UserCheck, Award, Settings, Globe, AlertTriangle, ChevronDown, ChevronUp, Copy, Check, Eye, Calendar, User, Hash, MessageSquare, Filter, Search, Headphones, Mail, Bot, Zap } from 'lucide-react';
import { RecruitmentApplication, AcademyStat, AcademyMember, AcademyRule, LeadershipOfficer, Trainee, TraineeReport, SiteSettings, ContactTicket } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: RecruitmentApplication[];
  onUpdateAppStatus: (id: string, newStatus: RecruitmentApplication['status']) => void;
  onDeleteApplication?: (id: string) => void;
  onLoadApplications?: () => Promise<void>;
  contactTickets?: ContactTicket[];
  onUpdateTicketStatus?: (id: string, newStatus: ContactTicket['status']) => void;
  onDeleteTicket?: (id: string) => void;
  stats: AcademyStat[];
  onUpdateStats: (newStats: AcademyStat[]) => void;
  members: AcademyMember[];
  onAddMember: (member: Omit<AcademyMember, 'id'>) => void;
  onUpdateMembers: (updatedMembers: AcademyMember[]) => void;
  onDeleteMember: (id: string) => void;
  rules: AcademyRule[];
  onAddRule: (rule: Omit<AcademyRule, 'id'>) => void;
  onUpdateRules?: (updatedRules: AcademyRule[]) => void;
  onDeleteRule?: (id: string) => void;
  leadership: LeadershipOfficer[];
  onUpdateLeadership: (updated: LeadershipOfficer[]) => void;
  trainees: Trainee[];
  onUpdateTrainees: (updatedTrainees: Trainee[]) => void;
  siteSettings?: SiteSettings;
  onUpdateSiteSettings?: (newSettings: SiteSettings) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  applications,
  onUpdateAppStatus,
  onDeleteApplication,
  onLoadApplications,
  contactTickets = [],
  onUpdateTicketStatus,
  onDeleteTicket,
  stats,
  onUpdateStats,
  members,
  onAddMember,
  onUpdateMembers,
  onDeleteMember,
  rules,
  onAddRule,
  onUpdateRules,
  onDeleteRule,
  leadership,
  onUpdateLeadership,
  trainees,
  onUpdateTrainees,
  siteSettings,
  onUpdateSiteSettings,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'apps' | 'contact' | 'stats' | 'members' | 'rules' | 'leadership' | 'trainees' | 'settings'>('apps');

  // Contact Tickets Search & Filter
  const [ticketSearchQuery, setTicketSearchQuery] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('الكل');

  // Applications management state
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<string>('الكل');
  const [copiedAppId, setCopiedAppId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopyAppDetails = (app: RecruitmentApplication) => {
    const text = `📋 **استمارة تقديم على أكاديمية الشرطة**
👤 **الاسم الكامل**: ${app.fullName}
🎂 **العمر**: ${app.age} سنة
🎧 **معرف الديسكورد**: ${app.discordId}
📅 **تاريخ التقديم**: ${app.submittedAt}
📊 **الحالة الحالية**: ${app.status}

💼 **الخبرات السابقة الإدارية والميدانية**:
${app.experience || 'لم تذكر'}

📝 **سبب الانضمام ورغبة المتقدم**:
${app.whyJoin}

📜 **الموافقة على اللوائح والقوانين**: ${app.acceptedRules ? 'نعم - موافق ومقر بالكامل' : 'لا'}`;

    navigator.clipboard.writeText(text);
    setCopiedAppId(app.id);
    setTimeout(() => setCopiedAppId(null), 2500);
  };

  const handleCopySingleField = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Form states for adding stat
  const [newStatLabel, setNewStatLabel] = useState('');
  const [newStatValue, setNewStatValue] = useState<number | ''>(10);
  const [newStatDesc, setNewStatDesc] = useState('');
  const [newStatIcon, setNewStatIcon] = useState('Award');

  // Form states for adding member
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRank, setNewMemberRank] = useState('Police Academy');
  const [newMemberBadge, setNewMemberBadge] = useState('#');
  const [newMemberDept, setNewMemberDept] = useState('عضو أكاديمية');
  const [newMemberAvatarUrl, setNewMemberAvatarUrl] = useState('');

  // Form states for adding rule
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleContent, setNewRuleContent] = useState('');
  const [newRuleCat, setNewRuleCat] = useState<AcademyRule['category']>('الانضباط');

  // Form states for adding trainee
  const [newTraineeName, setNewTraineeName] = useState('');
  const [newTraineeBadge, setNewTraineeBadge] = useState('TR-');
  const [newTraineeBatch, setNewTraineeBatch] = useState('الدفعة 14');
  const [newTraineeStatus, setNewTraineeStatus] = useState<Trainee['status']>('Cadet');

  // Form states for adding report
  const [selectedTraineeForReport, setSelectedTraineeForReport] = useState<string>('');
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState<TraineeReport['category']>('تقرير ميداني اسبوعي');
  const [reportEvaluator, setReportEvaluator] = useState('إدارة القبول والتدريب');
  const [reportScore, setReportScore] = useState('95/100');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportNotes, setReportNotes] = useState('');
  const [pdfDataUrl, setPdfDataUrl] = useState<string>('');
  const [pdfFileName, setPdfFileName] = useState<string>('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;

    if (!isSupabaseConfigured || !supabase) {
      setAuthError('لم يتم إعداد Supabase بعد. أضف إعدادات Supabase في متغيرات البيئة.');
      return;
    }

    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.trim();
    if (!adminEmail) {
      setAuthError('لم يتم تحديد بريد مسؤول الأكاديمية في VITE_ADMIN_EMAIL.');
      return;
    }

    if (!password.trim()) {
      setAuthError('أدخل كلمة مرور لوحة الإدارة.');
      return;
    }

    setIsLoggingIn(true);
    setAuthError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password,
      });

      if (error) throw error;

      setIsAuthenticated(true);
      await onLoadApplications?.();
    } catch (error) {
      console.error('Admin login failed:', error);
      setIsAuthenticated(false);
      setAuthError('بيانات الدخول غير صحيحة أو لا يمكن الوصول إلى Supabase.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleStatChange = (id: string, field: keyof AcademyStat, value: any) => {
    const updated = stats.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    onUpdateStats(updated);
  };

  const handleDeleteStat = (id: string) => {
    const updated = stats.filter((s) => s.id !== id);
    onUpdateStats(updated);
  };

  const handleCreateStat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatLabel) return;
    const newStatObj: AcademyStat = {
      id: `stat-${Date.now()}`,
      label: newStatLabel,
      value: Number(newStatValue) || 0,
      description: newStatDesc,
      iconName: newStatIcon,
    };
    onUpdateStats([...stats, newStatObj]);
    setNewStatLabel('');
    setNewStatValue(10);
    setNewStatDesc('');
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName) return;

    onAddMember({
      name: newMemberName,
      rank: newMemberRank,
      rankLevel: 5,
      badgeNumber: newMemberBadge,
      department: newMemberDept,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'نشط',
      avatarUrl: newMemberAvatarUrl,
    });

    setNewMemberName('');
    setNewMemberBadge('#');
    setNewMemberAvatarUrl('');
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleTitle || !newRuleContent) return;

    onAddRule({
      title: newRuleTitle,
      content: newRuleContent,
      category: newRuleCat,
      importance: 'عالي',
    });

    setNewRuleTitle('');
    setNewRuleContent('');
  };

  const handleCreateTrainee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTraineeName) return;

    const newTraineeObj: Trainee = {
      id: `tr-${Date.now()}`,
      name: newTraineeName,
      badgeNumber: newTraineeBadge,
      batch: newTraineeBatch,
      joinDate: new Date().toISOString().split('T')[0],
      status: newTraineeStatus,
      reports: [],
    };

    onUpdateTrainees([...trainees, newTraineeObj]);
    setNewTraineeName('');
    setNewTraineeBadge('TR-');
  };

  const handlePdfFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFileName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPdfDataUrl(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReportToTrainee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTraineeForReport || !reportTitle) return;

    const newRep: TraineeReport = {
      id: `rep-${Date.now()}`,
      traineeId: selectedTraineeForReport,
      title: reportTitle,
      category: reportCategory,
      date: reportDate,
      evaluator: reportEvaluator,
      score: reportScore,
      pdfUrl: pdfDataUrl || undefined,
      pdfName: pdfFileName || `${reportTitle}.pdf`,
      notes: reportNotes,
    };

    const updated = trainees.map((tr) => {
      if (tr.id === selectedTraineeForReport) {
        return {
          ...tr,
          reports: [...(tr.reports || []), newRep],
        };
      }
      return tr;
    });

    onUpdateTrainees(updated);
    setReportTitle('');
    setReportNotes('');
    setPdfDataUrl('');
    setPdfFileName('');
    alert('تم إضافة التقرير وملف الـ PDF بنجاح لملف المتدرب!');
  };

  const handleDeleteReport = (traineeId: string, reportId: string) => {
    const updated = trainees.map((tr) => {
      if (tr.id === traineeId) {
        return {
          ...tr,
          reports: tr.reports.filter((r) => r.id !== reportId),
        };
      }
      return tr;
    });
    onUpdateTrainees(updated);
  };

  const handleDeleteTrainee = (traineeId: string) => {
    if (confirm('هل أنت تأكد من حذف المتدرب وجميع تقاريره؟')) {
      onUpdateTrainees(trainees.filter((t) => t.id !== traineeId));
    }
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gold-gradient font-['Cairo']">
                لوحة التحكم والإدارة الفنية | Admin Control Panel
              </h2>
              <p className="text-xs text-amber-300/80 mt-1">
                إدارة الكادر، القبول، الهيكل التنظيمي، والمتدربين والتقارير المرفقة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>حفظ تلقائي ودائم للسيرفر مفعّل</span>
          </div>
        </div>

        {/* Login Form if not authenticated */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-12 p-6 bg-[#0e121d] border border-amber-500/30 rounded-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Key className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-amber-200 font-['Cairo']">
              سجل الدخول للوحة التحكم
            </h3>
            <p className="text-xs text-gray-400">
              يرجى إدخال كلمة المرور المعتمدة للوصول لبيانات الإدارة.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="أدخل كلمة المرور..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#111622] border border-amber-500/30 text-amber-200 text-center font-mono text-sm focus:outline-none focus:border-amber-400"
              />

              {authError && (
                <div className="text-xs text-red-400 font-medium">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="gold-btn w-full py-3 rounded-xl text-xs font-bold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? 'جاري التحقق...' : 'دخول للوحة الإدارة'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Admin Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-amber-500/20 pb-3">
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'settings'
                    ? 'bg-amber-500/20 border border-amber-400 text-yellow-300 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                    : 'bg-[#111622] border border-amber-500/20 text-gray-400 hover:text-gray-200'
                }`}
              >
                <Settings className="w-4 h-4 text-amber-400" />
                <span>إعدادات الواجهة والموقع</span>
              </button>

              <button
                onClick={() => setActiveTab('apps')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'apps'
                    ? 'bg-amber-500/20 border border-amber-400 text-yellow-300 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                    : 'bg-[#111622] border border-amber-500/20 text-gray-400 hover:text-gray-200'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>طلبات القبول ({applications.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'contact'
                    ? 'bg-amber-500/20 border border-amber-400 text-yellow-300 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                    : 'bg-[#111622] border border-amber-500/20 text-gray-400 hover:text-gray-200'
                }`}
              >
                <Headphones className="w-4 h-4 text-amber-400" />
                <span>رسائل تواصل معنا ({contactTickets.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'stats'
                    ? 'bg-amber-500/20 border border-amber-400 text-yellow-300 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                    : 'bg-[#111622] border border-amber-500/20 text-gray-400 hover:text-gray-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>الإحصائيات</span>
              </button>

              <button
                onClick={() => setActiveTab('members')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'members'
                    ? 'bg-amber-500/20 border border-amber-400 text-yellow-300 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                    : 'bg-[#111622] border border-amber-500/20 text-gray-400 hover:text-gray-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>تعديل وإضافة الأعضاء ({members.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('trainees')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'trainees'
                    ? 'bg-amber-500/20 border border-amber-400 text-yellow-300 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                    : 'bg-[#111622] border border-amber-500/20 text-gray-400 hover:text-gray-200'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>المتدربين وتقارير PDF ({trainees.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('rules')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'rules'
                    ? 'bg-amber-500/20 border border-amber-400 text-yellow-300 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                    : 'bg-[#111622] border border-amber-500/20 text-gray-400 hover:text-gray-200'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>القوانين ({rules.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('leadership')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'leadership'
                    ? 'bg-amber-500/20 border border-amber-400 text-yellow-300 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                    : 'bg-[#111622] border border-amber-500/20 text-gray-400 hover:text-gray-200'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>إدارة الأكاديمية ({leadership?.length || 0})</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto pr-1">
              
              {/* TAB 0: Site Settings */}
              {activeTab === 'settings' && siteSettings && onUpdateSiteSettings && (
                <div className="space-y-6">
                  <div className="bg-[#0e121d] border border-amber-500/30 p-5 rounded-xl space-y-4">
                    <h4 className="text-sm font-bold text-amber-300 font-['Cairo'] flex items-center gap-2">
                      <Globe className="w-5 h-5 text-amber-400" />
                      إعدادات اسم الموقع واللوجو والهيرو
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-amber-200/90 mb-1">اسم الموقع الرئيسي</label>
                        <input
                          type="text"
                          value={siteSettings.siteName}
                          onChange={(e) => onUpdateSiteSettings({ ...siteSettings, siteName: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-amber-200"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-200/90 mb-1">العنوان الفرعي (اللوجو)</label>
                        <input
                          type="text"
                          value={siteSettings.siteSubtitle}
                          onChange={(e) => onUpdateSiteSettings({ ...siteSettings, siteSubtitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-amber-200"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-200/90 mb-1">نص شارة الواجهة (Slogan Badge)</label>
                        <input
                          type="text"
                          value={siteSettings.heroBadgeText}
                          onChange={(e) => onUpdateSiteSettings({ ...siteSettings, heroBadgeText: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-amber-200"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-200/90 mb-1">عنوان الواجهة الرئيسي (Headline)</label>
                        <input
                          type="text"
                          value={siteSettings.heroHeadline}
                          onChange={(e) => onUpdateSiteSettings({ ...siteSettings, heroHeadline: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-amber-200 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-200/90 mb-1">الشعار الثانوي (Hero Subtitle)</label>
                        <input
                          type="text"
                          value={siteSettings.heroSubtitle}
                          onChange={(e) => onUpdateSiteSettings({ ...siteSettings, heroSubtitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-amber-200"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-200/90 mb-1">رابط الديسكورد للتواصل</label>
                        <input
                          type="text"
                          value={siteSettings.contactDiscordUrl || ''}
                          onChange={(e) => onUpdateSiteSettings({ ...siteSettings, contactDiscordUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-amber-200 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-200/90 mb-1">وصف الواجهة الرئيسية (Hero Description)</label>
                      <textarea
                        rows={2}
                        value={siteSettings.heroDescription}
                        onChange={(e) => onUpdateSiteSettings({ ...siteSettings, heroDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-amber-200"
                      />
                    </div>
                  </div>

                  {/* Recruitment Settings */}
                  <div className="bg-[#0e121d] border border-amber-500/30 p-5 rounded-xl space-y-4">
                    <h4 className="text-sm font-bold text-amber-300 font-['Cairo'] flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-400" />
                      التحكم بحالة القبول والتسجيل
                    </h4>

                    <div className="flex items-center gap-4 bg-[#111622] p-3 rounded-lg border border-amber-500/20">
                      <label className="text-xs font-bold text-amber-200">حالة التقديم بالأكاديمية:</label>
                      <button
                        type="button"
                        onClick={() => onUpdateSiteSettings({ ...siteSettings, recruitmentOpen: !siteSettings.recruitmentOpen })}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          siteSettings.recruitmentOpen
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-red-500/20 border-red-500 text-red-300'
                        }`}
                      >
                        {siteSettings.recruitmentOpen ? 'التقديم مفتوح الأن' : 'التقديم مغلق'}
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-200/90 mb-1">ملاحظة القبول عند الإغلاق</label>
                      <input
                        type="text"
                        value={siteSettings.recruitmentNotice || ''}
                        onChange={(e) => onUpdateSiteSettings({ ...siteSettings, recruitmentNotice: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-amber-200"
                        placeholder="استمارة التقديم على الأكاديمية مغلقة حالياً بقرار من إدارة القبول والتدريب."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: Applications */}
              {activeTab === 'apps' && (() => {
                const filteredApps = applications.filter((app) => {
                  const matchesStatus = appStatusFilter === 'الكل' || app.status === appStatusFilter;
                  const query = appSearchQuery.trim().toLowerCase();
                  const matchesQuery =
                    !query ||
                    app.fullName.toLowerCase().includes(query) ||
                    app.discordId.toLowerCase().includes(query) ||
                    app.gameId.toLowerCase().includes(query);
                  return matchesStatus && matchesQuery;
                });

                const totalApps = applications.length;
                const pendingCount = applications.filter(a => a.status === 'قيد المراجعة').length;
                const acceptedCount = applications.filter(a => a.status === 'مقبول مبدئياً').length;
                const interviewedCount = applications.filter(a => a.status === 'تمت المقابلة').length;
                const rejectedCount = applications.filter(a => a.status === 'مرفوض').length;

                return (
                  <div className="space-y-4">
                    {/* Header Bar with Counters & Filters */}
                    <div className="bg-[#0e121d] border border-amber-500/20 p-4 rounded-xl space-y-3">
                      {/* Stats Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                            إجمالي الطلبات: {totalApps}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300">
                            قيد المراجعة: {pendingCount}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                            مقبول مبدئياً: {acceptedCount}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300">
                            تمت المقابلة: {interviewedCount}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300">
                            مرفوض: {rejectedCount}
                          </span>
                        </div>
                      </div>

                      {/* Search & Filter Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="relative">
                          <Search className="w-4 h-4 text-gray-400 absolute top-2.5 right-3" />
                          <input
                            type="text"
                            placeholder="بحث باسم المتقدم، الديسكورد، أو الهوية باللعبة..."
                            value={appSearchQuery}
                            onChange={(e) => setAppSearchQuery(e.target.value)}
                            className="w-full pr-9 pl-3 py-1.5 rounded-lg bg-[#141a29] border border-amber-500/30 text-xs text-gray-200 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <select
                            value={appStatusFilter}
                            onChange={(e) => setAppStatusFilter(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#141a29] border border-amber-500/30 text-xs text-amber-200"
                          >
                            <option value="الكل">عرض جميع الحالات ({totalApps})</option>
                            <option value="قيد المراجعة">قيد المراجعة ({pendingCount})</option>
                            <option value="مقبول مبدئياً">مقبول مبدئياً ({acceptedCount})</option>
                            <option value="تمت المقابلة">تمت المقابلة ({interviewedCount})</option>
                            <option value="مرفوض">مرفوض ({rejectedCount})</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Applications List */}
                    {filteredApps.length > 0 ? (
                      filteredApps.map((app) => {
                        const isExpanded = expandedAppId === app.id;

                        return (
                          <div
                            key={app.id}
                            className="bg-[#0e121d] border border-amber-500/25 rounded-xl p-4 space-y-4 shadow-md transition-all hover:border-amber-500/40"
                          >
                            {/* Card Top Row / Summary */}
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                              <div className="space-y-1.5 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-base font-extrabold text-amber-200 font-['Cairo'] flex items-center gap-1.5">
                                    <User className="w-4 h-4 text-amber-400" />
                                    {app.fullName}
                                  </h4>
                                  <span className="text-xs text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                                    العمر: {app.age} سنة
                                  </span>
                                  <span
                                    className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                                      app.status === 'مقبول مبدئياً'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        : app.status === 'تمت المقابلة'
                                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                        : app.status === 'مرفوض'
                                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    }`}
                                  >
                                    {app.status}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
                                  <div className="flex items-center gap-1 bg-[#141a29] px-2 py-0.5 rounded border border-amber-500/20">
                                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                                    <span className="text-gray-400">الديسكورد:</span>
                                    <span className="font-mono text-amber-300 font-bold">{app.discordId}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopySingleField(app.discordId, `discord-${app.id}`)}
                                      className="p-1 hover:bg-amber-500/20 rounded text-amber-400"
                                      title="نسخ الديسكورد"
                                    >
                                      {copiedField === `discord-${app.id}` ? (
                                        <Check className="w-3 h-3 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-1 bg-[#141a29] px-2 py-0.5 rounded border border-amber-500/20">
                                    <Hash className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="text-gray-400">الهوية باللعبة:</span>
                                    <span className="font-mono text-amber-200 font-bold">{app.gameId}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopySingleField(app.gameId, `gameId-${app.id}`)}
                                      className="p-1 hover:bg-amber-500/20 rounded text-amber-400"
                                      title="نسخ الهوية"
                                    >
                                      {copiedField === `gameId-${app.id}` ? (
                                        <Check className="w-3 h-3 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>

                                  {app.submittedAt && (
                                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                      <Calendar className="w-3.5 h-3.5 text-amber-400/70" />
                                      <span>تاريخ التقديم: {app.submittedAt}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Top Quick Actions */}
                              <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                                <button
                                  type="button"
                                  onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                                    isExpanded
                                      ? 'bg-amber-500/30 text-amber-200 border border-amber-400'
                                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                                  }`}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>{isExpanded ? 'إخفاء التفاصيل' : 'عرض البيانات كاملة'}</span>
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </button>

                                {/* Copy Summary Button */}
                                <button
                                  type="button"
                                  onClick={() => handleCopyAppDetails(app)}
                                  className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg text-xs font-bold border border-blue-500/30 flex items-center gap-1"
                                  title="نسخ كامل ملخص استمارة المتقدم لنسخه في الديسكورد"
                                >
                                  {copiedAppId === app.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-emerald-300">تم النسخ</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>نسخ للديسكورد</span>
                                    </>
                                  )}
                                </button>

                                {onDeleteApplication && (
                                  <button
                                    type="button"
                                    onClick={() => onDeleteApplication(app.id)}
                                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-red-500/20"
                                    title="حذف الطلب"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Full Detailed Information View */}
                            <div className={`space-y-3 pt-3 border-t border-amber-500/20 transition-all ${isExpanded ? 'block' : 'block opacity-95'}`}>
                              <div className="bg-[#080b12] p-3.5 rounded-xl border border-amber-500/15 space-y-3">
                                <h5 className="text-xs font-extrabold text-amber-300 font-['Cairo'] flex items-center gap-1.5 border-b border-amber-500/10 pb-2">
                                  <FileText className="w-4 h-4 text-amber-400" />
                                  تفاصيل وبيانات طلب التقديم المكتملة:
                                </h5>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                                  <div className="bg-[#111622] p-2.5 rounded-lg border border-amber-500/20">
                                    <span className="block text-[10px] text-gray-400 mb-0.5">الاسم الثلاثي / الرباعي</span>
                                    <span className="font-bold text-amber-200">{app.fullName}</span>
                                  </div>

                                  <div className="bg-[#111622] p-2.5 rounded-lg border border-amber-500/20">
                                    <span className="block text-[10px] text-gray-400 mb-0.5">العمر</span>
                                    <span className="font-bold text-amber-200">{app.age} سنة</span>
                                  </div>

                                  <div className="bg-[#111622] p-2.5 rounded-lg border border-amber-500/20">
                                    <span className="block text-[10px] text-gray-400 mb-0.5">معرف الديسكورد (Discord ID)</span>
                                    <span className="font-mono font-bold text-indigo-300">{app.discordId}</span>
                                  </div>

                                  <div className="bg-[#111622] p-2.5 rounded-lg border border-amber-500/20">
                                    <span className="block text-[10px] text-gray-400 mb-0.5">الرقم والهوية باللعبة (Game ID)</span>
                                    <span className="font-mono font-bold text-amber-300">{app.gameId}</span>
                                  </div>

                                  <div className="bg-[#111622] p-2.5 rounded-lg border border-amber-500/20">
                                    <span className="block text-[10px] text-gray-400 mb-0.5">توقيت تقديم الطلب</span>
                                    <span className="font-bold text-gray-300">{app.submittedAt || 'حديثاً'}</span>
                                  </div>
                                </div>

                                {/* Experience Box */}
                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-amber-300/90">
                                    الخبرات السابقة الميدانية والإدارية:
                                  </label>
                                  <div className="p-3 bg-[#111622] rounded-lg border border-amber-500/20 text-xs text-gray-200 leading-relaxed whitespace-pre-wrap min-h-[48px]">
                                    {app.experience ? app.experience : <span className="text-gray-500 italic">لم يتم إدخال خبرات سابقة</span>}
                                  </div>
                                </div>

                                {/* Why Join Box */}
                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-amber-300/90">
                                    سبب الرغبة في الانضمام لأكاديمية الشرطة:
                                  </label>
                                  <div className="p-3 bg-[#111622] rounded-lg border border-amber-500/20 text-xs text-gray-200 leading-relaxed whitespace-pre-wrap font-medium">
                                    {app.whyJoin}
                                  </div>
                                </div>

                                {/* Rules Acceptance */}
                                <div className="flex items-center gap-2 p-2.5 bg-[#111622] rounded-lg border border-amber-500/20 text-xs">
                                  <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                  <span className="text-gray-300">الإقرار باللوائح والشروط:</span>
                                  {app.acceptedRules ? (
                                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                                      <CheckCircle className="w-3.5 h-3.5" /> تم الموافقة والإقرار بجميع القوانين
                                    </span>
                                  ) : (
                                    <span className="text-red-400 font-bold">لم تتم الموافقة</span>
                                  )}
                                </div>

                                {/* Status Decision Controls */}
                                <div className="pt-2 border-t border-amber-500/10 flex flex-wrap items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-amber-200">تغيير حالة الطلب:</span>
                                    <select
                                      value={app.status}
                                      onChange={(e) => onUpdateAppStatus(app.id, e.target.value as RecruitmentApplication['status'])}
                                      className="px-3 py-1.5 rounded-lg bg-[#141a29] border border-amber-500/40 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                                    >
                                      <option value="قيد المراجعة">🟡 قيد المراجعة</option>
                                      <option value="مقبول مبدئياً">🟢 قبول مبدئي</option>
                                      <option value="تمت المقابلة">🔵 تمت المقابلة</option>
                                      <option value="مرفوض">🔴 مرفوض</option>
                                    </select>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => onUpdateAppStatus(app.id, 'مقبول مبدئياً')}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${
                                        app.status === 'مقبول مبدئياً'
                                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                                          : 'bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border-emerald-500/30'
                                      }`}
                                    >
                                      <CheckCircle className="w-3.5 h-3.5" />
                                      قبول مبدئي
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => onUpdateAppStatus(app.id, 'تمت المقابلة')}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${
                                        app.status === 'تمت المقابلة'
                                          ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                                          : 'bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border-blue-500/30'
                                      }`}
                                    >
                                      <UserCheck className="w-3.5 h-3.5" />
                                      تمت المقابلة
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => onUpdateAppStatus(app.id, 'مرفوض')}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${
                                        app.status === 'مرفوض'
                                          ? 'bg-red-600 text-white border-red-400 shadow-md'
                                          : 'bg-red-600/20 hover:bg-red-600/40 text-red-300 border-red-500/30'
                                      }`}
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                      رفض الطلب
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-12 text-center text-gray-400 text-xs bg-[#0e121d] rounded-xl border border-amber-500/20">
                        لا توجد طلبات تقديم تتطابق مع معايير البحث أو الفلترة الحالية.
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* TAB 1.5: Contact Tickets */}
              {activeTab === 'contact' && (() => {
                const filteredTickets = contactTickets.filter(ticket => {
                  const matchesSearch =
                    ticket.senderName.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                    ticket.contactInfo.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                    ticket.subject.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                    ticket.message.toLowerCase().includes(ticketSearchQuery.toLowerCase());
                  const matchesStatus =
                    ticketStatusFilter === 'الكل' || ticket.status === ticketStatusFilter;
                  return matchesSearch && matchesStatus;
                });

                const newCount = contactTickets.filter(t => t.status === 'جديد').length;
                const repliedCount = contactTickets.filter(t => t.status === 'تم الرد').length;
                const closedCount = contactTickets.filter(t => t.status === 'مغلق').length;

                return (
                  <div className="space-y-4">
                    {/* Header & Stats */}
                    <div className="bg-[#0e121d] border border-amber-500/30 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-amber-300 font-['Cairo'] flex items-center gap-2">
                          <Headphones className="w-5 h-5 text-amber-400" />
                          إدارة استفسارات ورسائل "تواصل معنا"
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          عرض جميع الاستفسارات والرسائل المرسلة من زوار وأعضاء الأكاديمية والرد عليها
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                          الجديدة: {newCount}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold">
                          تم الرد: {repliedCount}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-gray-500/10 border border-gray-500/30 text-gray-400 font-bold">
                          المغلقة: {closedCount}
                        </span>
                      </div>
                    </div>

                    {/* Auto-Reply Settings Control Panel */}
                    {siteSettings && onUpdateSiteSettings && (
                      <div className="bg-[#0d121f] border border-indigo-500/30 p-4 rounded-xl space-y-3 shadow-md">
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-indigo-500/20">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              <Bot className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div>
                              <h5 className="text-xs font-black text-indigo-200 font-['Cairo'] flex items-center gap-2">
                                إعدادات الرد الآلي الفوري (Auto-Reply Bot)
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  siteSettings.autoReplyEnabled !== false
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
                                }`}>
                                  {siteSettings.autoReplyEnabled !== false ? '⚡ مفعل' : '⚪ معطل'}
                                </span>
                              </h5>
                              <p className="text-[11px] text-gray-400">
                                يتم إرسال هذا الرد تلقائياً وفورياً لأي زائر يرسل استفسار عبر نموذج تواصل معنا
                              </p>
                            </div>
                          </div>

                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={siteSettings.autoReplyEnabled !== false}
                              onChange={(e) =>
                                onUpdateSiteSettings({
                                  ...siteSettings,
                                  autoReplyEnabled: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            <span className="ms-2 text-xs font-bold text-indigo-200">
                              {siteSettings.autoReplyEnabled !== false ? 'تعطيل' : 'تفعيل'}
                            </span>
                          </label>
                        </div>

                        {siteSettings.autoReplyEnabled !== false && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-indigo-300 font-bold">
                              <span>نص قالب الرد الآلي التلقائي:</span>
                              <span className="text-gray-400 text-[10px]">
                                المتغيرات المتاحة: <code className="text-amber-300 font-mono">{'{NAME}'}</code> (اسم المرسل)، <code className="text-amber-300 font-mono">{'{TICKET_ID}'}</code> (رقم التذكرة)
                              </span>
                            </div>
                            <textarea
                              rows={3}
                              value={
                                siteSettings.autoReplyTemplate ||
                                'مرحباً {NAME}، تم استلام استفسارك بنجاح عبر البوابة الإلكترونية لأكاديمية الشرطة برقم تذكرة مرجعي ({TICKET_ID}). سيقوم فريق الدعم أو مشرفي الأكاديمية بمراجعة طلبك والرد عليك عبر الديسكورد في أسرع وقت. للتواصل المباشر يرجى التواصل معنا عبر الديسكورد: iqtpp أو al3mri0201.'
                              }
                              onChange={(e) =>
                                onUpdateSiteSettings({
                                  ...siteSettings,
                                  autoReplyTemplate: e.target.value,
                                })
                              }
                              className="w-full p-2.5 bg-[#121827] border border-indigo-500/30 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-indigo-400 leading-relaxed font-sans"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Filter & Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute top-3 right-3 text-amber-400/60" />
                        <input
                          type="text"
                          placeholder="ابحث بالاسم، موضوع الاستفسار، معرف التواصل أو نص الرسالة..."
                          value={ticketSearchQuery}
                          onChange={(e) => setTicketSearchQuery(e.target.value)}
                          className="w-full pr-9 pl-4 py-2 rounded-xl bg-[#0e121d] border border-amber-500/30 text-xs text-gray-200 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-amber-400" />
                        <select
                          value={ticketStatusFilter}
                          onChange={(e) => setTicketStatusFilter(e.target.value)}
                          className="px-3 py-2 rounded-xl bg-[#0e121d] border border-amber-500/30 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                        >
                          <option value="الكل">جميع الحالات</option>
                          <option value="جديد">🟡 جديد</option>
                          <option value="تم الرد">🟢 تم الرد</option>
                          <option value="مغلق">⚪ مغلق</option>
                        </select>
                      </div>
                    </div>

                    {/* Tickets List */}
                    {filteredTickets.length > 0 ? (
                      <div className="space-y-3">
                        {filteredTickets.map((ticket) => {
                          let statusBadge = (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              🟡 جديد
                            </span>
                          );
                          if (ticket.status === 'تم الرد') {
                            statusBadge = (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                🟢 تم الرد
                              </span>
                            );
                          } else if (ticket.status === 'مغلق') {
                            statusBadge = (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-500/20 text-gray-400 border border-gray-500/40">
                                ⚪ مغلق
                              </span>
                            );
                          }

                          return (
                            <div
                              key={ticket.id}
                              className="bg-[#0e121d] border border-amber-500/30 p-4 rounded-xl space-y-3 shadow-md"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-amber-500/20">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    <MessageSquare className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h5 className="text-xs font-black text-amber-200 font-['Cairo']">
                                        {ticket.senderName}
                                      </h5>
                                      {statusBadge}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-2">
                                      <span>معرف التواصل: <strong className="text-indigo-300 font-mono">{ticket.contactInfo}</strong></span>
                                      <span>•</span>
                                      <span>تاريخ الإرسال: {ticket.createdAt}</span>
                                    </p>
                                  </div>
                                </div>

                                {onDeleteTicket && (
                                  <button
                                    type="button"
                                    onClick={() => onDeleteTicket(ticket.id)}
                                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-red-500/20 text-xs"
                                    title="حذف الرسالة"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>

                              <div>
                                <span className="block text-[10px] font-bold text-amber-300/80 mb-1">
                                  موضوع الاستفسار: {ticket.subject}
                                </span>
                                <div className="p-3 bg-[#111622] rounded-lg border border-amber-500/20 text-xs text-gray-200 whitespace-pre-wrap leading-relaxed">
                                  {ticket.message}
                                </div>
                              </div>

                              {ticket.autoReplyMessage && (
                                <div className="p-2.5 bg-[#0b101c] rounded-lg border border-indigo-500/30 text-xs space-y-1">
                                  <span className="text-[10px] font-black text-indigo-300 font-['Cairo'] flex items-center gap-1">
                                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                                    الرد الآلي المرسل للمستفسر تلقائياً:
                                  </span>
                                  <p className="text-gray-300 text-[11px] font-sans leading-relaxed">
                                    {ticket.autoReplyMessage}
                                  </p>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-500/10">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-amber-200">تحديث حالة التذكرة:</span>
                                  <select
                                    value={ticket.status}
                                    onChange={(e) =>
                                      onUpdateTicketStatus &&
                                      onUpdateTicketStatus(ticket.id, e.target.value as ContactTicket['status'])
                                    }
                                    className="px-3 py-1 rounded-lg bg-[#141a29] border border-amber-500/40 text-xs text-amber-300 font-bold focus:outline-none"
                                  >
                                    <option value="جديد">🟡 جديد</option>
                                    <option value="تم الرد">🟢 تم الرد</option>
                                    <option value="مغلق">⚪ مغلق</option>
                                  </select>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onUpdateTicketStatus && onUpdateTicketStatus(ticket.id, 'تم الرد')
                                    }
                                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${
                                      ticket.status === 'تم الرد'
                                        ? 'bg-emerald-600 text-white border-emerald-400'
                                        : 'bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border-emerald-500/30'
                                    }`}
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    تحديد كـ تم الرد
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      onUpdateTicketStatus && onUpdateTicketStatus(ticket.id, 'مغلق')
                                    }
                                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${
                                      ticket.status === 'مغلق'
                                        ? 'bg-gray-600 text-white border-gray-400'
                                        : 'bg-gray-600/20 hover:bg-gray-600/40 text-gray-300 border-gray-500/30'
                                    }`}
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    إغلاق الاستفسار
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-gray-400 text-xs bg-[#0e121d] rounded-xl border border-amber-500/20">
                        لا توجد رسائل أو استفسارات حالياً تتطابق مع البحث.
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* TAB 2: Stats */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  {/* Add Stat Form */}
                  <form onSubmit={handleCreateStat} className="bg-[#0e121d] p-4 rounded-xl border border-amber-500/30 space-y-3">
                    <h4 className="text-xs font-bold text-amber-300 font-['Cairo'] flex items-center gap-1">
                      <Plus className="w-4 h-4" /> إضافة عنصر إحصائية جديد
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="العنوان (مثال: المدربين المعتمدين)..."
                        required
                        value={newStatLabel}
                        onChange={(e) => setNewStatLabel(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-gray-200"
                      />
                      <input
                        type="number"
                        placeholder="الرقم / القيمة (مثال: 25)..."
                        required
                        value={newStatValue}
                        onChange={(e) => setNewStatValue(e.target.value === '' ? '' : Number(e.target.value))}
                        className="px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-gray-200"
                      />
                      <input
                        type="text"
                        placeholder="الوصف الفرعي..."
                        value={newStatDesc}
                        onChange={(e) => setNewStatDesc(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-gray-200"
                      />
                      <button type="submit" className="gold-btn py-2 rounded-lg text-xs font-bold">
                        إضافة الإحصائية
                      </button>
                    </div>
                  </form>

                  {/* List of Stats with Full Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.map((stat) => (
                      <div key={stat.id} className="bg-[#0e121d] border border-amber-500/20 p-4 rounded-xl space-y-3 relative group">
                        <div className="flex justify-between items-center">
                          <label className="block text-xs font-bold text-amber-200 font-['Cairo']">
                            عنوان الإحصائية
                          </label>
                          <button
                            type="button"
                            onClick={() => handleDeleteStat(stat.id)}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                            title="حذف الإحصائية"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#111622] border border-amber-500/30 text-amber-200 text-xs font-bold"
                        />

                        <div>
                          <label className="block text-[10px] text-gray-400 mb-1">الرقم / القيمة</label>
                          <input
                            type="number"
                            value={stat.value}
                            onChange={(e) => handleStatChange(stat.id, 'value', Number(e.target.value))}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#111622] border border-amber-500/30 text-amber-300 font-black text-lg focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-gray-400 mb-1">الوصف الفرعي</label>
                          <input
                            type="text"
                            value={stat.description}
                            onChange={(e) => handleStatChange(stat.id, 'description', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#111622] border border-amber-500/30 text-gray-300 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Members Management */}
              {activeTab === 'members' && (
                <div className="space-y-6">
                  {/* Add Member Form */}
                  <form onSubmit={handleCreateMember} className="bg-[#0e121d] p-4 rounded-xl border border-amber-500/30 space-y-3">
                    <h4 className="text-xs font-bold text-amber-300 font-['Cairo'] flex items-center gap-1">
                      <Plus className="w-4 h-4" /> إضافة عضو / كادر جديد للأكاديمية
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                      <input
                        type="text"
                        placeholder="الاسم الثلاثي..."
                        required
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-gray-200"
                      />
                      <input
                        type="text"
                        placeholder="الرتبة أو المسمى..."
                        required
                        value={newMemberRank}
                        onChange={(e) => setNewMemberRank(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-gray-200"
                      />
                      <input
                        type="text"
                        placeholder="الرقم العسكري (#109)..."
                        required
                        value={newMemberBadge}
                        onChange={(e) => setNewMemberBadge(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-gray-200"
                      />
                      <select
                        value={newMemberDept}
                        onChange={(e) => setNewMemberDept(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-amber-200"
                      >
                        <option value="القيادة العامة">القيادة العامة</option>
                        <option value="المشرف العام">المشرف العام</option>
                        <option value="إدارة الأكاديمية">إدارة الأكاديمية</option>
                        <option value="عضو أكاديمية">عضو أكاديمية</option>
                        <option value="شؤون القبول">شؤون القبول</option>
                        <option value="جناح التدريب">جناح التدريب</option>
                      </select>

                      <button type="submit" className="gold-btn py-2 rounded-lg text-xs font-bold">
                        إضافة العضو
                      </button>
                    </div>

                    {/* New member avatar uploader */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-amber-500/10">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {newMemberAvatarUrl ? (
                          <img src={newMemberAvatarUrl} alt="معاينة" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-amber-400">لا صورة</span>
                        )}
                      </div>
                      <div className="flex-1 w-full flex flex-col sm:flex-row gap-2 items-center">
                        <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center">
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع صورة العضو</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setNewMemberAvatarUrl(event.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="أو ضع رابط صورة العضو هنا..."
                          value={newMemberAvatarUrl}
                          onChange={(e) => setNewMemberAvatarUrl(e.target.value)}
                          className="w-full flex-1 px-2.5 py-1.5 rounded-lg bg-[#141a29] border border-amber-500/30 text-xs text-gray-200"
                        />
                      </div>
                    </div>
                  </form>

                  {/* Members List with Edit functionality */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-amber-300 font-['Cairo']">
                      قائمة الأعضاء والكادر (يمكنك التعديل مباشرة وإضافة/تحديث الصور):
                    </h4>

                    <div className="grid grid-cols-1 gap-4">
                      {members.map((m) => (
                        <div key={m.id} className="bg-[#0e121d] border border-amber-500/20 p-4 rounded-xl space-y-3">
                          {/* Image controls for this member */}
                          <div className="flex flex-col sm:flex-row items-center gap-3 p-2.5 bg-[#131927] rounded-xl border border-amber-500/15">
                            <div className="w-12 h-12 rounded-full p-0.5 bg-amber-500/30 flex-shrink-0 overflow-hidden relative">
                              {m.avatarUrl && m.avatarUrl.trim() !== '' ? (
                                <img
                                  src={m.avatarUrl}
                                  alt={m.name}
                                  className="w-full h-full object-cover rounded-full"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-full h-full rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 text-xs font-bold">
                                  بلا صورة
                                </div>
                              )}
                            </div>

                            <div className="flex-1 w-full space-y-1.5">
                              <label className="block text-[10px] text-amber-300 font-bold">
                                صورة العضو / الكادر (رفع من الجهاز أو رابط):
                              </label>
                              <div className="flex flex-col sm:flex-row gap-2 items-center">
                                <label className="cursor-pointer px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>رفع صورة</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                          const dataUrl = event.target?.result as string;
                                          const updated = members.map((item) =>
                                            item.id === m.id ? { ...item, avatarUrl: dataUrl } : item
                                          );
                                          onUpdateMembers(updated);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>
                                <input
                                  type="text"
                                  placeholder="أو رابط الصورة هنا..."
                                  value={m.avatarUrl || ''}
                                  onChange={(e) => {
                                    const updated = members.map((item) =>
                                      item.id === m.id ? { ...item, avatarUrl: e.target.value } : item
                                    );
                                    onUpdateMembers(updated);
                                  }}
                                  className="w-full flex-1 px-2.5 py-1 rounded-lg bg-[#141a29] border border-amber-500/30 text-xs text-gray-200"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 flex-1">
                              <div>
                                <label className="block text-[10px] text-gray-400 mb-0.5">الاسم</label>
                                <input
                                  type="text"
                                  value={m.name}
                                  onChange={(e) => {
                                    const updated = members.map((item) => item.id === m.id ? { ...item, name: e.target.value } : item);
                                    onUpdateMembers(updated);
                                  }}
                                  className="w-full px-2 py-1 rounded bg-[#141a29] border border-amber-500/30 text-xs text-gray-200 font-bold"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] text-gray-400 mb-0.5">الرتبة / اللقب</label>
                                <input
                                  type="text"
                                  value={m.rank}
                                  onChange={(e) => {
                                    const updated = members.map((item) => item.id === m.id ? { ...item, rank: e.target.value } : item);
                                    onUpdateMembers(updated);
                                  }}
                                  className="w-full px-2 py-1 rounded bg-[#141a29] border border-amber-500/30 text-xs text-gray-200"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] text-gray-400 mb-0.5">الرقم العسكري</label>
                                <input
                                  type="text"
                                  value={m.badgeNumber}
                                  onChange={(e) => {
                                    const updated = members.map((item) => item.id === m.id ? { ...item, badgeNumber: e.target.value } : item);
                                    onUpdateMembers(updated);
                                  }}
                                  className="w-full px-2 py-1 rounded bg-[#141a29] border border-amber-500/30 text-xs text-gray-200 font-mono"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] text-gray-400 mb-0.5">القسم</label>
                                <select
                                  value={m.department}
                                  onChange={(e) => {
                                    const updated = members.map((item) => item.id === m.id ? { ...item, department: e.target.value } : item);
                                    onUpdateMembers(updated);
                                  }}
                                  className="w-full px-2 py-1 rounded bg-[#141a29] border border-amber-500/30 text-xs text-amber-300"
                                >
                                  <option value="القيادة العامة">القيادة العامة</option>
                                  <option value="المشرف العام">المشرف العام</option>
                                  <option value="إدارة الأكاديمية">إدارة الأكاديمية</option>
                                  <option value="عضو أكاديمية">عضو أكاديمية</option>
                                  <option value="شؤون القبول">شؤون القبول</option>
                                  <option value="جناح التدريب">جناح التدريب</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] text-gray-400 mb-0.5">الحالة</label>
                                <select
                                  value={m.status}
                                  onChange={(e) => {
                                    const updated = members.map((item) => item.id === m.id ? { ...item, status: e.target.value as any } : item);
                                    onUpdateMembers(updated);
                                  }}
                                  className="w-full px-2 py-1 rounded bg-[#141a29] border border-amber-500/30 text-xs text-emerald-300"
                                >
                                  <option value="نشط">نشط</option>
                                  <option value="في إجازة">في إجازة</option>
                                  <option value="مترقي حديثاً">مترقي حديثاً</option>
                                </select>
                              </div>
                            </div>

                            <button
                              onClick={() => onDeleteMember(m.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg self-end md:self-center border border-red-500/20"
                              title="حذف العضو"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Trainees & PDF Reports Management */}
              {activeTab === 'trainees' && (
                <div className="space-y-6">
                  {/* Add Trainee Form */}
                  <form onSubmit={handleCreateTrainee} className="bg-[#0e121d] p-4 rounded-xl border border-amber-500/30 space-y-3">
                    <h4 className="text-xs font-bold text-amber-300 font-['Cairo'] flex items-center gap-1">
                      <Plus className="w-4 h-4" /> إضافة متدرب جديد
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                      <input
                        type="text"
                        placeholder="اسم المتدرب الرباعي..."
                        required
                        value={newTraineeName}
                        onChange={(e) => setNewTraineeName(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-gray-200"
                      />
                      <input
                        type="text"
                        placeholder="الرقم العسكري (TR-8804)..."
                        required
                        value={newTraineeBadge}
                        onChange={(e) => setNewTraineeBadge(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-gray-200"
                      />
                      <input
                        type="text"
                        placeholder="الدفعة (الدفعة 14)..."
                        required
                        value={newTraineeBatch}
                        onChange={(e) => setNewTraineeBatch(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-gray-200"
                      />
                      <select
                        value={newTraineeStatus}
                        onChange={(e) => setNewTraineeStatus(e.target.value as any)}
                        className="px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-amber-200"
                      >
                        <option value="Cadet">Cadet (متدرب)</option>
                        <option value="Solo Cadet">Solo Cadet (متدرب منفرد)</option>
                        <option value="مؤهل للتخرج">مؤهل للتخرج</option>
                        <option value="خريج">خريج</option>
                      </select>

                      <button type="submit" className="gold-btn py-2 rounded-lg text-xs font-bold">
                        إضافة المتدرب
                      </button>
                    </div>
                  </form>

                  {/* Add Report to Trainee Section */}
                  <form onSubmit={handleAddReportToTrainee} className="bg-[#0e121d] p-4 rounded-xl border border-amber-500/40 space-y-3">
                    <h4 className="text-xs font-bold text-amber-300 font-['Cairo'] flex items-center gap-1">
                      <FileText className="w-4 h-4 text-red-400" /> إضافة / رفع تقرير PDF لمتدرب
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] text-gray-400 mb-1">اختر المتدرب</label>
                        <select
                          required
                          value={selectedTraineeForReport}
                          onChange={(e) => setSelectedTraineeForReport(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-amber-200"
                        >
                          <option value="">-- اختر متدرباً --</option>
                          {trainees.map((tr) => (
                            <option key={tr.id} value={tr.id}>
                              {tr.name} ({tr.badgeNumber})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-400 mb-1">عنوان التقرير</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: تقرير تقييم المداهمات والرماية..."
                          value={reportTitle}
                          onChange={(e) => setReportTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-gray-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-400 mb-1">نوع التقرير</label>
                        <select
                          value={reportCategory}
                          onChange={(e) => setReportCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-amber-200 font-bold"
                        >
                          <option value="تقرير ميداني اسبوعي">تقرير ميداني اسبوعي</option>
                          <option value="تقرير اول اسبوع">تقرير اول اسبوع</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-400 mb-1">المُقَيِّم / الجهة المصدرة</label>
                        <input
                          type="text"
                          value={reportEvaluator}
                          onChange={(e) => setReportEvaluator(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-gray-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-400 mb-1">النتيجة / الدرجة</label>
                        <input
                          type="text"
                          value={reportScore}
                          onChange={(e) => setReportScore(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-emerald-400 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-400 mb-1">تاريخ التقرير</label>
                        <input
                          type="date"
                          value={reportDate}
                          onChange={(e) => setReportDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-gray-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">ملاحظات التقرير</label>
                      <textarea
                        rows={2}
                        placeholder="اكتب ملاحظات وتقييمات المدرب أو المفتش..."
                        value={reportNotes}
                        onChange={(e) => setReportNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-gray-200"
                      />
                    </div>

                    {/* PDF File Uploader Input */}
                    <div className="bg-[#141a29] p-3 rounded-lg border border-dashed border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-amber-200">
                        <Upload className="w-5 h-5 text-amber-400" />
                        <div>
                          <p className="font-bold">مرفق ملف الـ PDF الخاص بالتقرير:</p>
                          <p className="text-[11px] text-gray-400">
                            {pdfFileName ? `الملف المحدد: ${pdfFileName}` : 'يمكنك اختيار ملف PDF من جهازك أو اعتماده تلقائياً'}
                          </p>
                        </div>
                      </div>

                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handlePdfFileUpload}
                        className="text-xs text-amber-300 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500/20 file:text-amber-300 hover:file:bg-amber-500/30 cursor-pointer"
                      />
                    </div>

                    <button type="submit" className="gold-btn w-full py-2.5 rounded-lg text-xs font-bold">
                      حفظ التقرير والـ PDF لملف المتدرب
                    </button>
                  </form>

                  {/* List of trainees with report management */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-amber-300 font-['Cairo']">
                      سجل المتدربين الحالي والتقارير المرفقة:
                    </h4>

                    {trainees.map((tr) => (
                      <div key={tr.id} className="bg-[#0e121d] border border-amber-500/20 p-4 rounded-xl space-y-3">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pb-2 border-b border-amber-500/10">
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 flex-1">
                            <input
                              type="text"
                              value={tr.name}
                              onChange={(e) => {
                                const updated = trainees.map((item) => item.id === tr.id ? { ...item, name: e.target.value } : item);
                                onUpdateTrainees(updated);
                              }}
                              className="px-2 py-1 rounded bg-[#141a29] border border-amber-500/30 text-xs font-bold text-amber-200"
                            />
                            <input
                              type="text"
                              value={tr.badgeNumber}
                              onChange={(e) => {
                                const updated = trainees.map((item) => item.id === tr.id ? { ...item, badgeNumber: e.target.value } : item);
                                onUpdateTrainees(updated);
                              }}
                              className="px-2 py-1 rounded bg-[#141a29] border border-amber-500/30 text-xs text-gray-300 font-mono"
                            />
                            <input
                              type="text"
                              value={tr.batch}
                              onChange={(e) => {
                                const updated = trainees.map((item) => item.id === tr.id ? { ...item, batch: e.target.value } : item);
                                onUpdateTrainees(updated);
                              }}
                              className="px-2 py-1 rounded bg-[#141a29] border border-amber-500/30 text-xs text-gray-300"
                            />
                            <select
                              value={tr.status}
                              onChange={(e) => {
                                const updated = trainees.map((item) => item.id === tr.id ? { ...item, status: e.target.value as any } : item);
                                onUpdateTrainees(updated);
                              }}
                              className="px-2 py-1 rounded bg-[#141a29] border border-amber-500/30 text-xs text-amber-300 font-bold"
                            >
                              <option value="Cadet">Cadet</option>
                              <option value="Solo Cadet">Solo Cadet</option>
                              <option value="مؤهل للتخرج">مؤهل للتخرج</option>
                              <option value="خريج">خريج</option>
                            </select>
                          </div>

                          <button
                            onClick={() => handleDeleteTrainee(tr.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded self-end sm:self-center"
                            title="حذف المتدرب"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Trainee reports list */}
                        <div className="pl-2 space-y-1.5">
                          <p className="text-[11px] font-bold text-gray-400">
                            التقارير المرفقة ({tr.reports?.length || 0}):
                          </p>
                          {tr.reports && tr.reports.length > 0 ? (
                            tr.reports.map((rep) => (
                              <div key={rep.id} className="flex items-center justify-between text-xs bg-[#131927] p-2 rounded border border-amber-500/10">
                                <div>
                                  <span className="text-amber-200 font-bold">{rep.title}</span>
                                  <span className="text-[10px] text-gray-400 mr-2">({rep.category} - {rep.date})</span>
                                </div>
                                <button
                                  onClick={() => handleDeleteReport(tr.id, rep.id)}
                                  className="text-red-400 hover:text-red-300 text-[10px] px-1.5 py-0.5 rounded bg-red-500/10"
                                >
                                  حذف التقرير
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-[10px] text-gray-500">لا يوجد تقارير مرفوعة بعد.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Rules Management */}
              {activeTab === 'rules' && (
                <div className="space-y-6">
                  <form onSubmit={handleCreateRule} className="bg-[#0e121d] p-4 rounded-xl border border-amber-500/30 space-y-3">
                    <h4 className="text-xs font-bold text-amber-300 font-['Cairo'] flex items-center gap-1">
                      <Plus className="w-4 h-4" /> إضافة قانون جديد للأكاديمية
                    </h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="عنوان القانون..."
                          required
                          value={newRuleTitle}
                          onChange={(e) => setNewRuleTitle(e.target.value)}
                          className="px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-gray-200"
                        />
                        <select
                          value={newRuleCat}
                          onChange={(e) => setNewRuleCat(e.target.value as any)}
                          className="px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-amber-200"
                        >
                          <option value="عامة">عامة</option>
                          <option value="الانضباط">الانضباط</option>
                          <option value="التقديم">التقديم</option>
                          <option value="الميدان">الميدان</option>
                          <option value="العقوبات">العقوبات</option>
                        </select>
                        <button type="submit" className="gold-btn py-2 rounded-lg text-xs font-bold">
                          إضافة القانون
                        </button>
                      </div>

                      <textarea
                        placeholder="نص وتفاصيل القانون اللائحي..."
                        required
                        rows={2}
                        value={newRuleContent}
                        onChange={(e) => setNewRuleContent(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-amber-500/30 text-xs text-gray-200"
                      />
                    </div>
                  </form>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-amber-300 font-['Cairo']">
                      قائمة القوانين الحالية (يمكنك التعديل أو الحذف):
                    </h4>
                    {rules.map((rule) => (
                      <div key={rule.id} className="bg-[#0e121d] border border-amber-500/20 p-3.5 rounded-xl space-y-2">
                        <div className="flex justify-between items-center gap-2">
                          <input
                            type="text"
                            value={rule.title}
                            onChange={(e) => {
                              if (onUpdateRules) {
                                const updated = rules.map((r) => (r.id === rule.id ? { ...r, title: e.target.value } : r));
                                onUpdateRules(updated);
                              }
                            }}
                            className="flex-1 px-2.5 py-1 rounded bg-[#141a29] border border-amber-500/30 text-xs text-amber-200 font-bold"
                          />
                          <select
                            value={rule.category}
                            onChange={(e) => {
                              if (onUpdateRules) {
                                const updated = rules.map((r) => (r.id === rule.id ? { ...r, category: e.target.value as any } : r));
                                onUpdateRules(updated);
                              }
                            }}
                            className="px-2 py-1 rounded bg-[#141a29] border border-amber-500/30 text-xs text-amber-300"
                          >
                            <option value="عامة">عامة</option>
                            <option value="الانضباط">الانضباط</option>
                            <option value="التقديم">التقديم</option>
                            <option value="الميدان">الميدان</option>
                            <option value="العقوبات">العقوبات</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              if (onDeleteRule) {
                                onDeleteRule(rule.id);
                              } else if (onUpdateRules) {
                                onUpdateRules(rules.filter((r) => r.id !== rule.id));
                              }
                            }}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                            title="حذف القانون"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={rule.content}
                          onChange={(e) => {
                            if (onUpdateRules) {
                              const updated = rules.map((r) => (r.id === rule.id ? { ...r, content: e.target.value } : r));
                              onUpdateRules(updated);
                            }
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-[#141a29] border border-amber-500/30 text-xs text-gray-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: Leadership Management */}
              {activeTab === 'leadership' && (
                <div className="space-y-4">
                  <div className="bg-[#111622] p-4 rounded-xl border border-amber-500/20 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-amber-300 font-['Cairo'] mb-1">
                        تعديل وإدارة صور وأسماء قيادة الأكاديمية
                      </h3>
                      <p className="text-xs text-gray-400">
                        يمكنك تغيير صور القيادات (رفع ملف مباشر من جهازك أو وضع رابط صورة)، وتخصيص المسمى والاسم والرتبة.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const newLeader: LeadershipOfficer = {
                          id: `lead-${Date.now()}`,
                          title: 'Police Academy',
                          titleAr: 'Police Academy',
                          name: 'الاسم هنا',
                          role: 'Police Academy',
                          rank: 'Police Academy',
                          stars: 3,
                          badgeNumber: '#110',
                          department: 'إدارة الأكاديمية',
                          avatarUrl: ''
                        };
                        onUpdateLeadership([...leadership, newLeader]);
                      }}
                      className="gold-btn px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 self-start sm:self-center shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة قائد جديد</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {leadership?.map((officer) => (
                      <div
                        key={officer.id}
                        className="bg-[#0e121d] border border-amber-500/20 rounded-xl p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-amber-500/10">
                          <span className="text-xs font-bold text-amber-400">
                            {officer.titleAr} ({officer.name})
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-gray-400 bg-[#141a29] px-2 py-0.5 rounded">
                              {officer.badgeNumber}
                            </span>
                            <button
                              onClick={() => {
                                if (confirm(`هل أنت تأكد من حذف ${officer.name}؟`)) {
                                  onUpdateLeadership(leadership.filter((l) => l.id !== officer.id));
                                }
                              }}
                              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                              title="حذف القائد"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-[#131927] rounded-xl border border-amber-500/15">
                          <div className="w-16 h-16 rounded-full p-0.5 bg-amber-500/30 flex-shrink-0 overflow-hidden relative">
                            {officer.avatarUrl && officer.avatarUrl.trim() !== '' ? (
                              <img
                                src={officer.avatarUrl}
                                alt={officer.name}
                                className="w-full h-full object-cover rounded-full"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 text-xs font-bold">
                                بلا صورة
                              </div>
                            )}
                          </div>

                          <div className="flex-1 w-full space-y-2">
                            <label className="block text-[10px] text-amber-300 font-bold">
                              صورة الضابط / القائد (رفع من الجهاز أو وضع رابط):
                            </label>

                            <div className="flex flex-col sm:flex-row gap-2 items-center">
                              {/* File Uploader */}
                              <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center">
                                <Upload className="w-3.5 h-3.5" />
                                <span>رفع صورة من الجهاز</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        const dataUrl = event.target?.result as string;
                                        const updated = leadership.map((o) =>
                                          o.id === officer.id ? { ...o, avatarUrl: dataUrl } : o
                                        );
                                        onUpdateLeadership(updated);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>

                              {/* URL input */}
                              <input
                                type="text"
                                placeholder="أو ألقِ رابط الصورة هنا..."
                                value={officer.avatarUrl || ''}
                                onChange={(e) => {
                                  const updated = leadership.map((o) =>
                                    o.id === officer.id ? { ...o, avatarUrl: e.target.value } : o
                                  );
                                  onUpdateLeadership(updated);
                                }}
                                className="w-full flex-1 px-2.5 py-1.5 rounded-lg bg-[#141a29] border border-amber-500/30 text-xs text-gray-200"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2">
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1">المسمى القيادي</label>
                            <input
                              type="text"
                              value={officer.titleAr}
                              onChange={(e) => {
                                const updated = leadership.map((o) =>
                                  o.id === officer.id ? { ...o, titleAr: e.target.value } : o
                                );
                                onUpdateLeadership(updated);
                              }}
                              className="w-full px-2 py-1.5 rounded-lg bg-[#141a29] border border-amber-500/30 text-xs text-gray-200"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1">الاسم / اللقب</label>
                            <input
                              type="text"
                              value={officer.name}
                              onChange={(e) => {
                                const updated = leadership.map((o) =>
                                  o.id === officer.id ? { ...o, name: e.target.value } : o
                                );
                                onUpdateLeadership(updated);
                              }}
                              className="w-full px-2 py-1.5 rounded-lg bg-[#141a29] border border-amber-500/30 text-xs text-gray-200"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-amber-300/90 font-bold mb-1">الكود العسكري</label>
                            <input
                              type="text"
                              value={officer.badgeNumber}
                              onChange={(e) => {
                                const updated = leadership.map((o) =>
                                  o.id === officer.id ? { ...o, badgeNumber: e.target.value } : o
                                );
                                onUpdateLeadership(updated);
                              }}
                              className="w-full px-2 py-1.5 rounded-lg bg-[#141a29] border border-amber-500/50 text-xs text-amber-300 font-mono font-bold"
                              placeholder="مثال: PA-01"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1">الرتبة</label>
                            <input
                              type="text"
                              value={officer.rank}
                              onChange={(e) => {
                                const updated = leadership.map((o) =>
                                  o.id === officer.id ? { ...o, rank: e.target.value } : o
                                );
                                onUpdateLeadership(updated);
                              }}
                              className="w-full px-2 py-1.5 rounded-lg bg-[#141a29] border border-amber-500/30 text-xs text-gray-200"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1">القسم</label>
                            <input
                              type="text"
                              value={officer.department}
                              onChange={(e) => {
                                const updated = leadership.map((o) =>
                                  o.id === officer.id ? { ...o, department: e.target.value } : o
                                );
                                onUpdateLeadership(updated);
                              }}
                              className="w-full px-2 py-1.5 rounded-lg bg-[#141a29] border border-amber-500/30 text-xs text-gray-200"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-amber-300 font-bold mb-1">النجوم</label>
                            <select
                              value={officer.stars}
                              onChange={(e) => {
                                const updated = leadership.map((o) =>
                                  o.id === officer.id ? { ...o, stars: Number(e.target.value) } : o
                                );
                                onUpdateLeadership(updated);
                              }}
                              className="w-full px-2 py-1.5 rounded-lg bg-[#141a29] border border-amber-500/40 text-xs text-amber-300 font-bold"
                            >
                              <option value={5}>⭐ 5 نجوم</option>
                              <option value={4}>⭐ 4 نجوم</option>
                              <option value={3}>⭐ 3 نجوم</option>
                              <option value={2}>⭐ نجمتان</option>
                              <option value={1}>⭐ نجمة واحدة</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-amber-500/30 flex justify-between items-center">
          <span className="text-xs text-amber-300/70 font-medium">
            النظام الإداري للأكاديمية v2.5 | حماية مشددة
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
