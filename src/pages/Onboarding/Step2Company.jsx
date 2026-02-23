import React from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { ArrowLeft, Building2, Globe2, FileText } from 'lucide-react';
import { cn } from '../../utils/cn';

const Step2Company = ({ onNext, onBack, data, updateData }) => {
    return (
        <div className="space-y-10">
            {/* Section: Core Identity */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-lg bg-brand-primary/5 text-brand-primary">
                        <Building2 size={18} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-base font-bold text-[#101828]">Legal Identity</h3>
                </div>

                <Input
                    label="Company Legal Name"
                    placeholder="e.g. Acme Corporation Pvt Ltd"
                    value={data.companyName || ''}
                    onChange={(e) => updateData({ companyName: e.target.value })}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                        label="Industry Type"
                        placeholder="e.g. Logistics & Supply"
                        value={data.industry || ''}
                        onChange={(e) => updateData({ industry: e.target.value })}
                    />
                    <Input
                        label="Website"
                        placeholder="https://acme.org"
                        icon={Globe2}
                        value={data.website || ''}
                        onChange={(e) => updateData({ website: e.target.value })}
                    />
                </div>
            </div>

            {/* Section: Description */}
            <div className="space-y-6 pt-6 border-t border-[#f2f4f7]">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-lg bg-brand-primary/5 text-brand-primary">
                        <FileText size={18} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-base font-bold text-[#101828]">Company Narrative</h3>
                </div>

                <div className="space-y-2 group/container">
                    <label className="text-sm font-semibold text-[#344054] ml-1 transition-colors group-focus-within/container:text-brand-primary">
                        About the Company
                    </label>
                    <div className="relative">
                        <textarea
                            className={cn(
                                "w-full min-h-[140px] px-4 py-3 bg-white border border-[#eaecf0] rounded-xl outline-hidden transition-all duration-300",
                                "placeholder:text-[#98a2b3] text-[#101828] font-medium text-[0.9375rem] resize-none",
                                "hover:border-[#d0d5dd] hover:bg-[#fcfcfd]",
                                "focus:border-brand-primary focus:bg-white focus:ring-[4px] focus:ring-brand-primary/[0.08] focus:shadow-[0_2px_4px_rgba(12,165,165,0.05)]"
                            )}
                            placeholder="Briefly describe your company's mission and core operations..."
                            value={data.description || ''}
                            onChange={(e) => updateData({ description: e.target.value.slice(0, 500) })}
                        />
                        <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
                            <div className="h-1 w-16 bg-[#f2f4f7] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-brand-primary transition-all duration-300"
                                    style={{ width: `${(data.description?.length || 0) / 5}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-[#98a2b3]">
                                {data.description?.length || 0}/500
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button variant="ghost" className="flex-1 order-2 sm:order-1" onClick={onBack}>
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </Button>
                <Button size="lg" className="flex-[2] order-1 sm:order-2 shadow-lg shadow-brand-primary/20" onClick={onNext}>
                    Continue to Location
                </Button>
            </div>
        </div>
    );
};

export default Step2Company;
