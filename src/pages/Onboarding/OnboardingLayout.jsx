import { AnimatePresence, motion } from 'framer-motion';

const stepImages = {
    1: '/images/login_3d_character_illustration_1771844038221.png',
    2: '/images/login_3d_illustration_1771844210617.png',
    3: '/images/onboarding_3d_illustration_1771844241879.png',
    4: '/images/onboarding_illustration_3d_1771844312101.png',
    5: '/images/auth_illustration_3d_1771844281802.png',
};

const OnboardingLayout = ({ children, currentStep = 1, totalSteps = 5, title, subtitle }) => {
    const steps = [
        { id: 1, name: 'Account' },
        { id: 2, name: 'Verification' },
        { id: 3, name: 'Company' },
        { id: 4, name: 'Location' },
        { id: 5, name: 'Social' }
    ];

    return (
        <div className="h-screen w-full flex relative overflow-hidden bg-white">

            {/* Right-side 3D image background */}
            <div className="absolute right-0 top-0 w-[55%] h-full hidden lg:block">
                <div className="absolute inset-0 bg-linear-to-l from-transparent via-transparent to-white z-10" />
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentStep}
                        src={stepImages[currentStep]}
                        alt={`Step ${currentStep} illustration`}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </AnimatePresence>
                {/* Soft tint overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-brand-primary/5 to-transparent z-5" />
            </div>

            {/* Left-side Form Content */}
            <div className="relative z-20 w-full lg:w-[55%] h-screen p-8 lg:p-14 flex flex-col">

                {/* Header: Logo */}
                <div className="flex items-center gap-2.5 mb-8 shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold text-lg">O</div>
                    <span className="text-xl font-bold text-brand-dark tracking-tight">Oppvia</span>
                </div>

                {/* Progress Bars */}
                <div className="mb-2 shrink-0">
                    <div className="flex gap-1.5">
                        {steps.map((s) => (
                            <div
                                key={s.id}
                                className={`h-1.5 rounded-full transition-all duration-500 ${s.id <= currentStep ? 'w-8 bg-brand-primary' :
                                        'w-6 bg-[#e5e7eb]'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Step Counter */}
                <p className="text-sm text-[#9ca3af] font-medium mb-4 shrink-0">
                    {currentStep} of {totalSteps}
                </p>

                {/* Title */}
                <div className="mb-6 max-w-[520px] shrink-0">
                    <h1 className="text-4xl lg:text-[2.75rem] font-bold text-brand-dark tracking-tight leading-tight mb-2">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-[15px] text-[#667085] leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Scrollable Step Content */}
                <AnimatePresence mode="wait">
                    <motion.main
                        key={currentStep}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="w-full max-w-[540px] flex-1 min-h-0 overflow-y-auto pr-2"
                    >
                        {children}
                    </motion.main>
                </AnimatePresence>

                {/* Dot Indicators */}
                <div className="flex gap-2 pt-4 shrink-0">
                    {steps.map((s) => (
                        <div
                            key={s.id}
                            className={`rounded-full transition-all duration-300 ${s.id === currentStep
                                    ? 'w-3 h-3 bg-brand-primary'
                                    : s.id < currentStep
                                        ? 'w-2.5 h-2.5 bg-brand-accent'
                                        : 'w-2 h-2 bg-[#d1d5db]'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OnboardingLayout;
