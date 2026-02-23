import Input from '../../components/Input';
import Button from '../../components/Button';
import { ArrowLeft, Building2, Globe2, FileText } from 'lucide-react';
import { cn } from '../../utils/cn';

const Step2Company = ({ onNext, onBack, data, updateData }) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Legal Identity */}
            <div className="space-y-5">
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="p-2 rounded-lg bg-brand-primary/8 text-brand-primary">
                        <Building2 size={18} strokeWidth={2} />
                    </div>
                    <h3 className="text-[15px] font-bold text-brand-dark">Legal Identity</h3>
                </div>

                <Input label="Company Legal Name" placeholder="e.g. Acme Corporation Pvt Ltd" icon={Building2}
                    value={data.companyName || ''} onChange={(e) => updateData({ companyName: e.target.value })} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Industry Type" placeholder="e.g. Software & Tech"
                        value={data.industry || ''} onChange={(e) => updateData({ industry: e.target.value })} />
                    <Input label="Website" placeholder="https://acme.org" icon={Globe2}
                        value={data.website || ''} onChange={(e) => updateData({ website: e.target.value })} />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-5 pt-6 border-t border-[#f3f4f6]">
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="p-2 rounded-lg bg-brand-primary/8 text-brand-primary">
                        <FileText size={18} strokeWidth={2} />
                    </div>
                    <h3 className="text-[15px] font-bold text-brand-dark">Company Narrative</h3>
                </div>

                <div className="space-y-2 group/ta">
                    <label className="text-[13px] font-semibold text-[#475467] ml-1 transition-colors group-focus-within/ta:text-brand-primary">
                        About the Company
                    </label>
                    <div className="relative">
                        <textarea
                            className={cn(
                                "w-full min-h-[120px] px-4 py-3.5 bg-white border border-[#e5e7eb] rounded-xl outline-none transition-all duration-200",
                                "placeholder:text-[#9ca3af] text-brand-dark font-medium text-[15px] resize-none",
                                "hover:border-[#d1d5db]",
                                "focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                            )}
                            placeholder="Briefly describe your company's mission and core operations..."
                            value={data.description || ''}
                            onChange={(e) => updateData({ description: e.target.value.slice(0, 500) })}
                        />
                        <span className="absolute bottom-3 right-4 text-[11px] font-medium text-[#9ca3af] tabular-nums">
                            {data.description?.length || 0}/500
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <Button variant="ghost" className="flex-1" onClick={onBack}>
                    <ArrowLeft size={16} className="mr-1.5" /> Back
                </Button>
                <Button size="lg" className="flex-2" onClick={onNext}>Continue</Button>
            </div>
        </div>
    );
};

export default Step2Company;
