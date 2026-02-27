import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    Crown,
    Zap,
    Building2,
    CreditCard,
    Calendar,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    TrendingUp,
    Download,
    X
} from 'lucide-react';
import Button from '../../components/Button';
import Tooltip from '../../components/Tooltip';
import { setActiveTab, selectPlan } from '../../store/slices/subscriptionSlice';

const planIcons = {
    basic: Zap,
    growth: Crown,
    enterprise: Building2,
};

const planThemeColors = {
    basic: 'text-[#6b7280]',
    growth: 'text-brand-primary',
    enterprise: 'text-purple-600',
};

const planBgColors = {
    basic: 'bg-[#9ca3af]/5',
    growth: 'bg-brand-primary/5',
    enterprise: 'bg-purple-600/5',
};

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const SubscriptionPage = () => {
    const dispatch = useDispatch();
    const { plans, featureLabels, featureTooltips, currentPlan, paymentHistory, activeTab } = useSelector((state) => state.subscription);

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-10 pb-10">
            {/* Editorial Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-brand-primary text-editorial tracking-tighter">
                        Billing & <span className="text-brand-primary/40">Subscription</span>
                    </h1>
                    <p className="text-sm font-bold text-brand-primary/30">
                        Manage your recruitment power and billing history.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" className="rounded-2xl px-6 py-4 h-auto shadow-soft bg-white border-brand-primary/5 hover:bg-brand-primary/5 transition-all flex items-center gap-2 group">
                        <Download size={18} className="text-brand-primary/40 group-hover:text-brand-primary transition-colors" />
                        <span className="font-black uppercase tracking-widest text-[10px] text-brand-primary/60 group-hover:text-brand-primary transition-colors">Export Billing</span>
                    </Button>
                </div>
            </div>

            {/* Premium Tab Navigation */}
            <div className="flex items-center gap-1.5 bg-brand-primary/5 p-1.5 rounded-2xl w-fit">
                {[
                    { id: 'plans', label: 'Plans & Pricing', icon: Sparkles },
                    { id: 'history', label: 'Payment History', icon: Calendar }
                ].map((t) => {
                    const Icon = t.icon;
                    return (
                        <button
                            key={t.id}
                            onClick={() => dispatch(setActiveTab(t.id))}
                            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeTab === t.id
                                ? 'bg-white text-brand-primary shadow-soft'
                                : 'text-brand-primary/40 hover:text-brand-primary hover:bg-white/50'
                                }`}
                        >
                            <Icon size={14} strokeWidth={3} className={activeTab === t.id ? 'text-brand-primary' : 'text-brand-primary/30'} />
                            {t.label}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'plans' ? (
                    <motion.div
                        key="plans"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-10"
                    >
                        {/* Plan Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {plans.map((plan) => {
                                const Icon = planIcons[plan.id];
                                const isCurrent = plan.id === currentPlan;
                                const isUpgrade = plans.findIndex(p => p.id === plan.id) > plans.findIndex(p => p.id === currentPlan);
                                const themeColor = planThemeColors[plan.id];
                                const bgColor = planBgColors[plan.id];

                                return (
                                    <motion.div
                                        key={plan.id}
                                        variants={item}
                                        className={`group relative bg-white rounded-[32px] border border-brand-primary/5 shadow-soft hover:shadow-premium transition-all duration-500 flex flex-col overflow-hidden ${isCurrent ? 'ring-2 ring-brand-primary ring-offset-4 ring-offset-brand-primary/5' : ''}`}
                                    >
                                        {/* Status Ribbon */}
                                        {isCurrent && (
                                            <div className="absolute top-6 right-6">
                                                <div className="px-3 py-1 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-soft flex items-center gap-1.5">
                                                    <ShieldCheck size={12} strokeWidth={3} />
                                                    Active
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-8 space-y-6 flex-1">
                                            <div className="space-y-2">
                                                <div className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center ${themeColor} shadow-soft relative overflow-hidden group-hover:scale-110 transition-transform duration-500`}>
                                                    <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent" />
                                                    <Icon size={24} strokeWidth={2.5} />
                                                </div>
                                                <h3 className="text-xl font-black text-brand-primary tracking-tighter uppercase mt-4">{plan.name}</h3>
                                            </div>

                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-black text-brand-primary tracking-tighter">{plan.price}</span>
                                                {plan.period && <span className="text-xs font-bold text-brand-primary/30 uppercase tracking-widest">{plan.period}</span>}
                                            </div>

                                            <div className="space-y-4 pt-4 border-t border-brand-primary/5">
                                                {Object.entries(plan.features).map(([key, val]) => (
                                                    <div key={key} className="flex items-center gap-3">
                                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${val === '✕'
                                                            ? 'bg-brand-primary/5 text-brand-primary/20'
                                                            : 'bg-emerald-500/10 text-emerald-500'
                                                            }`}>
                                                            {val === '✕' ? <X size={12} strokeWidth={3} /> : <Check size={14} strokeWidth={3} />}
                                                        </div>
                                                        <div className="flex-1 flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-1.5 min-w-0">
                                                                <span className="text-xs font-bold text-brand-primary/60 truncate">{featureLabels[key]}</span>
                                                                <Tooltip text={featureTooltips[key]} size={12} />
                                                            </div>
                                                            <span className="text-xs font-black text-brand-primary truncate">{val}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Area */}
                                        <div className="p-4 pt-0">
                                            {isCurrent ? (
                                                <div className="w-full py-5 bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-[24px] flex items-center justify-center gap-2 shadow-inner">
                                                    Current Power Level
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => dispatch(selectPlan(plan.id))}
                                                    className={`w-full py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-soft border border-brand-primary/5 ${isUpgrade
                                                        ? 'bg-brand-primary text-white hover:bg-brand-primary-light hover:shadow-premium'
                                                        : 'bg-white text-brand-primary hover:bg-brand-primary/5'
                                                        }`}
                                                >
                                                    {isUpgrade ? 'Upgrade Your Potential' : 'Review Plan'}
                                                    <ArrowRight size={14} strokeWidth={3} className={`transition-transform duration-300 ${isUpgrade ? 'group-hover/btn:translate-x-1' : ''}`} />
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Feature Comparison Table */}
                        <div className="bg-white rounded-[32px] border border-brand-primary/5 shadow-soft overflow-hidden">
                            <div className="p-8 border-b border-brand-primary/5 flex items-center justify-between bg-brand-primary/2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-soft">
                                        <TrendingUp size={18} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-lg font-black text-brand-primary tracking-tighter">Feature <span className="text-brand-primary/40">Comparison</span></h3>
                                </div>
                            </div>
                            <div className="overflow-x-auto no-scrollbar">
                                <table className="w-full min-w-[700px]">
                                    <thead>
                                        <tr className="bg-brand-primary/2">
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">Capability</th>
                                            {plans.map(p => (
                                                <th key={p.id} className={`px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest transition-colors ${p.id === currentPlan ? 'text-brand-primary' : 'text-brand-primary/40'}`}>
                                                    <div className="flex flex-col items-center gap-1">
                                                        {p.id === currentPlan && (
                                                            <span className="text-[8px] bg-brand-primary text-white px-1.5 py-0.5 rounded-sm mb-1">CURRENT</span>
                                                        )}
                                                        {p.name}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-primary/5">
                                        {Object.entries(featureLabels).map(([key, label]) => (
                                            <tr key={key} className="hover:bg-brand-primary/2 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-brand-primary/70">{label}</span>
                                                        <Tooltip text={featureTooltips[key]} size={12} />
                                                    </div>
                                                </td>
                                                {plans.map(p => (
                                                    <td key={p.id} className={`px-8 py-5 text-center transition-all ${p.id === currentPlan ? 'bg-brand-primary/3' : ''}`}>
                                                        {p.features[key] === '✕' ? (
                                                            <div className="flex justify-center">
                                                                <div className="w-7 h-7 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary/20">
                                                                    <X size={14} strokeWidth={3} />
                                                                </div>
                                                            </div>
                                                        ) : p.features[key] === '✓' ? (
                                                            <div className="flex justify-center">
                                                                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm">
                                                                    <Check size={16} strokeWidth={3} />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs font-black text-brand-primary">{p.features[key]}</span>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="history"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-[32px] border border-brand-primary/5 shadow-soft overflow-hidden"
                    >
                        <div className="p-8 border-b border-brand-primary/5 flex items-center bg-brand-primary/2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-soft">
                                    <CreditCard size={18} strokeWidth={3} />
                                </div>
                                <h3 className="text-lg font-black text-brand-primary tracking-tighter">Payment <span className="text-brand-primary/40">History</span></h3>
                            </div>
                        </div>
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-brand-primary/2">
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">Transaction Date</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">Plan Name</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">Invoice Amount</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">Payment Method</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-primary/5">
                                    {paymentHistory.map((p) => (
                                        <tr key={p.id} className="hover:bg-brand-primary/2 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary/30 group-hover:text-brand-primary transition-colors">
                                                        <Calendar size={14} strokeWidth={2.5} />
                                                    </div>
                                                    <span className="text-xs font-bold text-brand-primary/70">
                                                        {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-xs font-black text-brand-primary uppercase tracking-widest">{p.plan}</span>
                                            </td>
                                            <td className="px-8 py-5 text-xs font-black text-brand-primary">{p.amount}</td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard size={14} className="text-brand-primary/30" />
                                                    <span className="text-xs font-bold text-brand-primary/60">{p.method}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/10">
                                                    {p.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SubscriptionPage;
