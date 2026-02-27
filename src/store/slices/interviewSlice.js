import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isModalOpen: false,
    selectedCandidate: null,
    loading: false,
    error: null,
};

const interviewSlice = createSlice({
    name: 'interview',
    initialState,
    reducers: {
        openInterviewModal: (state, action) => {
            state.isModalOpen = true;
            state.selectedCandidate = action.payload;
        },
        closeInterviewModal: (state) => {
            state.isModalOpen = false;
            state.selectedCandidate = null;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    openInterviewModal,
    closeInterviewModal,
    setLoading,
    setError,
} = interviewSlice.actions;

export default interviewSlice.reducer;
