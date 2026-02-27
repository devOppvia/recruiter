import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobsReducer from './slices/jobsSlice';
import candidatesReducer from './slices/candidatesSlice';
import resumeBankReducer from './slices/resumeBankSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import interviewReducer from './slices/interviewSlice';
import supportReducer from './slices/supportSlice';
import notificationReducer from './slices/notificationSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        jobs: jobsReducer,
        candidates: candidatesReducer,
        resumeBank: resumeBankReducer,
        subscription: subscriptionReducer,
        interview: interviewReducer,
        support: supportReducer,
        notifications: notificationReducer,
        profile: profileReducer,
    },
});

export default store;
