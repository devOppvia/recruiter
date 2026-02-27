import { motion } from 'framer-motion';
import { Clock, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Button from '../../components/Button';

const StatusPending = () => {
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-brand-primary-light/5 rounded-full blur-2xl" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full bg-white rounded-[48px] shadow-premium border border-brand-primary/5 overflow-hidden relative z-10"
            >
                {/* Visual Progress Header */}
                <div className="bg-brand-primary h-3 w-full relative overflow-hidden">
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '-40%' }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="absolute inset-0 bg-white/20"
                    />
                </div>

                <div className="p-10 lg:p-16 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-24 h-24 bg-brand-primary/5 rounded-[32px] flex items-center justify-center mx-auto mb-10 border border-brand-primary/10 relative group"
                    >
                        <div className="absolute inset-0 bg-brand-primary/5 rounded-[32px] animate-ping" />
                        <Clock className="text-brand-primary relative z-10" size={40} strokeWidth={2.5} />
                    </motion.div>

                    <div className="space-y-6 mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/5 rounded-full border border-brand-primary/10"
                        >
                            <Sparkles size={14} className="text-brand-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">Submission Vaulted</span>
                        </motion.div>

                        <h1 className="text-5xl font-black text-brand-primary tracking-tighter leading-[0.9] font-editorial">
                            Identity Verification <br />
                            <span className="text-brand-primary/30 italic">In Progress</span>
                        </h1>

                        <p className="text-sm font-bold text-brand-primary/40 leading-relaxed max-w-md mx-auto">
                            Our executive council is currently certifying your credentials. This strictly confidential process ensures the integrity of the Oppvia ecosystem.
                        </p>
                    </div>

                    {/* Status Tracking Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-6 rounded-[32px] bg-brand-primary/5 border border-brand-primary/10 relative overflow-hidden group shadow-soft"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl -z-10" />
                            <CheckCircle2 className="text-brand-primary mb-4" size={24} strokeWidth={3} />
                            <h3 className="font-black text-brand-primary text-xs uppercase tracking-widest mb-2">Protocol: Intake</h3>
                            <p className="text-[11px] font-bold text-brand-primary/40 leading-relaxed">Identity and company dossiers have been successfully vaulted.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="p-6 rounded-[32px] bg-white border border-brand-primary/5 relative overflow-hidden shadow-soft"
                        >
                            <ArrowRight className="text-brand-primary/20 mb-4" size={24} strokeWidth={3} />
                            <h3 className="font-black text-brand-primary/20 text-xs uppercase tracking-widest mb-2">Protocol: Activation</h3>
                            <p className="text-[11px] font-bold text-brand-primary/20 leading-relaxed">Your professional dashboard will be initialized automatically.</p>
                        </motion.div>
                    </div>

                    <div className="space-y-8">
                        <div className="inline-block px-6 py-3 bg-brand-primary/2 border border-brand-primary/5 rounded-2xl">
                            <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-[0.2em]">
                                Verification Window: <span className="text-brand-primary">24-48 Business Hours</span>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                variant="ghost"
                                className="h-14 px-8 rounded-2xl text-brand-primary font-black uppercase tracking-widest text-[10px] bg-brand-primary/5 border border-brand-primary/10 hover:bg-brand-primary hover:text-white transition-all shadow-soft"
                            >
                                <MessageSquare size={16} strokeWidth={3} className="mr-2" />
                                Secure Support
                            </Button>
                            <Button
                                className="h-14 px-8 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-[10px] shadow-premium hover:shadow-hover group"
                            >
                                Intelligence FAQ
                                <ArrowRight size={14} strokeWidth={3} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="px-10 py-8 bg-[#F9FAFB]/50 border-t border-brand-primary/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-brand-primary/40" />
                        <span className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">End-to-End Encrypted Verification</span>
                    </div>
                    <span className="text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.3em]">Oppvia ecosystem v4.0</span>
                </div>
            </motion.div>
        </div>
    );
};

export default StatusPending;
