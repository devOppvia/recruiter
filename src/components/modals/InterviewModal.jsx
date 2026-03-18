import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Button from "../Button";
import {
  updateCandidateStatusApi,
  getjobLocationsApi,
  scheduleInterviewApi,
} from "../../helper/api";
import toast from "react-hot-toast";

// Popular video conferencing platforms with their URL patterns
const VALID_PLATFORMS = [
  { name: "Google Meet", patterns: ["meet.google.com", "meet.google.com/"] },
  { name: "Zoom", patterns: ["zoom.us", "zoom.us/j/", "zoom.us/my/"] },
  { name: "Microsoft Teams", patterns: ["teams.microsoft.com", "teams.live.com"] },
  { name: "Webex", patterns: ["webex.com", ".webex.com"] },
  { name: "GoToMeeting", patterns: ["gotomeeting.com", "gotomeet.me"] },
  { name: "BlueJeans", patterns: ["bluejeans.com"] },
  { name: "Cisco Webex", patterns: ["webex.com"] },
  { name: "Whereby", patterns: ["whereby.com"] },
  { name: "Jitsi", patterns: ["jitsi.org", "meet.jit.si"] },
  { name: "Discord", patterns: ["discord.gg", "discord.com"] },
  { name: "Skype", patterns: ["skype.com", "join.skype.com"] },
  { name: "Mattermost", patterns: ["mattermost.com"] },
  { name: "Slack", patterns: ["slack.com", "app.slack.com"] },
];

const isValidPlatformLink = (input) => {
  if (!input) return false;

  // Check if it's a full URL
  try {
    const url = new URL(input.startsWith("http") ? input : `https://${input}`);
    const hostname = url.hostname.toLowerCase();

    // Check if hostname matches any platform pattern
    return VALID_PLATFORMS.some((platform) =>
      platform.patterns.some((pattern) => hostname.includes(pattern.replace("www.", "")))
    );
  } catch {
    // If not a valid URL, check if it's a meeting ID/username that might be valid
    // Allow common meeting ID formats (alphanumeric with dashes)
    const meetingIdPattern = /^[a-zA-Z0-9\-._]+$/;
    return meetingIdPattern.test(input.trim());
  }
};

const InterviewModal = ({ isOpen, onClose, candidate, onSuccess, onInterviewScheduled }) => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    mode: "Online", // Online or Offline
    platform: "",
    location: "",
    notes: "",
  });
  const [platformError, setPlatformError] = useState("");

  const [locations, setLocations] = useState([]);
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    if (isOpen && companyId) {
      fetchLocations();
    }
  }, [isOpen, companyId]);

  const fetchLocations = async () => {
    try {
      const response = await getjobLocationsApi(companyId);
      if (response.status) {
        setLocations(response.data || []);
      }
    } catch (error) {
      console.error("Fetch Locations Error:", error);
    }
  };

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !candidate) return null;

  const handleClose = () => {
    onClose();
    setTimeout(() => setIsSubmitted(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate platform link for online interviews
    if (formData.mode === "Online" && formData.platform) {
      if (!isValidPlatformLink(formData.platform)) {
        setPlatformError("Please enter a valid meeting link (e.g., Google Meet, Zoom, Teams)");
        return;
      }
      setPlatformError("");
    }

    try {
      // const payload = {
      //   companyId,
      //   id: candidate.id,
      //   internId: candidate.internId,
      //   interviewStatus: "INTERVIEW",
      //   interviewDate: formData.date,
      //   interviewTime: formData.time,
      //   jobId: candidate.jobId,
      //   interviewLocation: "",
      //   interviewType: "",
      //   interviewLink: "",
      // };

      const payload = {
        id: candidate?.id,
        companyId: companyId,
        jobId: candidate?.jobId,
        internId: candidate?.internId,
        interviewType: formData.mode === "Online" ? "ONLINE" : "OFFLINE",
        interviewDate: formData.date, // ensure correct format if needed
        interviewTime: formData.time,
        interviewLink:
          formData.mode === "Online" ? formData.platform.trim() : "",
        interviewLocation:
          formData.mode === "Offline" ? formData.location.trim() : "",
      };

      if (formData.mode === "Online") {
        ((payload.interviewType = "ONLINE"),
          (payload.interviewLink = formData.platform));
      } else {
        ((payload.interviewType = "OFFLINE"),
          (payload.interviewLocation = formData.location));
      }
      const response = await scheduleInterviewApi(payload);

      if (response.status) {
        // if (onSuccess) {
        //   onSuccess(candidate.id, "INTERVIEW");
        // }
        if (onInterviewScheduled) {
          onInterviewScheduled();
        }
        setIsSubmitted(true);
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        toast.error(response.message || "Failed to schedule interview");
      }
    } catch (error) {
      console.error("Schedule Interview Error:", error);
      toast.error(error || "An error occurred");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-brand-primary/20 backdrop-blur-sm"
        />

        {/* Modal Hook */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-[40px] shadow-premium overflow-hidden border border-brand-primary/5"
        >
          {isSubmitted ? (
            <div className="p-12 text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500"
              >
                <CheckCircle2 size={40} strokeWidth={2.5} />
              </motion.div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-brand-primary tracking-tight">
                  Interview Scheduled!
                </h2>
                <p className="text-brand-primary/40 font-bold text-sm uppercase tracking-widest">
                  Invitation sent to{" "}
                  {candidate.intern?.fullName || candidate.name}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-8 pb-0 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-brand-primary tracking-tight">
                    Schedule{" "}
                    <span className="text-brand-primary/40">Interview</span>
                  </h2>
                  <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest flex items-center gap-2">
                    Candidate:{" "}
                    <span className="text-brand-primary/60">
                      {candidate.intern?.fullName || candidate.name}
                    </span>
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary/40 hover:bg-brand-primary hover:text-white transition-all duration-300"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                      Date
                    </label>
                    <div className="relative group">
                      <CalendarIcon
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-primary transition-colors"
                        size={18}
                      />
                      <input
                        required
                        type="date"
                        className="w-full pl-12 pr-4 py-4 bg-brand-primary/5 border-none rounded-2xl text-xs font-bold text-brand-primary outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                      Time
                    </label>
                    <div className="relative group">
                      <Clock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-primary transition-colors"
                        size={18}
                      />
                      <input
                        required
                        type="time"
                        className="w-full pl-12 pr-4 py-4 bg-brand-primary/5 border-none rounded-2xl text-xs font-bold text-brand-primary outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                    Interview Mode
                  </label>
                  <div className="flex gap-2 p-1.5 bg-brand-primary/5 rounded-2xl overflow-x-auto no-scrollbar">
                    {["Online", "Offline"].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            mode,
                            platform: "",
                            location: "",
                          })
                        }
                        className={`flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                          formData.mode === mode
                            ? "bg-white text-brand-primary shadow-soft"
                            : "text-brand-primary/40 hover:text-brand-primary hover:bg-white/50"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.mode === "Online" ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                      Platform
                    </label>
                    <div className="relative group">
                      <Video
                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                          platformError ? "text-red-400" : "text-brand-primary/20 group-focus-within:text-brand-primary"
                        }`}
                        size={18}
                      />
                      <input
                        required
                        type="text"
                        placeholder="Enter meeting link (e.g., https://meet.google.com/xxx)"
                        className={`w-full pl-12 pr-4 py-4 bg-brand-primary/5 border-none rounded-2xl text-xs font-bold text-brand-primary outline-none focus:ring-2 transition-all ${
                          platformError ? "focus:ring-red-400 ring-1 ring-red-400" : "focus:ring-brand-primary/10"
                        }`}
                        value={formData.platform}
                        onChange={(e) => {
                          setFormData({ ...formData, platform: e.target.value });
                          if (platformError) setPlatformError("");
                        }}
                      />
                    </div>
                    {platformError && (
                      <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 ml-1">
                        <AlertCircle size={12} />
                        {platformError}
                      </p>
                    )}
                    <p className="text-[9px] font-bold text-brand-primary/30 ml-1">
                      Accepted: Google Meet, Zoom, Microsoft Teams, Webex, GoToMeeting, BlueJeans, Whereby, Jitsi, Discord, Skype
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                      Company Location
                    </label>
                    <div className="relative group">
                      <MapPin
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-primary transition-colors"
                        size={18}
                      />
                      <select
                        required
                        className="w-full pl-12 pr-4 py-4 bg-brand-primary/5 border-none rounded-2xl text-xs font-bold text-brand-primary outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all appearance-none"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                      >
                        <option value="">Select Location</option>
                        {locations.map((loc, idx) => (
                          <option key={idx} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClose}
                    className="flex-1 rounded-2xl py-4 font-black uppercase tracking-widest text-[10px] text-brand-primary/40"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-[2] rounded-2xl py-4 font-black uppercase tracking-widest text-[10px] shadow-soft shadow-brand-primary/20 group bg-brand-primary"
                  >
                    Confirm Schedule
                    <ChevronRight
                      size={16}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </Button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InterviewModal;
