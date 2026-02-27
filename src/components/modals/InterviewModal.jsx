import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Calendar as CalendarIcon,
    Clock,
    Video,
    MapPin,
    Link as LinkIcon,
    ChevronRight,
    CheckCircle2
} from 'lucide-react';
import Button from '../Button';
import { closeInterviewModal } from '../../store/slices/interviewSlice';
import { updateCandidateStatus } from '../../store/slices/candidatesSlice';

const InterviewModal = () => {
    const dispatch = useDispatch();
    const { isModalOpen, selectedCandidate } = useSelector((state) => state.interview);

    const [formData, setFormData] = useState({
        date: '',
        time: '',
        mode: 'Google Meet',
        location: '',
        notes: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!isModalOpen || !selectedCandidate) return null;

    const handleClose = () => {
        dispatch(closeInterviewModal());
        setTimeout(() => setIsSubmitted(false), 500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would call an API
        // For UI implementation, we'll update the candidate status
        dispatch(updateCandidateStatus({
            ids: [selectedCandidate.id],
            status: 'interview_scheduled'
        }));

        setIsSubmitted(true);
        setTimeout(() => {
            handleClose();
        }, 2000);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-brand-primary/20 backdrop-blur-sm"
                />

                {/* Modal Hook */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-xl bg-white rounded-[40px] shadow-premium overflow-hidden border border-brand-primary/5"
                >
                    {isSubmitted ? (
                        <div className="p-12 text-center space-y-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500"
                            >
                                <CheckCircle2 size={40} strokeWidth={2.5} />
                            </motion.div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-brand-primary tracking-tight">Interview Scheduled!</h2>
                                <p className="text-brand-primary/40 font-bold text-sm uppercase tracking-widest">
                                    Invitation sent to {selectedCandidate.name}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="p-8 pb-0 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-brand-primary tracking-tight">Schedule <span className="text-brand-primary/40">Interview</span></h2>
                                    <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest flex items-center gap-2">
                                        Candidate: <span className="text-brand-primary/60">{selectedCandidate.name}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary/40 hover:bg-brand-primary hover:text-white transition-all duration-300"
                                >
                                    <X size={20} strokeWidth={3} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">Date</label>
                                        <div className="relative group">
                                            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-primary transition-colors" size={18} />
                                            <input
                                                required
                                                type="date"
                                                className="w-full pl-12 pr-4 py-4 bg-brand-primary/5 border-none rounded-2xl text-xs font-bold text-brand-primary outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">Time</label>
                                        <div className="relative group">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-primary transition-colors" size={18} />
                                            <input
                                                required
                                                type="time"
                                                className="w-full pl-12 pr-4 py-4 bg-brand-primary/5 border-none rounded-2xl text-xs font-bold text-brand-primary outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">Interview Mode</label>
                                    <div className="flex gap-2 p-1.5 bg-brand-primary/5 rounded-2xl overflow-x-auto no-scrollbar">
                                        {['In-person', 'Google Meet', 'Online'].map((mode) => (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, mode })}
                                                className={`flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${formData.mode === mode
                                                    ? 'bg-white text-brand-primary shadow-soft'
                                                    : 'text-brand-primary/40 hover:text-brand-primary hover:bg-white/50'}`}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                                        {formData.mode === 'In-person' ? 'Location Address' : 'Meeting Link'}
                                    </label>
                                    <div className="relative group">
                                        {formData.mode === 'In-person'
                                            ? <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-primary transition-colors" size={18} />
                                            : <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-primary transition-colors" size={18} />
                                        }
                                        <input
                                            required
                                            type="text"
                                            placeholder={formData.mode === 'In-person' ? 'Enter office address...' : 'Enter meeting URL...'}
                                            className="w-full pl-12 pr-4 py-4 bg-brand-primary/5 border-none rounded-2xl text-xs font-bold text-brand-primary placeholder:text-brand-primary/20 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleClose}
                                        className="flex-1 rounded-2xl py-4 font-black uppercase tracking-widest text-[10px] text-brand-primary/40"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-[2] rounded-2xl py-4 font-black uppercase tracking-widest text-[10px] shadow-soft shadow-brand-primary/20 group bg-brand-primary"
                                    >
                                        Confirm Schedule
                                        <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default InterviewModal;
