import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Search,
    Wallet,
    Bell,
    Settings,
    Menu,
    X,
    PanelLeft,
    PanelTop,
    ChevronRight,
    LogOut,
    LifeBuoy,
} from 'lucide-react';
import Button from '../Button';
import NotificationDropdown from '../NotificationDropdown';

const LAYOUT_KEY = 'oppvia_layout_mode';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { unreadCount } = useSelector((state) => state.notifications);
    const { usage } = useSelector((state) => state.subscription);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [layoutMode, setLayoutMode] = useState(() => {
        return localStorage.getItem(LAYOUT_KEY) || 'navbar';
    });

    useEffect(() => {
        localStorage.setItem(LAYOUT_KEY, layoutMode);
    }, [layoutMode]);

    const toggleLayout = () => {
        setLayoutMode((prev) => (prev === 'navbar' ? 'sidebar' : 'navbar'));
        setIsMobileMenuOpen(false);
    };

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/dashboard/overview' },
        { id: 'jobs', label: 'Job Postings', icon: Briefcase, path: '/dashboard/jobs' },
        { id: 'candidates', label: 'Candidates', icon: Users, path: '/dashboard/candidates' },
        { id: 'resume-bank', label: 'Resume Bank', icon: Search, path: '/dashboard/resume-bank' },
        { id: 'subscription', label: 'Subscription', icon: Wallet, path: '/dashboard/subscription' },
        { id: 'support', label: 'Support', icon: LifeBuoy, path: '/dashboard/support' },
        { id: 'profile', label: 'Profile', icon: Settings, path: '/dashboard/profile' },
    ];

    const isSidebar = layoutMode === 'sidebar';

    const renderNavItems = (items) => {
        return items.map((item) => {
            const isActive = location.pathname === item.path;
            const isPillNav = layoutMode === 'navbar';

            if (isPillNav) {
                return (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        title={item.label}
                        className={`relative px-4 xl:px-6 py-2.5 xl:py-3 rounded-full 2xl:text-sm text-xs font-bold transition-all duration-300 flex items-center gap-1.5 2xl:gap-2 group ${isActive ? 'text-white' : 'text-brand-primary/60 hover:text-brand-primary hover:bg-brand-primary/5'}`}
                    >
                        <item.icon size={18} strokeWidth={2.5} className="relative z-10 shrink-0" />
                        <span className="relative z-10 hidden 2xl:block">{item.label}</span>
                        {isActive && (
                            <motion.div
                                layoutId="nav-pill"
                                className="absolute inset-0 bg-brand-primary rounded-full shadow-soft"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </button>
                );
            }

            return (
                <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 group relative ${isActive
                        ? 'bg-white text-brand-primary shadow-soft'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                >
                    <item.icon
                        size={17}
                        strokeWidth={2.5}
                        className={`shrink-0 ${isActive ? 'text-brand-primary' : 'text-white/50 group-hover:text-white'}`}
                    />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive && (
                        <ChevronRight size={14} className="text-brand-primary/40 shrink-0" />
                    )}
                </button>
            );
        });
    };

    // ──────────────────────────────────────────────
    // SIDEBAR LAYOUT
    // ──────────────────────────────────────────────
    if (isSidebar) {
        return (
            <div className="min-h-screen flex">
                <motion.aside
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed left-0 top-0 bottom-0 w-64 z-50 flex flex-col bg-brand-primary shadow-2xl"
                >
                    <div className="px-6 pt-8 pb-6 flex items-center gap-3 border-b border-white/10">
                        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shadow-soft shrink-0">
                            <img src="/small_logo.svg" alt="Oppvia" className="w-5 h-5 " />
                        </div>
                        <span className="text-xl font-black text-white tracking-tighter">Oppvia</span>
                    </div>

                    <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-3 mb-4">Navigation</p>
                        {renderNavItems(navItems)}
                    </nav>

                    {/* Quota Tracker */}
                    <div className="px-6 py-6 border-t border-white/10">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Account Usage</p>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">
                                    <span>Job Postings</span>
                                    <span>{usage.jobPostings.current}/{usage.jobPostings.max}</span>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-brand-accent transition-all duration-1000"
                                        style={{ width: `${(usage.jobPostings.current / usage.jobPostings.max) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">
                                    <span>Resume Access</span>
                                    <span>{usage.resumeAccess.current}/{usage.resumeAccess.max}</span>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-brand-accent transition-all duration-1000"
                                        style={{ width: `${(usage.resumeAccess.current / usage.resumeAccess.max) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-3 pb-6 pt-4 border-t border-white/10 space-y-2">
                        <button
                            onClick={toggleLayout}
                            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold text-white/50 hover:text-white hover:bg-white/10 transition-all group"
                            title="Switch to Navbar layout"
                        >
                            <PanelTop size={17} strokeWidth={2.5} className="shrink-0 group-hover:text-white/80" />
                            <span>Switch to Navbar</span>
                        </button>

                        <button className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold text-white/50 hover:text-white hover:bg-white/10 transition-all group">
                            <Settings size={17} strokeWidth={2.5} className="shrink-0" />
                            <span>Settings</span>
                        </button>

                        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 mt-2">
                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm shrink-0 ring-2 ring-white/20">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-white leading-tight truncate">
                                    {user?.name?.split(' ')[0] || 'Admin'}
                                </p>
                                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Recruiter</p>
                            </div>
                            <button className="p-1.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-white/10 transition-all">
                                <LogOut size={14} />
                            </button>
                        </div>
                    </div>
                </motion.aside>

                <div className="flex-1 ml-64">
                    <div className="sticky top-0 z-40 px-6 py-3 flex items-center justify-between bg-white/40 backdrop-blur-md border-b border-white/60">
                        <div className="flex items-center gap-2 text-[11px] font-bold tracking-tight">
                            <span className="text-brand-primary/40 uppercase tracking-widest">Dashboard</span>
                            <ChevronRight size={10} className="text-brand-primary/20" />
                            <span className="text-brand-primary uppercase tracking-widest">
                                {navItems.find(item => item.path === location.pathname)?.label || 'Overview'}
                            </span>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden xl:flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                                    <span className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">Active Jobs:</span>
                                    <span className="text-xs font-black text-brand-primary">{usage.jobPostings.current}/{usage.jobPostings.max}</span>
                                </div>
                                <div className="w-px h-3 bg-brand-primary/10" />
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                                    <span className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">Resumes:</span>
                                    <span className="text-xs font-black text-brand-primary">{usage.resumeAccess.current}/{usage.resumeAccess.max}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-xl p-1.5 rounded-full border border-white/60 shadow-glass relative">
                                <button
                                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                    className={`flex w-9 h-9 items-center justify-center rounded-full transition-all relative ${isNotificationOpen ? 'bg-brand-primary text-white shadow-soft' : 'text-brand-primary/60 hover:bg-brand-primary/5 hover:text-brand-primary'}`}
                                >
                                    <Bell size={16} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-brand-primary rounded-full border-2 border-white animate-pulse" />
                                    )}
                                </button>
                                <NotificationDropdown isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
                                <div className="w-px h-5 bg-brand-primary/10" />
                                <div className="flex items-center gap-2 px-2">
                                    <p className="text-[11px] font-black text-brand-primary hidden sm:block">
                                        {user?.name?.split(' ')[0] || 'Admin'}
                                    </p>
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-primary to-brand-primary-light flex items-center justify-center text-white font-black text-xs shadow-soft cursor-pointer">
                                        {user?.name?.charAt(0) || 'A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <main className="px-6 sm:px-8 pb-20 pt-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        );
    }

    // ──────────────────────────────────────────────
    // NAVBAR LAYOUT (default)
    // ──────────────────────────────────────────────
    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden">
            <header className="sticky top-0 z-50 px-2 sm:px-4 2xl:px-8 py-3 2xl:py-4">
                <div className="w-full flex items-center justify-between gap-2 lg:gap-4 2xl:gap-6">

                    <div className="flex items-center gap-2 lg:gap-3 glass-morphism rounded-full px-3 lg:px-5 py-2 lg:py-2.5 shadow-glass border border-white/60 shrink-0">
                        <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-xl bg-brand-primary flex items-center justify-center shadow-soft">
                            <img src="/small_logo.svg" alt="Oppvia" className="w-4 h-4 lg:w-5 lg:h-5" />
                        </div>
                        <span className="text-base lg:text-lg font-black text-brand-primary tracking-tighter hidden md:block">Oppvia</span>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4 flex-1 justify-end">
                        <nav className="hidden md:flex items-center gap-1 xl:gap-1.5 bg-white/40 backdrop-blur-xl p-1.5 xl:p-2 rounded-full border border-white/60 shadow-glass">
                            {renderNavItems(navItems)}
                        </nav>

                        {/* Usage Spotlight (Navbar Mode) */}
                        <div className="hidden 2xl:flex items-center gap-4 bg-brand-primary/5 px-6 py-2 rounded-full border border-brand-primary/5 shadow-inner">
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-brand-primary/40 uppercase tracking-widest leading-none">Jobs</span>
                                <span className="text-xs font-black text-brand-primary leading-none">{usage.jobPostings.current}/{usage.jobPostings.max}</span>
                            </div>
                            <div className="w-px h-3 bg-brand-primary/10" />
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-brand-primary/40 uppercase tracking-widest leading-none">Access</span>
                                <span className="text-xs font-black text-brand-primary leading-none">{usage.resumeAccess.current}/{usage.resumeAccess.max}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-xl p-1.5 rounded-full border border-white/60 shadow-glass relative">
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className={`flex w-10 h-10 items-center justify-center rounded-full transition-all relative ${isNotificationOpen ? 'bg-brand-primary text-white shadow-soft' : 'text-brand-primary/60 hover:bg-brand-primary/5 hover:text-brand-primary'}`}
                            >
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-primary text-[8px] items-center justify-center text-white font-black">{unreadCount}</span>
                                    </span>
                                )}
                            </button>
                            <NotificationDropdown isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />

                            <button
                                onClick={toggleLayout}
                                title="Switch to Sidebar layout"
                                className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full text-brand-primary/60 hover:bg-brand-primary/5 hover:text-brand-primary transition-all"
                            >
                                <PanelLeft size={18} />
                            </button>

                            <button className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full text-brand-primary/60 hover:bg-brand-primary/5 hover:text-brand-primary transition-all">
                                <Settings size={18} />
                            </button>

                            <div className="flex items-center gap-2 lg:gap-3 lg:pl-3 lg:border-l lg:border-brand-primary/10 lg:ml-1 pr-1">
                                <div className="text-right hidden 2xl:block">
                                    <p className="text-[12px] font-black text-brand-primary leading-tight">{user?.name?.split(' ')[0] || 'Alexander'}</p>
                                    <p className="text-[9px] font-bold text-brand-primary/40 uppercase tracking-widest whitespace-nowrap">Recruiter</p>
                                </div>
                                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-linear-to-br from-brand-primary to-brand-primary-light flex items-center justify-center text-white/90 font-black text-[11px] lg:text-[12px] shadow-soft ring-2 lg:ring-4 ring-brand-primary/5 cursor-pointer">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                                <button className="md:hidden p-2 rounded-full text-brand-primary shrink-0 ml-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-brand-primary/20 backdrop-blur-md z-55 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.nav
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed right-4 top-24 bottom-4 w-72 bg-white rounded-3xl z-60 shadow-2xl p-6 flex flex-col md:hidden"
                        >
                            <div className="flex-1 space-y-2">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                                            className={`w-full px-5 py-4 rounded-2xl text-sm font-bold flex items-center gap-4 transition-all ${isActive ? 'bg-brand-primary text-white shadow-soft' : 'text-brand-primary/60 hover:bg-brand-primary/5'}`}
                                        >
                                            <item.icon size={20} />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={toggleLayout}
                                className="flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-brand-primary/60 hover:bg-brand-primary/5 transition-all mt-2"
                            >
                                <PanelLeft size={20} />
                                Switch to Sidebar
                            </button>
                            <Button variant="outline" className="mt-2 w-full border-red-100 text-red-500 hover:bg-red-50 py-4 rounded-2xl">
                                Sign Out
                            </Button>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>

            <main className="flex-1 w-full px-4 sm:px-8 pb-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -10 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="py-2"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default DashboardLayout;
