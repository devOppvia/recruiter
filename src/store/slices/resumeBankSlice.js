import { createSlice } from '@reduxjs/toolkit';

const dummyResumes = [
    {
        id: 'res_001',
        name: 'Riya Sharma',
        education: 'B.Tech Computer Science — IIT Delhi',
        skills: ['React', 'JavaScript', 'CSS', 'Node.js'],
        city: 'Mumbai',
        department: 'Frontend',
        industry: 'Tech',
        gender: 'Female',
        experience: 'Fresher',
        preferences: 'Remote, Full-time',
        avatar: null,
    },
    {
        id: 'res_002',
        name: 'Arjun Mehta',
        education: 'MBA Marketing — IIM Ahmedabad',
        skills: ['Marketing Strategy', 'SEO', 'Content Writing', 'Analytics'],
        city: 'Delhi',
        department: 'Marketing',
        industry: 'Finance',
        gender: 'Male',
        experience: '1 Internship',
        preferences: 'Hybrid, Part-time OK',
        avatar: null,
    },
    {
        id: 'res_003',
        name: 'Priya Nair',
        education: 'B.Des Communication Design — NID',
        skills: ['Figma', 'Adobe XD', 'Illustration', 'Prototyping'],
        city: 'Mumbai',
        department: 'Design',
        industry: 'Tech',
        gender: 'Female',
        experience: '2 Internships',
        preferences: 'In-person, Full-time',
        avatar: null,
    },
    {
        id: 'res_004',
        name: 'Karan Patel',
        education: 'B.Tech CSE — BITS Pilani',
        skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
        city: 'Bangalore',
        department: 'Backend',
        industry: 'Tech',
        gender: 'Male',
        experience: '1 Internship',
        preferences: 'Remote, Full-time',
        avatar: null,
    },
    {
        id: 'res_005',
        name: 'Ananya Gupta',
        education: 'B.Sc Statistics — St. Xavier\'s College',
        skills: ['Python', 'R', 'SQL', 'Tableau', 'Power BI'],
        city: 'Pune',
        department: 'Data Science',
        industry: 'Finance',
        gender: 'Female',
        experience: 'Fresher',
        preferences: 'Remote, Part-time OK',
        avatar: null,
    },
    {
        id: 'res_006',
        name: 'Vikram Singh',
        education: 'B.Des Visual Communication — Srishti Institute',
        skills: ['Photoshop', 'Illustrator', 'After Effects', 'Motion Graphics'],
        city: 'Delhi',
        department: 'Design',
        industry: 'Design',
        gender: 'Male',
        experience: '1 Internship',
        preferences: 'Hybrid, Full-time',
        avatar: null,
    },
];

const initialState = {
    resumes: dummyResumes,
    filters: {
        industry: [],
        department: [],
        city: [],
        gender: [],
    },
    previewId: null,
};

const resumeBankSlice = createSlice({
    name: 'resumeBank',
    initialState,
    reducers: {
        toggleFilter: (state, action) => {
            const { category, value } = action.payload;
            const arr = state.filters[category];
            const idx = arr.indexOf(value);
            if (idx >= 0) {
                arr.splice(idx, 1);
            } else {
                arr.push(value);
            }
        },
        clearFilters: (state) => {
            state.filters = { industry: [], department: [], city: [], gender: [] };
        },
        removeFilter: (state, action) => {
            const { category, value } = action.payload;
            state.filters[category] = state.filters[category].filter(v => v !== value);
        },
        setPreview: (state, action) => {
            state.previewId = action.payload;
        },
        closePreview: (state) => {
            state.previewId = null;
        },
    },
});

export const {
    toggleFilter,
    clearFilters,
    removeFilter,
    setPreview,
    closePreview,
} = resumeBankSlice.actions;
export default resumeBankSlice.reducer;
