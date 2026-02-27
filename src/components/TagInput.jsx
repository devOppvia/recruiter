import { useState } from 'react';
import { cn } from '../utils/cn';
import { X } from 'lucide-react';

const TagInput = ({
    label,
    tags = [],
    onChange,
    placeholder = 'Type and press Enter...',
    suggestions = [],
    helperText,
    className,
}) => {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const addTag = (tag) => {
        const trimmed = tag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            onChange([...tags, trimmed]);
        }
        setInput('');
        setShowSuggestions(false);
    };

    const removeTag = (tag) => {
        onChange(tags.filter(t => t !== tag));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(input);
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    const filteredSuggestions = suggestions.filter(
        s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
    );

    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="text-sm font-semibold text-[#475467] ml-1">{label}</label>
            )}
            <div className={cn(
                'flex flex-wrap gap-2 p-3 bg-white border border-[#e5e7eb] rounded-xl min-h-[52px] transition-all',
                'focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10',
                className
            )}>
                {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/8 text-brand-primary text-xs font-semibold rounded-lg">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                            <X size={12} />
                        </button>
                    </span>
                ))}
                <div className="relative flex-1 min-w-[120px]">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder={tags.length === 0 ? placeholder : '+ Add more'}
                        className="w-full py-1 text-sm outline-none placeholder:text-[#9ca3af] text-[#1C2024] font-medium"
                    />
                    {showSuggestions && input && filteredSuggestions.length > 0 && (
                        <div className="absolute z-50 top-full left-0 mt-1 w-full bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-40 overflow-y-auto p-1">
                            {filteredSuggestions.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onMouseDown={() => addTag(s)}
                                    className="w-full px-3 py-2 text-sm text-left text-[#344054] hover:bg-[#f9fafb] rounded-md"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {helperText && (
                <span className="text-xs text-[#9ca3af] ml-1">{helperText}</span>
            )}
        </div>
    );
};

export default TagInput;
