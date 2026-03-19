import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "plans",
  currentPlanId: null, // store active plan id globally
  subscriptionData: null, // stores subscription data globally
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

    setSubscriptionData: (state, action) => {
      state.subscriptionData = action.payload;
    },
  },
});

export const { setActiveTab, setCurrentPlanId, setSubscriptionData } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;