import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Eye, EyeOff, User, Mail, ShieldCheck, Phone, Briefcase, ArrowRight } from 'lucide-react';

const Step1Account = ({ onNext, data, updateData }) => {
    const navigate = useNavigate();
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
            {/* Input Cards Row */}
            <div className="bg-brand-primary/2 rounded-[32px] p-8 border border-brand-primary/5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Identity: Full Name" placeholder="Alexander Pierce" icon={User}
                        value={data.contactName || ''} onChange={(e) => updateData({ contactName: e.target.value })} />
                    <Input label="Credential: Job Title" placeholder="Operations Director" icon={Briefcase}
                        value={data.designation || ''} onChange={(e) => updateData({ designation: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Registry: Work Email" placeholder="alex@company.com" type="email" icon={Mail}
                        value={data.email || ''} onChange={(e) => updateData({ email: e.target.value })} />
                    <Input label="Protocol: Phone Number" placeholder="+91 99999 00000" type="tel" icon={Phone}
                        value={data.phone || ''} onChange={(e) => updateData({ phone: e.target.value })} />
                </div>
            </div>

            {/* Password Card */}
            <div className="bg-white rounded-[32px] p-8 border border-brand-primary/5 shadow-soft">
                <Input
                    label="Security: Create Password"
                    placeholder="Min 8 characters required"
                    icon={ShieldCheck}
                    type={showPassword ? 'text' : 'password'}
                    value={data.password || ''}
                    onChange={(e) => updateData({ password: e.target.value })}
                    rightAction={
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="flex items-center justify-center">
                            {showPassword ? <EyeOff size={18} strokeWidth={3} /> : <Eye size={18} strokeWidth={3} />}
                        </button>
                    }
                />

                {data.password && (
                    <div className="mt-6 p-4 bg-brand-primary/2 rounded-2xl border border-brand-primary/5">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">Entropy Analysis</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${strength <= 25 ? 'text-red-500' : strength <= 50 ? 'text-orange-500' : strength <= 75 ? 'text-brand-accent' : 'text-emerald-500'
                                }`}>
                                {strength <= 25 ? 'Critical' : strength <= 50 ? 'Limited' : strength <= 75 ? 'Optimized' : 'Maximum'}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-white rounded-full overflow-hidden flex gap-1">
                            <div className={`h-full rounded-full transition-all duration-500 ${strength >= 25 ? 'bg-red-400 w-1/4' : 'w-0'}`} />
                            <div className={`h-full rounded-full transition-all duration-500 ${strength >= 50 ? 'bg-orange-400 w-1/4' : 'w-0'}`} />
                            <div className={`h-full rounded-full transition-all duration-500 ${strength >= 75 ? 'bg-brand-accent w-1/4' : 'w-0'}`} />
                            <div className={`h-full rounded-full transition-all duration-500 ${strength >= 100 ? 'bg-emerald-500 w-1/4' : 'w-0'}`} />
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="pt-8 border-t border-brand-primary/5 flex items-center justify-between gap-6">
                <Button
                    size="lg"
                    onClick={onNext}
                    className="h-16 px-12 rounded-[24px] bg-brand-primary text-white font-black uppercase tracking-[0.2em] text-xs shadow-premium hover:shadow-hover group"
                >
                    <span className="flex items-center gap-3">
                        Initialize Profile
                        <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </Button>

                <div className="text-right">
                    <p className="text-[10px] font-black text-brand-primary/20 uppercase tracking-widest mb-1">Already Member?</p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm font-black text-brand-primary hover:text-brand-primary-light transition-colors underline underline-offset-8 decoration-brand-primary/10"
                    >
                        Secure Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step1Account;
