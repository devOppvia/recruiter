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
        primary: 'bg-brand-primary text-white hover:bg-brand-primary-light active:scale-[0.98] shadow-sm',
        accent: 'bg-brand-accent text-white font-bold hover:brightness-110 active:scale-[0.98] shadow-sm',
        secondary: 'bg-white text-[#344054] border border-[#e5e7eb] hover:bg-[#f9fafb] active:scale-[0.98]',
        outline: 'border-2 border-brand-primary text-brand-primary bg-white hover:bg-brand-primary/5 active:scale-[0.98]',
        ghost: 'text-[#667085] border border-[#e5e7eb] hover:bg-[#f9fafb] hover:text-brand-dark active:scale-[0.98]',
        dark: 'bg-brand-dark text-white hover:bg-brand-primary-light active:scale-[0.98]',
    };

    const sizes = {
        sm: 'px-5 py-2.5 text-sm',
        md: 'px-6 py-3 text-[0.9375rem]',
        lg: 'px-8 py-4 text-base',
    };

    return (
        <button
            className={cn(
                'relative flex items-center justify-center rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
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
