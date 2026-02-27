import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Building2, MapPin, Share2, ArrowLeft } from 'lucide-react';

const stepIcons = {
    1: User,
    2: ShieldCheck,
    3: Building2,
    4: MapPin,
    5: Share2,
};

const stepImages = {
    1: '/images/login_3d_character_illustration_1771844038221.png',
    2: '/images/login_3d_illustration_1771844210617.png',
    3: '/images/onboarding_3d_illustration_1771844241879.png',
    4: '/images/onboarding_illustration_3d_1771844312101.png',
    5: '/images/auth_illustration_3d_1771844281802.png',
};

const OnboardingLayout = ({ children, currentStep = 1, totalSteps = 5, title, subtitle }) => {
    const navigate = useNavigate();
    const steps = [
        { id: 1, name: 'Account Credentials' },
        { id: 2, name: 'Identity Verification' },
        { id: 3, name: 'Company Profile' },
        { id: 4, name: 'Global Presence' },
        { id: 5, name: 'Digital Ecosystem' }
    ];

    return (
        <div className="h-screen w-full flex overflow-hidden bg-[#F9FAFB]">
            {/* Left: Progress & Branding Panel */}
            <div className="hidden lg:flex w-[320px] bg-brand-primary p-10 flex-col justify-between relative overflow-hidden shrink-0">
                {/* Decorative Background */}
                <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl" />

                <div
                    onClick={() => navigate('/')}
                    className="relative z-10 flex items-center gap-3 mb-16 cursor-pointer group"
                >
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary font-black text-xl shadow-premium group-hover:scale-110 transition-transform">
                        O
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter">Oppvia</span>
                </div>

                <div className="relative z-10 space-y-10 flex-1">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Registration Process</p>
                        <h3 className="text-2xl font-black text-white tracking-tighter">Onboarding Hub</h3>
                    </div>

                    <div className="relative space-y-8">
                        {/* Connecting Line */}
                        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-white/10" />

                        {steps.map((s) => {
                            const Icon = stepIcons[s.id];
                            const isActive = s.id === currentStep;
                            const isCompleted = s.id < currentStep;

                            return (
                                <div key={s.id} className="relative flex items-center gap-4 group">
                                    <div className={`
                                        w-10 h-10 rounded-xl flex items-center justify-center z-10 transition-all duration-300
                                        ${isActive ? 'bg-white text-brand-primary scale-110 shadow-premium' :
                                            isCompleted ? 'bg-brand-primary-light text-white' : 'bg-white/10 text-white/40 border border-white/5'}
                                    `}>
                                        <Icon size={18} strokeWidth={isActive ? 3 : 2} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-white' : 'text-white/40'}`}>
                                            Step 0{s.id}
                                        </span>
                                        <span className={`text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-white/40'}`}>
                                            {s.name}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeStep"
                                            className="absolute -right-10 w-1 h-8 bg-white rounded-l-full"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-white/10">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 text-center">Security Council Verified</p>
                    <div className="flex justify-center gap-4 opacity-40">
                        <div className="w-8 h-8 rounded-full border border-white" />
                        <div className="w-8 h-8 rounded-full border border-white" />
                        <div className="w-8 h-8 rounded-full border border-white" />
                    </div>
                </div>
            </div>

            {/* Middle: Content Workspace */}
            <div className="flex-1 h-screen flex flex-col bg-white  shadow-2xl z-20 overflow-hidden">
                {/* Wizard Header */}
                <div className="px-8 lg:px-14 py-8 flex items-center justify-between border-b border-brand-primary/5 shrink-0 bg-white/80 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div
                            onClick={() => navigate('/')}
                            className="lg:hidden w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-black cursor-pointer"
                        >
                            O
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black text-brand-primary tracking-tighter">
                                {title}
                            </h1>
                            <p className="text-xs font-bold text-brand-primary/40 uppercase tracking-widest">{subtitle}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <p className="text-[10px] font-black text-brand-primary/20 uppercase tracking-widest">Progress</p>
                            <p className="text-xs font-black text-brand-primary">{Math.round((currentStep / totalSteps) * 100)}% Complete</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary font-black text-xs border border-brand-primary/10">
                            {currentStep}/{totalSteps}
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="max-w-3xl mx-auto p-8 lg:p-14">
                        <AnimatePresence mode="wait">
                            <motion.main
                                key={currentStep}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full"
                            >
                                {children}
                            </motion.main>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Secure Footer Bar */}
                <div className="px-8 lg:px-14 py-4 border-t border-brand-primary/5 bg-[#F9FAFB]/50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 text-brand-primary/40">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Secure Handshake Protocol</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-brand-primary/20 uppercase tracking-widest hidden sm:block">Need assistance?</span>
                        <button className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline">Support Hub</button>
                    </div>
                </div>
            </div>

            {/* Right: Dynamic Context Panel */}
            <div className="hidden xl:block w-[340px] h-screen p-10 relative overflow-hidden bg-[#F9FAFB]">
                <div className="relative z-10 h-full flex flex-col justify-end gap-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="aspect-square rounded-[40px] overflow-hidden bg-brand-primary/5 border border-brand-primary/10 group shadow-premium">
                                <motion.img
                                    src={stepImages[currentStep]}
                                    alt="illustration"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-black text-brand-primary tracking-tighter">Pro Tip</h4>
                                <p className="text-xs font-bold text-brand-primary/40 leading-relaxed">
                                    Completing your profile fully increases your company's visibility to premium talent by up to 45%.
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="p-6 bg-white rounded-3xl border border-brand-primary/5 shadow-soft space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                                <Building2 size={16} />
                            </div>
                            <span className="text-[10px] font-black text-brand-primary/80 uppercase tracking-widest">Global Network</span>
                        </div>
                        <p className="text-[10px] font-bold text-brand-primary/40 uppercase">You're joining 12,000+ companies worldwide.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingLayout;
