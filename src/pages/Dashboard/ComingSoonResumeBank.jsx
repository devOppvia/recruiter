import { motion } from 'framer-motion';
import { Briefcase, Clock3, FileSearch, ShieldCheck, Sparkles, Users } from 'lucide-react';
import Button from '../../components/Button';

const rolloutItems = [
    { title: 'Verified Candidate Profiles', status: 'Ready' },
    { title: 'Smart Skill Match', status: 'In Progress' },
    { title: 'One-Click Resume Exports', status: 'In Progress' },
    { title: 'Direct Candidate Outreach', status: 'Next' },
];

const ComingSoonResumeBank = () => {
    return (
        <div className="space-y-8 pb-10">
            <div className="space-y-1">
                <h1 className="text-4xl font-black text-brand-primary text-editorial tracking-tighter">
                    Resume <span className="text-brand-primary/40">Bank</span>
                </h1>
                <p className="text-sm font-bold text-brand-primary/30">
                    A premium search and discovery workspace for hiring teams.
                </p>
            </div>

            <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-[36px] border border-brand-primary/10 bg-linear-to-br from-brand-primary to-brand-primary-light p-8 md:p-10 shadow-premium text-white"
            >
                <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-brand-accent/20 blur-3xl" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
                    <div className="lg:col-span-2 space-y-5">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[10px] font-black uppercase tracking-widest">
                            <Clock3 size={14} />
                            Coming Soon
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight max-w-2xl">
                            Resume Bank is under final QA and will go live soon.
                        </h2>
                        <p className="text-sm md:text-base font-semibold text-white/80 max-w-2xl leading-relaxed">
                            We are polishing search performance, profile quality controls, and recruiter workflows to ensure an industry-standard experience from day one.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button className="rounded-2xl px-6 py-4 h-auto bg-white text-brand-primary hover:bg-white/90 font-black uppercase tracking-widest text-[10px]">
                                Notify Me On Launch
                            </Button>
                            <Button
                                variant="secondary"
                                className="rounded-2xl px-6 py-4 h-auto bg-white/10 border-white/30 text-white hover:bg-white/15 font-black uppercase tracking-widest text-[10px]"
                            >
                                Contact Support
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white/10 border border-white/20 rounded-3xl p-5 space-y-4 backdrop-blur-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Launch Window</p>
                        <p className="text-2xl font-black tracking-tight">Phase 1 Rollout</p>
                        <p className="text-sm font-semibold text-white/80">Access opens gradually for all companies once validation is complete.</p>
                    </div>
                </div>
            </motion.section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="xl:col-span-2 bg-white rounded-[32px] border border-brand-primary/5 shadow-soft p-7 md:p-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-brand-primary/5 text-brand-primary flex items-center justify-center">
                            <Sparkles size={18} strokeWidth={3} />
                        </div>
                        <h3 className="text-lg font-black text-brand-primary tracking-tight">What You Get At Launch</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-brand-primary/8 bg-brand-primary/3 p-5 space-y-2">
                            <Users className="text-brand-primary/60" size={18} />
                            <p className="text-sm font-black text-brand-primary">Curated Talent Pool</p>
                            <p className="text-xs font-semibold text-brand-primary/50">Browse verified intern profiles with cleaner, structured data.</p>
                        </div>
                        <div className="rounded-2xl border border-brand-primary/8 bg-brand-primary/3 p-5 space-y-2">
                            <FileSearch className="text-brand-primary/60" size={18} />
                            <p className="text-sm font-black text-brand-primary">Advanced Search</p>
                            <p className="text-xs font-semibold text-brand-primary/50">Filter by role, skills, location, experience, and education.</p>
                        </div>
                        <div className="rounded-2xl border border-brand-primary/8 bg-brand-primary/3 p-5 space-y-2">
                            <ShieldCheck className="text-brand-primary/60" size={18} />
                            <p className="text-sm font-black text-brand-primary">Trust & Verification</p>
                            <p className="text-xs font-semibold text-brand-primary/50">Profiles pass checks for identity and résumé quality consistency.</p>
                        </div>
                        <div className="rounded-2xl border border-brand-primary/8 bg-brand-primary/3 p-5 space-y-2">
                            <Briefcase className="text-brand-primary/60" size={18} />
                            <p className="text-sm font-black text-brand-primary">Recruiter Workflow</p>
                            <p className="text-xs font-semibold text-brand-primary/50">Shortlist, export, and connect with candidates in fewer steps.</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="bg-white rounded-[32px] border border-brand-primary/5 shadow-soft p-7 space-y-5"
                >
                    <h3 className="text-sm font-black uppercase tracking-widest text-brand-primary/60">Release Progress</h3>
                    <div className="space-y-3">
                        {rolloutItems.map((item) => (
                            <div key={item.title} className="rounded-2xl border border-brand-primary/8 px-4 py-3 bg-brand-primary/2">
                                <p className="text-sm font-black text-brand-primary">{item.title}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary/45 mt-1">{item.status}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ComingSoonResumeBank;
