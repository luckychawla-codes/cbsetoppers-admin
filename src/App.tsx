import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Settings, LogOut, Search,
    ShieldAlert, Calendar, Clock, TrendingUp, Activity,
    Shield, Plus, Trash2, Pencil, Eye, EyeOff, ChevronRight, ChevronUp, ChevronDown,
    Zap, BarChart3, AlertTriangle, CheckCircle2, XCircle, Github,
    RefreshCw, MessageSquare, Crown, Star, Lock, Sun, Moon, BookOpen, Download
} from 'lucide-react';
import {
    fetchAdminStats, fetchAllStudents, fetchMaintenanceSettings,
    updateMaintenanceSettings, supabase, signInOperator, signOutOperator,
    fetchAllOperators, createOperator, deleteOperator,
    Operator, OperatorRole,
    fetchSubjects, createSubject, deleteSubject, updateSubject,
    fetchFolders, createFolder, deleteFolder, updateFolder,
    fetchMaterials, createMaterial, deleteMaterial, updateMaterial,
    Subject, Folder, Material, SubjectCategory, MaterialType
} from './services/supabase';

type View = 'dashboard' | 'students' | 'content' | 'settings' | 'operators';

const LOGO_URL = "https://i.ibb.co/vC4MYFFk/1770137585956.png";

const SUBJECT_ICONS = [
    { id: 'biology', name: 'Biology', url: '/assets/subjects/biology.png' },
    { id: 'botany', name: 'Botany/Plants', url: '/assets/subjects/botany.png' },
    { id: 'chemistry', name: 'Chemistry', url: '/assets/subjects/chemistry.png' },
    { id: 'eng', name: 'English', url: '/assets/subjects/eng.png' },
    { id: 'landscape', name: 'Geography/Landscape', url: '/assets/subjects/landscape.png' },
    { id: 'neural', name: 'Neural/AI', url: '/assets/subjects/neural.png' },
    { id: 'psychology', name: 'Psychology', url: '/assets/subjects/psychology.png' },
    { id: 'relativity', name: 'Relativity/Physics', url: '/assets/subjects/relativity.png' },
    { id: 'society', name: 'Civics/Society', url: '/assets/subjects/society.png' },
    { id: 'sports', name: 'Physical Ed/Sports', url: '/assets/subjects/sports.png' },
    { id: 'tools', name: 'Tools/Math', url: '/assets/subjects/tools.png' }
];

const ROLE_CONFIG: Record<OperatorRole, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    founder: {
        label: 'Founder',
        color: 'text-amber-400',
        bg: 'bg-amber-400/10 border-amber-400/20',
        icon: <Crown size={12} />,
    },
    ceo: {
        label: 'CEO',
        color: 'text-violet-400',
        bg: 'bg-violet-400/10 border-violet-400/20',
        icon: <Star size={12} />,
    },
    owner: {
        label: 'Owner',
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10 border-cyan-400/20',
        icon: <Shield size={12} />,
    },
};

// ─────────────────────────────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────────────────────────────
const LoginPage: React.FC<{ onLogin: (op: Operator) => void }> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) { setError('Enter both email and password.'); return; }
        setLoading(true);
        setError('');
        try {
            const op = await signInOperator(email, password);
            if (op) onLogin(op);
        } catch (err: any) {
            setError(err.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-slate-50 dark:bg-[#050510] flex flex-col items-center justify-center p-8 relative overflow-hidden"
        >
            {/* Ambient glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-700/5 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-[400px] z-10"
            >
                {/* Brand - Direct on screen */}
                <div className="flex flex-col items-center gap-6 mb-12">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-violet-600/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative w-24 h-24 rounded-[1.75rem] overflow-hidden shadow-2xl shadow-violet-900/40 border border-slate-900/10 dark:border-white/10 transform transition-transform duration-500 hover:scale-105 active:scale-95">
                            <img src={LOGO_URL} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg border border-violet-500/30">
                            <Lock size={14} className="text-slate-900 dark:text-white" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">CBSE TOPPERS</h1>
                        <p className="text-[11px] font-black text-violet-400 uppercase tracking-[0.5em] mt-3 opacity-60">Admin Terminal</p>
                    </div>
                </div>

                {/* Form - Minimal & Smooth */}
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-[0.2em] ml-1">Operator Access</label>
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-slate-900/[0.03] dark:bg-white/[0.03] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-900/10 dark:placeholder:text-white/10 outline-none focus:border-violet-500/40 focus:bg-slate-900/[0.05] dark:focus:bg-white/[0.05] transition-all duration-300"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            autoComplete="email"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="relative">
                            <input
                                type={showPass ? 'text' : 'password'}
                                placeholder="Security Key"
                                className="w-full bg-slate-900/[0.03] dark:bg-white/[0.03] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl px-5 py-4 pr-14 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-900/10 dark:placeholder:text-white/10 outline-none focus:border-violet-500/40 focus:bg-slate-900/[0.05] dark:focus:bg-white/[0.05] transition-all duration-300"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            />
                            <button
                                type="button"
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-900/10 dark:text-white/10 hover:text-slate-900/40 dark:hover:text-white/40 transition-colors"
                                onClick={() => setShowPass(!showPass)}
                            >
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl animate-shake"
                        >
                            <XCircle size={18} className="text-red-500 shrink-0" />
                            <p className="text-red-500 text-[11px] font-bold">{error}</p>
                        </motion.div>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-4.5 bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-violet-500 hover:text-slate-900 dark:hover:text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl shadow-xl transition-all duration-500 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
                    >
                        {loading ? (
                            <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Authenticating...</>
                        ) : (
                            <><Shield size={16} /> Enter Terminal</>
                        )}
                    </button>
                </div>

                <p className="text-center text-[9px] text-slate-900/10 dark:text-white/10 font-black uppercase tracking-[0.3em] mt-16">
                    Restricted Access · v3.0 Final
                </p>
            </motion.div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// SIDEBAR ITEM
// ─────────────────────────────────────────────────────────────────────
const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: number }> = ({ icon, label, active, onClick, badge }) => (
    <motion.button
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all group relative ${active
            ? 'text-violet-400'
            : 'text-slate-900/30 dark:text-white/30 hover:text-slate-900/60 dark:hover:text-white/60 hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.04]'
            }`}
    >
        {active && (
            <motion.div
                layoutId="active-bg"
                className="absolute inset-0 bg-violet-600/10 border border-violet-500/20 rounded-xl"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
            />
        )}
        <span className={`relative transition-all ${active ? 'text-violet-400' : 'text-slate-900/25 dark:text-white/25 group-hover:text-slate-900/50 dark:group-hover:text-white/50'}`}>{icon}</span>
        <span className="relative">{label}</span>
        {badge !== undefined && badge > 0 && (
            <span className="relative ml-auto bg-violet-500 text-slate-900 dark:text-white text-[8px] font-black px-2 py-0.5 rounded-full">{badge}</span>
        )}
        {active && <ChevronRight size={12} className="relative ml-auto text-violet-500" />}
    </motion.button>
);

// ─────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; sub: string; color: string }> = ({ label, value, icon, sub, color }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-slate-900/[0.03] dark:bg-white/[0.03] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl p-6 hover:border-slate-900/[0.12] dark:hover:border-white/[0.12] hover:bg-slate-900/[0.05] dark:hover:bg-white/[0.05] transition-all group cursor-default shadow-sm hover:shadow-xl hover:shadow-violet-500/5"
    >
        <div className="flex items-start justify-between mb-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-current/10`} style={{ backgroundColor: 'color-mix(in srgb, currentColor 10%, transparent)' }}>
                <div className="[&>*]:w-5 [&>*]:h-5">{icon}</div>
            </div>
            <Activity size={14} className="text-slate-900/10 dark:text-white/10 group-hover:text-slate-900/20 dark:group-hover:text-white/20 transition-colors" />
        </div>
        <p className={`text-3xl font-black ${color} tracking-tighter mb-1`}>{value}</p>
        <p className="text-[11px] font-black text-slate-900/20 dark:text-white/20 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-[10px] text-slate-900/15 dark:text-white/15 font-medium">{sub}</p>
    </motion.div>
);

// ─────────────────────────────────────────────────────────────────────
// DASHBOARD VIEW
// ─────────────────────────────────────────────────────────────────────
const DashboardView: React.FC<{ stats: any; operator: Operator; onRefresh: () => void; loading: boolean; setView: (v: View) => void }> = ({ stats, operator, onRefresh, loading, setView }) => {
    const roleConf = ROLE_CONFIG[operator.role];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border mb-3 ${roleConf.bg} ${roleConf.color}`}>
                        {roleConf.icon} {roleConf.label}
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Command Center</h1>
                    <p className="text-slate-900/30 dark:text-white/30 text-sm font-medium mt-1">Welcome back, {operator.name.split(' ')[0]}. Here's your platform overview.</p>
                </div>
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setView('content')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 border border-violet-500 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-violet-700 transition-all shadow-lg shadow-violet-900/20"
                    >
                        <Settings size={13} /> Open Content Manager
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRefresh}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl text-[10px] font-black text-slate-900/40 dark:text-white/40 uppercase tracking-widest hover:text-slate-900/60 dark:hover:text-white/60 hover:bg-slate-900/[0.08] dark:hover:bg-white/[0.08] transition-all"
                    >
                        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
                    </motion.button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-8">
                <StatCard
                    label="Students" value={stats?.studentCount ?? '—'} sub="Verified toppers"
                    icon={<Users className="text-violet-400" />} color="text-violet-400"
                />
                <StatCard
                    label="Quizzes" value={stats?.quizCount ?? '—'} sub="Total attempts"
                    icon={<Zap className="text-amber-400" />} color="text-amber-400"
                />
                <StatCard
                    label="Accuracy" value={`${stats?.accuracy ?? 0}%`} sub="Platform average"
                    icon={<BarChart3 className="text-cyan-400" />} color="text-cyan-400"
                />
                <StatCard
                    label="Status" value="Online" sub="All systems running"
                    icon={<CheckCircle2 className="text-emerald-400" />} color="text-emerald-400"
                />
            </div>

            {/* Recent Results */}
            <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-900/[0.06] dark:border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Live Assessment Feed</h3>
                    </div>
                    <span className="text-[9px] font-black text-slate-900/20 dark:text-white/20 uppercase tracking-widest">Last 10 Results</span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                                <div className="w-9 h-9 bg-slate-900/5 dark:bg-white/5 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-slate-900/5 dark:bg-white/5 rounded w-1/3" />
                                    <div className="h-2 bg-slate-900/3 dark:bg-white/3 rounded w-1/4" />
                                </div>
                            </div>
                        ))
                    ) : (stats?.recentResults || []).map((res: any, i: number) => {
                        const pct = Math.round((res.score / res.total) * 100);
                        return (
                            <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-900/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                                <div className="w-9 h-9 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-sm">🎓</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{res.students?.name || 'Anonymous'}</p>
                                    <p className="text-[10px] font-bold text-slate-900/30 dark:text-white/30 uppercase tracking-wider">{res.subject} · {res.score}/{res.total}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black${pct >= 70 ? 'bg-emerald-400/10 text-emerald-400' : pct >= 50 ? 'bg-amber-400/10 text-amber-400' : 'bg-red-400/10 text-red-400'}`}>
                                        {pct}%
                                    </div>
                                    <p className="text-[9px] text-slate-900/20 dark:text-white/20 mt-1">{new Date(res.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        );
                    })}
                    {!loading && (!stats?.recentResults || stats.recentResults.length === 0) && (
                        <div className="px-6 py-12 text-center">
                            <p className="text-slate-900/20 dark:text-white/20 text-sm font-bold">No activity yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// STUDENTS VIEW
// ─────────────────────────────────────────────────────────────────────
const StudentsView: React.FC<{ students: any[]; loading: boolean }> = ({ students, loading }) => {
    const [search, setSearch] = useState('');
    const filtered = students.filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.student_id?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Student Base</h1>
                    <p className="text-slate-900/30 dark:text-white/30 text-sm font-medium mt-1">{students.length} registered toppers</p>
                </div>
                <div className="relative w-full xl:w-[500px]">
                    <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900/25 dark:text-white/25" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or email..."
                        className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-900/20 dark:placeholder:text-white/20 outline-none focus:border-violet-500/50 transition-all"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl overflow-hidden w-full">
                {/* Desktop View Table */}
                <div className="hidden xl:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-900/[0.06] dark:border-white/[0.06]">
                                {['Student ID', 'Name', 'Class & Stream', 'Email', 'Status'].map(h => (
                                    <th key={h} className="px-6 py-4 text-left text-[9px] font-black text-slate-900/20 dark:text-white/20 uppercase tracking-[0.2em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {loading ? [...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    {[...Array(5)].map((__, j) => (
                                        <td key={j} className="px-6 py-5">
                                            <div className="h-3 bg-slate-900/5 dark:bg-white/5 rounded animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            )) : filtered.map((s: any, i: number) => (
                                <tr key={i} className="hover:bg-slate-900/[0.03] dark:hover:bg-white/[0.03] transition-colors group">
                                    <td className="px-6 py-4">
                                        <code className="text-[11px] font-black text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2.5 py-1 rounded-lg">{s.student_id}</code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{s.name}</p>
                                        <p className="text-[10px] text-slate-900/30 dark:text-white/30 uppercase tracking-widest">{s.gender}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-900/60 dark:text-white/60 font-medium">{s.class}</p>
                                        {s.stream && <p className="text-[10px] text-violet-400/70 uppercase tracking-wider">{s.stream}</p>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-900/30 dark:text-white/30 font-medium italic">{s.email}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                            <span className="text-[10px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest">Active</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View Cards */}
                <div className="xl:hidden divide-y divide-white/[0.04]">
                    {loading ? [...Array(3)].map((_, i) => (
                        <div key={i} className="p-6 space-y-4 animate-pulse">
                            <div className="h-4 bg-slate-900/5 dark:bg-white/5 rounded w-1/3" />
                            <div className="h-3 bg-slate-900/5 dark:bg-white/5 rounded w-1/2" />
                            <div className="h-3 bg-slate-900/5 dark:bg-white/5 rounded w-1/4" />
                        </div>
                    )) : filtered.map((s: any, i: number) => (
                        <div key={i} className="p-5 space-y-4 hover:bg-slate-900/[0.01] dark:hover:bg-white/[0.01] transition-all">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-black text-slate-900 dark:text-white text-base leading-tight">{s.name}</p>
                                    <p className="text-[10px] font-bold text-slate-900/30 dark:text-white/30 uppercase tracking-widest mt-1">{s.gender} · {s.class} {s.stream && `· ${s.stream}`}</p>
                                </div>
                                <code className="text-[9px] font-black text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2 py-0.5 rounded-md">{s.student_id}</code>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-900/[0.03] dark:border-white/[0.03]">
                                <p className="text-[11px] text-slate-900/40 dark:text-white/40 font-medium truncate max-w-[200px]">{s.email}</p>
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-lg">
                                    <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {!loading && filtered.length === 0 && (
                    <div className="py-16 text-center">
                        <p className="text-slate-900/20 dark:text-white/20 font-bold">No students found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// OPERATORS VIEW
// ─────────────────────────────────────────────────────────────────────
const OperatorsView: React.FC<{ currentOperator: Operator }> = ({ currentOperator }) => {
    const [operators, setOperators] = useState<Operator[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ email: '', name: '', role: 'founder' as OperatorRole, password: '' });
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        try { setOperators(await fetchAllOperators()); } catch (_) { }
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleAdd = async () => {
        if (!form.email || !form.name || !form.password) { setError('All fields are required.'); return; }
        setAdding(true); setError(''); setSuccess('');
        try {
            await createOperator(form);
            setSuccess(`${form.name} has been added as ${form.role}.`);
            setForm({ email: '', name: '', role: 'founder', password: '' });
            setShowAdd(false);
            await load();
        } catch (e: any) {
            setError(e.message || 'Failed to add operator.');
        } finally { setAdding(false); }
    };

    const handleDelete = async (op: Operator) => {
        if (op.id === currentOperator.id) { setError("You can't remove yourself."); return; }
        if (!confirm(`Remove ${op.name} (${op.role})?`)) return;
        try {
            await deleteOperator(op.id);
            await load();
        } catch (_) { setError('Failed to remove operator.'); }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Operators</h1>
                    <p className="text-slate-900/30 dark:text-white/30 text-sm font-medium mt-1">Manage platform access · CEO · Founder · Owner only</p>
                </div>
                <button
                    onClick={() => { setShowAdd(true); setError(''); setSuccess(''); }}
                    className="flex items-center gap-2 px-5 py-3 bg-violet-600/80 hover:bg-violet-600 border border-violet-500/30 text-slate-900 dark:text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-violet-900/20"
                >
                    <Plus size={14} /> Add Operator
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <XCircle size={16} className="text-red-400 shrink-0" />
                    <p className="text-red-400 text-xs font-bold">{error}</p>
                    <button onClick={() => setError('')} className="ml-auto text-red-400/60 hover:text-red-400"><XCircle size={14} /></button>
                </div>
            )}
            {success && (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <p className="text-emerald-400 text-xs font-bold">{success}</p>
                </div>
            )}

            {/* Add Form Modal */}
            {showAdd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowAdd(false)} />
                    <div className="relative bg-white dark:bg-[#0a0a1a] border border-slate-900/10 dark:border-white/10 rounded-3xl p-8 w-full max-w-md z-10 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-violet-600/20 text-violet-400 rounded-xl flex items-center justify-center">
                                <Plus size={18} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">New Operator</h3>
                                <p className="text-[10px] text-slate-900/30 dark:text-white/30 font-bold uppercase tracking-widest">Grant platform access</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
                                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'operator@domain.com' },
                                { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">{f.label}</label>
                                    <input
                                        type={f.type} placeholder={f.placeholder}
                                        className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-900/20 dark:placeholder:text-white/20 outline-none focus:border-violet-500/50 transition-all"
                                        value={(form as any)[f.key]}
                                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">Role</label>
                                <select
                                    className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500/50 transition-all"
                                    value={form.role}
                                    onChange={e => setForm(p => ({ ...p, role: e.target.value as OperatorRole }))}
                                >
                                    <option value="founder">Founder</option>
                                    <option value="ceo">CEO</option>
                                    <option value="owner">Owner</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowAdd(false)} className="flex-1 py-3 border border-slate-900/10 dark:border-white/10 text-slate-900/40 dark:text-white/40 font-black uppercase text-[10px] tracking-widest rounded-xl hover:border-slate-900/20 dark:hover:border-white/20 hover:text-slate-900/60 dark:hover:text-white/60 transition-all">
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                disabled={adding}
                                className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-slate-900 dark:text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {adding ? <div className="w-4 h-4 border-2 border-slate-900/30 dark:border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={14} />}
                                {adding ? 'Adding...' : 'Add Operator'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Operators Table */}
            <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="divide-y divide-white/[0.04]">
                    {loading ? [...Array(3)].map((_, i) => (
                        <div key={i} className="px-6 py-5 flex items-center gap-4 animate-pulse">
                            <div className="w-10 h-10 bg-slate-900/5 dark:bg-white/5 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-slate-900/5 dark:bg-white/5 rounded w-1/4" />
                                <div className="h-2 bg-slate-900/3 dark:bg-white/3 rounded w-1/3" />
                            </div>
                        </div>
                    )) : operators.map(op => {
                        const rc = ROLE_CONFIG[op.role];
                        const isYou = op.id === currentOperator.id;
                        return (
                            <div key={op.id} className="px-6 py-5 flex items-center gap-4 hover:bg-slate-900/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                <div className="w-10 h-10 bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/20 rounded-xl flex items-center justify-center text-lg font-black text-violet-400">
                                    {op.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{op.name}</p>
                                        {isYou && <span className="text-[8px] font-black text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2 py-0.5 rounded-full uppercase tracking-widest">You</span>}
                                    </div>
                                    <p className="text-[11px] text-slate-900/30 dark:text-white/30 font-medium">{op.email}</p>
                                    {op.student_id && (
                                        <p className="text-[9px] text-cyan-400/60 font-bold uppercase tracking-widest mt-0.5">🔗 Linked to Student: {op.student_id}</p>
                                    )}
                                </div>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border${rc.bg}${rc.color}`}>
                                    {rc.icon} {rc.label}
                                </div>
                                <p className="text-[10px] text-slate-900/20 dark:text-white/20 hidden md:block">{new Date(op.created_at).toLocaleDateString('en-IN')}</p>
                                {!isYou && (
                                    <button
                                        onClick={() => handleDelete(op)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-900/20 dark:text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    {!loading && operators.length === 0 && (
                        <div className="py-16 text-center"><p className="text-slate-900/20 dark:text-white/20 font-bold">No operators found</p></div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// CONTENT MANAGER VIEW (IFRAME)
// ─────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────
// CONTENT MANAGER VIEW (NATIVE)
// ─────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────
// CONTENT MANAGER VIEW (STRICT REBUILD)
// ─────────────────────────────────────────────────────────────────────
const ContentView: React.FC = () => {
    const [view, setView] = useState<'subjects' | 'folders'>('subjects');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
    const [path, setPath] = useState<Folder[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [downloading, setDownloading] = useState<string | null>(null);

    const handleDownload = async (url: string, title: string) => {
        if (downloading) return;
        setDownloading(url);
        try {
            // Google Drive direct download link replacement
            let downloadUrl = url;
            if (url.includes('drive.google.com')) {
                downloadUrl = url.replace(/\/preview$/, '/view').replace(/\/view(\?.*)?$/, '/view?export=download');
            }

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${title}.pdf`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error('Download failed', e);
        } finally {
            setDownloading(null);
        }
    };
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [subForm, setSubForm] = useState<Partial<Subject>>({
        category: 'Core',
        target_class: 'XII', // Keep for now
        target_stream: 'PCM', // Keep for now
        target_classes: ['XII'],
        target_streams: ['PCM'],
        target_exams: [],
        icon_url: '/assets/subjects/relativity.png'
    });
    const [folderForm, setFolderForm] = useState({ name: '' });
    const [materialForm, setMaterialForm] = useState<Partial<Material>>({ type: 'pdf', title: '', url: '' });
    const [addType, setAddType] = useState<'subfolder' | 'pdf' | 'image' | 'video'>('subfolder');

    const classes = ['IX', 'X', 'XI', 'XII', 'XII+'];
    const streams = ['PCB', 'PCM', 'PCBM', 'Commerce', 'Humanities', 'Science'];
    const exams = ['JEE', 'NEET', 'CUET', 'NDA', 'CLAT', 'CA Foundation'];

    const loadSubjects = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchSubjects();
            setSubjects(data);
        } catch (_) { }
        setLoading(false);
    }, []);

    const loadFolderContent = useCallback(async (subjectId: string, parentId: string | null) => {
        setLoading(true);
        try {
            const [f, m] = await Promise.all([
                fetchFolders(subjectId, parentId),
                fetchMaterials(subjectId, parentId)
            ]);
            setFolders(f);
            setMaterials(m);
        } catch (_) { }
        setLoading(false);
    }, []);

    useEffect(() => { loadSubjects(); }, [loadSubjects]);

    const handleAddSubject = async () => {
        if (!subForm.name || !subForm.code) return alert('Name and Code required');
        if (!subForm.target_classes || subForm.target_classes.length === 0) return alert('Select at least one class');

        const hasHigher = subForm.target_classes.some(c => ['XI', 'XII', 'XII+'].includes(c));

        if (subForm.category === 'Core') {
            if (hasHigher && (!subForm.target_streams || subForm.target_streams.length === 0)) {
                return alert('Stream is mandatory for Class XI/XII Core subjects');
            }
        }

        const finalData = { ...subForm };
        if (subForm.category === 'Additional') {
            finalData.target_stream = undefined;
            finalData.target_streams = [];
        }

        try {
            if (isEditing && editingId) {
                await updateSubject(editingId, finalData);
            } else {
                await createSubject({ ...finalData, order_index: subjects.length });
            }
            setIsAdding(false);
            setIsEditing(false);
            setEditingId(null);
            loadSubjects();
        } catch (e: any) { alert(e.message || 'Error saving subject'); }
    };

    const handleAddFolder = async () => {
        if (!folderForm.name || !currentSubject) return;
        try {
            if (isEditing && editingId) {
                await updateFolder(editingId, { name: folderForm.name });
            } else {
                await createFolder({
                    subject_id: currentSubject.id,
                    parent_id: path[path.length - 1]?.id || null,
                    name: folderForm.name,
                    order_index: folders.length
                });
            }
            setFolderForm({ name: '' });
            setIsAdding(false);
            setIsEditing(false);
            setEditingId(null);
            loadFolderContent(currentSubject.id, path[path.length - 1]?.id || null);
        } catch (_) { alert('Error saving folder'); }
    };

    const handleAddMaterial = async () => {
        const parentFolder = path[path.length - 1];
        if (!currentSubject || !materialForm.title || !materialForm.url) return alert('Fill all fields');

        let finalUrl = materialForm.url;
        if (finalUrl.includes('drive.google.com')) {
            finalUrl = finalUrl.replace(/\/view(\?.*)?$/, '/preview');
            if (finalUrl.includes('/d/')) {
                const parts = finalUrl.split('/d/');
                if (parts[1] && !parts[1].includes('/preview')) {
                    const fileId = parts[1].split('/')[0];
                    finalUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                }
            }
        }

        try {
            if (isEditing && editingId) {
                await updateMaterial(editingId, { ...materialForm, url: finalUrl });
            } else {
                await createMaterial({
                    ...materialForm,
                    url: finalUrl,
                    subject_id: currentSubject.id,
                    folder_id: parentFolder?.id || null,
                    order_index: materials.length
                });
            }
            setMaterialForm({ type: 'pdf', title: '', url: '' });
            setIsAdding(false);
            setIsEditing(false);
            setEditingId(null);
            loadFolderContent(currentSubject.id, parentFolder?.id || null);
        } catch (_) { alert('Error saving material'); }
    };

    const startEditSubject = (s: Subject) => {
        setSubForm(s);
        setEditingId(s.id);
        setIsEditing(true);
        setIsAdding(true);
    };

    const startEditFolder = (f: Folder) => {
        setFolderForm({ name: f.name });
        setEditingId(f.id);
        setAddType('subfolder');
        setIsEditing(true);
        setIsAdding(true);
    };

    const startEditMaterial = (m: Material) => {
        setMaterialForm({ title: m.title, url: m.url, type: m.type });
        setEditingId(m.id);
        setAddType(m.type as any);
        setIsEditing(true);
        setIsAdding(true);
    };

    const handleReorder = async (type: 'subject' | 'folder' | 'material', direction: 'up' | 'down', item: any) => {
        let list: any[] = [];
        if (type === 'subject') list = subjects;
        else if (type === 'folder') list = folders;
        else list = materials;

        const idx = list.findIndex(i => i.id === item.id);
        if (direction === 'up' && idx === 0) return;
        if (direction === 'down' && idx === list.length - 1) return;

        const otherIdx = direction === 'up' ? idx - 1 : idx + 1;
        const otherItem = list[otherIdx];

        const tempIndex = item.order_index;
        const newItemOrder = otherItem.order_index;
        const newOtherOrder = tempIndex;

        try {
            if (type === 'subject') {
                await Promise.all([updateSubject(item.id, { order_index: newItemOrder }), updateSubject(otherItem.id, { order_index: newOtherOrder })]);
                loadSubjects();
            } else if (type === 'folder') {
                await Promise.all([updateFolder(item.id, { order_index: newItemOrder }), updateFolder(otherItem.id, { order_index: newOtherOrder })]);
                loadFolderContent(currentSubject!.id, path[path.length - 1]?.id || null);
            } else {
                await Promise.all([updateMaterial(item.id, { order_index: newItemOrder }), updateMaterial(otherItem.id, { order_index: newOtherOrder })]);
                loadFolderContent(currentSubject!.id, path[path.length - 1]?.id || null);
            }
        } catch (_) { alert('Ordering Failed'); }
    };

    const drillDownSubject = (s: Subject) => {
        setCurrentSubject(s);
        setPath([]);
        setView('folders');
        loadFolderContent(s.id, null);
    };

    const navigateTo = (f: Folder, idx: number) => {
        const newPath = path.slice(0, idx + 1);
        setPath(newPath);
        loadFolderContent(currentSubject!.id, f.id);
    };

    const navigateRoot = () => {
        setPath([]);
        loadFolderContent(currentSubject!.id, null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                        {view === 'subjects' ? 'Subjects Portal' : currentSubject?.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        {view === 'folders' && (
                            <button onClick={() => { setView('subjects'); setCurrentSubject(null); }} className="text-[10px] font-black text-violet-500 uppercase flex items-center gap-1 hover:underline">
                                <ChevronRight size={12} className="rotate-180" /> Subjects
                            </button>
                        )}
                        <p className="text-slate-900/30 dark:text-white/30 text-sm font-medium">
                            {view === 'subjects' ? 'Define core and additional project structures.' : 'Manage folders and materials hierarchy.'}
                        </p>
                    </div>
                </div>
                {view === 'subjects' ? (
                    <button onClick={() => { setIsEditing(false); setEditingId(null); setSubForm({ name: '', code: '', category: 'Core', target_class: 'XII', target_stream: 'PCM', target_classes: ['XII'], target_streams: ['PCM'], target_exams: [], icon_url: '/assets/subjects/relativity.png' }); setIsAdding(true); }} className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                        <Plus size={14} /> New Subject
                    </button>
                ) : (
                    <button onClick={() => { setIsEditing(false); setEditingId(null); setAddType('subfolder'); setFolderForm({ name: '' }); setMaterialForm({ type: 'pdf', title: '', url: '' }); setIsAdding(true); }} className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                        <Plus size={14} /> Add Content
                    </button>
                )}
            </div>

            {/* Path / Breadcrumbs for Folders */}
            {view === 'folders' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/[0.03] dark:bg-white/[0.03] rounded-xl overflow-x-auto no-scrollbar">
                    <button onClick={navigateRoot} className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${path.length === 0 ? 'text-violet-500' : 'text-slate-400'}`}>Roots</button>
                    {path.map((f, i) => (
                        <React.Fragment key={f.id}>
                            <ChevronRight size={10} className="text-slate-300 shrink-0" />
                            <button onClick={() => navigateTo(f, i)} className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${i === path.length - 1 ? 'text-violet-500' : 'text-slate-400'}`}>{f.name}</button>
                        </React.Fragment>
                    ))}
                </div>
            )}

            {/* Forms Overlay */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-[#0c0c14] border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white shadow-sm">
                                {isEditing ? 'Modify Content Node' : (view === 'subjects' ? 'Direct Subject Creation' : 'Structure / Content Node')}
                            </h2>

                            {view === 'subjects' ? (
                                <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Type</label>
                                            <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold" value={subForm.category} onChange={e => setSubForm({ ...subForm, category: e.target.value as SubjectCategory })}>
                                                <option value="Core">Core Subject</option>
                                                <option value="Additional">Additional Subject</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Code</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold" value={subForm.code} onChange={e => setSubForm({ ...subForm, code: e.target.value })} placeholder="e.g. PHY-042" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Name</label>
                                        <input type="text" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold" value={subForm.name} onChange={e => setSubForm({ ...subForm, name: e.target.value })} placeholder="e.g. Physics" />
                                    </div>

                                    {/* Target Classes - Multi Select */}
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Linked Classes</label>
                                        <div className="flex flex-wrap gap-2">
                                            {classes.map(c => {
                                                const isSelected = subForm.target_classes?.includes(c);
                                                return (
                                                    <button
                                                        key={c}
                                                        type="button"
                                                        onClick={() => {
                                                            setSubForm(prev => {
                                                                const current = prev.target_classes || [];
                                                                const next = isSelected ? current.filter((x: string) => x !== c) : [...current, c];
                                                                let nextStreams = prev.target_streams || [];
                                                                if (!isSelected && (c === 'IX' || c === 'X') && !nextStreams.includes('Science')) {
                                                                    nextStreams = [...nextStreams, 'Science'];
                                                                }
                                                                return { ...prev, target_classes: next, target_streams: nextStreams };
                                                            });
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${isSelected ? 'bg-violet-600 border-violet-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-400 opacity-60'}`}
                                                    >
                                                        {c}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Target Streams - Multi Select (if Core & Class XI or XII selected) */}
                                    {(subForm.category === 'Core' && subForm.target_classes?.some(c => ['IX', 'X', 'XI', 'XII', 'XII+'].includes(c))) && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Linked Streams</label>
                                            <div className="flex flex-wrap gap-2">
                                                {streams.map(s => {
                                                    const isSelected = subForm.target_streams?.includes(s);
                                                    const isLockedScience = s === 'Science' &&
                                                        (subForm.target_classes?.includes('X') || subForm.target_classes?.includes('IX')) &&
                                                        !subForm.target_classes?.some(c => ['XI', 'XII', 'XII+'].includes(c));

                                                    return (
                                                        <button
                                                            key={s}
                                                            type="button"
                                                            disabled={isLockedScience}
                                                            onClick={() => {
                                                                setSubForm(prev => {
                                                                    const current = prev.target_streams || [];
                                                                    const next = isSelected ? current.filter((x: string) => x !== s) : [...current, s];
                                                                    return { ...prev, target_streams: next };
                                                                });
                                                            }}
                                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${isSelected ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-400 opacity-60'} ${isLockedScience ? 'cursor-not-allowed opacity-100 bg-cyan-600/30 border-cyan-500/30' : ''}`}
                                                        >
                                                            {s}
                                                            {isLockedScience && <span className="ml-1 text-[8px] opacity-50">(Locked for IX/X)</span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Competitive Exams - Multi Select */}
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Linked Competitive Exams</label>
                                        <div className="flex flex-wrap gap-2">
                                            {exams.map(e => {
                                                const isSelected = subForm.target_exams?.includes(e);
                                                return (
                                                    <button
                                                        key={e}
                                                        type="button"
                                                        onClick={() => {
                                                            setSubForm(prev => {
                                                                const current = prev.target_exams || [];
                                                                const next = isSelected ? current.filter((x: string) => x !== e) : [...current, e];
                                                                return { ...prev, target_exams: next };
                                                            });
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${isSelected ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-400 opacity-60'}`}
                                                    >
                                                        {e}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Subject Icon Picker */}
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Subject Representation Icon</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {SUBJECT_ICONS.map(icon => (
                                                <button
                                                    key={icon.id}
                                                    type="button"
                                                    onClick={() => setSubForm({ ...subForm, icon_url: icon.url })}
                                                    className={`relative p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${subForm.icon_url === icon.url ? 'bg-violet-600/10 border-violet-500 shadow-lg' : 'bg-slate-50 dark:bg-white/5 border-transparent hover:border-white/10'}`}
                                                >
                                                    <img src={icon.url} alt={icon.name} className="w-8 h-8 object-contain" />
                                                    <span className="text-[7px] font-black uppercase text-center opacity-40">{icon.name}</span>
                                                    {subForm.icon_url === icon.url && (
                                                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0c0c14]">
                                                            <CheckCircle2 size={8} className="text-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button onClick={handleAddSubject} className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl mt-4 active:scale-95 transition-all">{isEditing ? 'Update Subject' : 'Create Subject Folder'}</button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Content Type</label>
                                        <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold" value={addType} onChange={e => {
                                            const t = e.target.value as 'subfolder' | 'pdf' | 'image' | 'video';
                                            setAddType(t);
                                            if (t !== 'subfolder') setMaterialForm({ ...materialForm, type: t as MaterialType });
                                        }}>
                                            <option value="subfolder">Subfolder</option>
                                            <option value="pdf">PDF Document</option>
                                            <option value="image">Image File</option>
                                            <option value="video">YouTube Video</option>
                                        </select>
                                    </div>

                                    {addType === 'subfolder' ? (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Folder Name</label>
                                                <input type="text" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold" value={folderForm.name} onChange={e => setFolderForm({ name: e.target.value })} placeholder="e.g. Notes, Videos, Practice" />
                                            </div>
                                            <button onClick={handleAddFolder} className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">{isEditing ? 'Update Folder' : 'Create Subfolder'}</button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Title</label>
                                                <input type="text" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold" value={materialForm.title} onChange={e => setMaterialForm({ ...materialForm, title: e.target.value })} placeholder="e.g. Chapter 1 Summary" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">{addType === 'video' ? 'YouTube URL' : 'File Direct URL'}</label>
                                                <input type="text" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold" value={materialForm.url} onChange={e => setMaterialForm({ ...materialForm, url: e.target.value })} placeholder="https://..." />
                                            </div>
                                            <button onClick={handleAddMaterial} className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">{isEditing ? 'Save Changes' : 'Publish Content'}</button>
                                        </>
                                    )}
                                </div>
                            )}

                            <button onClick={() => { setIsAdding(false); setIsEditing(false); setEditingId(null); setMaterialForm({ type: 'pdf', title: '', url: '' }); }} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-400 transition-colors">Dismiss</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Content List */}
            <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-3xl overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="p-12 flex flex-col items-center gap-4">
                        <RefreshCw className="animate-spin text-violet-500" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Refreshing Data Store...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-900/[0.04] dark:divide-white/[0.04]">
                        {view === 'subjects' ? (
                            subjects.length === 0 ? (
                                <div className="py-20 text-center text-slate-400 text-xs font-bold">No subjects added. Start with "New Subject".</div>
                            ) : subjects.map(s => (
                                <div key={s.id} onClick={() => drillDownSubject(s)} className="p-6 flex items-center justify-between hover:bg-slate-900/[0.03] dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-white/5 dark:bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-2 group-hover:scale-110 transition-transform overflow-hidden shadow-sm">
                                            <img src={s.icon_url || '/assets/subjects/relativity.png'} className="w-full h-full object-contain filter drop-shadow-sm" onError={(e) => (e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/3426/3426653.png')} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{s.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[8px] font-black bg-slate-900/10 dark:bg-white/10 text-slate-500 px-2 py-0.5 rounded uppercase">{s.code}</span>
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${s.category === 'Core' ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'}`}>{s.category}</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {s.target_classes?.map(c => <span key={c} className="text-[7px] font-black border border-slate-500/20 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded uppercase">{c}</span>)}
                                                    {s.target_streams?.map(st => <span key={st} className="text-[7px] font-black border border-cyan-500/20 text-cyan-500 px-1.5 py-0.5 rounded uppercase">{st}</span>)}
                                                    {s.target_exams?.map(ex => <span key={ex} className="text-[7px] font-black border border-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded uppercase">{ex}</span>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col gap-1 mr-2">
                                            <button onClick={(e) => { e.stopPropagation(); handleReorder('subject', 'up', s); }} className="p-1 text-slate-300 hover:text-violet-500 transition-colors"><ChevronUp size={12} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); handleReorder('subject', 'down', s); }} className="p-1 text-slate-300 hover:text-violet-500 transition-colors"><ChevronDown size={12} /></button>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); startEditSubject(s); }} className="p-2 text-slate-300 hover:text-violet-500 transition-colors opacity-0 group-hover:opacity-100"><Pencil size={16} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); deleteSubject(s.id).then(loadSubjects); }} className="p-2 text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                {/* Folders */}
                                {folders.map(f => (
                                    <div key={f.id} onClick={() => { setPath([...path, f]); loadFolderContent(currentSubject!.id, f.id); }} className="p-6 flex items-center justify-between hover:bg-slate-900/[0.03] dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 bg-slate-400/10 border border-slate-400/20 rounded-xl flex items-center justify-center text-lg">📁</div>
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{f.name}</h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col gap-1 mr-2">
                                                <button onClick={(e) => { e.stopPropagation(); handleReorder('folder', 'up', f); }} className="p-1 text-slate-300 hover:text-violet-500 transition-colors"><ChevronUp size={12} /></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleReorder('folder', 'down', f); }} className="p-1 text-slate-300 hover:text-violet-500 transition-colors"><ChevronDown size={12} /></button>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); startEditFolder(f); }} className="p-2 text-slate-300 hover:text-violet-500 transition-colors opacity-0 group-hover:opacity-100"><Pencil size={16} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); deleteFolder(f.id).then(() => loadFolderContent(currentSubject!.id, path[path.length - 1]?.id || null)); }} className="p-2 text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                                {/* Materials */}
                                {materials.map(m => (
                                    <div key={m.id} className="p-6 flex items-center justify-between hover:bg-slate-900/[0.03] dark:hover:bg-white/[0.03] transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-lg">
                                                {m.type === 'pdf' ? '📄' : m.type === 'image' ? '🖼️' : '📺'}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{m.title}</h4>
                                                <p className="text-[8px] font-black text-slate-400 uppercase mt-0.5">{m.type} Material</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col gap-1 mr-2">
                                                <button onClick={() => handleReorder('material', 'up', m)} className="p-1 text-slate-300 hover:text-violet-500 transition-colors"><ChevronUp size={12} /></button>
                                                <button onClick={() => handleReorder('material', 'down', m)} className="p-1 text-slate-300 hover:text-violet-500 transition-colors"><ChevronDown size={12} /></button>
                                            </div>
                                            <a href={m.url} target="_blank" rel="noreferrer" className="p-2 text-slate-300 hover:text-violet-500 transition-colors"><Eye size={16} /></a>
                                            {m.type === 'pdf' && (
                                                <button
                                                    onClick={() => handleDownload(m.url, m.title)}
                                                    className={`p-2 transition-colors ${downloading === m.url ? 'text-violet-500 animate-bounce' : 'text-slate-300 hover:text-cyan-500'}`}
                                                >
                                                    <Download size={16} />
                                                </button>
                                            )}
                                            <button onClick={() => startEditMaterial(m)} className="p-2 text-slate-300 hover:text-violet-500 transition-colors"><Pencil size={16} /></button>
                                            <button onClick={() => deleteMaterial(m.id).then(() => loadFolderContent(currentSubject!.id, path[path.length - 1]?.id || null))} className="p-2 text-slate-300 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                                {folders.length === 0 && materials.length === 0 && (
                                    <div className="py-20 text-center text-slate-400 text-xs font-bold">This node is empty.</div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// SETTINGS VIEW
// ─────────────────────────────────────────────────────────────────────
const SettingsView: React.FC = () => {
    const [maintenance, setMaintenance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchMaintenanceSettings().then(d => { setMaintenance(d); setLoading(false); });
    }, []);

    const toggle = async () => {
        if (!maintenance) return;
        const newState = !maintenance.maintenance_enabled;
        try {
            await updateMaintenanceSettings({ ...maintenance, maintenance_enabled: newState });
            setMaintenance((p: any) => ({ ...p, maintenance_enabled: newState }));
            setMsg({ type: 'success', text: newState ? 'Maintenance mode activated.' : 'Platform is now live!' });
        } catch (_) {
            setMsg({ type: 'error', text: 'Failed to toggle maintenance.' });
        }
        setTimeout(() => setMsg(null), 3000);
    };

    const save = async () => {
        if (!maintenance) return;
        setSaving(true);
        try {
            await updateMaintenanceSettings(maintenance);
            setMsg({ type: 'success', text: 'Settings pushed to platform successfully! ✅' });
        } catch (e: any) {
            console.error('Save settings error:', e);
            setMsg({ type: 'error', text: 'Failed to save. Check permission.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMsg(null), 3000);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Platform Settings</h1>
                <p className="text-slate-900/30 dark:text-white/30 text-sm font-medium mt-1">Control maintenance mode and global system variables.</p>
            </div>

            {msg && (
                <div className={`flex items-center gap-3 p-4 rounded-xl border${msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    {msg.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-red-400" />}
                    <p className={`text-xs font-bold${msg.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{msg.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Toggle Card */}
                <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all${maintenance?.maintenance_enabled ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Maintenance Mode</h3>
                            <p className="text-[10px] text-slate-900/30 dark:text-white/30 font-medium">Toggle platform access.</p>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl border flex items-center gap-3${maintenance?.maintenance_enabled ? 'bg-red-500/5 border-red-500/15' : 'bg-emerald-500/5 border-emerald-500/15'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full${maintenance?.maintenance_enabled ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest${maintenance?.maintenance_enabled ? 'text-red-400' : 'text-emerald-400'}`}>
                            {loading ? 'Loading...' : maintenance?.maintenance_enabled ? 'Emergency Shutdown Active' : 'Normal Operations'}
                        </span>
                    </div>

                    <button
                        onClick={toggle}
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all active:scale-95 border${maintenance?.maintenance_enabled
                            ? 'bg-slate-900/5 dark:bg-white/5 border-slate-900/10 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-900/10 dark:hover:bg-white/10'
                            : 'bg-gradient-to-r from-red-600/80 to-rose-600/80 border-red-500/20 text-slate-900 dark:text-white hover:from-red-600 hover:to-rose-600 shadow-lg shadow-red-900/20'
                            }`}
                    >
                        {maintenance?.maintenance_enabled ? '✅ Restore Platform Access' : '🔴 Emergency Grid Shutdown'}
                    </button>
                </div>

                {/* Message & Schedule Card */}
                <div className="bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-2xl p-6 space-y-5">
                    <div className="flex items-center gap-3">
                        <MessageSquare size={18} className="text-violet-400" />
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Smart Scheduling</h3>
                    </div>

                    <div>
                        <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-2 block">Maintenance Message</label>
                        <textarea
                            className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-900/20 dark:placeholder:text-white/20 outline-none focus:border-violet-500/50 transition-all min-h-[90px] resize-none"
                            placeholder="We'll be back soon..."
                            value={maintenance?.maintenance_message || ''}
                            onChange={e => setMaintenance((p: any) => ({ ...p, maintenance_message: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="text-[9px] font-black text-slate-900/30 dark:text-white/30 uppercase tracking-widest ml-1 mb-2 block">Auto Re-Open Time</label>
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-900/25 dark:text-white/25" />
                            <input
                                type="datetime-local"
                                className="w-full bg-slate-900/[0.05] dark:bg-white/[0.05] border border-slate-900/[0.08] dark:border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500/50 transition-all [color-scheme:dark]"
                                value={maintenance?.maintenance_opening_date
                                    ? new Date(new Date(maintenance.maintenance_opening_date).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
                                    : ''}
                                onChange={e => setMaintenance((p: any) => ({ ...p, maintenance_opening_date: e.target.value || null }))}
                            />
                        </div>
                        <p className="text-[8px] text-violet-400/50 font-bold uppercase tracking-widest ml-1 mt-1.5">✨ App auto-activates at this time.</p>
                    </div>

                    <button
                        onClick={save}
                        disabled={saving || loading}
                        className="w-full py-3.5 bg-violet-600/80 hover:bg-violet-600 border border-violet-500/20 text-slate-900 dark:text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-900/20"
                    >
                        {saving ? <div className="w-4 h-4 border-2 border-slate-900/30 dark:border-white/30 border-t-white rounded-full animate-spin" /> : <Zap size={14} />}
                        {saving ? 'Pushing...' : 'Push to Platform'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────
const AdminApp: React.FC = () => {
    const [operator, setOperator] = useState<Operator | null>(null);
    const [view, setView] = useState<View>('dashboard');
    const [stats, setStats] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('topper_admin_theme') as 'dark' | 'light') || 'dark');

    // Restore session on mount
    useEffect(() => {
        const saved = localStorage.getItem('topper_admin_operator');
        if (saved) {
            try { setOperator(JSON.parse(saved)); } catch (_) { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('topper_admin_theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const loadData = useCallback(async () => {
        if (!operator) return;
        setLoading(true);
        try {
            const s = await fetchAdminStats();
            setStats(s);
            if (view === 'students') {
                const stds = await fetchAllStudents();
                setStudents(stds);
            }
        } catch (_) { }
        setLoading(false);
    }, [operator, view]);

    useEffect(() => {
        if (operator) loadData();
        // Hide splash when app starts
        if ((window as any).hideSplash) {
            setTimeout((window as any).hideSplash, 1000);
        }
    }, [loadData, operator]);

    const handleLogin = (op: Operator) => {
        setOperator(op);
        localStorage.setItem('topper_admin_operator', JSON.stringify(op));
    };

    const handleLogout = async () => {
        await signOutOperator();
        setOperator(null);
        localStorage.removeItem('topper_admin_operator');
        setStats(null);
        setStudents([]);
    };

    if (!operator) return (
        <AnimatePresence mode="wait">
            <LoginPage key="login" onLogin={handleLogin} />
        </AnimatePresence>
    );

    const roleConf = ROLE_CONFIG[operator.role];

    const navItems: { id: View; icon: React.ReactNode; label: string }[] = [
        { id: 'dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
        { id: 'students', icon: <Users size={16} />, label: 'Students' },
        { id: 'operators', icon: <Shield size={16} />, label: 'Operators' },
        { id: 'content', icon: <BookOpen size={16} />, label: 'Content Manager' },
        { id: 'settings', icon: <Settings size={16} />, label: 'Settings' },
    ];

    return (
        <div className="h-screen w-full bg-slate-50 dark:bg-[#050510] flex text-slate-900 dark:text-white overflow-hidden">
            {/* Mobile overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    x: sidebarOpen ? 0 : (window.innerWidth < 768 ? '-100%' : 0),
                    opacity: 1
                }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className={`fixed md:relative z-50 md:z-auto h-screen w-72 flex flex-col bg-white dark:bg-[#07070f] border-r border-slate-900/[0.06] dark:border-white/[0.06] shadow-2xl md:shadow-none`}
            >
                {/* Brand */}
                <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-900/[0.06] dark:border-white/[0.06]">
                    <img src={LOGO_URL} className="w-9 h-9 rounded-xl border border-slate-900/10 dark:border-white/10" />
                    <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">CBSE TOPPERS</p>
                        <p className="text-[9px] font-bold text-violet-400/60 uppercase tracking-[0.3em] mt-0.5">Admin Terminal</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
                    <p className="text-[8px] font-black text-slate-900/15 dark:text-white/15 uppercase tracking-[0.3em] px-3 mb-4">Command Deck</p>
                    <AnimatePresence>
                        {navItems.map((n, i) => (
                            <motion.div
                                key={n.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <SidebarItem
                                    icon={n.icon}
                                    label={n.label}
                                    active={view === n.id}
                                    onClick={() => { setView(n.id); setSidebarOpen(false); }}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </nav>

                {/* GitHub Sync Indicator */}
                <div className="px-3 pb-2 pt-2 border-t border-slate-900/[0.06] dark:border-white/[0.06]">
                    <button
                        onClick={() => alert('Changes are already pushed to GitHub (main branch).')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/[0.03] dark:bg-white/[0.02] border border-slate-900/[0.06] dark:border-white/[0.06] rounded-xl hover:bg-slate-900/[0.06] dark:hover:bg-white/[0.04] transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <Github size={16} className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">GitHub Sync</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </button>
                </div>

                {/* Operator Info */}
                <div className="p-4 border-t border-slate-900/[0.06] dark:border-white/[0.06]">
                    <div className="flex items-center gap-3 p-3 bg-slate-900/[0.03] dark:bg-white/[0.03] rounded-xl border border-slate-900/[0.06] dark:border-white/[0.06] mb-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-violet-600/30 to-purple-600/30 border border-violet-500/20 rounded-xl flex items-center justify-center font-black text-violet-300 text-sm">
                            {operator.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-slate-900 dark:text-white truncate">{operator.name}</p>
                            <div className={`inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest${roleConf.color}`}>
                                {roleConf.icon} {roleConf.label}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900/60 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5 transition-all mb-2"
                    >
                        <span className="flex items-center gap-3">
                            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />} {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all"
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Top Bar (mobile) */}
                <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-slate-900/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#07070f]">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-900/40 dark:text-white/40 hover:text-slate-900 dark:hover:text-white">
                        <div className="space-y-1.5">
                            <div className="w-5 h-0.5 bg-current rounded" />
                            <div className="w-4 h-0.5 bg-current rounded" />
                            <div className="w-5 h-0.5 bg-current rounded" />
                        </div>
                    </button>
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">CBSE TOPPERS</p>
                    <div className="w-8" />
                </div>

                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-violet-900/10 blur-[120px] rounded-full pointer-events-none" />

                <main className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-12 relative w-full h-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="h-full"
                        >
                            {view === 'dashboard' && <DashboardView stats={stats} operator={operator} onRefresh={loadData} loading={loading} setView={setView} />}
                            {view === 'students' && <StudentsView students={students} loading={loading} />}
                            {view === 'operators' && <OperatorsView currentOperator={operator} />}
                            {view === 'content' && <ContentView />}
                            {view === 'settings' && <SettingsView />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default AdminApp;
