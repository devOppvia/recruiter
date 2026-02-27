import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tickets: [
        {
            id: 'SUP-1024',
            subject: 'Issue with Candidate Filtering',
            category: 'Technical',
            status: 'open',
            priority: 'high',
            lastMessage: 'We are looking into this...',
            createdAt: '2026-02-23T10:00:00Z',
            messages: [
                {
                    id: 1,
                    sender: 'user',
                    text: 'I cannot filter candidates by skill accurately. Some results are missing.',
                    timestamp: '2026-02-23T10:00:00Z'
                },
                {
                    id: 2,
                    sender: 'support',
                    text: 'Hello! Thank you for reporting this. Could you please specify which skills are problematic?',
                    timestamp: '2026-02-23T10:15:00Z'
                }
            ]
        },
        {
            id: 'SUP-1025',
            subject: 'Billing Question - Invoice #892',
            category: 'Billing',
            status: 'resolved',
            priority: 'medium',
            lastMessage: 'Invoice has been re-sent.',
            createdAt: '2026-02-22T14:30:00Z',
            messages: [
                {
                    id: 1,
                    sender: 'user',
                    text: 'I haven\'t received my invoice for this month.',
                    timestamp: '2026-02-22T14:30:00Z'
                },
                {
                    id: 2,
                    sender: 'support',
                    text: 'Checking your account now...',
                    timestamp: '2026-02-22T14:45:00Z'
                },
                {
                    id: 3,
                    sender: 'support',
                    text: 'The invoice has been re-sent to your registered email address. Let us know if you need anything else!',
                    timestamp: '2026-02-22T15:00:00Z'
                }
            ]
        },
        {
            id: 'SUP-1026',
            subject: 'Resume Bank Access',
            category: 'Account',
            status: 'in-progress',
            priority: 'low',
            lastMessage: 'Account is being verified.',
            createdAt: '2026-02-24T09:00:00Z',
            messages: [
                {
                    id: 1,
                    sender: 'user',
                    text: 'I upgrade to Growth but cannot access Resume Bank.',
                    timestamp: '2026-02-24T09:00:00Z'
                }
            ]
        }
    ],
    isModalOpen: false,
    activeTicketId: null,
};

const supportSlice = createSlice({
    name: 'support',
    initialState,
    reducers: {
        toggleSupportModal: (state) => {
            state.isModalOpen = !state.isModalOpen;
        },
        setActiveTicket: (state, action) => {
            state.activeTicketId = action.payload;
        },
        addTicket: (state, action) => {
            const newTicket = {
                id: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
                ...action.payload,
                status: 'open',
                lastMessage: 'Awaiting support...',
                createdAt: new Date().toISOString(),
                messages: [
                    {
                        id: 1,
                        sender: 'user',
                        text: action.payload.message,
                        timestamp: new Date().toISOString()
                    }
                ]
            };
            state.tickets.unshift(newTicket);
            state.isModalOpen = false;
        },
        addMessage: (state, action) => {
            const { ticketId, text } = action.payload;
            const ticket = state.tickets.find(t => t.id === ticketId);
            if (ticket) {
                const newMessage = {
                    id: ticket.messages.length + 1,
                    sender: 'user',
                    text,
                    timestamp: new Date().toISOString()
                };
                ticket.messages.push(newMessage);
                ticket.lastMessage = text;
            }
        },
    },
});

export const { toggleSupportModal, setActiveTicket, addTicket, addMessage } = supportSlice.actions;
export default supportSlice.reducer;
