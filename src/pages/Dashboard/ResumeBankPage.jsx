import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    X,
    Download,
    Eye,
    Mail,
    ChevronDown,
    ChevronUp,
    GraduationCap,
    MapPin,
    Briefcase,
    Globe,
    User,
    ArrowRight,
    Sparkles,
} from 'lucide-react';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import {
    toggleFilter,
    clearFilters,
    removeFilter,
    setPreview,
    closePreview,
} from '../../store/slices/resumeBankSlice';

const filterConfig = [
    { key: 'industry', label: 'Industry', options: ['Tech', 'Finance', 'Design', 'Marketing'] },
    { key: 'department', label: 'Department', options: ['Frontend', 'Backend', 'Marketing', 'Design', 'Data Science'] },
    { key: 'city', label: 'City', options: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'] },
    { key: 'gender', label: 'Gender', options: ['Male', 'Female'] },
];

const ResumeBankPage = () => {
    const dispatch = useDispatch();
    const { resumes, filters, previewId } = useSelector((state) => state.resumeBank);
    const { usage } = useSelector((state) => state.subscription);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(true);
    const [collapsedSections, setCollapsedSections] = useState({});

    const activeFilters = Object.entries(filters).flatMap(([cat, vals]) => vals.map(v => ({ cat, v })));

    const filtered = resumes.filter(r => {
        if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase()) && !r.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
        if (filters.industry.length > 0 && !filters.industry.includes(r.industry)) return false;
        if (filters.department.length > 0 && !filters.department.includes(r.department)) return false;
        if (filters.city.length > 0 && !filters.city.includes(r.city)) return false;
        if (filters.gender.length > 0 && !filters.gender.includes(r.gender)) return false;
        return true;
    });

    const previewResume = resumes.find(r => r.id === previewId);

    const toggleSection = (key) => {
        setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Editorial Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-brand-primary text-editorial tracking-tighter">
                        Resume <span className="text-brand-primary/40">Bank</span>
                    </h1>
                    <p className="text-sm font-bold text-brand-primary/30">
                        Discover and recruit top talent from our verified intern pool.
                    </p>
                </div>

                {/* Quota Highlight */}
                {/* <div className="hidden lg:flex items-center gap-4 bg-brand-primary/5 px-6 py-3 rounded-2xl border border-brand-primary/5">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-brand-primary/40 uppercase tracking-widest leading-none mb-1">Resume Access</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-brand-primary tabular-nums">{usage.resumeAccess.current} / {usage.resumeAccess.max}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                        </div>
                    </div>
                </div> */}

                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        className="rounded-2xl px-6 py-4 h-auto shadow-soft bg-white border-brand-primary/5 hover:bg-brand-primary/5 transition-all flex items-center gap-2 group lg:hidden"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={18} className="text-brand-primary/40 group-hover:text-brand-primary transition-colors" />
                        <span className="font-black uppercase tracking-widest text-[10px] text-brand-primary/60 group-hover:text-brand-primary transition-colors">Filters</span>
                        {activeFilters.length > 0 && (
                            <span className="ml-1 w-5 h-5 bg-brand-primary text-white text-[10px] font-black rounded-lg flex items-center justify-center shadow-soft">
                                {activeFilters.length}
                            </span>
                        )}
                    </Button>
                    <Button variant="secondary" className="rounded-2xl px-6 py-4 h-auto shadow-soft bg-white border-brand-primary/5 hover:bg-brand-primary/5 transition-all flex items-center gap-2 group">
                        <Download size={18} className="text-brand-primary/40 group-hover:text-brand-primary transition-colors" />
                        <span className="font-black uppercase tracking-widest text-[10px] text-brand-primary/60 group-hover:text-brand-primary transition-colors">Export Bank</span>
                    </Button>
                </div>
            </div>

            {/* Hybrid Filter & Search Hub */}
            <div className="bg-white p-2 rounded-[32px] border border-brand-primary/5 shadow-soft flex flex-col md:flex-row gap-2">
                <div className="relative flex-1 group">
                    <Search
                        size={18}
                        strokeWidth={3}
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-primary transition-colors"
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, skills, or department..."
                        className="w-full pl-14 pr-6 py-4 bg-brand-primary/5 border-none rounded-[24px] text-xs font-bold text-brand-primary placeholder:text-brand-primary/20 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all shadow-inner"
                    />
                </div>

                {activeFilters.length > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-brand-primary/5 rounded-[24px] overflow-x-auto no-scrollbar max-w-md">
                        {activeFilters.map(f => (
                            <button
                                key={`${f.cat}-${f.v}`}
                                onClick={() => dispatch(removeFilter({ category: f.cat, value: f.v }))}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-xl shadow-soft whitespace-nowrap group hover:bg-brand-primary hover:text-white transition-all"
                            >
                                {f.v}
                                <X size={12} strokeWidth={3} className="opacity-40 group-hover:opacity-100" />
                            </button>
                        ))}
                        <button
                            onClick={() => dispatch(clearFilters())}
                            className="text-[10px] font-black text-red-400 hover:text-red-500 uppercase tracking-widest px-2 transition-colors whitespace-nowrap"
                        >
                            Reset
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Premium Filter Sidebar */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 280, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="shrink-0 hidden lg:block"
                        >
                            <div className="w-[280px] space-y-4 sticky top-24">
                                <div className="bg-white rounded-[32px] border border-brand-primary/5 shadow-soft p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                                                <Filter size={16} strokeWidth={3} />
                                            </div>
                                            <h3 className="text-xs font-black text-brand-primary uppercase tracking-widest">Filter Pool</h3>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {filterConfig.map(fc => (
                                            <div key={fc.key} className="space-y-2">
                                                <button
                                                    onClick={() => toggleSection(fc.key)}
                                                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${!collapsedSections[fc.key] ? 'bg-brand-primary/5 text-brand-primary' : 'text-brand-primary/30 hover:bg-brand-primary/2 hover:text-brand-primary/60'}`}
                                                >
                                                    {fc.label}
                                                    <div className={`transition-transform duration-300 ${!collapsedSections[fc.key] ? 'rotate-180' : ''}`}>
                                                        <ChevronDown size={14} strokeWidth={3} />
                                                    </div>
                                                </button>
                                                {!collapsedSections[fc.key] && (
                                                    <div className="px-2 space-y-1 py-1">
                                                        {fc.options.map(opt => {
                                                            const isActive = filters[fc.key].includes(opt);
                                                            return (
                                                                <button
                                                                    key={opt}
                                                                    onClick={() => dispatch(toggleFilter({ category: fc.key, value: opt }))}
                                                                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-[11px] font-bold transition-all group ${isActive
                                                                        ? 'bg-brand-primary text-white shadow-soft'
                                                                        : 'text-brand-primary/50 hover:bg-brand-primary/2 hover:text-brand-primary'
                                                                        }`}
                                                                >
                                                                    <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all ${isActive ? 'bg-white border-white text-brand-primary' : 'border-brand-primary/10 group-hover:border-brand-primary/30 bg-white'}`}>
                                                                        {isActive && <div className="w-1.5 h-1.5 rounded-sm bg-brand-primary" />}
                                                                    </div>
                                                                    {opt}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Resume Grid */}
                <div className="flex-1">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                        {filtered.map((r) => (
                            <motion.div
                                key={r.id}
                                variants={item}
                                layout
                                className="group bg-white rounded-[32px] border border-brand-primary/5 shadow-soft hover:shadow-premium transition-all duration-500 overflow-hidden flex flex-col"
                            >
                                <div className="p-6 pb-0 flex items-center justify-between">
                                    <div className="w-14 h-14 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary text-xl font-black shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent" />
                                        {r.name.charAt(0)}
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="w-9 h-9 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary/40 hover:bg-brand-primary hover:text-white transition-all cursor-pointer shadow-soft">
                                            <Download size={16} strokeWidth={3} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4 flex-1">
                                    <div>
                                        <h3 className="text-base font-black text-brand-primary tracking-tight truncate group-hover:text-brand-primary-light transition-colors">{r.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">{r.department}</span>
                                            <div className="w-1 h-1 rounded-full bg-brand-primary/10" />
                                            <span className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">{r.industry}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5 bg-brand-primary/2 p-4 rounded-2xl border border-brand-primary/5">
                                        <div className="flex items-center gap-3 text-xs font-bold text-brand-primary/60">
                                            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-brand-primary/30 shadow-soft">
                                                <GraduationCap size={14} strokeWidth={2.5} />
                                            </div>
                                            <span className="truncate">{r.education}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs font-bold text-brand-primary/60">
                                            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-brand-primary/30 shadow-soft">
                                                <MapPin size={14} strokeWidth={2.5} />
                                            </div>
                                            <span>{r.city}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs font-bold text-brand-primary/60">
                                            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-brand-primary/30 shadow-soft">
                                                <Briefcase size={14} strokeWidth={2.5} />
                                            </div>
                                            <span>{r.experience}</span>
                                        </div>
                                    </div>

                                    {/* Skills Hub */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {r.skills.slice(0, 3).map(skill => (
                                            <span key={skill} className="px-3 py-1.5 bg-white text-brand-primary/60 text-[9px] font-black uppercase tracking-widest rounded-lg shadow-soft border border-brand-primary/5">
                                                {skill}
                                            </span>
                                        ))}
                                        {r.skills.length > 3 && (
                                            <span className="px-3 py-1.5 bg-brand-primary/5 text-brand-primary text-[9px] font-black uppercase tracking-widest rounded-lg">
                                                +{r.skills.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-2 pt-0">
                                    <button
                                        onClick={() => dispatch(setPreview(r.id))}
                                        className="w-full py-4 bg-brand-primary/5 hover:bg-brand-primary text-brand-primary hover:text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-inner hover:shadow-premium"
                                    >
                                        <Eye size={16} strokeWidth={3} className="opacity-40 group-hover/btn:opacity-100 group-hover/btn:scale-110 transition-all" />
                                        Full Profile
                                        <ArrowRight size={14} strokeWidth={3} className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {filtered.length === 0 && (
                        <div className="text-center py-24 bg-brand-primary/5 rounded-[48px] border border-dashed border-brand-primary/10">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-primary/20 mx-auto mb-6 shadow-soft">
                                <Search size={32} />
                            </div>
                            <p className="text-lg font-black text-brand-primary tracking-tight">No talent found</p>
                            <p className="text-sm font-bold text-brand-primary/30 mt-1 uppercase tracking-widest">Try adjusting your filters to discover more interns</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Preview Slide-Over Panel */}
            <AnimatePresence>
                {previewResume && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => dispatch(closePreview())}
                            className="fixed inset-0 bg-brand-primary/20 backdrop-blur-md z-100"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white z-101 shadow-2xl overflow-y-auto overflow-x-hidden no-scrollbar"
                        >
                            <div className="relative p-8 space-y-10">
                                {/* Header Controls */}
                                <div className="flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md py-4 z-10 -mx-8 px-8 border-b border-brand-primary/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-premium">
                                            <User size={20} strokeWidth={3} />
                                        </div>
                                        <h2 className="text-xl font-black text-brand-primary tracking-tighter">Candidate <span className="text-brand-primary/40">Profile</span></h2>
                                    </div>
                                    <button
                                        onClick={() => dispatch(closePreview())}
                                        className="w-11 h-11 flex items-center justify-center rounded-2xl bg-brand-primary/5 text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-soft group"
                                    >
                                        <X size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                                    </button>
                                </div>

                                {/* Profile Spotlight */}
                                <div className="relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-32 h-32 rounded-[40px] bg-linear-to-br from-brand-primary/20 to-brand-primary/5 p-1 relative group">
                                            <div className="absolute inset-0 bg-brand-primary rounded-[40px] opacity-0 group-hover:opacity-10 transition-opacity blur-xl" />
                                            <div className="w-full h-full bg-white rounded-[36px] flex items-center justify-center text-brand-primary text-5xl font-black shadow-premium overflow-hidden relative">
                                                <div className="absolute inset-0 bg-linear-to-br from-brand-primary/5 to-transparent" />
                                                {previewResume.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="mt-8 space-y-2">
                                            <div className="flex items-center justify-center gap-3">
                                                <h3 className="text-3xl font-black text-brand-primary tracking-tighter">{previewResume.name}</h3>
                                                <div className="px-3 py-1 bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-brand-primary/5">
                                                    Verified Talent
                                                </div>
                                            </div>
                                            <p className="text-base font-bold text-brand-primary/40 uppercase tracking-widest">{previewResume.department} — {previewResume.industry}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Information Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-brand-primary/2 p-6 rounded-[32px] border border-brand-primary/5 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-soft">
                                                <GraduationCap size={18} strokeWidth={3} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest leading-none">Education</p>
                                                <p className="text-sm font-black text-brand-primary/70">{previewResume.education}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-soft">
                                                <MapPin size={18} strokeWidth={3} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest leading-none">Location</p>
                                                <p className="text-sm font-black text-brand-primary/70">{previewResume.city}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-brand-primary/2 p-6 rounded-[32px] border border-brand-primary/5 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-soft">
                                                <Briefcase size={18} strokeWidth={3} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest leading-none">Experience</p>
                                                <p className="text-sm font-black text-brand-primary/70">{previewResume.experience}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-soft">
                                                <Globe size={18} strokeWidth={3} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest leading-none">Portfolio</p>
                                                <button className="text-sm font-black text-brand-primary hover:text-brand-primary-light transition-colors underline decoration-brand-primary/20 underline-offset-4">View Portfolio</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-brand-primary/5 p-8 rounded-[32px] border border-brand-primary/5 space-y-4 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 text-brand-primary/5 group-hover:scale-110 transition-transform duration-700">
                                            <Sparkles size={48} />
                                        </div>
                                        <h4 className="text-xs font-black text-brand-primary uppercase tracking-widest">Career Preferences</h4>
                                        <p className="text-base font-bold text-brand-primary/60 leading-relaxed italic pr-12">
                                            "{previewResume.preferences}"
                                        </p>
                                    </div>

                                    <div className="space-y-4 px-2">
                                        <h4 className="text-xs font-black text-brand-primary uppercase tracking-widest border-b border-brand-primary/5 pb-2">Verified Skillset</h4>
                                        <div className="flex flex-wrap gap-2.5">
                                            {previewResume.skills.map(skill => (
                                                <span key={skill} className="px-5 py-3 bg-white text-brand-primary text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-soft border border-brand-primary/5 hover:border-brand-primary/20 transition-all cursor-default scale-100 hover:scale-[1.02]">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-brand-primary/10">
                                        <Button className="flex-1 rounded-[24px] py-6 font-black uppercase tracking-widest text-xs shadow-premium flex items-center justify-center gap-3 group">
                                            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Download size={16} strokeWidth={3} />
                                            </div>
                                            Download Resume
                                        </Button>
                                        <Button variant="secondary" className="flex-1 rounded-[24px] py-6 font-black uppercase tracking-widest text-xs bg-white border-brand-primary/10 text-brand-primary hover:bg-brand-primary/5 flex items-center justify-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-brand-primary/5 flex items-center justify-center">
                                                <Mail size={16} strokeWidth={3} />
                                            </div>
                                            Send Offer
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div >
    );
};

export default ResumeBankPage;
