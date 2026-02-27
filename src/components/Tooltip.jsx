import { useState } from 'react';
import { cn } from '../utils/cn';
import { HelpCircle } from 'lucide-react';

const Tooltip = ({ text, children, className }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            {children || (
                <HelpCircle size={14} className={cn('text-[#9ca3af] hover:text-brand-primary cursor-help transition-colors', className)} />
            )}
            {show && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1C2024] text-white text-xs rounded-lg shadow-lg max-w-[220px] whitespace-normal leading-relaxed animate-fadeIn pointer-events-none">
                    {text}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-[#1C2024]" />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
