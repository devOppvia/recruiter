import React from 'react';
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    PauseCircle,
    XCircle,
    Briefcase,
    Zap,
    Users,
    Video,
    UserCheck,
    Lock
} from 'lucide-react';

const statusConfig = {
    // Job Statuses
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-500', icon: Briefcase },
    pending: { label: 'In Review', color: 'bg-amber-50 text-amber-600', icon: Clock },
    active: { label: 'Live', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
    paused: { label: 'Paused', color: 'bg-blue-50 text-blue-600', icon: PauseCircle },
    completed: { label: 'Completed', color: 'bg-purple-50 text-purple-600', icon: UserCheck },
    rejected: { label: 'Rejected', color: 'bg-red-50 text-red-500', icon: XCircle },
    closed: { label: 'Closed', color: 'bg-gray-50 text-gray-400', icon: Lock },

    // Candidate Statuses
    under_review: { label: 'Reviewing', color: 'bg-indigo-50 text-indigo-600', icon: Briefcase },
    shortlisted: { label: 'Shortlisted', color: 'bg-brand-accent/20 text-brand-primary', icon: Zap },
    interview_scheduled: { label: 'Interview', color: 'bg-blue-50 text-blue-600', icon: Video },
    hired: { label: 'Hired', color: 'bg-emerald-50 text-emerald-600', icon: UserCheck },

    // Feature Statuses
    expired: { label: 'Expired', color: 'bg-red-50 text-red-500', icon: AlertCircle }
};

const Badge = ({ status, size = 'md' }) => {
    const config = statusConfig[status] || { label: status, color: 'bg-gray-50 text-gray-600', icon: AlertCircle };
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'px-2.5 py-1 text-[10px] gap-1',
        md: 'px-3.5 py-1.5 text-[11px] gap-1.5',
        lg: 'px-5 py-2.5 text-xs gap-2'
    };

    return (
        <span className={`inline-flex items-center font-black uppercase tracking-widest rounded-2xl transition-all ${config.color} ${sizeClasses[size]}`}>
            <Icon size={size === 'sm' ? 12 : 14} strokeWidth={3} />
            {config.label}
        </span>
    );
};

export default Badge;
