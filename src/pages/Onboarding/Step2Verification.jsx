import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { ShieldCheck, RefreshCcw, Lock } from 'lucide-react';

const OtpGroup = ({ label, value, type, target, onChange, onKeyDown, timeLeft, canResend, onResend }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-end">
            <div>
                <p className="text-[13px] font-semibold text-[#475467] mb-1">{label}</p>
                <span className="text-xs text-[#9ca3af] bg-[#f9fafb] border border-[#e5e7eb] px-2 py-0.5 rounded-md">{target}</span>
            </div>
            <div className="flex items-center gap-2">
                {canResend ? (
                    <button onClick={onResend} className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1">
                        <RefreshCcw size={12} /> Resend
                    </button>
                ) : (
                    <span className="text-xs text-[#9ca3af] font-medium tabular-nums">00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
                )}
            </div>
        </div>

        <div className="flex gap-2.5">
            {value.map((digit, idx) => (
                <input key={idx} name={`${type}-otp-${idx}`} type="text" inputMode="numeric"
                    value={digit} autoComplete="one-time-code"
                    onChange={(e) => onChange(idx, e.target.value, type)}
                    onKeyDown={(e) => onKeyDown(e, idx, type)}
                    className="w-full aspect-square text-center text-xl font-bold text-brand-dark bg-white border border-[#e5e7eb] rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all"
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
        setTimers(prev => ({ ...prev, [type]: { timeLeft: 60, canResend: false } }));
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center gap-2.5 mb-1">
                <div className="p-2 rounded-lg bg-brand-primary/8 text-brand-primary">
                    <ShieldCheck size={18} strokeWidth={2} />
                </div>
                <h3 className="text-[15px] font-bold text-brand-dark">Verification Codes</h3>
            </div>

            <div className="space-y-8">
                <OtpGroup label="Email Verification" target={data.email || 'alex@company.com'}
                    value={emailOtp} type="email" onChange={handleOtpChange} onKeyDown={handleKeyDown}
                    timeLeft={timers.email.timeLeft} canResend={timers.email.canResend} onResend={() => handleResend('email')} />

                <OtpGroup label="Phone Verification" target={data.phone || '+91 99999 00000'}
                    value={phoneOtp} type="phone" onChange={handleOtpChange} onKeyDown={handleKeyDown}
                    timeLeft={timers.phone.timeLeft} canResend={timers.phone.canResend} onResend={() => handleResend('phone')} />
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-xl">
                <Lock size={16} className="text-brand-primary mt-0.5 shrink-0" />
                <p className="text-xs text-[#667085] leading-relaxed">
                    Codes are valid for 10 minutes. If you don't receive a code, check your spam folder or verify the contact details.
                </p>
            </div>

            <div className="flex gap-3 pt-4">
                <Button variant="ghost" className="flex-1" onClick={onBack}>Back</Button>
                <Button size="lg" className="flex-2" onClick={onNext}>Verify & Continue</Button>
            </div>
        </div>
    );
};

export default Step2Verification;
