import { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCcw, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../../components/Button';

const OtpGroup = ({ label, value, type, target, onChange, onKeyDown, timeLeft, canResend, onResend }) => (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    {type === 'email' ? <Lock size={16} strokeWidth={3} /> : <ShieldCheck size={16} strokeWidth={3} />}
                </div>
                <div>
                    <h4 className="text-[13px] font-black text-brand-primary uppercase tracking-widest">{label}</h4>
                    <p className="text-[11px] font-bold text-brand-primary/40 truncate max-w-[200px]">{target}</p>
                </div>
            </div>
            <div className="flex items-center self-end sm:self-auto shrink-0">
                {canResend ? (
                    <button
                        onClick={onResend}
                        className="text-[10px] font-black text-brand-primary hover:text-brand-primary-light flex items-center gap-1.5 uppercase tracking-widest bg-brand-primary/5 px-4 py-2 rounded-xl border border-brand-primary/10 transition-all"
                    >
                        <RefreshCcw size={12} strokeWidth={3} /> Resend Access Code
                    </button>
                ) : (
                    <div className="flex items-center gap-2 bg-brand-primary/5 px-4 py-2 rounded-xl border border-brand-primary/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                        <span className="text-[10px] font-black text-brand-primary tabular-nums uppercase tracking-widest">
                            New Code in 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                        </span>
                    </div>
                )}
            </div>
        </div>

        <div className="flex gap-3 justify-between">
            {value.map((digit, idx) => (
                <input
                    key={idx}
                    name={`${type}-otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    autoComplete="one-time-code"
                    onChange={(e) => onChange(idx, e.target.value, type)}
                    onKeyDown={(e) => onKeyDown(e, idx, type)}
                    className="w-full aspect-square max-w-[62px] text-center text-2xl font-black text-brand-primary bg-brand-primary/5 border border-brand-primary/10 rounded-2xl focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all duration-300"
                />
            ))}
        </div>
    </div>
);

const Step2Verification = ({ onNext, onBack, data }) => {
    const [timers, setTimers] = useState({
        email: { timeLeft: 60, canResend: false },
        phone: { timeLeft: 60, canResend: false }
    });
    const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
    const [phoneOtp, setPhoneOtp] = useState(['', '', '', '', '', '']);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimers(prev => {
                const next = { ...prev };
                let changed = false;
                ['email', 'phone'].forEach(type => {
                    if (next[type].timeLeft > 0) {
                        next[type] = { ...next[type], timeLeft: next[type].timeLeft - 1 };
                        changed = true;
                    } else if (!next[type].canResend) {
                        next[type] = { ...next[type], canResend: true };
                        changed = true;
                    }
                });
                return changed ? next : prev;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleOtpChange = (index, value, type) => {
        if (!/^\d*$/.test(value)) return;
        const setOtp = type === 'email' ? setEmailOtp : setPhoneOtp;
        const otp = type === 'email' ? emailOtp : phoneOtp;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) {
            document.querySelector(`input[name="${type}-otp-${index + 1}"]`)?.focus();
        }
    };

    const handleKeyDown = (e, index, type) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            document.querySelector(`input[name="${type}-otp-${index - 1}"]`)?.focus();
        }
    };

    const handleResend = (type) => {
        handleOtpChange(0, '', type); // Real world: trigger API
        setTimers(prev => ({ ...prev, [type]: { timeLeft: 60, canResend: false } }));
    };

    return (
        <div className="space-y-12">
            <OtpGroup
                label="Digital Identity Token"
                target={data.email || 'alex@company.com'}
                value={emailOtp}
                type="email"
                onChange={handleOtpChange}
                onKeyDown={handleKeyDown}
                timeLeft={timers.email.timeLeft}
                canResend={timers.email.canResend}
                onResend={() => handleResend('email')}
            />

            <div className="h-px bg-brand-primary/5 w-full" />

            <OtpGroup
                label="Mobile Device Link"
                target={data.phone || '+91 99999 00000'}
                value={phoneOtp}
                type="phone"
                onChange={handleOtpChange}
                onKeyDown={handleKeyDown}
                timeLeft={timers.phone.timeLeft}
                canResend={timers.phone.canResend}
                onResend={() => handleResend('phone')}
            />

            {/* Info Spotlight */}
            <div className="flex items-start gap-4 p-6 bg-brand-primary/2 border border-brand-primary/5 rounded-[32px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -z-10" />
                <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                    <Lock size={20} strokeWidth={3} />
                </div>
                <div className="space-y-1">
                    <h5 className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Protocol Intelligence</h5>
                    <p className="text-[11px] font-bold text-brand-primary/40 leading-relaxed max-w-sm">
                        Verification tokens expire in 10 cycles. Multi-layer encryption ensures your communication remains strictly confidential within the Oppvia ecosystem.
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-8 border-t border-brand-primary/5 flex items-center justify-between gap-4">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="h-14 px-8 rounded-2xl text-brand-primary/40 font-black uppercase tracking-widest text-[10px] hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
                >
                    <span className="flex items-center gap-2">
                        <ArrowLeft size={16} strokeWidth={3} />
                        Identity Shift
                    </span>
                </Button>
                <Button
                    size="lg"
                    onClick={onNext}
                    className="h-14 px-10 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs shadow-premium hover:shadow-hover group"
                >
                    <span className="flex items-center gap-3">
                        Secure Verification
                        <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default Step2Verification;
