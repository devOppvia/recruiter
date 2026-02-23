import React, { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Eye, EyeOff, User, Mail, ShieldCheck } from 'lucide-react';

const Step1Account = ({ onNext, data, updateData }) => {
    const [showPassword, setShowPassword] = useState(false);

    const checkPasswordStrength = (pass) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length > 8) score += 25;
        if (/[A-Z]/.test(pass)) score += 25;
        if (/[0-9]/.test(pass)) score += 25;
        if (/[^A-Za-z0-9]/.test(pass)) score += 25;
        return score;
    };

    const strength = checkPasswordStrength(data.password);

    return (
        <div className="space-y-10">
            {/* Section: Representative */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-lg bg-brand-primary/5 text-brand-primary">
                        <User size={18} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-base font-bold text-[#101828]">Direct Contact</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                        label="Full Name"
                        placeholder="e.g. Alexander Pierce"
                        value={data.contactName || ''}
                        onChange={(e) => updateData({ contactName: e.target.value })}
                    />
                    <Input
                        label="Job Title"
                        placeholder="e.g. Operations Director"
                        value={data.designation || ''}
                        onChange={(e) => updateData({ designation: e.target.value })}
                    />
                </div>
                <Input
                    label="Phone Number"
                    placeholder="+91 99999 00000"
                    type="tel"
                    value={data.phone || ''}
                    onChange={(e) => updateData({ phone: e.target.value })}
                />
            </div>

            {/* Section: Credentials */}
            <div className="space-y-6 pt-6 border-t border-[#f2f4f7]">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-lg bg-brand-primary/5 text-brand-primary">
                        <ShieldCheck size={18} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-base font-bold text-[#101828]">Security Detail</h3>
                </div>

                <Input
                    label="Work Email"
                    placeholder="alex@company.com"
                    type="email"
                    icon={Mail}
                    value={data.email || ''}
                    onChange={(e) => updateData({ email: e.target.value })}
                />

                <div className="relative">
                    <Input
                        label="Create Password"
                        placeholder="Min 8 characters"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password || ''}
                        onChange={(e) => updateData({ password: e.target.value })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-[42px] text-[#98a2b3] hover:text-brand-primary transition-colors focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={20} strokeWidth={2.2} /> : <Eye size={20} strokeWidth={2.2} />}
                    </button>

                    {/* Modern Password Strength UI */}
                    {data.password && (
                        <div className="mt-3 px-1">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[10px] font-black uppercase tracking-wider text-[#667085]">Security Strength</span>
                                <span className={`text-[10px] font-black uppercase tracking-wider ${strength <= 25 ? 'text-red-500' : strength <= 50 ? 'text-orange-500' : strength <= 75 ? 'text-blue-500' : 'text-emerald-500'
                                    }`}>
                                    {strength <= 25 ? 'Weak' : strength <= 50 ? 'Fair' : strength <= 75 ? 'Good' : 'Strong'}
                                </span>
                            </div>
                            <div className="h-1 w-full bg-[#f2f4f7] rounded-full overflow-hidden flex gap-1">
                                <div className={`h-full transition-all duration-500 rounded-full ${strength >= 25 ? 'bg-red-500 w-1/4' : 'w-0'}`} />
                                <div className={`h-full transition-all duration-500 rounded-full ${strength >= 50 ? 'bg-orange-500 w-1/4' : 'w-0'}`} />
                                <div className={`h-full transition-all duration-500 rounded-full ${strength >= 75 ? 'bg-blue-500 w-1/4' : 'w-0'}`} />
                                <div className={`h-full transition-all duration-500 rounded-full ${strength >= 100 ? 'bg-emerald-500 w-1/4' : 'w-0'}`} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-4">
                <Button size="lg" className="w-full shadow-lg shadow-brand-primary/20" onClick={onNext}>
                    Continue to Company Profile
                </Button>
                <p className="text-center text-sm text-[#667085] mt-6 font-medium">
                    Already registered? <button className="text-brand-primary font-bold hover:underline">Log in now</button>
                </p>
            </div>
        </div>
    );
};

export default Step1Account;
