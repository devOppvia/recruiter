import React from 'react';
import { cn } from '../utils/cn';
import { Loader2 } from 'lucide-react';

const Button = ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    disabled,
    ...props
}) => {
    const variants = {
        primary: 'bg-brand-primary text-white shadow-[0_1px_2px_rgba(12,165,165,0.05),0_0_0_1px_rgba(12,165,165,1)] hover:bg-brand-primary-light hover:shadow-[0_4px_12px_rgba(12,165,165,0.25)] active:scale-[0.98]',
        secondary: 'bg-white text-[#344054] border border-[#d0d5dd] shadow-sm hover:bg-[#f9fafb] hover:border-[#cfd4dc] active:scale-[0.98]',
        outline: 'border-2 border-brand-primary text-brand-primary bg-white hover:bg-brand-primary/5 active:scale-[0.98]',
        ghost: 'text-[#667085] hover:bg-[#f9fafb] hover:text-[#101828] active:scale-[0.98]',
    };

    const sizes = {
        sm: 'px-3.5 py-2 text-sm',
        md: 'px-6 py-3 text-[0.9375rem]',
        lg: 'px-8 py-4 text-base font-bold tracking-tight',
    };

    return (
        <button
            className={cn(
                'relative flex items-center justify-center rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin stroke-[3px]" />}
            {children}
        </button>
    );
};

export default Button;
