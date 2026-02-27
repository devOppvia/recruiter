import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notifications: [
        {
            id: 'notif_1',
            type: 'application',
            title: 'New Application',
            message: 'Sarah Jenkins applied for the UI Designer position.',
            time: '2 mins ago',
            isRead: false,
        },
        {
            id: 'notif_2',
            type: 'interview',
            title: 'Interview Confirmed',
            message: 'Michael Chen confirmed the technical interview for Backend Dev.',
            time: '1 hour ago',
            isRead: false,
        },
        {
            id: 'notif_3',
            type: 'system',
            title: 'Plan Upgrade Successful',
            message: 'Your account has been upgraded to the Growth Plan.',
            time: '5 hours ago',
            isRead: true,
        },
        {
            id: 'notif_4',
            type: 'application',
            title: 'New Application',
            message: 'Emily Watson applied for the Product Manager position.',
            time: '1 day ago',
            isRead: true,
        }
    ],
    unreadCount: 2,
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        markAsRead: (state, action) => {
            const notif = state.notifications.find(n => n.id === action.payload);
            if (notif && !notif.isRead) {
                notif.isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(n => n.isRead = true);
            state.unreadCount = 0;
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
    },
});

export const { markAsRead, markAllAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
