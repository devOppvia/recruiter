import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : {},
    isAuthenticated: localStorage.getItem("token") ? true : false,
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
        updateCompanyDetails: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
    },
});

export const { login, logout, updateProfile,updateCompanyDetails } = authSlice.actions;
export default authSlice.reducer;
