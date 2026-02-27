import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    Users,
    Video,
    UserCheck,
    ArrowUpRight,
    TrendingUp,
    Clock,
    CheckCircle2,
    ChevronRight,
    Play,
    Pause,
    Plus,
    Search,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const MetricBar = ({ label, value, percentage, icon: Icon, color = "bg-brand-accent", delay = 0 }) => (
    <div className="flex-1 min-w-[140px] group">
        <div className="flex justify-between items-end mb-2.5">
            <div className="flex items-center gap-2">
                {Icon && <Icon size={12} className="text-brand-primary/40 group-hover:text-brand-primary transition-colors" />}
                <span className="text-[10px] font-black text-brand-primary/50 uppercase tracking-widest">{label}</span>
            </div>
            <span className="text-sm font-black text-brand-primary tabular-nums">{value}</span>
        </div>
        <div className="h-3 bg-brand-primary/5 rounded-full p-[2px] backdrop-blur-sm border border-brand-primary/5">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full ${color} rounded-full relative overflow-hidden`}
            >
                {/* Subtle shine effect */}
                <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent w-1/2"
                />
            </motion.div>
        </div>
        <div className="flex justify-between mt-1.5">
            <span className="text-[9px] font-bold text-brand-primary/30 uppercase">{percentage}% Achieved</span>
            <TrendingUp size={10} className="text-emerald-500/50" />
        </div>
    </div>
);

const OverviewPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { jobs } = useSelector((state) => state.jobs);
    const { candidates } = useSelector((state) => state.candidates);
    const { usage } = useSelector((state) => state.subscription);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    // SRS Derived Stats
    const stats = [
        { label: 'Active Jobs', value: jobs.filter(j => j.status === 'live').length || 12, icon: Briefcase, color: 'text-brand-primary' },
        { label: 'Total Apps', value: candidates.length || 248, icon: Users, color: 'text-brand-primary' },
        { label: 'Interviews', value: 12, icon: Video, color: 'text-brand-primary' },
        { label: 'Hired', value: 8, icon: UserCheck, color: 'text-brand-primary' },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    const recentApps = [
        { name: "Sarah Jenkins", role: "UI Designer", time: "2h ago", avatar: "SJ" },
        { name: "Michael Chen", role: "Backend Dev", time: "4h ago", avatar: "MC" },
        { name: "Emily Watson", role: "Product Manager", time: "5h ago", avatar: "EW" },
    ];

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-10 w-full mx-auto pb-10 px-2 lg:px-4">

            {/* Redesigned Header — Two Rows */}
            <motion.div variants={item} className="flex flex-col gap-6 py-6">

                {/* ROW 1: Greeting — single inline line */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        {/* Date pill */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent opacity-40 shadow-[0_0_8px_rgba(255,212,102,0.4)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary/40">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                        </motion.div>

                        {/* Divider */}
                        <div className="w-px h-4 bg-brand-primary/10" />

                        {/* Greeting + Name — one line */}
                        <motion.h1
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight"
                        >
                            <span className="font-bold text-brand-primary/40">{getGreeting()}, </span>
                            <span className="relative inline-block">
                                {user?.name?.split(' ')[0] || 'Admin'}
                                <motion.span
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute -bottom-1 left-0 h-3 bg-brand-accent/15 rounded-full -z-10"
                                />
                            </span>
                        </motion.h1>
                    </div>
                </div>

                {/* ROW 2: Metrics + Stats */}
                <div className="flex flex-wrap xl:flex-nowrap items-center gap-6">
                    {/* Key Metrics Trackers */}
                    <div className="flex flex-wrap items-center gap-8 lg:gap-12 p-8 glass-morphism rounded-[48px] shadow-glass flex-1 border border-white/80 bg-white/30 backdrop-blur-2xl">
                        <MetricBar label="Interviews" value="12" percentage={35} icon={Video} color="bg-brand-primary shadow-[0_0_15px_rgba(5,71,82,0.2)]" delay={0.3} />
                        <MetricBar label="Placement" value="8" percentage={65} icon={UserCheck} color="bg-brand-accent shadow-[0_0_15px_rgba(255,212,102,0.3)]" delay={0.4} />
                        <div className="w-px h-12 bg-brand-primary/10 hidden lg:block" />
                        <MetricBar
                            label="Job Quota"
                            value={`${usage.jobPostings.current}/${usage.jobPostings.max}`}
                            percentage={Math.round((usage.jobPostings.current / usage.jobPostings.max) * 100)}
                            icon={Briefcase}
                            color="bg-brand-primary/60"
                            delay={0.5}
                        />
                        <MetricBar
                            label="Resume Quota"
                            value={`${usage.resumeAccess.current}/${usage.resumeAccess.max}`}
                            percentage={Math.round((usage.resumeAccess.current / usage.resumeAccess.max) * 100)}
                            icon={Search}
                            color="bg-brand-accent/60"
                            delay={0.6}
                        />
                    </div>

                    {/* Summary Glass Cards */}
                    <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-2 no-scrollbar scroll-smooth shrink-0">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="bg-white/60 border border-white/60 backdrop-blur-md rounded-3xl p-5 min-w-[120px] flex flex-col items-center justify-center text-center shadow-soft hover:shadow-glass hover:bg-white transition-all group"
                            >
                                <div className={`p-2.5 rounded-2xl bg-brand-primary/5 mb-3 group-hover:bg-brand-primary group-hover:text-white transition-colors ${stat.color}`}>
                                    <stat.icon size={18} />
                                </div>
                                <p className="text-3xl font-black text-brand-primary group-hover:scale-110 transition-transform tabular-nums leading-none mb-1">{stat.value}</p>
                                <p className="text-[9px] font-black text-brand-primary/40 uppercase tracking-widest">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </motion.div>


            {/* Main Widget Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                {/* LEFT: Sidebar */}
                <div className="lg:col-span-3 flex flex-col gap-6">

                    {/* CTA Card — compact image */}
                    <motion.div variants={item} className="group relative rounded-[36px] overflow-hidden shadow-soft border border-brand-primary/5 h-[220px] shrink-0">
                        <img
                            src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800"
                            alt="Hiring"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-brand-dark/90 via-brand-dark/30 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                            <p className="text-lg font-black tracking-tighter leading-tight mb-1">Grow Your Team</p>
                            <p className="text-[10px] font-bold text-white/60 mb-4">Build the future with top-tier talent.</p>
                            <Button
                                onClick={() => navigate('/dashboard/jobs')}
                                className="w-full bg-white text-brand-dark hover:bg-brand-accent transition-all font-black uppercase tracking-widest text-[10px] py-3 rounded-xl flex items-center justify-center gap-2"
                            >
                                <Plus size={14} /> Post a New Job
                            </Button>
                        </div>
                    </motion.div>

                    {/* Quick Navigation */}
                    <motion.div variants={item} className="bg-white rounded-[36px] p-6 shadow-soft border border-brand-primary/5 flex-1">
                        <p className="text-[10px] font-black text-brand-primary/50 uppercase tracking-widest mb-4">Quick Navigation</p>
                        <div className="space-y-1">
                            {[
                                { label: "Applicants Review", count: 24, path: '/dashboard/candidates' },
                                { label: "Interview Calendar", count: 2, path: '/dashboard/candidates' },
                                { label: "Active Postings", count: 12, path: '/dashboard/jobs' },
                                { label: "Resume Bank", count: null, path: '/dashboard/resume-bank' },
                            ].map((m, i) => (
                                <div
                                    key={i}
                                    onClick={() => navigate(m.path)}
                                    className="flex justify-between items-center py-3.5 px-3 hover:bg-brand-primary/5 rounded-2xl group cursor-pointer transition-all border-b border-brand-primary/5 last:border-0"
                                >
                                    <span className="text-sm font-black text-brand-primary/80 group-hover:text-brand-primary">{m.label}</span>
                                    <div className="flex items-center gap-2">
                                        {m.count && <span className="text-[10px] font-black bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full">{m.count}</span>}
                                        <ArrowUpRight size={14} className="text-brand-primary/30 group-hover:text-brand-primary transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>

                {/* MIDDLE: Analytics + Job Distribution + Calendar */}
                <div className="lg:col-span-6 flex flex-col gap-6">

                    {/* Top Row: Analytics + Job Distribution side by side */}
                    <div className="grid grid-cols-2 gap-6">

                        {/* Candidate Pipeline Chart */}
                        <motion.div variants={item} className="bg-white rounded-[36px] p-7 shadow-soft border border-brand-primary/5 flex flex-col justify-between h-[280px]">
                            <div>
                                <p className="text-[10px] font-black text-brand-primary/50 tracking-widest uppercase mb-1">Candidate Pipeline</p>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <p className="text-4xl font-black text-brand-primary tracking-tighter">248</p>
                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+18%</span>
                                </div>
                            </div>
                            <div className="flex items-end justify-between h-24 gap-2">
                                {[45, 30, 60, 95, 40, 85, 55].map((h, i) => (
                                    <div key={i} className="flex-1 h-full flex flex-col items-center justify-end gap-1.5">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                            className={`w-full rounded-full ${h > 80 ? 'bg-brand-accent shadow-[0_0_12px_rgba(255,212,102,0.35)]' : 'bg-brand-primary/30 hover:bg-brand-primary transition-colors'}`}
                                        />
                                        <span className="text-[9px] font-black text-brand-primary/50 uppercase">
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Job Status Distribution */}
                        <motion.div variants={item} className="bg-brand-secondary rounded-[36px] p-7 shadow-soft border border-brand-primary/5 flex flex-col justify-between h-[280px]">
                            <div>
                                <p className="text-[10px] font-black text-brand-primary/50 tracking-widest uppercase mb-1">Job Distribution</p>
                                <p className="text-2xl font-black text-brand-primary tracking-tighter mt-1">18 Total Postings</p>
                            </div>
                            <div className="flex flex-col gap-3.5">
                                {[
                                    { label: 'Approved', count: 12, color: 'bg-emerald-500', pct: 65 },
                                    { label: 'Pending', count: 4, color: 'bg-brand-accent', pct: 25 },
                                    { label: 'Draft', count: 2, color: 'bg-brand-primary/25', pct: 10 },
                                ].map((s, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] font-black text-brand-primary/70 uppercase tracking-widest">
                                            <span>{s.label}</span>
                                            <span>{s.count}</span>
                                        </div>
                                        <div className="h-1.5 bg-brand-primary/8 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${s.pct}%` }}
                                                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                                className={`h-full ${s.color} rounded-full`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => navigate('/dashboard/jobs')} className="w-full bg-brand-primary text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-primary-light transition-all flex items-center justify-center gap-2">
                                Manage Openings <ChevronRight size={12} />
                            </button>
                        </motion.div>

                    </div>

                    {/* Hiring Calendar — full width in middle column */}
                    <motion.div variants={item} className="bg-white rounded-[36px] p-8 shadow-soft border border-brand-primary/5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-brand-primary text-editorial">Hiring Calendar</h3>
                            <div className="flex gap-5">
                                {['August', 'September 2024', 'October'].map((m) => (
                                    <span key={m} className={`text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all ${m === 'September 2024' ? 'text-brand-primary' : 'text-brand-primary/60 hover:text-brand-primary'}`}>
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-3 text-center mb-6">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <p className="text-[9px] font-black text-brand-primary/50 uppercase tracking-widest mb-2">{d}</p>
                                    <div className={`p-3 rounded-xl transition-all ${i === 2 ? 'bg-brand-primary text-white shadow-soft -translate-y-1' : 'bg-brand-primary/10 text-brand-primary/60 hover:bg-brand-primary/15 hover:text-brand-primary'}`}>
                                        <p className="text-sm font-black">{22 + i}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-brand-dark rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:bg-black transition-all">
                            <div className="space-y-0.5">
                                <p className="text-sm font-black text-white">Interview with Sarah Jenkins</p>
                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">10:00 AM · Google Meet · Web Dev Role</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    <div className="w-7 h-7 rounded-full border-2 border-brand-dark bg-brand-primary/40 flex items-center justify-center text-[9px] font-bold text-white">SJ</div>
                                    <div className="w-7 h-7 rounded-full border-2 border-brand-dark bg-brand-primary/60" />
                                </div>
                                <ChevronRight size={16} className="text-white/30 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* RIGHT: Potential Hires + Account Sync */}
                <div className="lg:col-span-3 flex flex-col gap-6">

                    {/* Potential Hires */}
                    <motion.div variants={item} className="bg-white rounded-[36px] p-7 shadow-soft border border-brand-primary/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-base font-black text-brand-primary text-editorial">Potential Hires</h3>
                            <button
                                onClick={() => navigate('/dashboard/resume-bank')}
                                className="text-[10px] font-black uppercase tracking-widest text-brand-primary/50 hover:text-brand-primary transition-colors"
                            >
                                Bank →
                            </button>
                        </div>
                        <div className="space-y-5">
                            {recentApps.map((app, i) => (
                                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-brand-primary/8 flex items-center justify-center text-brand-primary font-black text-xs group-hover:bg-brand-primary group-hover:text-white transition-all shrink-0">
                                        {app.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-brand-primary leading-tight truncate">{app.name}</p>
                                        <p className="text-[10px] font-bold text-brand-primary/50 uppercase tracking-widest">{app.role}</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-brand-primary/40 shrink-0">{app.time}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Account Sync */}
                    <motion.div variants={item} className="bg-brand-dark rounded-[36px] p-7 shadow-soft border border-white/5 flex flex-col gap-6 flex-1">
                        <div className="flex justify-between items-center">
                            <h3 className="text-base font-black text-white text-editorial tracking-tight">Account Sync</h3>
                            <span className="text-2xl font-black text-white/60">85%</span>
                        </div>

                        <div className="flex gap-2">
                            <div className="h-5 flex-1 bg-brand-accent rounded-lg relative">
                                <span className="absolute -top-6 left-0 text-[9px] font-black text-white/60 uppercase tracking-widest">Registration Status</span>
                            </div>
                            <div className="h-5 flex-1 bg-brand-accent rounded-lg opacity-70" />
                            <div className="h-5 flex-1 bg-white/10 rounded-lg" />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            {[
                                { t: "Profile Verification", d: "Admin Confirmed", done: true },
                                { t: "KYC Documents", d: "Verified Oct 24", done: true },
                                { t: "Active Subscription", d: "Premium Plus", done: true },
                                { t: "Setup Hiring Team", d: "Pending Invite", done: false },
                            ].map((task, i) => (
                                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${task.done ? 'bg-white/15 text-brand-accent' : 'bg-white/8 text-white/30 group-hover:bg-white/15 group-hover:text-white'}`}>
                                        <CheckCircle2 size={16} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-black truncate ${task.done ? 'text-white' : 'text-white/50'}`}>{task.t}</p>
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{task.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={() => navigate('/dashboard/subscription')}
                            className="w-full py-3.5 rounded-2xl bg-white text-brand-dark hover:bg-brand-accent transition-all font-black tracking-widest uppercase text-[10px] shadow-soft"
                        >
                            Manage Account
                        </Button>
                    </motion.div>

                </div>

            </div>
        </motion.div>
    );
};

export default OverviewPage;
