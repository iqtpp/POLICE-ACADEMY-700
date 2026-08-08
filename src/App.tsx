import React, { useState, useEffect } from 'react';
import { createApplication, deleteApplication, fetchApplications, updateApplicationStatus } from './lib/applications';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { QuickNavCards } from './components/QuickNavCards';
import { LeadershipSection } from './components/LeadershipSection';
import { StatsSidebar } from './components/StatsSidebar';

import { AboutModal } from './components/AboutModal';
import { RulesModal } from './components/RulesModal';
import { ApplicationModal } from './components/ApplicationModal';
import { MembersModal } from './components/MembersModal';
import { LeadershipModal } from './components/LeadershipModal';
import { ContactModal } from './components/ContactModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { TraineesModal } from './components/TraineesModal';

import {
  INITIAL_LEADERSHIP,
  INITIAL_STATS,
  QUICK_FEATURE_CARDS,
  INITIAL_RULES,
  INITIAL_MEMBERS,
  INITIAL_TRAINEES,
  DEFAULT_SITE_SETTINGS,
  INITIAL_CONTACT_TICKETS,
} from './data/mockData';

import { ActiveTab, LeadershipOfficer, RecruitmentApplication, AcademyRule, AcademyMember, AcademyStat, Trainee, SiteSettings, ContactTicket } from './types';
import badgeImg from './assets/images/police_gold_badge_1785941230134.jpg';
import { Lock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Helper function to read from localStorage
  const loadStoredData = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(`police_academy_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // App Data States (Persisted in localStorage)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => loadStoredData('siteSettings', DEFAULT_SITE_SETTINGS));
  const [leadership, setLeadership] = useState<LeadershipOfficer[]>(() => loadStoredData('leadership', INITIAL_LEADERSHIP));
  const [stats, setStats] = useState<AcademyStat[]>(() => loadStoredData('stats', INITIAL_STATS));
  const [rules, setRules] = useState<AcademyRule[]>(() => loadStoredData('rules', INITIAL_RULES));
  const [members, setMembers] = useState<AcademyMember[]>(() => loadStoredData('members', INITIAL_MEMBERS));
  // Applications are stored in Supabase, not in localStorage or the public server store.
  const [applications, setApplications] = useState<RecruitmentApplication[]>([]);
  const [trainees, setTrainees] = useState<Trainee[]>(() => loadStoredData('trainees', INITIAL_TRAINEES));
  const [contactTickets, setContactTickets] = useState<ContactTicket[]>(() => loadStoredData('contactTickets', INITIAL_CONTACT_TICKETS));

  const [isLoadedFromServer, setIsLoadedFromServer] = useState(false);

  // Load stored data from server on mount
  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          const d = resData.data;
          if (d.siteSettings) setSiteSettings(d.siteSettings);
          if (d.leadership) setLeadership(d.leadership);
          if (d.stats) setStats(d.stats);
          if (d.rules) setRules(d.rules);
          if (d.members) setMembers(d.members);
          if (d.trainees) setTrainees(d.trainees);
          if (d.contactTickets) setContactTickets(d.contactTickets);
        }
      })
      .catch((err) => {
        console.warn('Could not load data from server API, falling back to localStorage:', err);
      })
      .finally(() => {
        setIsLoadedFromServer(true);
      });
  }, []);

  // Sync states to backend server and localStorage whenever they change
  useEffect(() => {
    if (!isLoadedFromServer) return;

    const payload = {
      siteSettings,
      leadership,
      stats,
      rules,
      members,
      trainees,
      contactTickets,
    };

    // Save to localStorage
    Object.entries(payload).forEach(([key, val]) => {
      try {
        localStorage.setItem(`police_academy_${key}`, JSON.stringify(val));
      } catch (e) {
        console.warn(`Failed to save ${key} to localStorage:`, e);
      }
    });

    // Save to server data_store.json
    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((e) => console.error('Failed to sync to server:', e));
  }, [isLoadedFromServer, siteSettings, leadership, stats, rules, members, trainees, contactTickets]);

  // Modals Visibility
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isLeadershipOpen, setIsLeadershipOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isTraineesOpen, setIsTraineesOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Handle Tab Selection
  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'about') setIsAboutOpen(true);
    if (tab === 'rules') setIsRulesOpen(true);
    if (tab === 'apply') setIsApplyOpen(true);
    if (tab === 'members') setIsMembersOpen(true);
    if (tab === 'leadership') setIsLeadershipOpen(true);
    if (tab === 'contact') setIsContactOpen(true);
    if (tab === 'trainees') setIsTraineesOpen(true);
  };

  // Applications are handled directly by Supabase.
  const handleAddApplication = async (
    newApp: Omit<RecruitmentApplication, 'id' | 'status' | 'submittedAt'>
  ) => {
    const created = await createApplication(newApp);
    setApplications(apps => [created, ...apps]);
  };

  const handleLoadApplications = async () => {
    const rows = await fetchApplications();
    setApplications(rows);
  };

  // Admin Actions
  const handleUpdateAppStatus = async (
    id: string,
    newStatus: RecruitmentApplication['status']
  ) => {
    try {
      await updateApplicationStatus(id, newStatus);
      setApplications(apps => apps.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (error) {
      console.error('Failed to update application status:', error);
      alert('تعذر تحديث حالة الطلب. تأكد من اتصال Supabase وصلاحيات لوحة الإدارة.');
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      await deleteApplication(id);
      setApplications(apps => apps.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete application:', error);
      alert('تعذر حذف الطلب. تأكد من اتصال Supabase وصلاحيات لوحة الإدارة.');
    }
  };

  const handleAddMember = (m: Omit<AcademyMember, 'id'>) => {
    const created: AcademyMember = { ...m, id: `m-${Date.now()}` };
    setMembers([created, ...members]);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleAddRule = (r: Omit<AcademyRule, 'id'>) => {
    const created: AcademyRule = { ...r, id: `r-${Date.now()}` };
    setRules([created, ...rules]);
  };

  const handleSendTicket = (ticketData: Omit<ContactTicket, 'id' | 'createdAt' | 'status'>) => {
    const newTicket: ContactTicket = {
      ...ticketData,
      id: `t-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'جديد',
    };
    setContactTickets([newTicket, ...contactTickets]);
  };

  const handleUpdateTicketStatus = (id: string, status: ContactTicket['status']) => {
    setContactTickets(tickets => tickets.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleDeleteTicket = (id: string) => {
    setContactTickets(tickets => tickets.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-gray-100 flex flex-col font-['Tajawal','Cairo',sans-serif]">
      
      {/* Top Header Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        openAdminModal={() => setIsAdminOpen(true)}
        siteSettings={siteSettings}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Hero Section */}
        <HeroSection
          onApplyClick={() => setIsApplyOpen(true)}
          siteSettings={siteSettings}
        />

        {/* 6 Feature Navigation Cards */}
        <QuickNavCards
          cards={QUICK_FEATURE_CARDS}
          onCardClick={handleSelectTab}
        />

        {/* Main Content Grid: Leadership & Stats Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 my-6 items-stretch">
          
          {/* Main Column (3/4 width): Leadership Section */}
          <div className="lg:col-span-3">
            <LeadershipSection
              officers={leadership}
              onViewAllClick={() => setIsLeadershipOpen(true)}
              onOfficerClick={() => setIsLeadershipOpen(true)}
            />
          </div>

          {/* Sidebar Column (1/4 width): Academy Stats */}
          <div className="lg:col-span-1">
            <StatsSidebar stats={stats} />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#06080d] border-t border-[#3a2e10]/80 py-8 mt-12 text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center space-y-4">
          
          <div className="flex items-center gap-3">
            <img src={badgeImg} alt="Police Emblem" className="w-10 h-10 rounded-full border border-amber-400/60 p-0.5" referrerPolicy="no-referrer" />
            <span className="text-lg font-black text-gold-gradient font-['Cairo']">
              أكاديمية الشرطة | POLICE ACADEMY
            </span>
          </div>

          <p className="text-xs text-amber-200/80 max-w-lg font-medium">
            نصنع القادة .. تحمي المستقبل | جميع الحقوق محفوظة لأكاديمية الشرطة © {new Date().getFullYear()}
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400 font-semibold pt-2">
            <button onClick={() => setIsAboutOpen(true)} className="hover:text-amber-300 transition-colors">عن الأكاديمية</button>
            <button onClick={() => setIsRulesOpen(true)} className="hover:text-amber-300 transition-colors">القوانين واللوائح</button>
            <button onClick={() => setIsApplyOpen(true)} className="hover:text-amber-300 transition-colors">تقديم طلب الالتحاق</button>
            <button onClick={() => setIsContactOpen(true)} className="hover:text-amber-300 transition-colors">تواصل معنا</button>
            <button onClick={() => setIsAdminOpen(true)} className="hover:text-amber-300 transition-colors flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>لوحة الإدارة</span>
            </button>
          </div>

        </div>
      </footer>

      {/* Modals & Dialogs */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => {
          setIsAboutOpen(false);
          setActiveTab('home');
        }}
        onApplyClick={() => setIsApplyOpen(true)}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => {
          setIsRulesOpen(false);
          setActiveTab('home');
        }}
        rules={rules}
      />

      <ApplicationModal
        isOpen={isApplyOpen}
        onClose={() => {
          setIsApplyOpen(false);
          setActiveTab('home');
        }}
        onSubmitApp={handleAddApplication}
        siteSettings={siteSettings}
      />

      <MembersModal
        isOpen={isMembersOpen}
        onClose={() => {
          setIsMembersOpen(false);
          setActiveTab('home');
        }}
        members={members}
      />

      <LeadershipModal
        isOpen={isLeadershipOpen}
        onClose={() => {
          setIsLeadershipOpen(false);
          setActiveTab('home');
        }}
        officers={leadership}
      />

      <TraineesModal
        isOpen={isTraineesOpen}
        onClose={() => {
          setIsTraineesOpen(false);
          setActiveTab('home');
        }}
        trainees={trainees}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => {
          setIsContactOpen(false);
          setActiveTab('home');
        }}
        onSendTicket={handleSendTicket}
        siteSettings={siteSettings}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        applications={applications}
        onUpdateAppStatus={handleUpdateAppStatus}
        onDeleteApplication={handleDeleteApplication}
        onLoadApplications={handleLoadApplications}
        contactTickets={contactTickets}
        onUpdateTicketStatus={handleUpdateTicketStatus}
        onDeleteTicket={handleDeleteTicket}
        stats={stats}
        onUpdateStats={setStats}
        members={members}
        onAddMember={handleAddMember}
        onUpdateMembers={setMembers}
        onDeleteMember={handleDeleteMember}
        rules={rules}
        onAddRule={handleAddRule}
        onUpdateRules={setRules}
        onDeleteRule={(id) => setRules(r => r.filter(rule => rule.id !== id))}
        leadership={leadership}
        onUpdateLeadership={setLeadership}
        trainees={trainees}
        onUpdateTrainees={setTrainees}
        siteSettings={siteSettings}
        onUpdateSiteSettings={setSiteSettings}
      />

    </div>
  );
}
