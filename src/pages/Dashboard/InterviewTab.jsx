import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
    Video,
    Calendar,
    Clock,
    MoreVertical,
    ExternalLink,
    Search
} from 'lucide-react';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const InterviewTab = () => {
    const { candidates } = useSelector((state) => state.candidates);

    // Filter candidates who have an interview scheduled
    const interviews = candidates.filter(c => c.status === 'interview_scheduled' && c.interview);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
    };

    if (interviews.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-brand-primary/5 rounded-[48px] border border-dashed border-brand-primary/10"
            >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-primary/20 mx-auto mb-6 shadow-soft">
                    <Calendar size={32} />
                </div>
                <p className="text-lg font-black text-brand-primary tracking-tight">No interviews scheduled</p>
                <p className="text-sm font-bold text-brand-primary/30 mt-1 uppercase tracking-widest">When you schedule interviews, they will appear here</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {interviews.map((c) => (
                <motion.div
                    key={c.id}
                    variants={item}
                    className="group bg-white rounded-[40px] border border-brand-primary/5 shadow-soft hover:shadow-premium transition-all duration-500 overflow-hidden flex flex-col"
                >
                    <div className="p-8 pb-4 flex-1 space-y-6">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary text-lg font-black shrink-0">
                                    {c.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-brand-primary tracking-tight truncate">{c.name}</h3>
                                    <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest truncate">{c.position}</p>
                                </div>
                            </div>
                            <Badge status={c.interview.response === 'confirmed' ? 'confirmed' : 'pending'} size="sm" className="rounded-lg px-2 py-0.5 text-[9px]" />
                        </div>

                        {/* Interview Details */}
                        <div className="bg-brand-primary/5 rounded-3xl p-5 space-y-4 border border-brand-primary/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-soft">
                                    <Calendar size={18} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">Date</p>
                                    <p className="text-[11px] font-black text-brand-primary/80 uppercase mb-0.5">
                                        {new Date(c.interview.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-soft">
                                    <Clock size={18} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">Time</p>
                                    <p className="text-[11px] font-black text-brand-primary/80 uppercase mb-0.5">
                                        {c.interview.time}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-soft">
                                    <Video size={18} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-0.5 flex-1 min-w-0">
                                    <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">Mode</p>
                                    <p className="text-[11px] font-black text-brand-primary/80 uppercase truncate">
                                        {c.interview.mode}
                                    </p>
                                </div>
                                <button className="w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary/40 hover:bg-brand-primary hover:text-white transition-all">
                                    <ExternalLink size={14} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 py-6 bg-brand-primary/2 border-t border-brand-primary/5 flex gap-2">
                        <Button className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[9px] shadow-soft">
                            Join Link
                        </Button>
                        <Button variant="ghost" className="w-12 h-12 rounded-2xl bg-white border border-brand-primary/5 flex items-center justify-center text-brand-primary/40 p-0">
                            <MoreVertical size={18} strokeWidth={3} />
                        </Button>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default InterviewTab;
