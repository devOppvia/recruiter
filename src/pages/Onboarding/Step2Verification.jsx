import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { ShieldCheck, RefreshCcw, CheckCircle2 } from 'lucide-react';

const OtpGroup = ({ label, value, type, target, onChange, onKeyDown, timeLeft, canResend, onResend }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-end">
            <div className="space-y-1">
                <p className="text-sm font-semibold text-[#344054]">{label}</p>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-[#667085] font-medium">{target}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-brand-primary uppercase tracking-wider">
                        <CheckCircle2 size={12} />
                        Sent
                    </div>
                </div>
            </div>
            {/* Contextual Resend Logic */}
            <div className="flex items-center gap-3 px-3 py-1.5 bg-[#f9fafb] rounded-lg border border-[#eaecf0]">
                {canResend ? (
                    <button
                        onClick={onResend}
                        className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-[0.05em] hover:underline"
                    >
                        <RefreshCcw size={12} />
                        Resend Code
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <RefreshCcw size={12} className="text-[#98a2b3] animate-spin-slow duration-[3s]" />
                        <span className="text-[10px] font-bold text-[#667085] tabular-nums">
                            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                        </span>
                    </div>
                )}
            </div>
        </div>
        <div className="flex gap-2.5">
            {value.map((digit, idx) => (
                <input
                    key={idx}
                    name={`${type}-otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => onChange(idx, e.target.value, type)}
                    onKeyDown={(e) => onKeyDown(e, idx, type)}
                    className="w-full aspect-square text-center text-xl font-bold text-[#101828] bg-white border border-[#eaecf0] rounded-xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all"
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
            const nextInput = document.querySelector(`input[name="${type}-otp-${index + 1}"]`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (e, index, type) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            const prevInput = document.querySelector(`input[name="${type}-otp-${index - 1}"]`);
            prevInput?.focus();
        }
    };

    const handleResend = (type) => {
        setTimers(prev => ({
            ...prev,
            [type]: { timeLeft: 60, canResend: false }
        }));
        // API call logic for specific type would go here
    };

    return (
        <div className="space-y-12 animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-brand-primary/5 text-brand-primary">
                    <ShieldCheck size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-[#101828]">Identity Verification</h3>
            </div>

            <div className="space-y-10">
                <OtpGroup
                    label="Email OTP Verification"
                    target={data.email || 'alex@company.com'}
                    value={emailOtp}
                    type="email"
                    onChange={handleOtpChange}
                    onKeyDown={handleKeyDown}
                    timeLeft={timers.email.timeLeft}
                    canResend={timers.email.canResend}
                    onResend={() => handleResend('email')}
                />

                <OtpGroup
                    label="Phone OTP Verification"
                    target={data.phone || '+91 99999 00000'}
                    value={phoneOtp}
                    type="phone"
                    onChange={handleOtpChange}
                    onKeyDown={handleKeyDown}
                    timeLeft={timers.phone.timeLeft}
                    canResend={timers.phone.canResend}
                    onResend={() => handleResend('phone')}
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button variant="ghost" className="flex-1 order-2 sm:order-1 font-bold" onClick={onBack}>
                    Change Details
                </Button>
                <Button size="lg" className="flex-[2] order-1 sm:order-2 shadow-[0_12px_24px_-8px_rgba(12,165,165,0.4)]" onClick={onNext}>
                    Verify & Continue
                </Button>
            </div>

            <div className="flex items-start gap-3 p-5 bg-brand-primary/[0.03] border border-brand-primary/10 rounded-2xl">
                <div className="w-8 h-8 rounded-lg bg-white border border-brand-primary/10 flex items-center justify-center text-brand-primary shadow-sm shrink-0 mt-0.5">
                    <ShieldCheck size={16} strokeWidth={2.5} />
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.1em]">Instant Security</p>
                    <p className="text-xs text-[#667085] font-medium leading-relaxed">
                        Verification codes expire after 10 minutes. If you don't receive the code, please check your spam folder or try the resend button.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Step2Verification;
