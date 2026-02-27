import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    company: {
        name: 'TechFlow Solutions',
        description: 'Building the future of recruitment with AI-driven analytics and premium talent matching.',
        logo: '/logo.png',
        industry: 'Technology',
        website: 'https://techflow.io',
        email: 'admin@techflow.io',
        mobile: '+91 98765 43210',
        contactPerson: 'Sarah Jenkins',
        address: '101 Tech Park, Hitech City, Hyderabad, India',
        locations: [
            '101 Tech Park, Hitech City, Hyderabad, India',
            'Andheri East, Mumbai, Maharashtra',
            'Koramangala, Bengaluru, Karnataka',
        ],
    },
    industries: ['Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'Manufacturing', 'Other'],
    otpStep: 1, // 1: Current OTP, 2: New Info Entry, 3: New OTP, 4: Success
    isOtpModalOpen: false,
    otpType: null, // 'email' or 'mobile'
    tempInfo: '', // Temp storage for new email/mobile during flow
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateProfile: (state, action) => {
            state.company = { ...state.company, ...action.payload };
        },
        toggleOtpModal: (state, action) => {
            state.isOtpModalOpen = !state.isOtpModalOpen;
            state.otpType = action.payload || null;
            state.otpStep = 1;
            state.tempInfo = '';
        },
        nextOtpStep: (state) => {
            state.otpStep += 1;
        },
        setTempInfo: (state, action) => {
            state.tempInfo = action.payload;
        },
        confirmContactUpdate: (state) => {
            if (state.otpType === 'email') {
                state.company.email = state.tempInfo;
            } else if (state.otpType === 'mobile') {
                state.company.mobile = state.tempInfo;
            }
            state.isOtpModalOpen = false;
            state.otpStep = 1;
            state.tempInfo = '';
        },
    },
});

export const { updateProfile, toggleOtpModal, nextOtpStep, setTempInfo, confirmContactUpdate } = profileSlice.actions;
export default profileSlice.reducer;
