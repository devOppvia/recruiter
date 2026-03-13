import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  count: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.count = action.payload.length;
    },

    clearNotifications: (state) => {
      state.notifications = [];
      state.count = 0;
    },
  },
});

export const { setNotifications, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;