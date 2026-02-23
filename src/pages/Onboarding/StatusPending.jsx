import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/Button';
import { Clock, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';

const StatusPending = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden"
            >
                <div className="bg-brand-primary h-2 w-full" />

                <div className="p-10 text-center">
                    <div className="w-20 h-20 bg-brand-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-brand-primary/10">
                        <Clock className="text-brand-primary animate-pulse" size={40} />
                    </div>

                    <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Application Submitted!</h1>
                    <p className="text-slate-500 text-lg leading-relaxed mb-10">
                        Welcome to the Oppvia family. Our team is currently reviewing your company profile to ensure the best experience for our interns.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <CheckCircle2 className="text-brand-primary mb-2" size={20} />
                            <h3 className="font-bold text-slate-800 text-sm mb-1">Step 1: Verification</h3>
                            <p className="text-xs text-slate-500">We verify your details and business presence.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-50">
                            <ArrowRight className="text-slate-400 mb-2" size={20} />
                            <h3 className="font-bold text-slate-800 text-sm mb-1">Step 2: Activation</h3>
                            <p className="text-xs text-slate-500">Your portal will be unlocked automatically.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-slate-400">
                            Usually takes <strong>24-48 business hours</strong>.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button variant="outline" className="gap-2">
                                <MessageSquare size={18} />
                                Contact Support
                            </Button>
                            <Button className="gap-2">
                                View FAQ
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-center items-center gap-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Powered by Oppvia</span>
                </div>
            </motion.div>
        </div>
    );
};

export default StatusPending;
