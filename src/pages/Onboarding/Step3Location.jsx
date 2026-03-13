import { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Globe, ArrowRight, ArrowLeft, Building2, Plus, Trash2 } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { companyCreateAccountStep3Api } from '../../helper/api';
import toast from 'react-hot-toast';

const Step3Location = ({ onNext, onBack, data, updateData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    // Refs for Google Places Autocomplete
    const hqInputRef = useRef(null);
    const branchRefs = useRef([]);

    // Initialize HQ Autocomplete
    useEffect(() => {
        if (!window.google || !hqInputRef.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(hqInputRef.current, {
            fields: ["place_id", "formatted_address", "address_components", "geometry"],
            types: ["establishment", "geocode"],
        });

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) return;

            const updatedFields = {
                address: place.formatted_address || "",
                city: "",
                state: "",
                country: "",
                zipCode: "",
            };

            place.address_components.forEach((component) => {
                const types = component.types;
                if (types.includes("locality")) updatedFields.city = component.long_name;
                else if (types.includes("administrative_area_level_2")) updatedFields.city = updatedFields.city || component.long_name;
                
                if (types.includes("administrative_area_level_1")) updatedFields.state = component.long_name;
                if (types.includes("country")) updatedFields.country = component.long_name;
                if (types.includes("postal_code")) updatedFields.zipCode = component.long_name;
            });

            updateData(updatedFields);
            setErrors(prev => ({ ...prev, address: null, city: null, state: null, country: null, zipCode: null }));
        });
    }, [updateData]);

    // Handle branch autocomplete
    useEffect(() => {
        if (!window.google) return;

        const autocompletes = branchRefs.current.map((ref, index) => {
            if (!ref) return null;
            const autocomplete = new window.google.maps.places.Autocomplete(ref, {
                fields: ["formatted_address"],
                types: ["establishment", "geocode"],
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (place.formatted_address) {
                    const updatedBranches = [...(data.branches || [])];
                    updatedBranches[index] = place.formatted_address;
                    updateData({ branches: updatedBranches });
                }
            });
            return autocomplete;
        });

        return () => {
            autocompletes.forEach(a => {
                if (a) window.google.maps.event.clearInstanceListeners(a);
            });
        };
    }, [data.branches?.length, updateData]);

    const validate = () => {
        const newErrors = {};
        if (!data.address) newErrors.address = "Required";
        if (!data.city) newErrors.city = "Required";
        if (!data.zipCode) newErrors.zipCode = "Required";
        if (!data.state) newErrors.state = "Required";
        if (!data.country) newErrors.country = "Required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Please select a valid headquarters location");
            return;
        }

        setIsLoading(true);
        const companyId = localStorage.getItem("companyId");

        try {
            const payload = {
                id: companyId,
                address: data.address,
                city: data.city,
                state: data.state,
                country: data.country,
                zipCode: data.zipCode,
                branchLocations: data.branches || []
            };

            const response = await companyCreateAccountStep3Api(payload);

            if (response.status) {
                toast.success(response.message || "Location details saved");
                localStorage.setItem("currentStep", "5");
                localStorage.setItem("formData", JSON.stringify(data));
                onNext();
            }
        } catch (error) {
            console.error("Step 3 Error:", error);
            toast.error(error || "Submission failed");
        } finally {
            setIsLoading(false);
        }
    };

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
                        ref={hqInputRef}
                        label="Registered Business Address"
                        placeholder="Search for your global office location..."
                        icon={Search}
                        value={data.address || ''}
                        onChange={(e) => updateData({ address: e.target.value })}
                        error={errors.address}
                        className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 pl-14 shadow-soft disabled:opacity-50"
                    />
                </div>
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
                        placeholder="City"
                        value={data.city || ''}
                        disabled
                        error={errors.city}
                        className="bg-brand-primary/5 border-brand-primary/10 rounded-[20px] transition-all py-5 shadow-soft opacity-60"
                    />
                    <Input
                        label="Postal Code / Zip"
                        placeholder="ZipCode"
                        value={data.zipCode || ''}
                        disabled
                        error={errors.zipCode}
                        className="bg-brand-primary/5 border-brand-primary/10 rounded-[20px] transition-all py-5 shadow-soft opacity-60"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="State / Province"
                        placeholder="State"
                        value={data.state || ''}
                        disabled
                        error={errors.state}
                        className="bg-brand-primary/5 border-brand-primary/10 rounded-[20px] transition-all py-5 shadow-soft opacity-60"
                    />
                    <Input
                        label="Nation / Country"
                        placeholder="Country"
                        icon={Globe}
                        value={data.country || ''}
                        disabled
                        error={errors.country}
                        className="bg-brand-primary/5 border-brand-primary/10 rounded-[20px] transition-all py-5 pl-14 shadow-soft opacity-60"
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
                        className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-widest px-4 py-2 rounded-xl bg-brand-primary/5 border border-brand-primary/10 hover:bg-brand-primary/10 transition-all font-inter"
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
                        <div key={index} className="flex items-end gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
                            <div className="flex-1">
                                <Input
                                    ref={el => branchRefs.current[index] = el}
                                    label={`Branch ${index + 1} Address`}
                                    placeholder="Search for branch location..."
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
                    disabled={isLoading}
                    className="h-14 px-8 rounded-2xl text-brand-primary/40 font-black uppercase tracking-widest text-[10px] hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
                >
                    <span className="flex items-center gap-2">
                        <ArrowLeft size={16} strokeWidth={3} />
                        Blueprint Revision
                    </span>
                </Button>
                <Button
                    size="lg"
                    onClick={handleSubmit}
                    isLoading={isLoading}
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
