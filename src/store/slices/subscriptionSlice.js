import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "plans",
  currentPlanId: null, // store active plan id globally
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    setCurrentPlanId: (state, action) => {
      state.currentPlanId = action.payload;
    },
  },
});

export const { setActiveTab, setCurrentPlanId } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;