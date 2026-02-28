import { createClient } from '@supabase/supabase-js';
import { decode } from '../utils/crypto';

const _U = "aHR0cHM6Ly9oa2RraHpmZG12Y3h2b3Bhc29obS5zdXBhYmFzZS5jbw==";
const _K = "ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklzdWRXRmhaZlZtUnRkbVp5ZG05d2VYTnZhbWhoYlM0alZYZHJPVG9pU3hOQk5FSXpNVFUyTmlJc0luUjVjQ0k2SWtwWFZDSjlNREI1TUdVNE5URTJPRWxrT0dSbE1UUXdNVGhoTVRRNVpEWmxNek0xWVdKalptSTJOV0U1WmpaaFpXUXpNR001TkdabE1qUTNPVGt3T0RCak9HUTBNVFpsTURFeU0yTXlNalptTURVNVpqWmtOak14TVRVME9EQXpNREUxWkdRNVltRXpNV0V3TVRWaE9HSmxNVFl6T1NJc0ltVjRjQ0k2TWpBNE5qZzRNVFkzTkgwdWQwMDBUMFJRWDFFemVFRkxSRTFUTTI5RlZscE9SazVUVmtoTVYxSTRSbGRHYWxsalVta3pVRk5SUXpNd00yMTRTVWxqY25WaGFXbFBXVlpUVm01VFlXdERWblpaVWxoVmVHUTBNekpmVkRSNFoxSkhRWEpUVjBoYVZYTnhlRlpvTFRSMVFrbDZRbGhVTjBSNE0ybFZWRXBDVEU5U01VNWxaRlpWVmxsalZWWldiM1pOU1ZOUWVYUXpReXRaVmxWUVZFVk9SVEowWkhSbVdrOU5WbUZVUlU5VVFqSXdSREo0Tm5kdVNYaEpTVVpPWTBORFFXUmhRVEpwTmtWSlZ6Sk9NMUV5UTB4SlV6WkJRMmN3UVZNMGRsWmtZVTVRUzFSMFlqWkhWbEZqTjFob1ZreHZaRWxrT1RSbVJrZzJOalppVFhwWU16VjNRUzl1ZDFReWNFVmlUVzVtUlZKRmFVSmZXVXBSTUV0bFdVMXhTbXhYV2tkVWVXSndTbXREYW1VemFsZFNNVkpYYVVodVdrOXVUVXBEUlhWVldrcGtWREozWldwTVVqVllRbVZyVlVacVdqVldVa1ZQUlVWVlNVMDBURmRXUkZsVFRFeFdWbGhEVkRGVlUwNU9TVTlvWVhwUVNVNVpWbFU1VFhNd05rSTBRblJaTUU5UVVrVllVVEpCVVVkUFMxcERRWGR6WVVsTFZrVlFTVFpXUVU1RFFWSkVUalJSVkd0VUxVZ3pUMUpTVFZScFFVUlNNME0zUmxWM1VVMXNUMUpUVmxCUWRUWkRWVlJVU0U5NFUxbERTMWxGVVZWRVNWWldSMU5PUm5SQlZVaE5URUpSWlVaTlEwNXNXVkpRV2xOU1RFVkNVVUpYVkZSQVNVNUZNRTVVU1ZWWVFWZFBUVkpQU1VKUFUxUlBRVXRQUVV0QlRWTlhUMUpTVWxSRlRrNUVSVk13VWs5NFBWVk1RMmRRVm01TVUwNVNVVUpSVlU5M1VVSkVRMWRQVUUxUFFVOU9WVVY0VlVKTVFWSldWRWRRVTBaUlUwNVVVbEJJVVRORlZVSTNWVVJKVUU5NFMxWkpVMUpQU1Y0eGIzVndSRzFpWkd0NGVsaGtaVzF5WjNSd1pHeG9ZUzVqYnc9PQ==";
const SUPABASE_URL = decode(_U);
const SUPABASE_ANON_KEY = decode("ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklzdWRXRmhaZlZtUnRkbVp5ZG05d2VYTnZhbWhoYlM0alZYZHJPVG9pU3hOQk5FSXpNVFUyTmlJc0luUjVjQ0k2SWtwWFZDSjlNREI1TUdVNE5URTJPRWxrT0dSbE1UUXdNVGhoTVRRNVpEWmxNek0xWVdKalptSTJOV0U1WmpaaFpXUXpNR001TkdabE1qUTNPVGt3T0RCak9HUTBNVFpsTURFeU0yTXlNalptTURVNVpqWmtOak14TVRVME9EQXpNREUxWkdRNVltRXpNV0V3TVRWaE9HSmxNVFl6T1NJc0ltVjRjQ0k2TWpBNE5qZzRNVFkzTkgwdWQwMDBUMFJRWDFFemVFRkxSRTFUTTI5RlZscE9SazVUVmtoTVYxSTRSbGRHYWxsalVta3pVRk5SUXpNd00yMTRTVWxqY25WaGFXbFBXVlpUVm01VFlXdERWblpaVWxoVmVHUTBNekpmVkRSNFoxSkhRWEpUVjBoYVZYTnhlRlpvTFRSMVFrbDZRbGhVTjBSNE0ybFZWRXBDVEU5U01VNWxaRlpWVmxsalZWWldiM1pOU1ZOUWVYUXpReXRaVmxWUVZFVk9SVEowWkhSbVdrOU5WbUZVUlU5VVFqSXdSREo0Tm5kdVNYaEpTVVpPWTBORFFXUmhRVEpwTmtWSlZ6Sk9NMUV5UTB4SlV6WkJRMmN3UVZNMGRsWmtZVTVRUzFSMFlqWkhWbEZqTjFob1ZreHZaRWxrT1RSbVJrZzJOalppVFhwWU16VjNRUzl1ZDFReWNFVmlUVzVtUlZKRmFVSmZXVXBSTUV0bFdVMXhTbXhYV2tkVWVXSndTbXREYW1VemFsZFNNVkpYYVVodVdrOXVUVXBEUlhWVldrcGtWREozWldwTVVqVllRbVZyVlVacVdqVldVa1ZQUlVWVlNVMDBURmRXUkZsVFRFeFdWbGhEVkRGVlUwNU9TVTlvWVhwUVNVNVpWbFU1VFhNd05rSTBRblJaTUU5UVVrVllVVEpCVVVkUFMxcERRWGR6WVVsTFZrVlFTVFpXUVU1RFFWSkVUalJSVkd0VUxVZ3pUMUpTVFZScFFVUlNNME0zUmxWM1VVMXNUMUpUVmxCUWRUWkRWVlJVU0U5NFUxbERTMWxGVVZWRVNWWldSMU5PUm5SQlZVaE5URUpSWlVaTlEwNXNXVkpRV2xOU1RFVkNVVUpYVkZSQVNVNUZNRTVVU1ZWWVFWZFBUVkpQU1VKUFUxUlBRVXRQUVV0QlRWTlhUMUpTVWxSRlRrNUVSVk13VWs5NFBWVk1RMmRRVm01TVUwNVNVVUpSVlU5M1VVSkVRMWRQVUUxUFFVOU9WVVY0VlVKTVFWSldWRWRRVTBaUlUwNVVVbEJJVVRORlZVSTNWVVJKVUU5NFMxWkpVMUpQU1Y0eGIzVndSRzFpWkd0NGVsaGtaVzF5WjNSd1pHeG9ZUzVqYnc9PQ==");

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

// ─── Content Management ───────────────────────────────────────────────

export type ContentType = 'section' | 'folder' | 'subject_core' | 'subject_additional' | 'file' | 'photo' | 'video' | 'competitive_exam' | 'stream' | 'quiz';

export interface DashboardContent {
    id: string;
    title: string;
    type: ContentType;
    content_link?: string;
    parent_id?: string;
    order_index: number;
    class_target?: string;
    stream_target?: string;
    exam_target?: string;
    created_at: string;
}

export const fetchDashboardContent = async (): Promise<DashboardContent[]> => {
    const { data, error } = await supabase
        .from('dashboard_content')
        .select('*')
        .order('order_index', { ascending: true });
    if (error) throw error;
    return data || [];
};

export const createDashboardContent = async (content: Partial<DashboardContent>) => {
    const { data, error } = await supabase
        .from('dashboard_content')
        .insert([content])
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const deleteDashboardContent = async (id: string) => {
    const { error } = await supabase.from('dashboard_content').delete().eq('id', id);
    if (error) throw error;
};

// Category Management
export const fetchClasses = async () => {
    const { data, error } = await supabase.from('classes').select('*').order('name');
    if (error) throw error;
    return data || [];
};

export const fetchStreams = async () => {
    const { data, error } = await supabase.from('streams').select('*').order('name');
    if (error) throw error;
    return data || [];
};

export const fetchExams = async () => {
    const { data, error } = await supabase.from('competitive_exams').select('*').order('name');
    if (error) throw error;
    return data || [];
};

export const fetchSubjects = async () => {
    const { data, error } = await supabase.from('subjects').select('*').order('name');
    if (error) throw error;
    return data || [];
};

export const createClass = async (name: string) => {
    const { data, error } = await supabase.from('classes').insert([{ name }]).select().single();
    if (error) throw error;
    return data;
};

export const createStream = async (name: string) => {
    const { data, error } = await supabase.from('streams').insert([{ name }]).select().single();
    if (error) throw error;
    return data;
};

export const createExam = async (name: string) => {
    const { data, error } = await supabase.from('competitive_exams').insert([{ name }]).select().single();
    if (error) throw error;
    return data;
};

export const createSubject = async (name: string, streamId?: string, className?: string) => {
    const { data, error } = await supabase.from('subjects').insert([{ name, stream_id: streamId, class_name: className }]).select().single();
    if (error) throw error;
    return data;
};

export const deleteClass = async (id: string) => {
    const { error } = await supabase.from('classes').delete().eq('id', id);
    if (error) throw error;
};

export const deleteStream = async (id: string) => {
    const { error } = await supabase.from('streams').delete().eq('id', id);
    if (error) throw error;
};

export const deleteExam = async (id: string) => {
    const { error } = await supabase.from('competitive_exams').delete().eq('id', id);
    if (error) throw error;
};

export const deleteSubject = async (id: string) => {
    const { error } = await supabase.from('subjects').delete().eq('id', id);
    if (error) throw error;
};
