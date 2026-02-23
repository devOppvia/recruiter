import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Facebook, Twitter, Linkedin, Github, CheckCircle2 } from 'lucide-react';

const OnboardingLayout = ({ children, currentStep = 1, title, subtitle }) => {
    const steps = [
        { id: 1, name: 'Account' },
        { id: 2, name: 'Verification' },
        { id: 3, name: 'Company' },
        { id: 4, name: 'Location' },
        { id: 5, name: 'Social' }
    ];

    return (
        <div className="h-screen w-full flex bg-white font-['Inter'] overflow-hidden">
            {/* Sidebar Panel - Fixed Full Height */}
            <div className="hidden lg:flex w-[400px] h-full bg-[#f9fafb] border-r border-[#eaecf0] p-12 flex-col justify-between shrink-0">
                <div className="space-y-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-[0_4px_12px_rgba(31,78,78,0.2)]">
                            <Globe className="text-white" size={22} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black tracking-tight text-[#101828] leading-none">Oppvia</span>
                            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mt-1">Company Panel</span>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Enhanced Stepper */}
                        <nav className="space-y-4">
                            {steps.map((step) => (
                                <div key={step.id} className="flex items-center gap-4 group">
                                    <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${step.id < currentStep
                                        ? 'bg-brand-primary border-brand-primary'
                                        : step.id === currentStep
                                            ? 'bg-white border-brand-primary shadow-[0_0_0_4px_rgba(31,78,78,0.1)]'
                                            : 'bg-white border-[#eaecf0]'
                                        }`}>
                                        {step.id < currentStep ? (
                                            <CheckCircle2 size={18} className="text-white" />
                                        ) : (
                                            <span className={`text-sm font-bold ${step.id === currentStep ? 'text-brand-primary' : 'text-[#98a2b3]'}`}>
                                                {step.id}
                                            </span>
                                        )}
                                        {step.id !== 5 && (
                                            <div className={`absolute top-10 left-1/2 -translate-x-1/2 w-[2px] h-4 transition-colors duration-500 ${step.id < currentStep ? 'bg-brand-primary' : 'bg-[#eaecf0]'
                                                }`} />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-bold tracking-tight transition-colors duration-300 ${step.id === currentStep ? 'text-[#101828]' : 'text-[#667085]'
                                            }`}>
                                            {step.name}
                                        </span>
                                        <span className="text-[11px] text-[#98a2b3] font-medium leading-none mt-0.5">
                                            Step 0{step.id}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </nav>

                        <div className="h-px bg-[#eaecf0] w-full" />

                        <div className="space-y-8">
                            <div className="space-y-1">
                                <h3 className="text-xs font-bold text-[#101828] uppercase tracking-wider">Chat to sales</h3>
                                <a href="mailto:sales@oppvia.com" className="text-sm font-semibold text-brand-primary hover:underline block">sales@oppvia.com</a>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-xs font-bold text-[#101828] uppercase tracking-wider">Email support</h3>
                                <a href="mailto:support@oppvia.com" className="text-sm font-semibold text-brand-primary hover:underline block">support@oppvia.com</a>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-xs font-bold text-[#101828] uppercase tracking-wider">Instant Help</h3>
                                <button className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-2 transition-all">
                                    Start live chat
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ecfdf3] border border-[#abefc6]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#12b76a] animate-pulse"></span>
                                        <span className="text-[9px] text-[#067647] font-extrabold uppercase tracking-widest">Online</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 px-1">
                    <Facebook className="text-[#98a2b3] hover:text-[#101828] cursor-pointer transition-colors" size={20} />
                    <Twitter className="text-[#98a2b3] hover:text-[#101828] cursor-pointer transition-colors" size={20} />
                    <Linkedin className="text-[#98a2b3] hover:text-[#101828] cursor-pointer transition-colors" size={20} />
                    <Github className="text-[#98a2b3] hover:text-[#101828] cursor-pointer transition-colors" size={20} />
                </div>
            </div>

            {/* Content Display Area */}
            <div className="flex-1 h-full flex flex-col items-center overflow-y-auto bg-white scroll-smooth pt-16 pb-12 px-6 lg:px-20 relative">
                <div className="w-full max-w-[540px] flex flex-col min-h-full">
                    {/* Header Branding (Mobile Only) */}
                    <div className="lg:hidden flex items-center justify-between gap-2 mb-12">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white font-bold shadow-lg shadow-brand-primary/20">O</div>
                            <span className="text-xl font-black tracking-tight text-[#101828]">Oppvia</span>
                        </div>
                        <div className="text-[11px] font-bold text-[#667085] bg-[#f9fafb] px-3 py-1 rounded-full border border-[#eaecf0]">
                            Step {currentStep}/5
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="flex-1 flex flex-col"
                        >
                            <div className="mb-10 text-left">
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] block mb-3"
                                >
                                    Step 0{currentStep} — {steps[currentStep - 1].name}
                                </motion.span>
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl font-extrabold text-[#101828] tracking-tight mb-4"
                                >
                                    {title}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-lg text-[#667085] leading-relaxed font-medium"
                                >
                                    {subtitle}
                                </motion.p>
                            </div>

                            <main className="w-full flex-1 pb-12">
                                {children}
                            </main>
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer Progress Mobile/Tablet */}
                    {/* <div className="mt-auto pt-8 border-t border-[#f2f4f7] mb-4">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#98a2b3] mb-3">
                            <span>Registration Status</span>
                            <span className="text-brand-primary">{Math.round((currentStep / 4) * 100)}% Complete</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#f2f4f7] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentStep / 4) * 100}%` }}
                                transition={{ duration: 1, ease: "circOut" }}
                                className="h-full bg-brand-primary"
                            />
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default OnboardingLayout;
