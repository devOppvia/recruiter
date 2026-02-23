import { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { MapPin, Navigation, ArrowLeft, Search, Edit3, Fingerprint, Globe } from 'lucide-react';

const Step3Location = ({ onNext, onBack, data, updateData }) => {
    const [isManualEdit, setIsManualEdit] = useState(false);

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Headquarters */}
            <div className="space-y-5">
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="p-2 rounded-lg bg-brand-primary/8 text-brand-primary">
                        <MapPin size={18} strokeWidth={2} />
                    </div>
                    <h3 className="text-[15px] font-bold text-brand-dark">Verified Address</h3>
                </div>

                <div className="relative">
                    <Input label="Registered Business Address" placeholder="Search for your office location..." icon={Search}
                        value={data.address || ''} onChange={(e) => updateData({ address: e.target.value })} disabled={isManualEdit} />
                    {!isManualEdit && (
                        <button className="absolute right-4 top-[42px] text-[#9ca3af] hover:text-brand-primary transition-colors"
                            onClick={() => setIsManualEdit(true)} title="Edit Manually">
                            <Edit3 size={16} />
                        </button>
                    )}
                </div>

                {isManualEdit && (
                    <div className="p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-xl flex gap-3 animate-fadeIn">
                        <Navigation size={16} className="text-brand-primary mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-semibold text-brand-primary mb-0.5">Manual Entry Mode</p>
                            <p className="text-xs text-[#667085]">
                                You are editing manually. <button onClick={() => setIsManualEdit(false)} className="text-brand-primary font-semibold hover:underline">Switch to Search</button>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Regional */}
            <div className="space-y-5 pt-6 border-t border-[#f3f4f6]">
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="p-2 rounded-lg bg-brand-primary/8 text-brand-primary">
                        <Fingerprint size={18} strokeWidth={2} />
                    </div>
                    <h3 className="text-[15px] font-bold text-brand-dark">Regional Context</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="City / Region" placeholder="e.g. Mumbai"
                        value={data.city || ''} onChange={(e) => updateData({ city: e.target.value })} />
                    <Input label="Zip / Postal Code" placeholder="e.g. 400001"
                        value={data.zipCode || ''} onChange={(e) => updateData({ zipCode: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="State / Province" placeholder="e.g. Maharashtra"
                        value={data.state || ''} onChange={(e) => updateData({ state: e.target.value })} />
                    <Input label="Country" placeholder="e.g. India" icon={Globe}
                        value={data.country || ''} onChange={(e) => updateData({ country: e.target.value })} />
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

export default Step3Location;
