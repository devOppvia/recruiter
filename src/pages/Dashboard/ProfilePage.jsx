import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Globe,
    Info,
    Mail,
    Smartphone,
    Camera,
    Save,
    ShieldCheck,
    MapPin,
    Briefcase,
    CheckCircle2,
    Edit3
} from 'lucide-react';
import { updateProfile, toggleOtpModal } from '../../store/slices/profileSlice';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import SecureUpdateModal from '../../components/modals/SecureUpdateModal';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { company, industries } = useSelector((state) => state.profile);
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({ ...company });
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            dispatch(updateProfile(formData));
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1000);
    };

    const tabs = [
        { id: 'general', label: 'General Info', icon: Building2 },
        { id: 'security', label: 'Security & Contact', icon: ShieldCheck },
    ];

    return (
        <div className="space-y-8 pb-20 max-w-5xl mx-auto">
            {/* Editorial Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-brand-primary text-editorial tracking-tighter">
                        Profile <span className="text-brand-primary/40">Management</span>
                    </h1>
                    <p className="text-sm font-bold text-brand-primary/30">
                        View and update your company's official information.
                    </p>
                </div>
                {activeTab === 'general' && (
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="rounded-2xl px-8 py-4 h-auto shadow-soft bg-brand-primary hover:bg-brand-primary-light transition-all flex items-center gap-2 group"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                        )}
                        <span className="font-black uppercase tracking-widest text-xs">
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </span>
                    </Button>
                )}
            </div>

            {/* Success Notification */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="p-4 bg-emerald-500 text-white rounded-2xl flex items-center gap-3 shadow-premium"
                    >
                        <CheckCircle2 size={20} strokeWidth={3} />
                        <span className="text-xs font-black uppercase tracking-widest">Settings updated successfully!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
                {/* Sidebar Navigation */}
                <div className="space-y-6">
                    <div className="p-8 bg-white rounded-[40px] border border-brand-primary/5 shadow-soft text-center space-y-4">
                        <div className="relative group mx-auto w-32 h-32">
                            <div className="w-full h-full rounded-[40px] bg-brand-primary/5 flex items-center justify-center overflow-hidden border-2 border-brand-primary/10 shadow-soft">
                                <img src={company.logo} alt="Company Logo" className="w-16 h-16 opacity-50" />
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-3 bg-brand-primary text-white rounded-2xl shadow-premium hover:scale-110 transition-transform">
                                <Camera size={18} strokeWidth={3} />
                            </button>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-brand-primary tracking-tighter truncate">{company.name}</h3>
                            <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest mt-1">{company.industry} Industry</p>
                        </div>
                    </div>

                    <div className="p-3 bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-soft space-y-1">
                        {tabs.map((tab) => {
                            const IsActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3.5 px-6 py-4 rounded-[24px] text-sm font-bold transition-all group ${IsActive
                                        ? 'bg-brand-primary text-white shadow-premium'
                                        : 'text-brand-primary/60 hover:text-brand-primary hover:bg-white/60'
                                        }`}
                                >
                                    <tab.icon size={18} strokeWidth={IsActive ? 3 : 2} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="space-y-10">
                    <AnimatePresence mode="wait">
                        {activeTab === 'general' ? (
                            <motion.div
                                key="general"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="bg-white rounded-[40px] border border-brand-primary/5 shadow-premium overflow-hidden">
                                    <div className="px-10 py-8 border-b border-brand-primary/5 bg-brand-primary/2">
                                        <h2 className="text-xl font-black text-brand-primary tracking-tighter uppercase font-editorial">Company <span className="text-brand-primary/40">Details</span></h2>
                                    </div>
                                    <div className="p-10 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <Input
                                                label="Company Name"
                                                icon={Building2}
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft"
                                            />
                                            <Input
                                                label="Website"
                                                icon={Globe}
                                                placeholder="https://example.com"
                                                value={formData.website}
                                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <Select
                                                label="Industry"
                                                options={industries}
                                                value={formData.industry}
                                                onChange={(val) => setFormData({ ...formData, industry: val })}
                                            />
                                            <Input
                                                label="Contact Person"
                                                icon={Edit3}
                                                value={formData.contactPerson}
                                                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                                className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft"
                                            />
                                        </div>

                                        <Textarea
                                            label="Brief Description"
                                            placeholder="Tell us about your company..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft h-32"
                                        />

                                        <Input
                                            label="Registered Address"
                                            icon={MapPin}
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="bg-white rounded-[40px] border border-brand-primary/5 shadow-premium overflow-hidden">
                                    <div className="px-10 py-8 border-b border-brand-primary/5 bg-brand-primary/2">
                                        <h2 className="text-xl font-black text-brand-primary tracking-tighter uppercase font-editorial">Contact <span className="text-brand-primary/40">Verification</span></h2>
                                    </div>
                                    <div className="p-10 space-y-10">
                                        {/* Email Card */}
                                        <div className="p-8 bg-brand-primary/2 rounded-[32px] border border-brand-primary/5 flex items-center justify-between group hover:border-brand-primary/20 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-brand-primary shadow-soft">
                                                    <Mail size={24} strokeWidth={2.5} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">Primary Email</p>
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-lg font-black text-brand-primary tracking-tight">{company.email}</h4>
                                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                            <CheckCircle2 size={12} strokeWidth={4} />
                                                            Verified
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={() => dispatch(toggleOtpModal('email'))}
                                                className="rounded-xl px-5 py-3 border-brand-primary-light/20 text-brand-primary hover:bg-brand-primary/5"
                                            >
                                                <span className="font-black uppercase tracking-widest text-[10px]">Change Email</span>
                                            </Button>
                                        </div>

                                        {/* Mobile Card */}
                                        <div className="p-8 bg-brand-primary/2 rounded-[32px] border border-brand-primary/5 flex items-center justify-between group hover:border-brand-primary/20 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-brand-primary shadow-soft">
                                                    <Smartphone size={24} strokeWidth={2.5} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">Mobile Number</p>
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-lg font-black text-brand-primary tracking-tight">{company.mobile}</h4>
                                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                            <CheckCircle2 size={12} strokeWidth={4} />
                                                            Verified
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={() => dispatch(toggleOtpModal('mobile'))}
                                                className="rounded-xl px-5 py-3 border-brand-primary-light/20 text-brand-primary hover:bg-brand-primary/5"
                                            >
                                                <span className="font-black uppercase tracking-widest text-[10px]">Change Number</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-amber-500/5 rounded-[32px] border border-amber-500/10 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                        <Info size={20} strokeWidth={3} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest">About Contact Changes</h4>
                                        <p className="text-[11px] font-bold text-amber-700/60 leading-relaxed">
                                            Updating your email or mobile number requires a multi-step verification process to ensure account security.
                                            Access to your current contact method is required to initiate the change.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <SecureUpdateModal />
        </div>
    );
};

export default ProfilePage;
