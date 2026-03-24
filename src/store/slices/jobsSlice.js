import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    jobs: [],
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
        jobCategoryId: '',
        jobSubCategoryId: '',
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
