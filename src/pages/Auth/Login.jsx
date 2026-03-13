import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { motion } from 'framer-motion';
import { copmanySignInApi } from '../../helper/api';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        
        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await copmanySignInApi(formData);
            
            if (response.status) {
                toast.success(response.message || "Welcome to Oppvia");
                
                // Store authentication critical data
                if (response.data.accessToken) {
                    localStorage.setItem("token", response.data.accessToken);
                    localStorage.setItem("accessToken", response.data.accessToken);
                }
                
                if (response.data.userData) {
                    localStorage.setItem("userData", JSON.stringify(response.data.userData));
                    localStorage.setItem("companyId", response.data.userData.id);
                }

                navigate('/dashboard/overview');
            } else {
                toast.error(response.message || "Authentication failed");
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error || "Invalid credentials. Please verify your access.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#F9FAFB] overflow-hidden">
            {/* Left: Branding Spotlight */}
            <div className="hidden lg:flex w-1/2 relative bg-brand-primary p-16 flex-col justify-between overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-brand-primary-light/20 rounded-full blur-2xl" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 flex items-center gap-3"
                >
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-primary font-black text-2xl shadow-premium">
                        O
                    </div>
                    <span className="text-2xl font-black text-white tracking-tighter">Oppvia</span>
                </motion.div>

                <div className="relative z-10 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 w-fit inline-flex items-center gap-2"
                    >
                        <Sparkles size={16} className="text-white/60" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Premium Talent Ecosystem</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-7xl font-black text-white leading-[0.9] tracking-tighter text-editorial"
                    >
                        Elevating <br />
                        <span className="text-white/40 italic">The Future</span> <br />
                        Of Recruitment
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-white/60 font-bold max-w-md leading-relaxed"
                    >
                        Discover, manage, and scale your workforce with the world's most sophisticated recruitment platform.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative z-10 pt-10 border-t border-white/10"
                >
                    <div className="flex gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden">
                                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        <div className="flex flex-col justify-center">
                            <p className="text-xs font-black text-white tracking-widest uppercase">Trusted by 500+</p>
                            <p className="text-[10px] font-bold text-white/40 uppercase">Global Enterprises</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right: Interaction Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-20 relative text-black">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-[480px] space-y-12"
                >
                    <div className="space-y-4">
                        <div className="w-14 h-1 px-4 bg-brand-primary/10 rounded-full mb-10 hidden lg:block" />
                        <h1 className="text-5xl font-black text-brand-primary tracking-tighter font-editorial">
                            Welcome <span className="text-brand-primary/30">Back</span>
                        </h1>
                        <p className="text-sm font-bold text-brand-primary/40 leading-relaxed max-w-sm">
                            Enter your credentials to access your administrative dashboard and premium talent pool.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 text-black">
                            <Input
                                label="Official Email"
                                placeholder="name@company.com"
                                type="email"
                                icon={Mail}
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                error={errors.email}
                            />
                        </div>

                        <div className="space-y-2 text-black">
                            <Input
                                label="Security Code"
                                placeholder="••••••••"
                                type={showPassword ? 'text' : 'password'}
                                icon={Lock}
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                error={errors.password}
                                rightAction={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="flex items-center justify-center"
                                    >
                                        {showPassword ? <EyeOff size={18} strokeWidth={3} /> : <Eye size={18} strokeWidth={3} />}
                                    </button>
                                }
                            />
                            <div className="flex justify-end pt-2">
                                <button type="button" className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest hover:text-brand-primary transition-colors">
                                    Forgot Access Code?
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-16 rounded-[24px] bg-brand-primary text-white font-black uppercase tracking-[0.2em] text-xs shadow-premium hover:shadow-hover group"
                            isLoading={isLoading}
                        >
                            <span className="flex items-center justify-center gap-3">
                                {isLoading ? 'Verifying...' : 'Authenticate Access'}
                                {!isLoading && <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />}
                            </span>
                        </Button>
                    </form>

                    <div className="pt-8 border-t border-brand-primary/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col">
                            <p className="text-[10px] font-black text-brand-primary/20 uppercase tracking-widest mb-1">New to Oppvia?</p>
                            <button
                                onClick={() => navigate('/register')}
                                className="text-sm font-black text-brand-primary flex items-center gap-2 group outline-none"
                            >
                                Create Recruiter Profile
                                <div className="w-5 h-5 rounded-full bg-brand-primary/5 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all shadow-soft group-focus:ring-2 group-focus:ring-brand-primary/20">
                                    <ArrowRight size={10} strokeWidth={4} />
                                </div>
                            </button>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-[10px] font-black text-brand-primary/20 uppercase tracking-widest mb-1">Security Standards</p>
                            <p className="text-[10px] font-bold text-brand-primary/40 max-w-[140px]">AES-256 encrypted access & identity verification.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Mobile Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl lg:hidden -z-10" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-primary-light/5 rounded-full blur-2xl lg:hidden -z-10" />
            </div>
        </div>
    );
};

export default Login;
