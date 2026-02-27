import { useState } from 'react';
import { MapPin, Navigation, Search, Edit3, Globe, ArrowRight, ArrowLeft, Building2, Plus, Trash2 } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Step3Location = ({ onNext, onBack, data, updateData }) => {
    const [isManualEdit, setIsManualEdit] = useState(false);

    return (
        <div className="space-y-10">
            {/* Form Section: Headquarters */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <MapPin size={16} strokeWidth={3} />
                    </div>
                    <h3 className="text-lg font-black text-brand-primary tracking-tighter">Global Headquarters</h3>
                </div>

                <div className="relative group/search">
                    <Input
                        label="Registered Business Address"
                        placeholder="Search for your global office location..."
                        icon={Search}
                        value={data.address || ''}
                        onChange={(e) => updateData({ address: e.target.value })}
                        // disabled={!isManualEdit}
                        className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 pl-14 shadow-soft disabled:opacity-50"
                    />
                    {/* {!isManualEdit && (
                        <button
                            className="absolute right-6 bottom-5 text-brand-primary/20 hover:text-brand-primary transition-colors bg-white/50 backdrop-blur-sm p-1.5 rounded-lg border border-brand-primary/5 shadow-soft"
                            onClick={() => setIsManualEdit(true)}
                            title="Edit Manually"
                        >
                            <Edit3 size={16} strokeWidth={2.5} />
                        </button>
                    )} */}
                </div>

                {isManualEdit && (
                    <div className="p-6 bg-brand-primary/5 border border-brand-primary/10 rounded-[24px] flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                            <Navigation size={18} strokeWidth={3} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Manual Entry Active</p>
                            <p className="text-[11px] font-bold text-brand-primary/40 leading-relaxed">
                                Precise coordinate targeting enabled. <button onClick={() => setIsManualEdit(false)} className="text-brand-primary font-black hover:underline">Return to Search</button>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Form Section: Regional Specifics */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <Globe size={16} strokeWidth={3} />
                    </div>
                    <h3 className="text-lg font-black text-brand-primary tracking-tighter">Regional Specifics</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Metropolitan / Region"
                        placeholder="e.g. London"
                        value={data.city || ''}
                        onChange={(e) => updateData({ city: e.target.value })}
                        className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 shadow-soft"
                    />
                    <Input
                        label="Postal Code / Zip"
                        placeholder="e.g. EC1A 1BB"
                        value={data.zipCode || ''}
                        onChange={(e) => updateData({ zipCode: e.target.value })}
                        className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 shadow-soft"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="State / Province"
                        placeholder="e.g. Greater London"
                        value={data.state || ''}
                        onChange={(e) => updateData({ state: e.target.value })}
                        className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 shadow-soft"
                    />
                    <Input
                        label="Nation / Country"
                        placeholder="e.g. United Kingdom"
                        icon={Globe}
                        value={data.country || ''}
                        onChange={(e) => updateData({ country: e.target.value })}
                        className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 pl-14 shadow-soft"
                    />
                </div>
            </div>

            {/* Form Section: Branch Offices */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                            <Building2 size={16} strokeWidth={3} />
                        </div>
                        <h3 className="text-lg font-black text-brand-primary tracking-tighter">Branch Offices</h3>
                    </div>
                    <button
                        type="button"
                        onClick={() => updateData({ branches: [...(data.branches || []), ''] })}
                        className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-widest px-4 py-2 rounded-xl bg-brand-primary/5 border border-brand-primary/10 hover:bg-brand-primary/10 transition-all"
                    >
                        <Plus size={13} strokeWidth={3} />
                        Add Branch
                    </button>
                </div>

                {(data.branches || []).length === 0 && (
                    <p className="text-[11px] font-bold text-brand-primary/30 text-center py-4">
                        No branch offices added yet. Click &quot;Add Branch&quot; to get started.
                    </p>
                )}

                <div className="space-y-4">
                    {(data.branches || []).map((branch, index) => (
                        <div key={index} className="flex items-end gap-3">
                            <div className="flex-1">
                                <Input
                                    label={`Branch ${index + 1} Address`}
                                    placeholder="e.g. 42 Park Lane, Manchester, UK"
                                    value={branch}
                                    onChange={(e) => {
                                        const updated = [...(data.branches || [])];
                                        updated[index] = e.target.value;
                                        updateData({ branches: updated });
                                    }}
                                    className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 shadow-soft"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    const updated = (data.branches || []).filter((_, i) => i !== index);
                                    updateData({ branches: updated });
                                }}
                                className="mb-0 p-3 rounded-xl text-brand-primary/30 hover:text-red-400 hover:bg-red-50 border border-brand-primary/10 hover:border-red-200 transition-all"
                                title="Remove branch"
                            >
                                <Trash2 size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="pt-8 border-t border-brand-primary/5 flex items-center justify-between gap-4">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="h-14 px-8 rounded-2xl text-brand-primary/40 font-black uppercase tracking-widest text-[10px] hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
                >
                    <span className="flex items-center gap-2">
                        <ArrowLeft size={16} strokeWidth={3} />
                        Blueprint Revision
                    </span>
                </Button>
                <Button
                    size="lg"
                    onClick={onNext}
                    className="h-14 px-10 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs shadow-premium hover:shadow-hover group"
                >
                    <span className="flex items-center gap-3">
                        Deploy Location
                        <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default Step3Location;
