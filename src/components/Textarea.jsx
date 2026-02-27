import { cn } from '../utils/cn';

const Textarea = ({
    label,
    error,
    className,
    maxLength,
    value = '',
    helperText,
    ...props
}) => {
    return (
        <div className="flex flex-col gap-2 w-full group/ta">
            {label && (
                <label className="text-sm font-semibold text-[#475467] ml-1 transition-colors group-focus-within/ta:text-brand-primary">
                    {label}
                </label>
            )}
            <div className="relative">
                <textarea
                    className={cn(
                        'w-full min-h-[120px] px-4 py-3.5 bg-white border border-[#e5e7eb] rounded-xl outline-none transition-all duration-200',
                        'placeholder:text-[#9ca3af] text-[#1C2024] font-medium text-base resize-none',
                        'hover:border-[#d1d5db]',
                        'focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10',
                        error && 'border-red-400 focus:ring-red-400/10 focus:border-red-400',
                        className
                    )}
                    value={value}
                    maxLength={maxLength}
                    {...props}
                />
                {maxLength && (
                    <span className="absolute bottom-3 right-4 text-[11px] font-medium text-[#9ca3af] tabular-nums">
                        {value.length}/{maxLength}
                    </span>
                )}
            </div>
            {helperText && !error && (
                <span className="text-xs text-[#9ca3af] ml-1">{helperText}</span>
            )}
            {error && (
                <span className="text-xs font-medium text-red-500 ml-1">{error}</span>
            )}
        </div>
    );
};

export default Textarea;
