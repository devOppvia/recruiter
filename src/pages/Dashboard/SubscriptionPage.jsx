import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Crown,
  Zap,
  Building2,
  CreditCard,
  Calendar,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Download,
  X,
} from "lucide-react";
import Button from "../../components/Button";
import Tooltip from "../../components/Tooltip";
import { setActiveTab } from "../../store/slices/subscriptionSlice";
import {
  COMPANY_ID,
  getSubscriptionPackagesApi,
  getPurchasedSubscriptionsApi,
  subscriptionApi,
  subscriptionVerifyPaymentApi,
  getPaymentHistoryApi,
} from "../../helper/api";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { setCurrentPlanId } from "../../store/slices/subscriptionSlice";
const planIcons = {
  basic: Zap,
  growth: Crown,
  enterprise: Building2,
};

const planThemeColors = {
  basic: "text-[#6b7280]",
  growth: "text-brand-primary",
  enterprise: "text-purple-600",
};

const planBgColors = {
  basic: "bg-[#9ca3af]/5",
  growth: "bg-brand-primary/5",
  enterprise: "bg-purple-600/5",
};
const featureLabels = {
  expireDaysPackage: "Expire Days Package",
  numberOfJobPosting: "Job Posting Limit",
  numberOfResumeAccess: "Candidate Access",
  jobDaysActive: "Job Days Active",
  numberOfResumeAccess: "Number Of Resume Access",
};

const featureTooltips = {
  expireDaysPackage: "Expire Days Package",
  jobPostingLimit: "Job Posting Limit",
  numberOfResumeAccess: "Candidate Access",
  jobDaysActive: "Job Days Active",
  numberOfResumeAccess: "Number Of Resume Access",
};
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const SubscriptionPage = () => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((state) => state.subscription);
  console.log("active tab : ", activeTab);
  const [plans, setPlans] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await getSubscriptionPackagesApi(COMPANY_ID);

      if (res?.data) {
        setPlans(res.data);

        const active = res.data.find((p) => p.isPurchased || p.isCurrent);

        if (active) {
          setCurrentPlan(active.id);
          dispatch(setCurrentPlanId(active.id)); // store in redux
        }
      }
    } catch (err) {
      console.error("Fetch packages error:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchPurchasedPlans = async () => {
    try {
      const res = await getPaymentHistoryApi(COMPANY_ID);

      if (res?.data) {
        setPaymentHistory(res.data);
      }
    } catch (err) {
      console.error("Fetch purchased plans error:", err);
    }
  };

  useEffect(() => {
    if (COMPANY_ID) {
      fetchPackages();
      fetchPurchasedPlans();
    }
  }, []);

  const handleSubscriptionClick = async (plan) => {
    try {
      const body = {
        companyId: COMPANY_ID,
        amount: plan?.discountedPrice,
        currency: "INR",
        subsciptionPlanId: plan?.id,
      };

      const data = await subscriptionApi(body);

      openRazorpayCheckout({
        ...data,
        companyId: body.companyId,
        subsciptionPlanId: body.subsciptionPlanId,
      });
    } catch (err) {
      console.error("Subscription API Error:", err);
      toast.error("Something went wrong");
    }
  };

  const openRazorpayCheckout = (data) => {
    if (!data || !window.Razorpay) {
      toast.error("Razorpay SDK not loaded");
      return;
    }

    const options = {
      key: "rzp_test_RlYjFWZ8v5e15u",
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      name: "Company Subscription",
      description: "Subscription Payment",

      handler: async function (response) {
        try {
          const body = {
            companyId: data.companyId,
            subsciptionPlanId: data.subsciptionPlanId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          await subscriptionVerifyPaymentApi(body);

          toast.success("Payment successful");

          fetchPackages();
          fetchPurchasedPlans();
        } catch (err) {
          console.error("Verify payment error:", err);
        }
      },

      theme: { color: "#2B5F60" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-10"
    >
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-brand-primary text-editorial tracking-tighter">
            Billing &{" "}
            <span className="text-brand-primary/40">Subscription</span>
          </h1>
          <p className="text-sm font-bold text-brand-primary/30">
            Manage your recruitment power and billing history.
          </p>
        </div>
      </div>

      {/* Premium Tab Navigation */}
      <div className="flex items-center gap-1.5 bg-brand-primary/5 p-1.5 rounded-2xl w-fit">
        {[
          { id: "plans", label: "Plans & Pricing", icon: Sparkles },
          { id: "history", label: "Payment History", icon: Calendar },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => dispatch(setActiveTab(t.id))}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                activeTab === t.id
                  ? "bg-white text-brand-primary shadow-soft"
                  : "text-brand-primary/40 hover:text-brand-primary hover:bg-white/50"
              }`}
            >
              <Icon
                size={14}
                strokeWidth={3}
                className={
                  activeTab === t.id
                    ? "text-brand-primary"
                    : "text-brand-primary/30"
                }
              />
              {t.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "plans" ? (
          <motion.div
            key="plans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => {
                const planKey =
                  plan.packageName?.toLowerCase() ||
                  plan.name?.toLowerCase() ||
                  plan.id;
                const Icon = planIcons[planKey] || planIcons[plan.id] || Zap;
                const isCurrent = plan.id === currentPlan;
                const isUpgrade =
                  plans.findIndex((p) => p.id === plan.id) >
                  plans.findIndex((p) => p.id === currentPlan);
                const themeColor =
                  planThemeColors[planKey] ||
                  planThemeColors[plan.id] ||
                  planThemeColors.basic;
                const bgColor =
                  planBgColors[planKey] ||
                  planBgColors[plan.id] ||
                  planBgColors.basic;

                return (
                  <motion.div
                    key={plan.id}
                    variants={item}
                    initial="hidden"
                    animate="show"
                    className={`group relative bg-white rounded-[32px] border border-brand-primary/5 shadow-soft hover:shadow-premium transition-all duration-500 flex flex-col overflow-hidden ${isCurrent ? "ring-2 ring-brand-primary ring-offset-4 ring-offset-brand-primary/5" : ""}`}
                  >
                    {/* Status Ribbon */}
                    {isCurrent && (
                      <div className="absolute top-6 right-6">
                        <div className="px-3 py-1 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-soft flex items-center gap-1.5">
                          <ShieldCheck size={12} strokeWidth={3} />
                          Active
                        </div>
                      </div>
                    )}

                    <div className="p-8 space-y-6 flex-1">
                      <div className="space-y-2">
                        <div
                          className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center ${themeColor} shadow-soft relative overflow-hidden group-hover:scale-110 transition-transform duration-500`}
                        >
                          <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent" />
                          <Icon size={24} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-black text-brand-primary tracking-tighter uppercase mt-4">
                          {plan.packageName}
                        </h3>
                      </div>

                      <div className="flex flex-col items-baseline gap-1">
                        {plan?.discountedPrice ? (
                          <span className="text-4xl font-black text-brand-primary tracking-tighter">
                            ₹{plan?.discountedPrice}{" "}
                            <span className="opacity-50 ml-2 line-through">
                              ₹{plan?.actualPrice}
                            </span>
                          </span>
                        ) : (
                          <span className="text-4xl font-black text-brand-primary tracking-tighter"></span>
                        )}

                        <div>
                          <span className="text-xs font-bold text-brand-primary/60 uppercase tracking-widest">
                            Valid for
                            <span className="text-brand-primary mr-1">
                              {" "}
                              {plan.expireDaysPackage}
                            </span>
                            days
                          </span>
                        </div>
                      </div>

                      <div>
                        {console.log("pan data : ", plan)}
                        {Object.entries(featureLabels)?.map(([key, label]) => (
                          <div
                            key={key}
                            className=" flex justify-between transition-colors group"
                          >
                            <div className="text-sm">{label}</div>

                            <div
                              key={plan.id}
                              className={` text-center ${
                                plan.id === currentPlan
                                  ? "bg-brand-primary/3"
                                  : ""
                              }`}
                            >
                              <span className="text-xs font-black text-brand-primary">
                                {plan?.[key] ?? "-"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className="p-4 pt-0">
                      {isCurrent ? (
                        <div className="w-full py-5 bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-[24px] flex items-center justify-center gap-2 shadow-inner">
                          Current Power Level
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSubscriptionClick(plan)}
                          className={`w-full py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-soft border border-brand-primary/5 ${
                            isUpgrade
                              ? "bg-brand-primary text-white hover:bg-brand-primary-light hover:shadow-premium"
                              : "bg-white text-brand-primary hover:bg-brand-primary/5"
                          }`}
                        >
                          {isUpgrade ? "Upgrade Your Potential" : "Review Plan"}
                          <ArrowRight
                            size={14}
                            strokeWidth={3}
                            className={`transition-transform duration-300 ${isUpgrade ? "group-hover/btn:translate-x-1" : ""}`}
                          />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Feature Comparison Table */}
            <div className="bg-white rounded-[32px] border border-brand-primary/5 shadow-soft overflow-hidden">
              <div className="p-8 border-b border-brand-primary/5 flex items-center justify-between bg-brand-primary/2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-soft">
                    <TrendingUp size={18} strokeWidth={3} />
                  </div>
                  <h3 className="text-lg font-black text-brand-primary tracking-tighter">
                    Feature{" "}
                    <span className="text-brand-primary/40">Comparison</span>
                  </h3>
                </div>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="bg-brand-primary/2">
                      <th className="px-8 py-5 text-left text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">
                        Capability
                      </th>
                      {plans.map((p) => (
                        <th
                          key={p.id}
                          className={`px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest transition-colors ${p.id === currentPlan ? "text-brand-primary" : "text-brand-primary/40"}`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            {p.id === currentPlan && (
                              <span className="text-[8px] bg-brand-primary text-white px-1.5 py-0.5 rounded-sm mb-1">
                                CURRENT
                              </span>
                            )}
                            {p.packageName}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-primary/5">
                    {Object.entries(featureLabels)?.map(([key, label]) => (
                      <tr
                        key={key}
                        className="hover:bg-brand-primary/2 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-brand-primary/70">
                              {label}
                            </span>
                            <Tooltip text={featureTooltips[key]} size={12} />
                          </div>
                        </td>
                        {plans?.map((p) => {
                          let value = "-";

                          if (key === "expireDaysPackage") {
                            value = p.expireDaysPackage || "-";
                          }

                          if (key === "numberOfJobPosting") {
                            value =
                              p.numberOfJobPosting ||
                              p.jobPostingCredits ||
                              "-";
                          }

                          if (key === "candidateAccess") {
                            value =
                              p.numberOfResumeAccess ||
                              p.resumeAccessCredits ||
                              "-";
                          }

                          if (key === "jobDaysActive") {
                            value = p.jobDaysActive || "-";
                          }

                          if (key === "numberOfResumeAccess") {
                            value = p.numberOfResumeAccess || "-";
                          }

                          return (
                            <td
                              key={p.id}
                              className={`px-8 py-5 text-center ${
                                p.id === currentPlan ? "bg-brand-primary/3" : ""
                              }`}
                            >
                              <span className="text-xs font-black text-brand-primary">
                                {value ?? "-"}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[32px] border border-brand-primary/5 shadow-soft overflow-hidden"
          >
            <div className="p-8 border-b border-brand-primary/5 flex items-center bg-brand-primary/2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-soft">
                  <CreditCard size={18} strokeWidth={3} />
                </div>
                <h3 className="text-lg font-black text-brand-primary tracking-tighter">
                  Payment <span className="text-brand-primary/40">History</span>
                </h3>
              </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full">
                <thead>
                  <tr className="bg-brand-primary/2">
                    <th className="px-8 py-5 text-left text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">
                      Payment id
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">
                      Payment Date
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">
                      Plan Name
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">
                      Invoice Amount
                    </th>

                    <th className="px-8 py-5 text-left text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-primary/5">
                  {paymentHistory.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-brand-primary/2 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary/30 group-hover:text-brand-primary transition-colors">
                            <CreditCard size={14} strokeWidth={2.5} />
                          </div>
                          <span className="text-xs font-bold text-brand-primary/70">
                            {p.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary/30 group-hover:text-brand-primary transition-colors">
                            <Calendar size={14} strokeWidth={2.5} />
                          </div>
                          <span className="text-xs font-bold text-brand-primary/70">
                            {new Date(p.purchasedAt).toLocaleDateString(
                              "en-IN",
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-black text-brand-primary uppercase tracking-widest">
                          {p.subscription?.packageName}{" "}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-xs font-black text-brand-primary">
                        ₹{p.amountPaid}
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/10 ${p.paymentStatus == "captured" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}
                        >
                          {p.paymentStatus == "captured" ? "Paid" : "Failed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SubscriptionPage;
