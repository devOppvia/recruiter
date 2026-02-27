import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Users,
    MapPin,
    Clock,
    UserPlus,
    Pause,
    Play,
    Trash2,
} from 'lucide-react';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import CreateJobWizard from './CreateJobWizard';
import JobDetailsModal from './JobDetailsModal';
import { toggleWizard, setStatusFilter } from '../../store/slices/jobsSlice';

const JobPostingPage = () => {
    const dispatch = useDispatch();
    const { jobs, statusFilter } = useSelector((state) => state.jobs);
    const { usage } = useSelector((state) => state.subscription);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMenu, setActiveMenu] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleViewDetails = (job) => {
        setSelectedJob(job);
        setIsDetailsOpen(true);
    };

    const filteredJobs = jobs.filter(job => {
        const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const statusTabs = [
        { id: 'all', label: 'All Jobs', count: jobs.length },
        { id: 'active', label: 'Live', count: jobs.filter(j => j.status === 'active').length },
        { id: 'pending', label: 'In Review', count: jobs.filter(j => j.status === 'pending').length },
        { id: 'rejected', label: 'Rejected', count: jobs.filter(j => j.status === 'rejected').length },
        { id: 'draft', label: 'Drafts', count: jobs.filter(j => j.status === 'draft').length },
        { id: 'paused', label: 'Paused', count: jobs.filter(j => j.status === 'paused').length },
        { id: 'completed', label: 'Completed', count: jobs.filter(j => j.status === 'completed').length },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Editorial Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-brand-primary text-editorial tracking-tighter">
                        Job <span className="text-brand-primary/40">Postings</span>
                    </h1>
                    <p className="text-sm font-bold text-brand-primary/30">
                        Manage your active internship opportunities and applicant pool.
                    </p>
                </div>

                {/* Quota Highlight */}
                {/* <div className="hidden lg:flex items-center gap-4 bg-brand-primary/5 px-6 py-3 rounded-2xl border border-brand-primary/5">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-brand-primary/40 uppercase tracking-widest leading-none mb-1">Active Quota</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-brand-primary tabular-nums">{usage.jobPostings.current} / {usage.jobPostings.max}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                        </div>
                    </div>
                </div> */}

                <Button
                    onClick={() => dispatch(toggleWizard())}
                    className="rounded-2xl px-6 py-4 h-auto shadow-soft bg-brand-primary hover:bg-brand-primary-light transition-all flex items-center gap-2 group"
                >
                    <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-black uppercase tracking-widest text-xs">Create New Job</span>
                </Button>
            </div>

            {/* Filter Hub */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-1.5 bg-brand-primary/5 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
                    {statusTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => dispatch(setStatusFilter(tab.id))}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shrink-0 ${statusFilter === tab.id
                                ? 'bg-white text-brand-primary shadow-soft'
                                : 'text-brand-primary/40 hover:text-brand-primary hover:bg-white/50'
                                }`}
                        >
                            {tab.label}
                            <span className={`text-[10px] opacity-40 ${statusFilter === tab.id ? 'text-brand-primary' : ''}`}>{tab.count}</span>
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/30 group-focus-within:text-brand-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-brand-primary/5 rounded-2xl text-sm font-bold text-brand-primary outline-none focus:border-brand-primary/20 focus:ring-4 focus:ring-brand-primary/5 transition-all shadow-soft"
                    />
                </div>
            </div>

            {/* Job Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {filteredJobs.map((job) => (
                    <motion.div
                        key={job.id}
                        variants={item}
                        className="bg-white rounded-[32px] p-8 shadow-soft border border-brand-primary/5 hover:border-brand-primary/10 transition-all group overflow-hidden relative"
                    >
                        {/* Status Icon Background */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl transition-all duration-500" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <Badge status={job.status} size="sm" />
                                <button
                                    onClick={() => setActiveMenu(activeMenu === job.id ? null : job.id)}
                                    className="p-2 -mr-2 rounded-xl text-brand-primary/30 hover:bg-brand-primary/5 hover:text-brand-primary transition-all"
                                >
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="space-y-1 mb-6">
                                <h3 className="text-xl font-black text-brand-primary tracking-tight leading-tight group-hover:text-brand-primary-light transition-colors">
                                    {job.title}
                                </h3>
                                <p className="text-[11px] font-black text-brand-primary/40 uppercase tracking-widest">
                                    {job.category} · {job.subCategory}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/50">
                                    <Users size={14} strokeWidth={3} />
                                    <span>{job.internsRequired} Interns</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/50">
                                    <MapPin size={14} strokeWidth={3} />
                                    <span>{job.workType}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/50">
                                    <Clock size={14} strokeWidth={3} />
                                    <span>{job.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/50">
                                    <UserPlus size={14} strokeWidth={3} />
                                    <span>{job.applicants} Applicants</span>
                                </div>
                            </div>

                            {/* Skills Chips - Expandable */}
                            <div className="flex flex-wrap gap-1.5 mb-8">
                                {job.skills.slice(0, 3).map(skill => (
                                    <span key={skill} className="px-2.5 py-1 bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase tracking-wider rounded-lg">
                                        {skill}
                                    </span>
                                ))}
                                {job.skills.length > 3 && (
                                    <span className="px-2.5 py-1 bg-brand-primary/5 text-brand-primary/40 text-[10px] font-black uppercase tracking-wider rounded-lg hover:text-brand-primary cursor-pointer transition-colors">
                                        + {job.skills.length - 3} more
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-brand-primary/5">
                                <div>
                                    <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest mb-0.5">
                                        {job.applicationType === 'Job' ? 'Annual Salary' : 'Monthly Stipend'}
                                    </p>
                                    <p className="text-sm font-black text-brand-primary tracking-tight">
                                        {job.applicationType === 'Job'
                                            ? `₹${job.salary?.minAmount || '0'} - ${job.salary?.maxAmount || '0'} LPA`
                                            : job.stipend.type === 'Fixed'
                                                ? `₹${job.stipend.amount}/mo`
                                                : job.stipend.type
                                        }
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest mb-1">{job.applicationType}</p>
                                    <Button
                                        onClick={() => handleViewDetails(job)}
                                        variant="ghost"
                                        className="text-brand-primary font-black uppercase tracking-widest text-[10px] hover:bg-brand-primary/5 px-4 rounded-xl"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Dropdown Menu Mockup */}
                        <AnimatePresence>
                            {activeMenu === job.id && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute top-16 right-8 w-48 bg-white glass-morphism rounded-2xl shadow-premium z-20 border border-brand-primary/10 overflow-hidden"
                                >
                                    <button className="w-full px-5 py-3.5 text-left text-xs font-bold text-brand-primary hover:bg-brand-primary/5 flex items-center gap-3">
                                        {job.status === 'paused' ? <Play size={14} /> : <Pause size={14} />}
                                        {job.status === 'paused' ? 'Resume Posting' : 'Pause Posting'}
                                    </button>
                                    <button className="w-full px-5 py-3.5 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-3">
                                        <Trash2 size={14} /> Delete Job
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </motion.div>

            {/* Overlays */}
            <CreateJobWizard />
            <JobDetailsModal
                job={selectedJob}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
            />
        </div>
    );
};

export default JobPostingPage;
