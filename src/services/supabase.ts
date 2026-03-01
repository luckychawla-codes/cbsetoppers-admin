import { createClient } from '@supabase/supabase-js';
import { decode } from '../utils/crypto';

// High-security obfuscated DBMS secrets
const _U = "b2MuZXNhYmFwdXMubWhvc2Fwb3Z4Y3ZtZGZ6aGtka2gvLzpzcHR0aA==";
const _K = "SVBLa3dBWHZVYUdGUjMxbE9Ib0k2eTY0YklzZ1JGSWF5VHlRMXhELXRJNy4wSE8zWVRNNGdqTjRBak02SUNjNFZtSXNnek4yVURNekV6TjNFak9pUVhZcEpDTGk0MmJ1Rm1JNklTWnM5bWNpd2lJdGgyYnpGR2N2WkhlalpYYmtabWVvdEdacmhtSTZJaVpsSm5Jc0lTWnpGbVloQlhkekppT2lNM2NwSnllLjlKQ1ZYcGtJNklDYzVSbklzSWlOMUl6VUlKaU9pY0diaEp5ZQ=="; // Note: Ensure this matches the key in ToppersDMBS.txt reversed and b64

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
}

// ─── ADMIN AUTH ─────────────────────────────────────────────────────

export const signInOperator = async (email: string, password: string): Promise<Operator | null> => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
    });
    if (authError) throw authError;

    const { data: op, error: opError } = await supabase
        .from('operators')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

    if (opError || !op) {
        await supabase.auth.signOut();
        throw new Error('Access Denied: Not an operator.');
    }
    return op as Operator;
};

export const signOutOperator = async () => {
    await supabase.auth.signOut();
};

export const fetchAllOperators = async (): Promise<Operator[]> => {
    const { data, error } = await supabase.from('operators').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
};

export const createOperator = async (op: any) => {
    const { data, error } = await supabase.from('operators').insert([op]).select().single();
    if (error) throw error;
    return data;
};

export const deleteOperator = async (id: string) => {
    await supabase.from('operators').delete().eq('id', id);
};

// ─── CONTENT MANAGEMENT (STRICT RULES) ──────────────────────────────

export type SubjectCategory = 'Core' | 'Additional';
export type MaterialType = 'pdf' | 'image' | 'video';

export interface Subject {
    id: string;
    name: string;
    code: string;
    category: SubjectCategory;
    target_class: string;
    target_stream?: string;
    created_at: string;
}

export interface Folder {
    id: string;
    subject_id: string;
    parent_id?: string | null;
    name: string;
    order_index: number;
    created_at: string;
}

export interface Material {
    id: string;
    folder_id: string;
    title: string;
    type: MaterialType;
    url: string;
    order_index: number;
    created_at: string;
}

// SUBJECTS
export const fetchSubjects = async (): Promise<Subject[]> => {
    const { data, error } = await supabase.from('subjects').select('*').order('name');
    if (error) throw error;
    return data || [];
};

export const createSubject = async (subject: Partial<Subject>) => {
    // Validation is enforced by DB constraints, but we can catch it here too
    const { data, error } = await supabase.from('subjects').insert([subject]).select().single();
    if (error) throw error;
    return data;
};

export const deleteSubject = async (id: string) => {
    await supabase.from('subjects').delete().eq('id', id);
};

// FOLDERS
export const fetchFolders = async (subjectId: string, parentId: string | null = null): Promise<Folder[]> => {
    let query = supabase.from('folders').select('*').eq('subject_id', subjectId);
    if (parentId) query = query.eq('parent_id', parentId);
    else query = query.is('parent_id', null);

    const { data, error } = await query.order('order_index');
    if (error) throw error;
    return data || [];
};

export const createFolder = async (folder: Partial<Folder>) => {
    const { data, error } = await supabase.from('folders').insert([folder]).select().single();
    if (error) throw error;
    return data;
};

export const deleteFolder = async (id: string) => {
    await supabase.from('folders').delete().eq('id', id);
};

// MATERIALS
export const fetchMaterials = async (folderId: string): Promise<Material[]> => {
    const { data, error } = await supabase.from('materials').select('*').eq('folder_id', folderId).order('order_index');
    if (error) throw error;
    return data || [];
};

export const createMaterial = async (material: Partial<Material>) => {
    const { data, error } = await supabase.from('materials').insert([material]).select().single();
    if (error) throw error;
    return data;
};

export const deleteMaterial = async (id: string) => {
    await supabase.from('materials').delete().eq('id', id);
};

// ─── ANALYTICS (DASHBOARD) ───────────────────────────────────────────

export const fetchAdminStats = async () => {
    const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
    const { count: subjectCount } = await supabase.from('subjects').select('*', { count: 'exact', head: true });

    return {
        studentCount: studentCount || 0,
        subjectCount: subjectCount || 0,
        quizCount: 0, // Placeholder
        accuracy: 0
    };
};

export const fetchAllStudents = async () => {
    const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
};

export const fetchMaintenanceSettings = async () => {
    const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle();
    if (error) throw error;
    return data;
};

export const updateMaintenanceSettings = async (settings: any) => {
    const { id, ...updateData } = settings;
    const { data, error } = await supabase.from('settings').update(updateData).eq('id', id || 1).select();
    if (error) throw error;
    return data;
};
