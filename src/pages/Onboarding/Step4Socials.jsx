import Input from '../../components/Input';
import Button from '../../components/Button';
import { ArrowLeft, Share2, Linkedin, Instagram, Youtube, HelpCircle, CheckCircle2 } from 'lucide-react';

const Step4Socials = ({ onNext, onBack, data, updateData }) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Social Links */}
            <div className="space-y-5">
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="p-2 rounded-lg bg-brand-primary/8 text-brand-primary">
                        <Share2 size={18} strokeWidth={2} />
                    </div>
                    <h3 className="text-[15px] font-bold text-brand-dark">Social Presence</h3>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <Input label="LinkedIn Organization URL" placeholder="linkedin.com/company/acme" icon={Linkedin}
                            value={data.linkedin || ''} onChange={(e) => updateData({ linkedin: e.target.value })} />
                        <div className="absolute right-0 top-0">
                            <span className="text-[10px] font-semibold text-brand-primary bg-brand-primary/8 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <CheckCircle2 size={10} /> Recommended
                            </span>
                        </div>
                    </div>

                    <Input label="Instagram Handle" placeholder="@acme_corp" icon={Instagram}
                        value={data.instagram || ''} onChange={(e) => updateData({ instagram: e.target.value })} />

                    <Input label="YouTube Channel" placeholder="youtube.com/c/acmecorp" icon={Youtube}
                        value={data.youtube || ''} onChange={(e) => updateData({ youtube: e.target.value })} />
                </div>
            </div>

            {/* Tip */}
            <div className="flex items-start gap-3 p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-xl">
                <HelpCircle size={16} className="text-brand-primary mt-0.5 shrink-0" />
                <p className="text-xs text-[#667085] leading-relaxed">
                    Linking your social profiles accelerates the verification process and increases your trust score with potential partners.
                </p>
            </div>

            <div className="flex gap-3 pt-4">
                <Button variant="ghost" className="flex-1" onClick={onBack}>
                    <ArrowLeft size={16} className="mr-1.5" /> Back
                </Button>
                <Button size="lg" className="flex-2" onClick={onNext}>Complete Registration</Button>
            </div>
        </div>
    );
};

export default Step4Socials;
