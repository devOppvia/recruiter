import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Download,
    Mail,
    UserCheck,
    UserX,
    CheckSquare,
    Square,
    ChevronDown,
    ExternalLink,
    Video,
    MapPin,
    GraduationCap,
    Calendar,
} from 'lucide-react';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import InterviewModal from '../../components/modals/InterviewModal';
import InterviewTab from './InterviewTab';
import { openInterviewModal } from '../../store/slices/interviewSlice';
import {
    toggleSelection,
    deselectAll,
    updateCandidateStatus,
    setStatusFilter,
    setSearchQuery,
    markCandidateOpened,
} from '../../store/slices/candidatesSlice';

const CandidatesPage = () => {
    const dispatch = useDispatch();
    const { candidates, selectedIds, statusFilter, searchQuery, openedCandidateIds } = useSelector((state) => state.candidates);
    const [expandedId, setExpandedId] = useState(null);
    const [activeTab, setActiveTab] = useState('candidates'); // 'candidates' or 'interviews'

    const isOpened = (candidateId) => openedCandidateIds.includes(candidateId);

    const statusOptions = [
        { value: 'all', label: 'All', count: candidates.length },
        { value: 'fresh', label: 'Fresh', count: candidates.filter(c => c.status === 'under_review' && !isOpened(c.id)).length },
        { value: 'opened', label: 'Opened', count: candidates.filter(c => c.status === 'under_review' && isOpened(c.id)).length },
        { value: 'shortlisted', label: 'Shortlisted', count: candidates.filter(c => c.status === 'shortlisted').length },
        { value: 'interview', label: 'Interview', count: candidates.filter(c => c.status === 'interview_scheduled').length },
        { value: 'hired', label: 'Hired', count: candidates.filter(c => c.status === 'hired').length },
        { value: 'rejected', label: 'Rejected', count: candidates.filter(c => c.status === 'rejected').length },
    ];

    const filtered = candidates.filter(c => {
        if (statusFilter === 'fresh' && !(c.status === 'under_review' && !isOpened(c.id))) return false;
        if (statusFilter === 'opened' && !(c.status === 'under_review' && isOpened(c.id))) return false;
        if (statusFilter === 'interview' && c.status !== 'interview_scheduled') return false;
        if (!['all', 'fresh', 'opened', 'interview'].includes(statusFilter) && c.status !== statusFilter) return false;
        if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.position.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const someSelected = selectedIds.length > 0;

    const handleBulkAction = (status) => {
        dispatch(updateCandidateStatus({ ids: selectedIds, status }));
    };

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
                        Pipeline <span className="text-brand-primary/40">Management</span>
                    </h1>
                    <div className="flex items-center gap-6 mt-2">
                        <button
                            onClick={() => setActiveTab('candidates')}
                            className={`text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'candidates' ? 'text-brand-primary' : 'text-brand-primary/20 hover:text-brand-primary/40'}`}
                        >
                            Candidates
                        </button>
                        <button
                            onClick={() => setActiveTab('interviews')}
                            className={`text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'interviews' ? 'text-brand-primary' : 'text-brand-primary/20 hover:text-brand-primary/40'}`}
                        >
                            Interviews
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" className="rounded-2xl px-6 py-4 h-auto shadow-soft bg-white border-brand-primary/5 hover:bg-brand-primary/5 transition-all flex items-center gap-2 group">
                        <Download size={18} className="text-brand-primary/40 group-hover:text-brand-primary transition-colors" />
                        <span className="font-black uppercase tracking-widest text-[10px] text-brand-primary/60 group-hover:text-brand-primary transition-colors">Export CSV</span>
                    </Button>
                </div>
            </div>

            {activeTab === 'candidates' ? (
                <>
                    {/* Filter Hub */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-brand-primary/5 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
                            {statusOptions.map((s) => (
                                <button
                                    key={s.value}
                                    onClick={() => dispatch(setStatusFilter(s.value))}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shrink-0 ${statusFilter === s.value
                                        ? 'bg-white text-brand-primary shadow-soft'
                                        : 'text-brand-primary/40 hover:text-brand-primary hover:bg-white/50'
                                        }`}
                                >
                                    {s.label}
                                    <span className={`text-[10px] opacity-40 ${statusFilter === s.value ? 'text-brand-primary' : ''}`}>{s.count}</span>
                                </button>
                            ))}
                        </div>

                        {/* Search Hub */}
                        <div className="relative w-full md:w-80 group">
                            <Search
                                size={18}
                                strokeWidth={3}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-primary transition-colors"
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                                placeholder="Search candidates..."
                                className="w-full pl-12 pr-6 py-4 bg-brand-primary/5 border-none rounded-2xl text-xs font-bold text-brand-primary placeholder:text-brand-primary/20 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Bulk Action Bar */}
                    <AnimatePresence>
                        {someSelected && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="flex items-center gap-4 bg-brand-primary p-4 rounded-[28px] shadow-premium"
                            >
                                <div className="flex items-center gap-3 pl-2">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-black">
                                        {selectedIds.length}
                                    </div>
                                    <span className="text-xs font-black text-white uppercase tracking-widest">Candidates Selected</span>
                                </div>
                                <div className="flex gap-2 ml-auto">
                                    <Button
                                        size="sm"
                                        className="bg-white text-brand-primary hover:bg-white/90 rounded-xl px-5 h-10 font-black uppercase tracking-widest text-[10px] shadow-soft transition-all"
                                        onClick={() => handleBulkAction('shortlisted')}
                                    >
                                        Shortlist
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-transparent border border-white/20 text-white hover:bg-white/10 rounded-xl px-5 h-10 font-black uppercase tracking-widest text-[10px] transition-all"
                                        onClick={() => handleBulkAction('rejected')}
                                    >
                                        Reject
                                    </Button>
                                    <div className="w-px h-10 bg-white/10 mx-1" />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-white/60 hover:text-white font-black uppercase tracking-widest text-[10px]"
                                        onClick={() => dispatch(deselectAll())}
                                    >
                                        Deselect
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Candidates List */}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                    >
                        {filtered.map((c) => (
                            <motion.div
                                key={c.id}
                                variants={item}
                                className={`group bg-white rounded-[32px] border border-brand-primary/5 shadow-soft hover:shadow-premium transition-all duration-500 overflow-hidden ${selectedIds.includes(c.id) ? 'ring-2 ring-brand-primary ring-offset-4 ring-offset-brand-primary/5 bg-brand-primary/2' : ''}`}
                            >
                                <div
                                    className="p-5 md:p-6 cursor-pointer"
                                    onClick={() => {
                                        const willOpen = expandedId !== c.id;
                                        setExpandedId(willOpen ? c.id : null);
                                        if (willOpen) dispatch(markCandidateOpened(c.id));
                                    }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-[40px_1fr_180px_140px_100px_40px] gap-6 items-center">
                                        {/* Selection Checkbox */}
                                        <div className="hidden md:flex justify-center" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => dispatch(toggleSelection(c.id))}
                                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${selectedIds.includes(c.id) ? 'bg-brand-primary border-brand-primary' : 'border-brand-primary/10 hover:border-brand-primary/30 bg-white'}`}
                                            >
                                                {selectedIds.includes(c.id) && <CheckSquare size={14} className="text-white" />}
                                            </button>
                                        </div>

                                        {/* Candidate Profile */}
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary text-xl font-black shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                                <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent" />
                                                {c.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-base font-black text-brand-primary tracking-tight truncate group-hover:text-brand-primary-light transition-colors">{c.name}</h3>
                                                <p className="text-[11px] font-bold text-brand-primary/30 uppercase tracking-widest truncate">{c.email}</p>
                                            </div>
                                        </div>

                                        {/* Position & Applied Date */}
                                        <div className="hidden md:block space-y-1">
                                            <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">Applied for</p>
                                            <p className="text-sm font-black text-brand-primary/80 truncate">{c.position}</p>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="hidden md:block">
                                            <Badge status={c.status} size="sm" className="rounded-xl px-4 py-1.5" />
                                        </div>

                                        {/* Interview/Schedule info */}
                                        <div className="hidden md:block space-y-1">
                                            <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">Next Step</p>
                                            {c.interview ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                                                    <span className="text-xs font-black text-brand-primary/60">{c.interview.date?.split('-').reverse().join('/')}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-black text-brand-primary/20">—</span>
                                            )}
                                        </div>

                                        {/* Expand Toggle */}
                                        <div className="hidden md:flex justify-end">
                                            <div className={`w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary/40 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 ${expandedId === c.id ? 'rotate-180 bg-brand-primary text-white' : ''}`}>
                                                <ChevronDown size={18} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                <AnimatePresence>
                                    {expandedId === c.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden border-t border-brand-primary/5"
                                        >
                                            <div className="p-6 pt-2 md:pl-[126px] md:pr-12 md:pb-10">
                                                <div className="bg-brand-primary/5 rounded-[32px] p-8 space-y-8 border border-brand-primary/5">
                                                    {/* Mobile Visibility Elements */}
                                                    <div className="flex items-center justify-between md:hidden pb-4 border-b border-brand-primary/5">
                                                        <Badge status={c.status} />
                                                        <p className="text-xs font-black text-brand-primary/40 uppercase tracking-widest">{c.position}</p>
                                                    </div>

                                                    {/* Advanced Info Grid */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                                        <div className="space-y-2">
                                                            <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">Education</p>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-primary/40 shadow-soft">
                                                                    <GraduationCap size={14} strokeWidth={2.5} />
                                                                </div>
                                                                <span className="text-xs font-black text-brand-primary/70">{c.education}</span>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">Experience</p>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-primary/40 shadow-soft">
                                                                    <MapPin size={14} strokeWidth={2.5} />
                                                                </div>
                                                                <span className="text-xs font-black text-brand-primary/70">{c.experience}</span>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">Phone</p>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-primary/40 shadow-soft">
                                                                    <Mail size={14} strokeWidth={2.5} />
                                                                </div>
                                                                <span className="text-xs font-black text-brand-primary/70">{c.phone}</span>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2 text-right lg:text-left">
                                                            <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">Application Date</p>
                                                            <p className="text-xs font-black text-brand-primary/40 py-2">
                                                                {new Date(c.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Skills Hub */}
                                                    <div className="space-y-3">
                                                        <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">Verified Skills</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {c.skills.map(skill => (
                                                                <span key={skill} className="px-4 py-2 bg-white text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-xl shadow-soft border border-brand-primary/5">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Interview Detail Bar */}
                                                    {c.interview && (
                                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white p-5 rounded-[24px] shadow-premium border border-brand-primary/5">
                                                            <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                                                                <Video size={18} strokeWidth={3} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-[10px] font-black text-brand-primary/20 uppercase tracking-widest mb-0.5">Scheduled Interview</p>
                                                                <h4 className="text-sm font-black text-brand-primary uppercase tracking-wide">
                                                                    {c.interview.mode} — {c.interview.date} @ {c.interview.time}
                                                                </h4>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${c.interview.response === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                                    {c.interview.response}
                                                                </div>
                                                                <Button size="sm" variant="ghost" className="text-brand-primary font-black uppercase tracking-widest text-[9px] hover:bg-brand-primary/5">Change</Button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Quick Actions Footer */}
                                                    <div className="pt-6 border-t border-brand-primary/5 flex flex-wrap gap-3">
                                                        <Button className="rounded-2xl px-8 font-black uppercase tracking-widest text-[10px] shadow-soft">
                                                            View Full Profile
                                                        </Button>

                                                        {c.resumeUrl && c.resumeUrl !== '#' ? (
                                                            <a
                                                                href={c.resumeUrl}
                                                                download
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 rounded-2xl px-6 h-10 font-black uppercase tracking-widest text-[10px] bg-white border border-brand-primary/10 text-brand-primary/60 hover:text-brand-primary hover:border-brand-primary/20 hover:shadow-soft transition-all shadow-soft"
                                                            >
                                                                <Download size={13} strokeWidth={3} />
                                                                Resume
                                                            </a>
                                                        ) : (
                                                            <span
                                                                title="Resume not available"
                                                                className="inline-flex items-center gap-2 rounded-2xl px-6 h-10 font-black uppercase tracking-widest text-[10px] bg-brand-primary/5 border border-brand-primary/5 text-brand-primary/20 cursor-not-allowed select-none"
                                                            >
                                                                <Download size={13} strokeWidth={3} />
                                                                Resume
                                                            </span>
                                                        )}

                                                        {c.status === 'under_review' && (
                                                            <>
                                                                <Button variant="secondary" className="rounded-2xl px-6 font-black uppercase tracking-widest text-[10px] bg-white border-brand-primary/5" onClick={() => dispatch(updateCandidateStatus({ ids: [c.id], status: 'shortlisted' }))}>
                                                                    Shortlist
                                                                </Button>
                                                                <Button variant="ghost" className="rounded-2xl px-6 font-black uppercase tracking-widest text-[10px] text-red-400 hover:text-red-500 hover:bg-red-50" onClick={() => dispatch(updateCandidateStatus({ ids: [c.id], status: 'rejected' }))}>
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                        {c.status === 'shortlisted' && (
                                                            <Button
                                                                className="rounded-2xl px-8 font-black uppercase tracking-widest text-[10px] bg-brand-primary shadow-soft"
                                                                onClick={() => dispatch(openInterviewModal(c))}
                                                            >
                                                                Schedule Interview
                                                            </Button>
                                                        )}
                                                        {c.status === 'interview_scheduled' && (
                                                            <Button className="rounded-2xl px-8 font-black uppercase tracking-widest text-[10px] bg-brand-primary shadow-soft" onClick={() => dispatch(updateCandidateStatus({ ids: [c.id], status: 'hired' }))}>
                                                                Hire Candidate
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>

                    {filtered.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24 bg-brand-primary/5 rounded-[48px] border border-dashed border-brand-primary/10"
                        >
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-primary/20 mx-auto mb-6 shadow-soft">
                                <Search size={32} />
                            </div>
                            <p className="text-lg font-black text-brand-primary tracking-tight">No candidates found</p>
                            <p className="text-sm font-bold text-brand-primary/30 mt-1 uppercase tracking-widest">Adjust your filters to see more results</p>
                        </motion.div>
                    )}
                </>
            ) : (
                <InterviewTab />
            )}

            <InterviewModal />
        </div>
    );
};

export default CandidatesPage;
