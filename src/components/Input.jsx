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
        <div className="flex flex-col gap-2 w-full group/input">
            {label && (
                <label className="text-[13px] font-semibold text-[#475467] ml-1 transition-colors group-focus-within/input:text-brand-primary">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] group-focus-within/input:text-brand-primary transition-colors z-10">
                        <Icon size={18} strokeWidth={2} />
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        'w-full px-4 py-3.5 bg-white border border-[#e5e7eb] rounded-xl outline-none transition-all duration-200',
                        'placeholder:text-[#9ca3af] text-[#1C2024] font-medium text-[15px]',
                        'hover:border-[#d1d5db]',
                        'focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10',
                        Icon && 'pl-11',
                        error && 'border-red-400 focus:ring-red-400/10 focus:border-red-400',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-xs font-medium text-red-500 ml-1">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
