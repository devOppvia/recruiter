import { createSlice } from '@reduxjs/toolkit';

// Dummy data removed for API integration

const initialState = {
    candidates: [],
    selectedIds: [],
    statusFilter: 'all',
    searchQuery: '',
    openedCandidateIds: [],
    isLoading: false,
    error: null,
    pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
    },
    counts: {
        all: 0,
        fresh: 0,
        opened: 0,
        shortlisted: 0,
        interview: 0,
        hired: 0,
        rejected: 0,
    }
};

const candidatesSlice = createSlice({
    name: 'candidates',
    initialState,
    reducers: {
        setCandidates: (state, action) => {
            state.candidates = action.payload.candidates || [];
            if (action.payload.pagination) {
                state.pagination = action.payload.pagination;
            }
            if (action.payload.counts) {
                state.counts = action.payload.counts;
            }
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        updateCandidateSuccess: (state, action) => {
            const { ids, status } = action.payload;
            state.candidates.forEach(c => {
                if (ids.includes(c.id)) {
                    c.status = status;
                }
            });
            state.selectedIds = [];
        },
        setStatusFilter: (state, action) => {
            state.statusFilter = action.payload;
            state.pagination.currentPage = 1; // Reset to page 1 on filter change
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
            state.pagination.currentPage = 1; // Reset to page 1 on search change
        },
        markCandidateOpened: (state, action) => {
            const candidateId = action.payload;
            if (!state.openedCandidateIds.includes(candidateId)) {
                state.openedCandidateIds.push(candidateId);
            }
        },
    },
});

export const {
    setCandidates,
    setLoading,
    setError,
    setPagination,
    updateCandidateSuccess,
    setStatusFilter,
    setSearchQuery,
    markCandidateOpened,
    toggleSelection,
    selectAll,
    deselectAll,
} = candidatesSlice.actions;
export default candidatesSlice.reducer;
