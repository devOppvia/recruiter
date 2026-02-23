import { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Mail, Lock, Eye, EyeOff, Github } from 'lucide-react';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-end relative overflow-hidden">

            {/* Full-page background image */}
            <img
                src="/images/login_3d_illustration_1771844210617.png"
                alt="3D Illustration"
                className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Subtle overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/40 via-transparent to-white/80" />

            {/* Right-aligned Floating Form Panel */}
            <div className="relative z-10 w-full max-w-[540px] bg-white rounded-3xl m-6 lg:m-10 p-10 lg:p-14 flex flex-col justify-center shadow-2xl">
                {/* Logo */}
                <div className="mb-10">
                    <div className="flex items-center gap-2.5 mb-8">
                        <div className="w-9 h-9 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold text-lg">O</div>
                        <span className="text-xl font-bold text-brand-dark tracking-tight">Oppvia</span>
                    </div>
                    <h1 className="text-4xl font-bold text-brand-dark leading-tight">Create account</h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        placeholder="Email address"
                        type="email"
                        icon={Mail}
                        required
                    />
                    <div className="relative">
                        <Input
                            placeholder="Password"
                            type={showPassword ? 'text' : 'password'}
                            icon={Lock}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-brand-primary transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                        Create account
                    </Button>
                </form>

                {/* Social Login */}
                {/* <div className="mt-8">
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e5e7eb]"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="bg-white px-3 text-[#9ca3af]">or sign up with</span></div>
                    </div>

                    <div className="flex justify-center gap-3">
                        <button className="w-12 h-12 flex items-center justify-center border border-[#e5e7eb] rounded-xl text-[#475467] hover:bg-[#f9fafb] hover:border-brand-primary/30 transition-all text-sm font-bold">
                            G
                        </button>
                        <button className="w-12 h-12 flex items-center justify-center border border-[#e5e7eb] rounded-xl text-[#475467] hover:bg-[#f9fafb] hover:border-brand-primary/30 transition-all">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" /></svg>
                        </button>
                        <button className="w-12 h-12 flex items-center justify-center border border-[#e5e7eb] rounded-xl text-[#475467] hover:bg-[#f9fafb] hover:border-brand-primary/30 transition-all">
                            <Github size={18} />
                        </button>
                    </div>
                </div> */}

                {/* Terms & Login Link */}
                <p className="mt-6 text-center text-xs text-[#667085] leading-relaxed">
                    By creating an account you agree to Oppvia's<br />
                    <button className="text-brand-primary font-semibold hover:underline">Terms of Services</button> and <button className="text-brand-primary font-semibold hover:underline">Privacy Policy</button>.
                </p>

                <p className="mt-6 text-center text-sm text-[#667085]">
                    Have an account? <button className="text-brand-primary font-semibold hover:underline">Log in</button>
                </p>
            </div>
        </div>
    );
};

export default Login;
