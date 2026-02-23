import React from 'react';
import { cn } from '../utils/cn';

const Input = ({
    label,
    error,
    className,
    type = 'text',
    icon: Icon,
    ...props
}) => {
    return (
        <div className="flex flex-col gap-2 w-full group/container">
            {label && (
                <label className="text-sm font-semibold text-[#344054] ml-1 transition-colors duration-200 group-focus-within/container:text-brand-primary">
                    {label}
                </label>
            )}
            <div className="relative isolate">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98a2b3] group-focus-within/container:text-brand-primary transition-all duration-300 z-10">
                        <Icon size={19} strokeWidth={2.2} />
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        'w-full px-4 py-3 bg-white border border-[#eaecf0] rounded-xl outline-hidden transition-all duration-300',
                        'placeholder:text-[#98a2b3] text-[#101828] font-medium text-[0.9375rem]',
                        'hover:border-[#d0d5dd] hover:bg-[#fcfcfd]',
                        'focus:border-brand-primary focus:bg-white focus:ring-[4px] focus:ring-brand-primary/[0.08] focus:shadow-[0_2px_4px_rgba(12,165,165,0.05)]',
                        Icon && 'pl-12',
                        error && 'border-red-500 focus:ring-red-500/10 focus:border-red-500 bg-red-50/10',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-xs font-semibold text-red-500 ml-1.5 flex items-center gap-1.5 animate-fadeIn">
                    <span className="w-1 h-1 rounded-full bg-red-500"></span>
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
