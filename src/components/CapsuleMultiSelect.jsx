import { useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '../utils/cn';

const CapsuleMultiSelect = ({
    label,
    options = [],
    selected = [],
    onChange,
    placeholder = 'Search options...',
    allowCreate = false,
    createButtonLabel = 'Add',
    helperText,
    className,
}) => {
    const [query, setQuery] = useState('');
    const normalizedQuery = query.trim().toLowerCase();

    const filteredOptions = useMemo(() => {
        if (!normalizedQuery) return options;
        return options.filter((option) => option.toLowerCase().includes(normalizedQuery));
    }, [options, normalizedQuery]);

    const canCreate =
        allowCreate &&
        query.trim() &&
        !options.some((option) => option.toLowerCase() === normalizedQuery) &&
        !selected.some((option) => option.toLowerCase() === normalizedQuery);

    const toggleOption = (option) => {
        if (selected.includes(option)) {
            onChange(selected.filter((item) => item !== option));
            return;
        }
        onChange([...selected, option]);
    };

    const addCustomOption = () => {
        const next = query.trim();
        if (!next) return;
        onChange([...selected, next]);
        setQuery('');
    };

    return (
        <div className={cn('flex flex-col gap-3 w-full', className)}>
            {label && <label className="text-sm font-semibold text-[#475467] ml-1">{label}</label>}

            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4 space-y-3 shadow-soft">
                <div className="flex flex-wrap gap-2">
                    {selected.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => toggleOption(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-primary text-white"
                        >
                            {item}
                            <X size={12} />
                        </button>
                    ))}
                    {selected.length === 0 && (
                        <span className="text-xs text-[#9ca3af] px-1">No items selected yet.</span>
                    )}
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 px-3 py-2.5 text-sm bg-[#f9fafb] border border-[#e5e7eb] rounded-xl outline-none focus:border-brand-primary"
                    />
                    {canCreate && (
                        <button
                            type="button"
                            onClick={addCustomOption}
                            className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary rounded-xl hover:bg-brand-primary/15 transition-colors"
                        >
                            <Plus size={14} />
                            {createButtonLabel}
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                    {filteredOptions.map((option) => {
                        const isSelected = selected.includes(option);
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => toggleOption(option)}
                                className={cn(
                                    'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                                    isSelected
                                        ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                                        : 'bg-white text-[#344054] border-[#e5e7eb] hover:border-brand-primary/30 hover:text-brand-primary'
                                )}
                            >
                                {option}
                            </button>
                        );
                    })}
                    {filteredOptions.length === 0 && (
                        <span className="text-xs text-[#9ca3af] px-1">No matching options.</span>
                    )}
                </div>
            </div>

            {helperText && <span className="text-xs text-[#9ca3af] ml-1">{helperText}</span>}
        </div>
    );
};

export default CapsuleMultiSelect;
