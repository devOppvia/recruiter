import { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Eye, EyeOff, User, Mail, ShieldCheck, Phone } from 'lucide-react';

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
        <div className="space-y-8 animate-fadeIn">
            {/* Representative Info */}
            <div className="space-y-5">
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="p-2 rounded-lg bg-brand-primary/8 text-brand-primary">
                        <User size={18} strokeWidth={2} />
                    </div>
                    <h3 className="text-[15px] font-bold text-brand-dark">Direct Contact</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Full Name" placeholder="e.g. Alexander Pierce" icon={User}
                        value={data.contactName || ''} onChange={(e) => updateData({ contactName: e.target.value })} />
                    <Input label="Job Title" placeholder="e.g. Operations Director"
                        value={data.designation || ''} onChange={(e) => updateData({ designation: e.target.value })} />
                </div>
                <Input label="Phone Number" placeholder="+91 99999 00000" type="tel" icon={Phone}
                    value={data.phone || ''} onChange={(e) => updateData({ phone: e.target.value })} />
            </div>

            {/* Credentials */}
            <div className="space-y-5 pt-6 border-t border-[#f3f4f6]">
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="p-2 rounded-lg bg-brand-primary/8 text-brand-primary">
                        <ShieldCheck size={18} strokeWidth={2} />
                    </div>
                    <h3 className="text-[15px] font-bold text-brand-dark">Security Detail</h3>
                </div>

                <Input label="Work Email" placeholder="alex@company.com" type="email" icon={Mail}
                    value={data.email || ''} onChange={(e) => updateData({ email: e.target.value })} />

                <div className="relative">
                    <Input label="Create Password" placeholder="Min 8 characters" icon={ShieldCheck}
                        type={showPassword ? 'text' : 'password'}
                        value={data.password || ''} onChange={(e) => updateData({ password: e.target.value })} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-[42px] text-[#9ca3af] hover:text-brand-primary transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>

                    {data.password && (
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[11px] font-semibold text-[#667085]">Password strength</span>
                                <span className={`text-[11px] font-bold ${strength <= 25 ? 'text-red-500' : strength <= 50 ? 'text-orange-500' : strength <= 75 ? 'text-brand-accent' : 'text-emerald-500'
                                    }`}>
                                    {strength <= 25 ? 'Weak' : strength <= 50 ? 'Fair' : strength <= 75 ? 'Good' : 'Strong'}
                                </span>
                            </div>
                            <div className="h-1 w-full bg-[#f3f4f6] rounded-full overflow-hidden flex gap-0.5">
                                <div className={`h-full rounded-full transition-all duration-300 ${strength >= 25 ? 'bg-red-400 w-1/4' : 'w-0'}`} />
                                <div className={`h-full rounded-full transition-all duration-300 ${strength >= 50 ? 'bg-orange-400 w-1/4' : 'w-0'}`} />
                                <div className={`h-full rounded-full transition-all duration-300 ${strength >= 75 ? 'bg-brand-accent w-1/4' : 'w-0'}`} />
                                <div className={`h-full rounded-full transition-all duration-300 ${strength >= 100 ? 'bg-emerald-500 w-1/4' : 'w-0'}`} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-4">
                <Button size="lg" className="w-full" onClick={onNext}>
                    Continue
                </Button>
                <p className="text-center text-sm text-[#667085] mt-5">
                    Already registered? <button className="text-brand-primary font-semibold hover:underline">Log in now</button>
                </p>
            </div>
        </div>
    );
};

export default Step1Account;
