import { useState } from 'react';
import { Linkedin, Instagram, Youtube, HelpCircle, CheckCircle2, ArrowRight, ArrowLeft, Share2, Globe } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { companyCreateAccountStep4Api } from '../../helper/api';
import toast from 'react-hot-toast';

const Step4Socials = ({ onNext, onBack, data, updateData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        // LinkedIn is required
        if (!data.linkedin) {
            newErrors.linkedin = "LinkedIn is required";
        } else if (!data.linkedin.toLowerCase().includes('linkedin.com')) {
            newErrors.linkedin = "Invalid LinkedIn URL";
        }

        // Instagram is optional but checked if present
        if (data.instagram && !data.instagram.toLowerCase().includes('instagram.com')) {
            newErrors.instagram = "Invalid Instagram URL";
        }

        // YouTube is optional but checked if present
        if (data.youtube && !data.youtube.toLowerCase().includes('youtube.com')) {
            newErrors.youtube = "Invalid YouTube URL";
        }

        // Website is optional
        // if (data.website && (!data.website.includes('.') || data.website.length < 5)) {
        //     newErrors.website = "Invalid Website URL";
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Please provide valid URLs");
            return;
        }

        setIsLoading(true);
        const companyId = localStorage.getItem("companyId");

        try {
            const payload = {
                id: companyId,
                linkdinUrl: data.linkedin,
                instagramUrl: data.instagram || "",
                youtubeUrl: data.youtube || "",
            };

            const response = await companyCreateAccountStep4Api(payload);

            if (response.status) {
                toast.success(response.message || "Ecosystem finalized successfully");
                localStorage.setItem("currentStep", "6"); // Finishing Step 5 (Wizard step numbers might vary)
                localStorage.removeItem("formData", JSON.stringify(data));
                onNext();
            }
        } catch (error) {
            console.error("Step 4 Error:", error);
            toast.error(error || "Submission failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* Form Section: Digital Footprint */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <Share2 size={16} strokeWidth={3} />
                    </div>
                    <h3 className="text-lg font-black text-brand-primary tracking-tighter">Digital Footprint</h3>
                </div>

                <div className="space-y-6">
                    <div className="relative group/social">
                        <Input
                            label="LinkedIn Organization URL"
                            placeholder="linkedin.com/company/acme"
                            icon={Linkedin}
                            value={data.linkedin || ''}
                            error={errors.linkedin}
                            onChange={(e) => updateData({ linkedin: e.target.value })}
                            className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 pl-14 shadow-soft"
                        />
                        {!errors.linkedin && data.linkedin && (
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 mt-3">
                                <span className="text-[10px] font-black text-white bg-green-500 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-soft">
                                    <CheckCircle2 size={10} strokeWidth={3} /> Verified
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Instagram URL"
                            placeholder="instagram.com/acme_corp"
                            icon={Instagram}
                            value={data.instagram || ''}
                            error={errors.instagram}
                            onChange={(e) => updateData({ instagram: e.target.value })}
                            className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 pl-14 shadow-soft"
                        />
                        <Input
                            label="YouTube Channel URL"
                            placeholder="youtube.com/c/acmecorp"
                            icon={Youtube}
                            value={data.youtube || ''}
                            error={errors.youtube}
                            onChange={(e) => updateData({ youtube: e.target.value })}
                            className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 pl-14 shadow-soft"
                        />
                    </div>

                    {/* <Input
                        label="Corporate Website"
                        placeholder="https://acmecorp.com"
                        icon={Globe}
                        value={data.website || ''}
                        error={errors.website}
                        onChange={(e) => updateData({ website: e.target.value })}
                        className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 pl-14 shadow-soft"
                    /> */}
                </div>
            </div>

            {/* Insight Spotlight */}
            <div className="flex items-start gap-4 p-6 bg-brand-primary/2 border border-brand-primary/5 rounded-[32px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -z-10" />
                <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                    <HelpCircle size={20} strokeWidth={3} />
                </div>
                <div className="space-y-1">
                    <h5 className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Ecosystem Trust</h5>
                    <p className="text-[11px] font-bold text-brand-primary/40 leading-relaxed max-w-sm">
                        Authenticating your social presence accelerates the validation cycle and exponentially increases your authority score within our elite talent marketplace.
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-8 border-t border-brand-primary/5 flex items-center justify-between gap-4">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    disabled={isLoading}
                    className="h-14 px-8 rounded-2xl text-brand-primary/40 font-black uppercase tracking-widest text-[10px] hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
                >
                    <span className="flex items-center gap-2">
                        <ArrowLeft size={16} strokeWidth={3} />
                        Identity Refinement
                    </span>
                </Button>
                <Button
                    size="lg"
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    className="h-14 px-10 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs shadow-premium hover:shadow-hover group"
                >
                    <span className="flex items-center gap-3">
                        Finalize Ecosystem Link
                        <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default Step4Socials;
