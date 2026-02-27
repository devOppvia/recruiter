import { createSlice } from '@reduxjs/toolkit';

const plans = [
    {
        id: 'basic',
        name: 'Basic',
        price: 'Free',
        priceValue: 0,
        features: {
            jobPostings: '2',
            resumeAccess: '✕',
            aiAssist: '✕',
            support: 'Email',
            analytics: 'Basic',
        },
    },
    {
        id: 'growth',
        name: 'Growth',
        price: '₹2,999',
        priceValue: 2999,
        period: '/mo',
        features: {
            jobPostings: '10',
            resumeAccess: '50',
            aiAssist: '✓',
            support: 'Priority',
            analytics: 'Advanced',
        },
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: '₹7,999',
        priceValue: 7999,
        period: '/mo',
        features: {
            jobPostings: 'Unlimited',
            resumeAccess: 'Unlimited',
            aiAssist: '✓',
            support: 'Dedicated',
            analytics: 'Full',
        },
    },
];

const featureLabels = {
    jobPostings: 'Job Postings',
    resumeAccess: 'Resume Access',
    aiAssist: 'AI Assist',
    support: 'Support',
    analytics: 'Analytics',
};

const featureTooltips = {
    jobPostings: 'Number of active job postings you can have at any time.',
    resumeAccess: 'Number of intern resumes you can view and download per month.',
    aiAssist: 'AI-powered job description generation to help you write better listings faster.',
    support: 'Level of customer support available for your plan.',
    analytics: 'Depth of analytics and insights available for your job postings and candidates.',
};

const paymentHistory = [
    { id: 'pay_001', date: '2026-02-01', amount: '₹2,999', plan: 'Growth', status: 'Paid', method: 'UPI' },
    { id: 'pay_002', date: '2026-01-01', amount: '₹2,999', plan: 'Growth', status: 'Paid', method: 'UPI' },
    { id: 'pay_003', date: '2025-12-01', amount: '₹2,999', plan: 'Growth', status: 'Paid', method: 'Credit Card' },
    { id: 'pay_004', date: '2025-11-01', amount: '₹2,999', plan: 'Growth', status: 'Paid', method: 'Credit Card' },
];

const initialState = {
    plans,
    featureLabels,
    featureTooltips,
    currentPlan: 'growth',
    usage: {
        jobPostings: { current: 12, max: 18 },
        resumeAccess: { current: 12, max: 50 }
    },
    paymentHistory,
    activeTab: 'plans',
};

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        selectPlan: (state, action) => {
            state.currentPlan = action.payload;
        },
    },
});

export const { setActiveTab, selectPlan } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
