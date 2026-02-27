import { createSlice } from '@reduxjs/toolkit';

const dummyCandidates = [
    {
        id: 'cand_001',
        name: 'Riya Sharma',
        email: 'riya.sharma@email.com',
        phone: '+91 98765 43210',
        position: 'Frontend Developer Intern',
        jobId: 'job_001',
        status: 'under_review',
        skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Tailwind CSS', 'TypeScript'],
        education: 'B.Tech Computer Science — IIT Delhi',
        appliedAt: '2026-02-15',
        experience: 'Fresher',
        avatar: null,
        interview: null,
        resumeUrl: '#',
    },
    {
        id: 'cand_002',
        name: 'Arjun Mehta',
        email: 'arjun.mehta@email.com',
        phone: '+91 87654 32100',
        position: 'Frontend Developer Intern',
        jobId: 'job_001',
        status: 'shortlisted',
        skills: ['React', 'Vue.js', 'Node.js', 'MongoDB'],
        education: 'B.Tech IT — NIT Trichy',
        appliedAt: '2026-02-14',
        experience: '1 Prior Internship',
        avatar: null,
        interview: {
            mode: 'Google Meet',
            date: '2026-02-28',
            time: '10:00 AM',
            response: 'confirmed',
        },
        resumeUrl: '#',
    },
    {
        id: 'cand_003',
        name: 'Priya Nair',
        email: 'priya.nair@email.com',
        phone: '+91 76543 21000',
        position: 'UI/UX Design Intern',
        jobId: 'job_002',
        status: 'interview_scheduled',
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'Wireframing', 'User Research'],
        education: 'B.Des Communication Design — NID',
        appliedAt: '2026-02-13',
        experience: '2 Prior Internships',
        avatar: null,
        interview: {
            mode: 'In-Person',
            date: '2026-02-27',
            time: '02:00 PM',
            response: 'confirmed',
        },
        resumeUrl: '#',
    },
    {
        id: 'cand_004',
        name: 'Karan Patel',
        email: 'karan.patel@email.com',
        phone: '+91 65432 10987',
        position: 'Frontend Developer Intern',
        jobId: 'job_001',
        status: 'hired',
        skills: ['React', 'Next.js', 'Tailwind CSS'],
        education: 'B.Tech CSE — BITS Pilani',
        appliedAt: '2026-02-10',
        experience: '1 Prior Internship',
        avatar: null,
        interview: {
            mode: 'Google Meet',
            date: '2026-02-20',
            time: '11:00 AM',
            response: 'confirmed',
        },
        resumeUrl: '#',
    },
    {
        id: 'cand_005',
        name: 'Sneha Kulkarni',
        email: 'sneha.k@email.com',
        phone: '+91 54321 09876',
        position: 'UI/UX Design Intern',
        jobId: 'job_002',
        status: 'rejected',
        skills: ['Canva', 'Figma'],
        education: 'BCA — Mumbai University',
        appliedAt: '2026-02-12',
        experience: 'Fresher',
        avatar: null,
        interview: null,
        resumeUrl: '#',
    },
    {
        id: 'cand_006',
        name: 'Rahul Verma',
        email: 'rahul.v@email.com',
        phone: '+91 43210 98765',
        position: 'Backend Developer Intern',
        jobId: 'job_003',
        status: 'under_review',
        skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Redis'],
        education: 'M.Tech Software Engineering — IIIT Hyderabad',
        appliedAt: '2026-02-21',
        experience: '1 Prior Internship',
        avatar: null,
        interview: null,
        resumeUrl: '#',
    },
    {
        id: 'cand_007',
        name: 'Ananya Gupta',
        email: 'ananya.g@email.com',
        phone: '+91 32109 87654',
        position: 'Data Analytics Intern',
        jobId: 'job_005',
        status: 'shortlisted',
        skills: ['Python', 'SQL', 'Power BI', 'Excel', 'Tableau', 'Machine Learning'],
        education: 'B.Sc Statistics — St. Xavier\'s College',
        appliedAt: '2026-01-20',
        experience: 'Fresher',
        avatar: null,
        interview: {
            mode: 'Online',
            date: '2026-03-01',
            time: '03:00 PM',
            response: 'no_response',
        },
        resumeUrl: '#',
    },
    {
        id: 'cand_008',
        name: 'Vikram Singh',
        email: 'vikram.s@email.com',
        phone: '+91 21098 76543',
        position: 'Graphic Design Intern',
        jobId: 'job_007',
        status: 'under_review',
        skills: ['Photoshop', 'Illustrator', 'InDesign', 'After Effects'],
        education: 'B.Des Visual Communication — Srishti Institute',
        appliedAt: '2026-02-05',
        experience: '1 Prior Internship',
        avatar: null,
        interview: null,
        resumeUrl: '#',
    },
];

const initialState = {
    candidates: dummyCandidates,
    selectedIds: [],
    statusFilter: 'all',
    searchQuery: '',
    openedCandidateIds: [],
};

const candidatesSlice = createSlice({
    name: 'candidates',
    initialState,
    reducers: {
        toggleSelection: (state, action) => {
            const id = action.payload;
            if (state.selectedIds.includes(id)) {
                state.selectedIds = state.selectedIds.filter(i => i !== id);
            } else {
                state.selectedIds.push(id);
            }
        },
        selectAll: (state) => {
            state.selectedIds = state.candidates.map(c => c.id);
        },
        deselectAll: (state) => {
            state.selectedIds = [];
        },
        updateCandidateStatus: (state, action) => {
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
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
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
    toggleSelection,
    selectAll,
    deselectAll,
    updateCandidateStatus,
    setStatusFilter,
    setSearchQuery,
    markCandidateOpened,
} = candidatesSlice.actions;
export default candidatesSlice.reducer;
