import { useRef, useState, useEffect } from 'react';
import { Building2, Globe2, ArrowRight, ArrowLeft, AlignLeft, ImagePlus, X, ChevronDown, Search, Check, Hash, Calendar, Users } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { cn } from '../../utils/cn';

const industryOptions = [
    'Information Technology', 'Software Development', 'AI & Machine Learning',
    'Data Science & Analytics', 'Cybersecurity', 'Cloud & Infrastructure',
    'Design & Creative', 'Marketing & Advertising', 'Finance & Banking',
    'Consulting', 'Healthcare & Life Sciences', 'Education & EdTech',
    'E-Commerce & Retail', 'Manufacturing', 'Logistics & Supply Chain',
    'Legal & Compliance', 'Real Estate', 'Media & Entertainment',
    'Non-Profit & Social Impact', 'Other',
];

const companySizeOptions = [
    { value: '1-10', label: '1 – 10 employees' },
    { value: '11-50', label: '11 – 50 employees' },
    { value: '51-200', label: '51 – 200 employees' },
    { value: '201-500', label: '201 – 500 employees' },
    { value: '501-1000', label: '501 – 1,000 employees' },
    { value: '1001-5000', label: '1,001 – 5,000 employees' },
    { value: '5000+', label: '5,000+ employees' },
];

// Inline branded select matching the company panel design system
const BrandedSelect = ({ label, placeholder, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = options.filter(
        (o) => (typeof o === 'string' ? o : o.label).toLowerCase().includes(search.toLowerCase())
    );

    const selectedLabel = options.find((o) => (typeof o === 'string' ? o : o.value) === value);
    const displayLabel = selectedLabel ? (typeof selectedLabel === 'string' ? selectedLabel : selectedLabel.label) : '';

    return (
        <div className="flex flex-col gap-2 w-full group/select" ref={ref}>
            {label && (
                <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1 transition-colors group-focus-within/select:text-brand-primary">
                    {label}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => { setIsOpen((p) => !p); setSearch(''); }}
                    className={cn(
                        'w-full bg-brand-primary/5 border border-brand-primary/10 rounded-[20px] outline-none transition-all duration-300 shadow-soft',
                        'hover:border-brand-primary/20 text-left flex items-center justify-between px-6 py-5',
                        isOpen && 'bg-white border-brand-primary/30 ring-4 ring-brand-primary/5',
                    )}
                >
                    <span className={cn('font-bold text-[15px]', displayLabel ? 'text-brand-primary' : 'text-brand-primary/20')}>
                        {displayLabel || placeholder}
                    </span>
                    <ChevronDown size={16} strokeWidth={3} className={cn('text-brand-primary/30 transition-transform shrink-0', isOpen && 'rotate-180 text-brand-primary')} />
                </button>

                {isOpen && (
                    <div className="absolute z-50 mt-2 w-full bg-white border border-brand-primary/10 rounded-[20px] shadow-premium overflow-hidden">
                        <div className="p-3 border-b border-brand-primary/5">
                            <div className="relative">
                                <Search size={14} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search..."
                                    autoFocus
                                    className="w-full pl-10 pr-4 py-2.5 bg-brand-primary/5 rounded-xl text-xs font-bold text-brand-primary placeholder:text-brand-primary/20 outline-none focus:ring-2 focus:ring-brand-primary/10"
                                />
                            </div>
                        </div>
                        <div className="max-h-52 overflow-y-auto p-2">
                            {filtered.length === 0 ? (
                                <p className="px-4 py-3 text-xs font-bold text-brand-primary/30">No options found</p>
                            ) : (
                                filtered.map((opt, idx) => {
                                    const optValue = typeof opt === 'string' ? opt : opt.value;
                                    const optLabel = typeof opt === 'string' ? opt : opt.label;
                                    const isSelected = optValue === value;
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => { onChange(optValue); setIsOpen(false); }}
                                            className={cn(
                                                'w-full px-4 py-2.5 text-xs font-black rounded-xl text-left flex items-center justify-between transition-all',
                                                isSelected ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-primary/60 hover:bg-brand-primary/5 hover:text-brand-primary'
                                            )}
                                        >
                                            {optLabel}
                                            {isSelected && <Check size={13} strokeWidth={3} className="text-brand-primary shrink-0" />}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Step2Company = ({ onNext, onBack, data, updateData }) => {
    const fileInputRef = useRef(null);

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => updateData({ companyLogo: ev.target.result });
        reader.readAsDataURL(file);
    };

    const removeLogo = () => {
        updateData({ companyLogo: '' });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-10">
            {/* Form Section: Company Core */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <Building2 size={16} strokeWidth={3} />
                    </div>
                    <h3 className="text-lg font-black text-brand-primary tracking-tighter">Organizational Blueprint</h3>
                </div>

                <div className="space-y-6">
                    {/* Company Identity Row: Logo + Name */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                        {/* Logo Upload */}
                        <div className="space-y-2 shrink-0">
                            <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">Company Logo</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoChange}
                            />
                            {data.companyLogo ? (
                                <div className="relative w-[72px] h-[72px] group/logo">
                                    <img
                                        src={data.companyLogo}
                                        alt="Company logo"
                                        className="w-full h-full rounded-2xl object-cover border border-brand-primary/10 shadow-soft"
                                    />
                                    <div className="absolute inset-0 rounded-2xl bg-brand-primary/60 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-brand-primary shadow-soft"
                                            title="Change logo"
                                        >
                                            <ImagePlus size={13} strokeWidth={3} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={removeLogo}
                                            className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-red-400 shadow-soft"
                                            title="Remove logo"
                                        >
                                            <X size={13} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-[72px] h-[72px] rounded-2xl border-2 border-dashed border-brand-primary/15 bg-brand-primary/5 hover:border-brand-primary/30 hover:bg-brand-primary/10 flex flex-col items-center justify-center gap-1 transition-all group/upload"
                                    title="Upload company logo"
                                >
                                    <ImagePlus size={18} strokeWidth={2.5} className="text-brand-primary/25 group-hover/upload:text-brand-primary/50 transition-colors" />
                                    <span className="text-[8px] font-black text-brand-primary/20 group-hover/upload:text-brand-primary/40 uppercase tracking-widest transition-colors">Logo</span>
                                </button>
                            )}
                        </div>

                        {/* Company Name */}
                        <div className="flex-1 w-full">
                            <Input
                                label="Company Name"
                                placeholder="e.g. Acme Corporation Pvt Ltd"
                                icon={Building2}
                                value={data.companyName || ''}
                                onChange={(e) => updateData({ companyName: e.target.value })}
                                className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 pl-14 shadow-soft"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BrandedSelect
                            label="Industry Vertical"
                            placeholder="Select an industry..."
                            options={industryOptions}
                            value={data.industry || ''}
                            onChange={(val) => updateData({ industry: val })}
                        />
                        <Input
                            label="Global Website"
                            placeholder="https://acme.org"
                            icon={Globe2}
                            value={data.website || ''}
                            onChange={(e) => updateData({ website: e.target.value })}
                            className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 pl-14 shadow-soft"
                        />
                    </div>
                </div>
            </div>

            {/* Form Section: Company Details */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <Users size={16} strokeWidth={3} />
                    </div>
                    <h3 className="text-lg font-black text-brand-primary tracking-tighter">Company Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BrandedSelect
                        label="Company Size"
                        placeholder="Select headcount range..."
                        options={companySizeOptions}
                        value={data.companySize || ''}
                        onChange={(val) => updateData({ companySize: val })}
                    />
                    <Input
                        label="Founded Year"
                        placeholder="e.g. 2015"
                        icon={Calendar}
                        type="number"
                        min="1800"
                        max={new Date().getFullYear()}
                        value={data.foundedYear || ''}
                        onChange={(e) => updateData({ foundedYear: e.target.value })}
                        className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 pl-14 shadow-soft"
                    />
                </div>

                <Input
                    label="PAN / GST / Registration Number"
                    placeholder="e.g. AABCT1332L or 29AABCT1332L1ZR"
                    icon={Hash}
                    value={data.registrationNumber || ''}
                    onChange={(e) => updateData({ registrationNumber: e.target.value.toUpperCase() })}
                    className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 pl-14 shadow-soft"
                />
            </div>

            {/* Form Section: Narrative */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <AlignLeft size={16} strokeWidth={3} />
                    </div>
                    <h3 className="text-lg font-black text-brand-primary tracking-tighter">Company Narrative</h3>
                </div>

                <div className="group/ta space-y-2">
                    <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1 transition-colors group-focus-within/ta:text-brand-primary">
                        Vision & Mission Statement
                    </label>
                    <div className="relative">
                        <textarea
                            className={cn(
                                "w-full min-h-[160px] px-6 py-5 bg-brand-primary/5 border border-brand-primary/10 rounded-[24px] outline-none transition-all duration-300 shadow-soft",
                                "placeholder:text-brand-primary/20 text-brand-primary font-bold text-[15px] resize-none",
                                "hover:border-brand-primary/20",
                                "focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5"
                            )}
                            placeholder="Briefly describe your company's core values, mission, and the impact you aim to create..."
                            value={data.description || ''}
                            onChange={(e) => updateData({ description: e.target.value.slice(0, 500) })}
                        />
                        <div className="absolute bottom-5 right-6 px-3 py-1 bg-white border border-brand-primary/10 rounded-full shadow-soft">
                            <span className="text-[10px] font-black text-brand-primary/40 tabular-nums uppercase tracking-widest">
                                {data.description?.length || 0} <span className="opacity-40">/</span> 500
                            </span>
                        </div>
                    </div>
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
                        Protocol Reset
                    </span>
                </Button>
                <Button
                    size="lg"
                    onClick={onNext}
                    className="h-14 px-10 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs shadow-premium hover:shadow-hover group"
                >
                    <span className="flex items-center gap-3">
                        Deploy Profile
                        <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default Step2Company;
