import React from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { ArrowLeft, Share2, Linkedin, Instagram, Youtube, HelpCircle } from 'lucide-react';

const Step4Socials = ({ onNext, onBack, data, updateData }) => {
    return (
        <div className="space-y-10">
            {/* Section: Digital Footprint */}
            <div className="space-y-8">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-lg bg-brand-primary/5 text-brand-primary">
                        <Share2 size={18} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-base font-bold text-[#101828]">Omni-channel Presence</h3>
                </div>

                <div className="space-y-6">
                    <div className="relative group/social">
                        <Input
                            label="LinkedIn Organization URL"
                            placeholder="linkedin.com/company/acme"
                            icon={Linkedin}
                            value={data.linkedin || ''}
                            onChange={(e) => updateData({ linkedin: e.target.value })}
                        />
                        <div className="absolute right-0 top-0 h-10 flex items-center pr-1">
                            <div className="px-2 py-0.5 rounded-md bg-[#f2f4f7] text-[9px] font-black text-[#667085] uppercase tracking-wider border border-[#eaecf0]">Recommended</div>
                        </div>
                    </div>

                    <Input
                        label="Instagram Handle"
                        placeholder="@acme_corp"
                        icon={Instagram}
                        value={data.instagram || ''}
                        onChange={(e) => updateData({ instagram: e.target.value })}
                    />

                    <Input
                        label="YouTube Channel"
                        placeholder="youtube.com/c/acmecorp"
                        icon={Youtube}
                        value={data.youtube || ''}
                        onChange={(e) => updateData({ youtube: e.target.value })}
                    />
                </div>
            </div>

            {/* Verification Tip */}
            <div className="p-5 bg-brand-primary/[0.03] border border-brand-primary/10 rounded-2xl flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-brand-primary/10 flex items-center justify-center text-brand-primary shadow-sm shrink-0">
                    <HelpCircle size={20} strokeWidth={2.5} />
                </div>
                <div className="space-y-1.5 pt-0.5">
                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Why Provide This?</p>
                    <p className="text-xs text-[#667085] font-medium leading-relaxed">
                        Linking your digital profiles accelerates the verification process by up to 48 hours and increases your trust score with potential partners.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button variant="ghost" className="flex-1 order-2 sm:order-1" onClick={onBack}>
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </Button>
                <Button size="lg" className="flex-[2] order-1 sm:order-2 shadow-[0_12px_24px_-8px_rgba(12,165,165,0.4)]" onClick={onNext}>
                    Complete Registration
                </Button>
            </div>
        </div>
    );
};

export default Step4Socials;
