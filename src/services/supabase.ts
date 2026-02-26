import { createClient } from '@supabase/supabase-js';
import { decode } from '../utils/crypto';

const _U = "aHR0cHM6Ly9oa2RraHpmZG12Y3h2b3Bhc29obS5zdXBhYmFzZS5jbw==";
const _K = "ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW1oclpHdG9lbVprYlhaamVIWnZjR0Z6YjJodElpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzTnpFek1EVTJOemdzSW1WNGNDSTZNakE0TmpnNE1UWTNPSDAuN0l0LUR4MVF5VHlhSUZSZ3NJYjQ2eTZJb0hPbDEzUkZHYVV2WEJ3a0tQSQ==";

const SUPABASE_URL = decode(_U);
const SUPABASE_ANON_KEY = decode(_K);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type OperatorRole = 'ceo' | 'founder' | 'owner';

export interface Operator {
    id: string;
    email: string;
    name: string;
    role: OperatorRole;
    student_id?: string | null;
    created_at: string;
    avatar_url?: string | null;
}

/** Sign in via Supabase Auth, then verify this user is in the operators table with a valid role */
export const signInOperator = async (email: string, password: string): Promise<Operator | null> => {
    try {
        // 1. Authenticate with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
        });
        if (authError) throw new Error(authError.message);
        if (!authData.user) throw new Error('Authentication failed.');

        // 2. Check operators table for valid role
        const { data: op, error: opError } = await supabase
            .from('operators')
            .select('*')
            .eq('email', email.trim().toLowerCase())
            .in('role', ['ceo', 'founder', 'owner'])
            .maybeSingle();

        if (opError || !op) {
            await supabase.auth.signOut();
            throw new Error('Access Denied: Your account does not have operator privileges.');
        }

        return op as Operator;
    } catch (err: any) {
        throw err;
    }
};

export const signOutOperator = async () => {
    await supabase.auth.signOut();
};

export const fetchAllOperators = async (): Promise<Operator[]> => {
    const { data, error } = await supabase
        .from('operators')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Operator[];
};

export const createOperator = async (op: {
    email: string;
    name: string;
    role: OperatorRole;
    password: string;
    student_id?: string;
}) => {
    // 1. Check if email already in Supabase Auth (student account link)
    const { data: existingStudent } = await supabase
        .from('students')
        .select('id, student_id')
        .eq('email', op.email.trim().toLowerCase())
        .maybeSingle();

    // 2. Try create auth user (if it fails, it might already exist - that's ok)
    try {
        await supabase.auth.admin?.createUser({
            email: op.email.trim(),
            password: op.password,
            email_confirm: true,
        });
    } catch (_) { /* Ignore if admin API not available */ }

    // 3. Insert into operators table
    const { data, error } = await supabase
        .from('operators')
        .insert([{
            email: op.email.trim().toLowerCase(),
            name: op.name.trim(),
            role: op.role,
            student_id: existingStudent?.student_id || op.student_id || null,
        }])
        .select()
        .single();

    if (error) throw error;
    return data as Operator;
};

export const deleteOperator = async (id: string) => {
    const { error } = await supabase.from('operators').delete().eq('id', id);
    if (error) throw error;
};

export const fetchAdminStats = async () => {
    try {
        const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
        const { count: quizCount } = await supabase.from('quiz_results').select('*', { count: 'exact', head: true });
        const { data: recentResults } = await supabase
            .from('quiz_results')
            .select('*, students(name)')
            .order('created_at', { ascending: false })
            .limit(10);

        // Accuracy stats
        const { data: allResults } = await supabase
            .from('quiz_results')
            .select('score, total')
            .limit(500);

        let accuracy = 0;
        if (allResults && allResults.length > 0) {
            const totalScore = allResults.reduce((a: number, r: any) => a + r.score, 0);
            const totalQ = allResults.reduce((a: number, r: any) => a + r.total, 0);
            accuracy = totalQ > 0 ? Math.round((totalScore / totalQ) * 100) : 0;
        }

        return {
            studentCount: studentCount || 0,
            quizCount: quizCount || 0,
            recentResults: recentResults || [],
            accuracy,
        };
    } catch (e) {
        console.error('fetchAdminStats error:', e);
        return null;
    }
};

export const fetchAllStudents = async () => {
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
};

export const fetchMaintenanceSettings = async () => {
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .maybeSingle();
    if (error) throw error;
    return data;
};

export const updateMaintenanceSettings = async (settings: any) => {
    const { id, ...updateData } = settings;
    // If id is provided, use it, otherwise fallback to id 1
    const targetId = id || 1;

    const { data, error } = await supabase
        .from('settings')
        .update(updateData)
        .eq('id', targetId)
        .select();
    if (error) throw error;
    return data;
};
