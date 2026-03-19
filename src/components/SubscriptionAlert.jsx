import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Clock, Briefcase, FileText } from "lucide-react";
import { setSubscriptionData } from "../store/slices/subscriptionSlice";
import { getPurchasedSubscriptionsApi } from "../helper/api";

const SubscriptionAlert = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subscriptionData } = useSelector((state) => state.subscription);
  const [isVisible, setIsVisible] = useState(false);
  const [alertReasons, setAlertReasons] = useState([]);

  const COMPANY_ID = localStorage.getItem("companyId");

  const fetchSubscriptionData = async () => {
    if (!COMPANY_ID) return;
    try {
      const res = await getPurchasedSubscriptionsApi(COMPANY_ID);
      if (res?.data && res.data.length > 0) {
        dispatch(setSubscriptionData(res.data[0]));
      }
    } catch (err) {
      console.error("Fetch subscription error:", err);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  useEffect(() => {
    if (!subscriptionData) {
      setIsVisible(false);
      return;
    }

    const reasons = [];
    const now = new Date();
    const subscriptionEnd = new Date(subscriptionData.subscriptionEnd);
    const jobPostingCredits = subscriptionData.jobPostingCredits || 0;
    const resumeAccessCredits = subscriptionData.resumeAccessCredits || 0;

    // Check if subscription is expiring within 3 days
    const daysUntilExpiry = Math.ceil(
      (subscriptionEnd - now) / (1000 * 60 * 60 * 24),
    );
    if (daysUntilExpiry <= 3 && daysUntilExpiry >= 0) {
      reasons.push({
        type: "expiry",
        message: `Your subscription expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? "" : "s"}`,
        icon: Clock,
      });
    }

    // Check job posting credits
    if (jobPostingCredits < 5) {
      reasons.push({
        type: "jobCredits",
        message: `Only ${jobPostingCredits} job posting credit${jobPostingCredits === 1 ? "" : "s"} remaining`,
        icon: Briefcase,
      });
    }

    // Check resume access credits
    if (resumeAccessCredits < 10) {
      reasons.push({
        type: "resumeCredits",
        message: `Only ${resumeAccessCredits} resume access credit${resumeAccessCredits === 1 ? "" : "s"} remaining`,
        icon: FileText,
      });
    }

    setAlertReasons(reasons);
    setIsVisible(reasons.length > 0);
  }, [subscriptionData]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || alertReasons.length === 0) return null;

  const handlePurchasePlan = () => {
    navigate("/dashboard/subscription");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-0 left-0 right-0 z-100 bg-brand-primary shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                <AlertTriangle size={18} strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                {alertReasons.map((reason, index) => {
                  const Icon = reason.icon;
                  return (
                    <div
                      key={reason.type}
                      className="flex items-center gap-2 text-white"
                    >
                      <Icon size={14} strokeWidth={2.5} />
                      <span className="text-xs font-bold">
                        {reason.message}
                      </span>
                      {index < alertReasons.length - 1 && (
                        <span className="text-white/30">|</span>
                      )}
                    </div>
                  );
                })}
                <button
                  onClick={handlePurchasePlan}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white text-brand-primary text-xs font-black uppercase tracking-widest rounded-lg hover:bg-white/90 transition-colors"
                >
                  Purchase New Plan
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionAlert;
