import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    Briefcase,
    CheckCircle2,
    ChevronRight,
    Plus,
    Search,
    TrendingUp,
    UserCheck,
    Users,
    Video,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../../components/Button';

const MetricBar = ({ label, value, icon: Icon, color = 'bg-brand-primary/30', delay = 0 }) => (
    <div className="flex-1 min-w-[140px] group">
        <div className="flex justify-between items-end mb-2.5">
            <div className="flex items-center gap-2">
                {Icon && <Icon size={12} className="text-brand-primary/40" />}
                <span className="text-[10px] font-black text-brand-primary/50 uppercase tracking-widest">{label}</span>
            </div>
            <span className="text-sm font-black text-brand-primary tabular-nums">{value}</span>
        </div>
        <div className="h-3 bg-brand-primary/5 rounded-full p-[2px] border border-brand-primary/5">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: '0%' }}
                transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full ${color} rounded-full`}
            />
        </div>
        <div className="flex justify-between mt-1.5">
            <span className="text-[9px] font-bold text-brand-primary/30 uppercase">0% Achieved</span>
            <TrendingUp size={10} className="text-brand-primary/20" />
        </div>
    </div>
);

const EmptyOverviewPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const stats = [
        { label: 'Active Jobs', value: 0, icon: Briefcase, color: 'text-brand-primary' },
        { label: 'Total Apps', value: 0, icon: Users, color: 'text-brand-primary' },
        { label: 'Interviews', value: 0, icon: Video, color: 'text-brand-primary' },
        { label: 'Hired', value: 0, icon: UserCheck, color: 'text-brand-primary' },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } },
    };

    const item = {
        hidden: { opacity: 0, y: 25 },
        show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-10 w-full mx-auto pb-10 px-2 lg:px-4">
            <motion.div variants={item} className="flex flex-col gap-6 py-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent opacity-40" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary/40">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                        <div className="w-px h-4 bg-brand-primary/10" />
                        <h1 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">
                            <span className="font-bold text-brand-primary/40">{getGreeting()}, </span>
                            <span>{user?.name?.split(' ')[0] || 'Admin'}</span>
                        </h1>
                    </div>
                </div>

                <div className="flex flex-wrap xl:flex-nowrap items-center gap-6">
                    <div className="flex flex-wrap items-center gap-8 lg:gap-12 p-8 glass-morphism rounded-[48px] shadow-glass flex-1 border border-white/80 bg-white/30 backdrop-blur-2xl">
                        <MetricBar label="Interviews" value="0" icon={Video} color="bg-brand-primary/40" delay={0.2} />
                        <MetricBar label="Placement" value="0" icon={UserCheck} color="bg-brand-accent/50" delay={0.3} />
                        <div className="w-px h-12 bg-brand-primary/10 hidden lg:block" />
                        <MetricBar label="Job Quota" value="0/0" icon={Briefcase} color="bg-brand-primary/30" delay={0.4} />
                        <MetricBar label="Resume Quota" value="0/0" icon={Search} color="bg-brand-accent/40" delay={0.5} />
                    </div>

                    <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-2 no-scrollbar shrink-0">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-white/60 border border-white/60 backdrop-blur-md rounded-3xl p-5 min-w-[120px] flex flex-col items-center justify-center text-center shadow-soft">
                                <div className={`p-2.5 rounded-2xl bg-brand-primary/5 mb-3 ${stat.color}`}>
                                    <stat.icon size={18} />
                                </div>
                                <p className="text-3xl font-black text-brand-primary leading-none mb-1">{stat.value}</p>
                                <p className="text-[9px] font-black text-brand-primary/40 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <motion.div variants={item} className="group relative rounded-[36px] overflow-hidden shadow-soft border border-brand-primary/5 h-[220px] shrink-0 bg-brand-primary">
                        <div className="absolute inset-0 bg-linear-to-t from-brand-dark/90 via-brand-dark/30 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                            <p className="text-lg font-black tracking-tighter leading-tight mb-1">No Jobs Posted Yet</p>
                            <p className="text-[10px] font-bold text-white/60 mb-4">Create your first opening to start receiving applications.</p>
                            <Button
                                onClick={() => navigate('/dashboard/jobs')}
                                className="w-full bg-white text-brand-dark hover:bg-brand-accent transition-all font-black uppercase tracking-widest text-[10px] py-3 rounded-xl flex items-center justify-center gap-2"
                            >
                                <Plus size={14} /> Post Your First Job
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="bg-white rounded-[36px] p-6 shadow-soft border border-brand-primary/5 flex-1">
                        <p className="text-[10px] font-black text-brand-primary/50 uppercase tracking-widest mb-4">Quick Navigation</p>
                        <div className="space-y-1">
                            {[
                                { label: 'Applicants Review', count: 0, path: '/dashboard/candidates' },
                                { label: 'Interview Calendar', count: 0, path: '/dashboard/candidates' },
                                { label: 'Active Postings', count: 0, path: '/dashboard/jobs' },
                                { label: 'Resume Bank', count: 0, path: '/dashboard/resume-bank' },
                            ].map((m) => (
                                <div
                                    key={m.label}
                                    onClick={() => navigate(m.path)}
                                    className="flex justify-between items-center py-3.5 px-3 hover:bg-brand-primary/5 rounded-2xl group cursor-pointer transition-all border-b border-brand-primary/5 last:border-0"
                                >
                                    <span className="text-sm font-black text-brand-primary/80 group-hover:text-brand-primary">{m.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full">{m.count}</span>
                                        <ArrowUpRight size={14} className="text-brand-primary/30 group-hover:text-brand-primary transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="lg:col-span-6 flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-6">
                        <motion.div variants={item} className="bg-white rounded-[36px] p-7 shadow-soft border border-brand-primary/5 flex flex-col justify-between h-[280px]">
                            <div>
                                <p className="text-[10px] font-black text-brand-primary/50 tracking-widest uppercase mb-1">Candidate Pipeline</p>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <p className="text-4xl font-black text-brand-primary tracking-tighter">0</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between h-24 gap-2">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                                    <div key={day} className="flex-1 h-full flex flex-col items-center justify-end gap-1.5">
                                        <div className="w-full h-[4%] rounded-full bg-brand-primary/10" />
                                        <span className="text-[9px] font-black text-brand-primary/50 uppercase">{day}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div variants={item} className="bg-brand-secondary rounded-[36px] p-7 shadow-soft border border-brand-primary/5 flex flex-col justify-between h-[280px]">
                            <div>
                                <p className="text-[10px] font-black text-brand-primary/50 tracking-widest uppercase mb-1">Job Distribution</p>
                                <p className="text-2xl font-black text-brand-primary tracking-tighter mt-1">0 Total Postings</p>
                            </div>
                            <div className="flex flex-col gap-3.5">
                                {[
                                    { label: 'Approved', count: 0 },
                                    { label: 'Pending', count: 0 },
                                    { label: 'Draft', count: 0 },
                                ].map((s) => (
                                    <div key={s.label} className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] font-black text-brand-primary/70 uppercase tracking-widest">
                                            <span>{s.label}</span>
                                            <span>{s.count}</span>
                                        </div>
                                        <div className="h-1.5 bg-brand-primary/8 rounded-full overflow-hidden">
                                            <div className="h-full w-0 rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => navigate('/dashboard/jobs')} className="w-full bg-brand-primary text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-primary-light transition-all flex items-center justify-center gap-2">
                                Manage Openings <ChevronRight size={12} />
                            </button>
                        </motion.div>
                    </div>

                    <motion.div variants={item} className="bg-white rounded-[36px] p-8 shadow-soft border border-brand-primary/5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-brand-primary text-editorial">Hiring Calendar</h3>
                            <div className="flex gap-5">
                                {['August', 'September 2024', 'October'].map((m) => (
                                    <span key={m} className="text-[10px] font-black uppercase tracking-wider text-brand-primary/40">{m}</span>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-3 text-center mb-6">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                <div key={d + i}>
                                    <p className="text-[9px] font-black text-brand-primary/50 uppercase tracking-widest mb-2">{d}</p>
                                    <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary/60">
                                        <p className="text-sm font-black">{22 + i}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-5 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="text-sm font-black text-brand-primary">No interviews scheduled</p>
                                <p className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">Once interviews are planned, they will appear here.</p>
                            </div>
                            <ChevronRight size={16} className="text-brand-primary/30" />
                        </div>
                    </motion.div>
                </div>

                <div className="lg:col-span-3 flex flex-col gap-6">
                    <motion.div variants={item} className="bg-white rounded-[36px] p-7 shadow-soft border border-brand-primary/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-base font-black text-brand-primary text-editorial">Potential Hires</h3>
                            <button onClick={() => navigate('/dashboard/resume-bank')} className="text-[10px] font-black uppercase tracking-widest text-brand-primary/50 hover:text-brand-primary transition-colors">
                                Bank →
                            </button>
                        </div>
                        <div className="rounded-2xl bg-brand-primary/5 border border-brand-primary/10 p-6 text-center">
                            <p className="text-sm font-black text-brand-primary">No candidate activity yet</p>
                            <p className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mt-2">Applicants will appear after job posts go live.</p>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="bg-brand-dark rounded-[36px] p-7 shadow-soft border border-white/5 flex flex-col gap-6 flex-1">
                        <div className="flex justify-between items-center">
                            <h3 className="text-base font-black text-white text-editorial tracking-tight">Account Sync</h3>
                            <span className="text-2xl font-black text-white/60">0%</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-5 flex-1 bg-white/10 rounded-lg relative">
                                <span className="absolute -top-6 left-0 text-[9px] font-black text-white/60 uppercase tracking-widest">Registration Status</span>
                            </div>
                            <div className="h-5 flex-1 bg-white/10 rounded-lg" />
                            <div className="h-5 flex-1 bg-white/10 rounded-lg" />
                        </div>
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            {[
                                { t: 'Profile Verification', d: 'Pending', done: false },
                                { t: 'KYC Documents', d: 'Pending', done: false },
                                { t: 'Active Subscription', d: 'Pending', done: false },
                                { t: 'Setup Hiring Team', d: 'Pending', done: false },
                            ].map((task) => (
                                <div key={task.t} className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-white/8 text-white/30 flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={16} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black truncate text-white/50">{task.t}</p>
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{task.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            onClick={() => navigate('/dashboard/subscription')}
                            className="w-full py-3.5 rounded-2xl bg-white text-brand-dark hover:bg-brand-accent transition-all font-black tracking-widest uppercase text-[10px] shadow-soft"
                        >
                            Complete Setup
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default EmptyOverviewPage;
