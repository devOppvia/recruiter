import React, { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { MapPin, Navigation, ArrowLeft, Search, Edit3, Fingerprint } from 'lucide-react';

const Step3Location = ({ onNext, onBack, data, updateData }) => {
    const [isManualEdit, setIsManualEdit] = useState(false);

    return (
        <div className="space-y-10">
            {/* Section: Headquarters */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-lg bg-brand-primary/5 text-brand-primary">
                        <MapPin size={18} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-base font-bold text-[#101828]">Verified Address</h3>
                </div>

                <div className="relative group/search">
                    <Input
                        label="Registered Business Address"
                        placeholder="Search for your office location..."
                        icon={Search}
                        className="pr-12"
                        value={data.address || ''}
                        onChange={(e) => updateData({ address: e.target.value })}
                        disabled={isManualEdit}
                    />
                    {!isManualEdit && (
                        <button
                            className="absolute right-4 top-[42px] p-1 text-[#98a2b3] hover:text-brand-primary transition-colors"
                            onClick={() => setIsManualEdit(true)}
                            title="Edit Manually"
                        >
                            <Edit3 size={18} />
                        </button>
                    )}
                </div>

                {isManualEdit && (
                    <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl flex gap-3 animate-fadeIn">
                        <Navigation size={18} className="text-orange-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">Manual Entry Mode</p>
                            <p className="text-xs text-orange-600 font-medium leading-relaxed">
                                You are editing the address manually. Exact coordinates will be determined during verification.
                            </p>
                            <button
                                onClick={() => setIsManualEdit(false)}
                                className="text-[10px] font-black text-orange-700 uppercase tracking-[0.1em] hover:underline mt-1"
                            >
                                Switch to Smart Search
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Section: Regional Data */}
            <div className="space-y-6 pt-6 border-t border-[#f2f4f7]">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-lg bg-brand-primary/5 text-brand-primary">
                        <Fingerprint size={18} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-base font-bold text-[#101828]">Regional Context</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                        label="City / Region"
                        placeholder="e.g. Mumbai"
                        value={data.city || ''}
                        onChange={(e) => updateData({ city: e.target.value })}
                    />
                    <Input
                        label="Zip / Postal Code"
                        placeholder="e.g. 400001"
                        value={data.zipCode || ''}
                        onChange={(e) => updateData({ zipCode: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                        label="State / Province"
                        placeholder="e.g. Maharashtra"
                        value={data.state || ''}
                        onChange={(e) => updateData({ state: e.target.value })}
                    />
                    <Input
                        label="Country"
                        placeholder="e.g. India"
                        value={data.country || ''}
                        onChange={(e) => updateData({ country: e.target.value })}
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button variant="ghost" className="flex-1 order-2 sm:order-1" onClick={onBack}>
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </Button>
                <Button size="lg" className="flex-[2] order-1 sm:order-2 shadow-lg shadow-brand-primary/20" onClick={onNext}>
                    Continue to Online Presence
                </Button>
            </div>
        </div>
    );
};

export default Step3Location;
