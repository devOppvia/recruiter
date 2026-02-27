import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, trend, trendType = 'up', icon: Icon, description }) => {
    return (
        <div className="bg-white rounded-[32px] p-7 shadow-soft border border-brand-primary/5 hover:border-brand-primary/10 transition-all group overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl group-hover:bg-brand-primary/10 transition-all duration-500" />

            <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                        {Icon && <Icon size={22} strokeWidth={2.5} />}
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                            }`}>
                            {trendType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {trend}
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-4xl font-black text-brand-primary text-editorial tracking-tighter mb-1">
                        {value}
                    </h3>
                    <p className="text-[11px] font-black text-brand-primary/60 uppercase tracking-widest leading-none">
                        {label}
                    </p>
                </div>

                {description && (
                    <p className="text-[13px] font-bold text-brand-primary/50 leading-snug">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default StatCard;
