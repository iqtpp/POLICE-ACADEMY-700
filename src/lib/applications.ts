import { supabase } from './supabase';
import type { RecruitmentApplication } from '../types';

type ApplicationRow = {
  id: string | number;
  full_name: string;
  age: number;
  discord_id: string;
  game_id: string;
  department_preference?: string | null;
  experience?: string | null;
  why_join: string;
  accepted_rules: boolean;
  status: RecruitmentApplication['status'];
  submitted_at: string;
};

const requireSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase غير مفعّل. أضف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY إلى متغيرات البيئة.');
  }
  return supabase;
};

const fromRow = (row: ApplicationRow): RecruitmentApplication => ({
  id: String(row.id),
  fullName: row.full_name,
  age: Number(row.age),
  discordId: row.discord_id,
  gameId: row.game_id || '-',
  departmentPreference: row.department_preference ?? undefined,
  experience: row.experience ?? '',
  whyJoin: row.why_join,
  acceptedRules: Boolean(row.accepted_rules),
  status: row.status,
  submittedAt: row.submitted_at,
});

export const fetchApplications = async (): Promise<RecruitmentApplication[]> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from('academy_applications')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(fromRow);
};

export const createApplication = async (
  app: Omit<RecruitmentApplication, 'id' | 'status' | 'submittedAt'>
): Promise<RecruitmentApplication> => {
  const client = requireSupabase();

  const row = {
    id: crypto.randomUUID(),
    full_name: app.fullName,
    age: app.age,
    discord_id: app.discordId,
    game_id: app.gameId || '-',
    department_preference: app.departmentPreference ?? null,
    experience: app.experience ?? '',
    why_join: app.whyJoin,
    accepted_rules: app.acceptedRules,
    status: 'قيد المراجعة' as RecruitmentApplication['status'],
    submitted_at: new Date().toISOString(),
  };

  const { data, error } = await client
    .from('academy_applications')
    .insert(row)
    .select('*')
    .single();

  if (error) throw error;
  return fromRow(data as ApplicationRow);
};

export const updateApplicationStatus = async (
  id: string,
  status: RecruitmentApplication['status']
): Promise<void> => {
  const client = requireSupabase();
  const { error } = await client
    .from('academy_applications')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
};

export const deleteApplication = async (id: string): Promise<void> => {
  const client = requireSupabase();
  const { error } = await client
    .from('academy_applications')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
