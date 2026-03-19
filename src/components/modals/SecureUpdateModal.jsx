import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldCheck,
  Mail,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  toggleOtpModal,
  nextOtpStep,
  setTempInfo,
  confirmContactUpdate,
} from "../../store/slices/profileSlice";
import Button from "../Button";
import Input from "../Input";
import {
  updateCompanyEmailWithOTP,
  verifyCompanyEmailWithOTP,
  sendCompanyNewEmailOtp,
  verifyAndUpdateNewMailWithOtpApi,
  updateComapanyMobileWithOTP,
  verifyCompanyMobileWithOTP,
  sendCompanyNewMobileOtp,
  verifyAndUpdateNewMobileWithOtpApi,
} from "../../helper/api";

import toast from "react-hot-toast";

const SecureUpdateModal = () => {
  const dispatch = useDispatch();
  const { isOtpModalOpen, otpStep, otpType, tempInfo, company } = useSelector(
    (state) => state.profile,
  );
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [inputValue, setInputValue] = useState("");
  const [timer, setTimer] = useState(30);
  const otpCode = otp.join("");

  const isEmail = otpType === "email";

  useEffect(() => {
    let interval;
    if (isOtpModalOpen && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpModalOpen, timer]);

  const handleOtpChange = (idx, val) => {
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && idx < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace") {
      // If current field is empty → move to previous
      if (!otp[idx] && idx > 0) {
        const prevInput = document.getElementById(`otp-${idx - 1}`);
        prevInput?.focus();
      }
    }
  };

  const resetOtp = () => {
    setOtp(["", "", "", ""]);
    setTimer(30);
  };
  const handleNext = async () => {
    const companyId = localStorage.getItem("companyId");
    const otpCode = otp.join("");

    try {
      // STEP 1 → Verify OLD contact OTP
      if (otpStep === 1) {
        if (isEmail) {
          await verifyCompanyEmailWithOTP(companyId, {
            otp: otpCode,
            email: company.email,
          });
        } else {
          await verifyCompanyMobileWithOTP(companyId, {
            otp: otpCode,
            mobileNumber: company.mobile,
          });
        }

        dispatch(nextOtpStep());
        resetOtp();
        toast.success(`${isEmail ? "Email" : "Mobile"} verified successfully`);
      }

      // STEP 2 → Send OTP to NEW contact
      else if (otpStep === 2) {
        if (isEmail) {
          await sendCompanyNewEmailOtp(companyId, {
            newEmail: inputValue,
          });
        } else {
          await sendCompanyNewMobileOtp(companyId, {
            newMobileNumber: inputValue,
          });
        }

        dispatch(setTempInfo(inputValue));
        dispatch(nextOtpStep());
        resetOtp();
        toast.success(`OTP sent to new ${isEmail ? "email" : "mobile"}`);
      }

      // STEP 3 → Verify NEW contact OTP
      else if (otpStep === 3) {
        if (isEmail) {
          await verifyAndUpdateNewMailWithOtpApi(companyId, {
            otp: otpCode,
            newEmail: tempInfo,
          });
        } else {
          await verifyAndUpdateNewMobileWithOtpApi(companyId, {
            otp: otpCode,
            newMobileNumber: tempInfo,
          });
        }

        dispatch(nextOtpStep());
        toast.success(`${isEmail ? "Email" : "Mobile"} updated successfully`);
      }
    } catch (error) {
      toast.error(error || "Something went wrong");
    }
  };

  const handleResend = async () => {
    const companyId = localStorage.getItem("companyId");

    try {
      if (otpStep === 1) {
        if (isEmail) {
          await updateCompanyEmailWithOTP(companyId, {
            email: company.email,
          });
        } else {
          await updateComapanyMobileWithOTP(companyId, {
            mobileNumber: company.mobile,
          });
        }
      }

      if (otpStep === 3) {
        if (isEmail) {
          await sendCompanyNewEmailOtp(companyId, {
            newEmail: tempInfo,
          });
        } else {
          await sendCompanyNewMobileOtp(companyId, {
            mobileNumber: tempInfo,
          });
        }
      }

      resetOtp();
      toast.success("OTP resent successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to resend OTP");
    }
  };

  if (!isOtpModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(toggleOtpModal())}
          className="absolute inset-0 bg-brand-primary/20 backdrop-blur-xl"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[40px] shadow-premium overflow-hidden border border-white/60 flex flex-col"
        >
          {/* Header */}
          <div className="px-10 pt-10 pb-6 flex justify-between items-center bg-brand-primary/2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary shadow-soft">
                <ShieldCheck size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-black text-brand-primary tracking-tighter uppercase">
                  Secure <span className="text-brand-primary/40">Update</span>
                </h2>
                <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">
                  Step {otpStep} of 3{" "}
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch(toggleOtpModal())}
              className="p-3 bg-white hover:bg-brand-primary/5 rounded-2xl text-brand-primary/40 hover:text-brand-primary transition-all shadow-soft"
            >
              <X size={18} strokeWidth={3} />
            </button>
          </div>

          {/* Content Steps */}
          <div className="p-10">
            <AnimatePresence mode="wait">
              {otpStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-brand-primary tracking-tight">
                      Verify Current {isEmail ? "Email" : "Mobile"}
                    </h3>
                    <p className="text-sm font-bold text-brand-primary/40 leading-relaxed">
                      We've sent a 6-digit verification code to{" "}
                      <span className="text-brand-primary">
                        {isEmail ? company.email : company.mobile}
                      </span>
                      . Enter it below to continue.
                    </p>
                  </div>

                  {/* OTP Inputs */}
                  <div className="flex justify-evenly gap-3">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)} // 👈 ADD THIS
                        className="w-12 h-14 bg-brand-primary/5 rounded-2xl border text-center font-black text-xl text-brand-primary shadow-soft focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    {timer > 0 ? (
                      <p className="text-[11px] font-bold text-brand-primary/30 italic">
                        Resend available in {timer}s
                      </p>
                    ) : (
                      <button
                        onClick={handleResend}
                        className="text-[11px] font-black text-brand-primary uppercase tracking-widest hover:text-brand-primary-light transition-colors flex items-center gap-2"
                      >
                        <RefreshCw size={12} strokeWidth={3} /> Resend Code
                      </button>
                    )}
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={otp.some((d) => !d)}
                    className="w-full rounded-2xl py-5 h-auto shadow-premium bg-brand-primary hover:bg-brand-primary-light transition-all flex items-center justify-center gap-3 group"
                  >
                    <span className="font-black uppercase tracking-widest text-xs">
                      Verify & Proceed
                    </span>
                    <ArrowRight
                      size={16}
                      strokeWidth={3}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Button>
                </motion.div>
              )}

              {otpStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-brand-primary tracking-tight">
                      Enter New {isEmail ? "Email Address" : "Mobile Number"}
                    </h3>
                    <p className="text-sm font-bold text-brand-primary/40 leading-relaxed">
                      Provide the new {isEmail ? "email" : "mobile"} you'd like
                      to use for your account.
                    </p>
                  </div>

                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-primary transition-colors">
                      {isEmail ? <Mail size={20} /> : <Smartphone size={20} />}
                    </div>
                    <input
                      type={isEmail ? "email" : "text"}
                      placeholder={
                        isEmail ? "new@techflow.io" : "+91 XXXXX XXXXX"
                      }
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 bg-brand-primary/2 rounded-2xl border-none font-bold text-brand-primary shadow-soft focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all"
                    />
                  </div>

                  <div className="p-5 bg-brand-primary/5 rounded-3xl flex items-start gap-4">
                    <AlertCircle
                      size={20}
                      className="text-brand-primary/40 shrink-0 mt-0.5"
                    />
                    <p className="text-[11px] font-bold text-brand-primary/60 leading-relaxed italic">
                      A verification code will be sent to this new{" "}
                      {isEmail ? "address" : "number"} to confirm you have
                      access to it.
                    </p>
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={!inputValue}
                    className="w-full rounded-2xl py-5 h-auto shadow-premium bg-brand-primary hover:bg-brand-primary-light transition-all flex items-center justify-center gap-3 group"
                  >
                    <span className="font-black uppercase tracking-widest text-xs">
                      Send Verification
                    </span>
                    <ArrowRight
                      size={16}
                      strokeWidth={3}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Button>
                </motion.div>
              )}

              {otpStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-brand-primary tracking-tight">
                      Verify New {isEmail ? "Email" : "Mobile"}
                    </h3>
                    <p className="text-sm font-bold text-brand-primary/40 leading-relaxed">
                      Almost there! Enter the 6-digit code sent to{" "}
                      <span className="text-brand-primary">{tempInfo}</span>.
                    </p>
                  </div>

                  {/* OTP Inputs */}
                  <div className="flex justify-evenly gap-3">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-12 h-14 bg-brand-primary/5 rounded-2xl border text-center font-black text-xl text-brand-primary shadow-soft focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all"
                      />
                    ))}
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={otp.some((d) => !d)}
                    className="w-full rounded-2xl py-5 h-auto shadow-premium bg-brand-primary hover:bg-brand-primary-light transition-all flex items-center justify-center gap-3 group"
                  >
                    <span className="font-black uppercase tracking-widest text-xs">
                      Confirm Update
                    </span>
                    <ArrowRight
                      size={16}
                      strokeWidth={3}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Button>
                </motion.div>
              )}

              {otpStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-24 h-24 rounded-[40px] bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-soft animate-pulse-slow">
                    <CheckCircle2 size={48} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-brand-primary tracking-tighter uppercase">
                      Update Successful
                    </h3>
                    <p className="text-sm font-bold text-brand-primary/40 max-w-xs mx-auto">
                      Your account {isEmail ? "email" : "mobile number"} has
                      been securely updated to{" "}
                      <span className="text-brand-primary">{tempInfo}</span>.
                    </p>
                  </div>
                  <Button
                    onClick={() => dispatch(confirmContactUpdate())}
                    className="w-full rounded-2xl py-4 h-auto shadow-premium bg-brand-primary hover:bg-brand-primary-light transition-all"
                  >
                    <span className="font-black uppercase tracking-widest text-xs">
                      Great, Thanks!
                    </span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Step Visualizer */}
          {otpStep < 4 && (
            <div className="px-10 pb-10 flex items-center justify-center gap-3">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step === otpStep
                      ? "w-10 bg-brand-primary"
                      : step < otpStep
                        ? "w-6 bg-brand-primary/40"
                        : "w-3 bg-brand-primary/10"
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SecureUpdateModal;
