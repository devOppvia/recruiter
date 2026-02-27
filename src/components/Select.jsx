import { useState, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';
import { ChevronDown, Search, Check } from 'lucide-react';

const Select = ({
    label,
    options = [],
    value,
    onChange,
    placeholder = 'Select...',
    searchable = false,
    className,
    error,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = searchable
        ? options.filter(opt =>
            (typeof opt === 'string' ? opt : opt.label)
                .toLowerCase()
                .includes(search.toLowerCase())
        )
        : options;

    const selectedLabel = options.find(opt =>
        (typeof opt === 'string' ? opt : opt.value) === value
    );
    const displayLabel = selectedLabel
        ? (typeof selectedLabel === 'string' ? selectedLabel : selectedLabel.label)
        : '';

    return (
        <div className="flex flex-col gap-2 w-full" ref={ref}>
            {label && (
                <label className="text-sm font-semibold text-[#475467] ml-1">{label}</label>
            )}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        'w-full px-4 py-4 bg-white border border-[#e5e7eb] rounded-xl outline-none transition-all duration-200 text-left flex items-center justify-between',
                        'hover:border-[#d1d5db]',
                        isOpen && 'border-brand-primary ring-2 ring-brand-primary/10',
                        error && 'border-red-400',
                        className
                    )}
                >
                    <span className={cn('text-base font-medium', value ? 'text-[#1C2024]' : 'text-[#9ca3af]')}>
                        {displayLabel || placeholder}
                    </span>
                    <ChevronDown size={18} className={cn('text-[#9ca3af] transition-transform', isOpen && 'rotate-180')} />
                </button>

                {isOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-[#e5e7eb] rounded-xl shadow-lg max-h-60 overflow-hidden animate-fadeIn">
                        {searchable && (
                            <div className="p-2 border-b border-[#f3f4f6]">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search..."
                                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#f9fafb] border border-[#e5e7eb] rounded-lg outline-none focus:border-brand-primary"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}
                        <div className="overflow-y-auto max-h-48 p-1">
                            {filtered.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-[#9ca3af]">No options found</div>
                            ) : (
                                filtered.map((opt, idx) => {
                                    const optValue = typeof opt === 'string' ? opt : opt.value;
                                    const optLabel = typeof opt === 'string' ? opt : opt.label;
                                    const isSelected = optValue === value;
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                onChange(optValue);
                                                setIsOpen(false);
                                                setSearch('');
                                            }}
                                            className={cn(
                                                'w-full px-3 py-2.5 text-sm font-medium rounded-lg text-left flex items-center justify-between transition-colors',
                                                isSelected
                                                    ? 'bg-brand-primary/5 text-brand-primary'
                                                    : 'text-[#344054] hover:bg-[#f9fafb]'
                                            )}
                                        >
                                            {optLabel}
                                            {isSelected && <Check size={16} className="text-brand-primary" />}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
            {error && <span className="text-xs font-medium text-red-500 ml-1">{error}</span>}
        </div>
    );
};

export default Select;
