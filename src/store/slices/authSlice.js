import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: {
        id: 'comp_001',
        companyName: 'Acme Corporation',
        email: 'contact@acmecorp.com',
        logo: null,
        industry: 'Technology',
        companySize: '51-200',
        plan: 'Growth',
    },
    isAuthenticated: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        updateProfile: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
    },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
