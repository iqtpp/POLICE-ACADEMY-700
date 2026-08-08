export type ActiveTab = 'home' | 'about' | 'rules' | 'apply' | 'members' | 'leadership' | 'contact' | 'trainees';

export interface LeadershipOfficer {
  id: string;
  title: string;
  titleAr: string;
  name: string;
  role: string;
  rank: string;
  stars: number;
  avatarUrl?: string;
  badgeNumber: string;
  department: string;
  bio?: string;
}

export interface AcademyStat {
  id: string;
  label: string;
  value: number;
  iconName: string;
  description?: string;
}

export interface QuickFeatureCard {
  id: ActiveTab;
  title: string;
  description: string;
  iconName: string;
}

export interface AcademyRule {
  id: string;
  title: string;
  category: 'عامة' | 'الانضباط' | 'التقديم' | 'الميدان' | 'العقوبات';
  content: string;
  importance: 'عالي' | 'متوسط' | 'تنبيه';
}

export interface AcademyMember {
  id: string;
  name: string;
  rank: string;
  rankLevel: number; // For sorting
  badgeNumber: string;
  department: string;
  joinDate: string;
  status: 'نشط' | 'في إجازة' | 'مترقي حديثاً';
  avatarUrl?: string;
}

export interface TraineeReport {
  id: string;
  traineeId: string;
  title: string;
  category: 'تقرير ميداني اسبوعي' | 'تقرير اول اسبوع';
  date: string;
  evaluator: string;
  score?: string;
  pdfUrl?: string; // Data URL or PDF link
  pdfName?: string;
  notes?: string;
}

export interface Trainee {
  id: string;
  name: string;
  badgeNumber: string;
  batch: string; // e.g. الدفعة 14
  joinDate: string;
  status: 'Cadet' | 'Solo Cadet' | 'مستجد' | 'تحت التدريب' | 'مؤهل للتخرج' | 'خريج';
  avatarUrl?: string;
  reports: TraineeReport[];
}

export interface RecruitmentApplication {
  id: string;
  fullName: string;
  age: number;
  discordId: string;
  gameId: string;
  departmentPreference?: string;
  experience: string;
  whyJoin: string;
  acceptedRules: boolean;
  status: 'قيد المراجعة' | 'مقبول مبدئياً' | 'مرفوض' | 'تمت المقابلة';
  submittedAt: string;
}

export interface ContactTicket {
  id: string;
  senderName: string;
  contactInfo: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'جديد' | 'تم الرد' | 'مغلق';
  autoReplyMessage?: string;
}

export interface SiteSettings {
  siteName: string;
  siteSubtitle: string;
  heroBadgeText: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroDescription: string;
  recruitmentOpen: boolean;
  recruitmentNotice: string;
  contactDiscordUrl: string;
  contactEmail: string;
  autoReplyEnabled?: boolean;
  autoReplyTemplate?: string;
}
