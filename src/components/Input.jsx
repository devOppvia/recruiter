import { cn } from '../utils/cn';

const Input = ({
    label,
    error,
    className,
    type = 'text',
    icon: Icon,
    rightIcon: RightIcon,
    rightAction,
    ...props
}) => {
    return (
        <div className="flex flex-col gap-2 w-full group/input">
            {label && (
                <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1 transition-colors group-focus-within/input:text-brand-primary">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within/input:text-brand-primary transition-colors z-10">
                        <Icon size={18} strokeWidth={3} />
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        'w-full bg-brand-primary/5 border border-brand-primary/10 rounded-[20px] outline-none transition-all duration-300',
                        'placeholder:text-brand-primary/20 text-brand-primary font-bold text-[15px]',
                        'hover:border-brand-primary/20',
                        'focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5',
                        'py-5 px-6',
                        Icon && 'pl-14',
                        (RightIcon || rightAction) && 'pr-14',
                        error && 'border-red-400 focus:ring-red-400/10 focus:border-red-400',
                        className
                    )}
                    {...props}
                />
                {(RightIcon || rightAction) && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
                        {rightAction ? (
                            <div className="text-brand-primary/20 hover:text-brand-primary transition-colors">
                                {rightAction}
                            </div>
                        ) : (
                            <RightIcon size={18} strokeWidth={3} className="text-brand-primary/20" />
                        )}
                    </div>
                )}
            </div>
            {error && (
                <span className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-widest">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
