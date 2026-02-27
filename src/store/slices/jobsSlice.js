import { createSlice } from '@reduxjs/toolkit';

const dummyJobs = [
    {
        id: 'job_001',
        applicationType: 'Internship',
        title: 'Product Design Intern',
        category: 'Design',
        subCategory: 'UI/UX Design',
        jobType: '',
        urgentHiring: 'No',
        workType: 'Remote',
        location: '',
        internsRequired: 3,
        duration: '3 Months',
        workingHours: '6 Hours/Day',
        experienceRange: '1 to 2 Years',
        languages: ['English', 'Hindi'],
        ageRange: { min: '21', max: '30' },
        stipend: { type: 'Fixed', amount: 8000 },
        skills: ['Figma', 'React', 'Tailwind CSS'],
        benefits: ['Certificate', 'Letter of Recommendation'],
        description: 'Join our team to build luxury user interfaces for human-centric products.',
        requirements: 'Proficiency in Figma and basics of React.',
        otherInfo: 'Flexible working hours.',
        status: 'active', // Live
        applicants: 24,
        createdAt: '2026-02-10',
    },
    {
        id: 'job_002',
        applicationType: 'Internship',
        title: 'Backend Engineering Intern',
        category: 'Engineering',
        subCategory: 'Node.js',
        jobType: '',
        urgentHiring: 'Yes',
        workType: 'Hybrid',
        location: 'Mumbai, Maharashtra',
        internsRequired: 2,
        duration: '6 Months',
        workingHours: '4 Hours/Day',
        experienceRange: '0 to 1 Years',
        languages: ['English'],
        ageRange: { min: '20', max: '28' },
        stipend: { type: 'Fixed', amount: 12000 },
        skills: ['Node.js', 'Express', 'MongoDB'],
        benefits: ['Pre-placement Offer', 'Flexible Hours'],
        description: 'Help us scale our high-performance backend infrastructure.',
        requirements: 'Strong understanding of Node.js and MongoDB.',
        otherInfo: '',
        status: 'pending', // In Review
        applicants: 12,
        createdAt: '2026-02-12',
    },
    {
        id: 'job_003',
        applicationType: 'Internship',
        title: 'Content Marketing Intern',
        category: 'Marketing',
        subCategory: 'Social Media',
        jobType: '',
        urgentHiring: 'No',
        workType: 'Remote',
        location: '',
        internsRequired: 1,
        duration: '2 Months',
        workingHours: '4 Hours/Day',
        experienceRange: '0 to 1 Years',
        languages: ['English', 'Hindi'],
        ageRange: { min: '18', max: '26' },
        stipend: { type: 'Negotiable', amount: 0 },
        skills: ['SEO', 'Copywriting'],
        benefits: ['Certificate'],
        description: 'Craft beautiful stories and grow our digital presence.',
        requirements: 'Excellent writing skills.',
        otherInfo: '',
        status: 'paused',
        applicants: 8,
        createdAt: '2026-02-20',
    },
    {
        id: 'job_004',
        applicationType: 'Internship',
        title: 'Business Development Intern',
        category: 'Business',
        subCategory: 'Sales',
        jobType: '',
        urgentHiring: 'Yes',
        workType: 'In-person',
        location: 'Pune, Maharashtra',
        internsRequired: 2,
        duration: '3 Months',
        workingHours: '6 Hours/Day',
        experienceRange: '1 to 2 Years',
        languages: ['English', 'Hindi'],
        ageRange: { min: '20', max: '30' },
        stipend: { type: 'Fixed', amount: 10000 },
        skills: ['Communication', 'Negotiation', 'CRM'],
        benefits: ['Certificate', 'Mentorship'],
        description: 'Support outbound sales and partnership research.',
        requirements: 'Strong communication and interpersonal skills.',
        otherInfo: '',
        status: 'rejected',
        applicants: 5,
        createdAt: '2026-02-22',
    }
];

const initialState = {
    jobs: dummyJobs,
    isWizardOpen: false,
    currentStep: 1,
    statusFilter: 'all',
    draft: {
        applicationType: 'Internship', // Job or Internship
        title: '',
        category: '',
        subCategory: '',
        jobType: '',
        urgentHiring: 'No',
        internsRequired: 1,
        workType: 'Remote',
        location: '',
        duration: '3 Months',
        workingHours: '4 Hours/Day',
        experienceRange: '',
        languages: [],
        ageRange: { min: '', max: '' },
        stipend: { type: 'Fixed', minAmount: '', maxAmount: '', amount: '' },
        salary: { minAmount: '', maxAmount: '' },
        skills: [],
        benefits: [],
        description: '',
        otherInfo: '',
    },
};

const jobsSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        toggleWizard: (state) => {
            state.isWizardOpen = !state.isWizardOpen;
        },
        nextStep: (state) => {
            state.currentStep += 1;
        },
        prevStep: (state) => {
            state.currentStep -= 1;
        },
        updateDraft: (state, action) => {
            state.draft = { ...state.draft, ...action.payload };
        },
        resetWizard: (state) => {
            state.currentStep = 1;
            state.draft = initialState.draft;
        },
        setStatusFilter: (state, action) => {
            state.statusFilter = action.payload;
        },
        addJob: (state, action) => {
            state.jobs.unshift(action.payload);
        },
        deleteJob: (state, action) => {
            state.jobs = state.jobs.filter(job => job.id !== action.payload);
        }
    },
});

export const {
    toggleWizard,
    nextStep,
    prevStep,
    updateDraft,
    resetWizard,
    setStatusFilter,
    addJob,
    deleteJob
} = jobsSlice.actions;

export default jobsSlice.reducer;
