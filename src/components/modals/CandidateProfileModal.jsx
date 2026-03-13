import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Briefcase,
  ExternalLink,
  MapPin,
  User,
  Loader2,
  Download,
} from "lucide-react";
import {
  getViewProfileInfoApi,
  IMG_URL,
  resumeDownloadApi,
} from "../../helper/api";
import Button from "../Button";
import toast from "react-hot-toast";

const CandidateProfileModal = ({ isOpen, onClose, candidateId }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && candidateId) {
      fetchProfileInfo();
    }
  }, [isOpen, candidateId]);

  const fetchProfileInfo = async () => {
    setLoading(true);
    try {
      const response = await getViewProfileInfoApi(candidateId);
      if (response.status) {
        setProfileData(response.data);
      } else {
        toast.error(response.message || "Failed to fetch profile details");
        onClose();
      }
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      toast.error(error || "An error occurred");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = async () => {
    try {
      const response = await resumeDownloadApi(candidateId);
      // If API returns blob, convert it to blob
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and click it
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${candidateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url); // clean up
    } catch (error) {
      console.error("Resume Download Error:", error);
      toast.error("Failed to download resume");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-primary/20 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[48px] shadow-premium overflow-hidden border border-brand-primary/5 flex flex-col"
        >
          {/* Header Action */}
          <button
            onClick={onClose}
            className="absolute right-8 top-8 z-10 w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary/40 hover:bg-brand-primary hover:text-white transition-all duration-300"
          >
            <X size={24} strokeWidth={3} />
          </button>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
              <Loader2
                size={48}
                className="text-brand-primary animate-spin mb-4"
              />
              <p className="text-xs font-black uppercase tracking-widest text-brand-primary/40">
                Fetching Profile...
              </p>
            </div>
          ) : profileData ? (
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {/* Profile Header section */}
              <div className="p-8 md:p-12 pb-0">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-[40px] bg-brand-primary/5 flex items-center justify-center text-brand-primary text-4xl font-black relative overflow-hidden shrink-0 shadow-soft">
                    {profileData.profilePicture ? (
                      <img
                        src={`${IMG_URL}/${profileData.profilePicture}`}
                        alt={profileData.fullName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "";
                          e.target.parentElement.innerHTML =
                            profileData.fullName.charAt(0);
                        }}
                      />
                    ) : (
                      profileData.fullName.charAt(0)
                    )}
                    <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent" />
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <h2 className="text-3xl md:text-4xl font-black text-brand-primary tracking-tighter uppercase">
                        {profileData.fullName}
                      </h2>
                      <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2 text-brand-primary/40 text-xs font-bold uppercase tracking-widest">
                          <Mail size={14} />
                          {profileData.email}
                        </div>
                        <div className="flex items-center gap-2 text-brand-primary/40 text-xs font-bold uppercase tracking-widest">
                          <Phone size={14} />
                          {profileData.countryCode} {profileData.mobileNumber}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <span className="px-5 py-2.5 bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-xl border border-brand-primary/5">
                        {profileData.gender}
                      </span>
                      <span className="px-5 py-2.5 bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-xl border border-brand-primary/5 flex items-center gap-2">
                        <Calendar size={12} />
                        Born {new Date(profileData.DOB).toLocaleDateString()}
                      </span>
                      <Button
                        onClick={handleDownloadResume}
                        variant="secondary"
                        className="px-5 py-2.5 h-auto text-[10px] uppercase font-black tracking-widest rounded-xl border border-brand-primary/5 flex items-center gap-2 group"
                      >
                        <Download
                          size={14}
                          className="text-brand-primary/40 group-hover:text-brand-primary transition-colors"
                        />
                        Download Resume
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider with editorial flair */}
              <div className="px-12 py-8">
                <div className="h-px w-full bg-brand-primary/5" />
              </div>

              {/* Content Grid */}
              <div className="px-8 md:px-12 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
                {/* Main column */}
                <div className="space-y-12">
                  {/* Education */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary shadow-soft">
                        <GraduationCap size={20} />
                      </div>
                      <h3 className="text-sm font-black text-brand-primary uppercase tracking-[0.2em]">
                        Academic{" "}
                        <span className="text-brand-primary/30">
                          Background
                        </span>
                      </h3>
                    </div>
                    <div className="bg-brand-primary/2 rounded-[32px] p-8 border border-brand-primary/5 space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">
                          Institution
                        </p>
                        <p className="text-lg font-black text-brand-primary uppercase tracking-tight">
                          {profileData.collageOrUniversityName}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">
                            Degree
                          </p>
                          <p className="text-sm font-black text-brand-primary/70 uppercase">
                            {profileData.degreeOrCourse} —{" "}
                            {profileData.highestQualification}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">
                            Graduation Year
                          </p>
                          <p className="text-sm font-black text-brand-primary/70">
                            {profileData.yosOrGraduationYear}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Summary */}
                  {profileData.personalDetails && (
                    <section className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary shadow-soft">
                          <User size={20} />
                        </div>
                        <h3 className="text-sm font-black text-brand-primary uppercase tracking-[0.2em]">
                          About{" "}
                          <span className="text-brand-primary/30">Me</span>
                        </h3>
                      </div>
                      <div className="p-8 bg-brand-primary/5 rounded-[32px] border border-brand-primary/5">
                        <p className="text-brand-primary/60 text-sm leading-relaxed font-bold italic">
                          "{profileData.personalDetails}"
                        </p>
                      </div>
                    </section>
                  )}

                  {/* Projects */}
                  {profileData.projectLink?.length > 0 && (
                    <section className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary shadow-soft">
                          <Briefcase size={20} />
                        </div>
                        <h3 className="text-sm font-black text-brand-primary uppercase tracking-[0.2em]">
                          Notable{" "}
                          <span className="text-brand-primary/30">
                            Projects
                          </span>
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profileData.projectLink.map((project, idx) => (
                          <a
                            key={idx}
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-6 bg-white border border-brand-primary/5 rounded-[28px] shadow-soft hover:shadow-premium hover:border-brand-primary/20 transition-all duration-300"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-black text-brand-primary text-xs uppercase tracking-widest group-hover:text-brand-primary-light transition-colors">
                                {project.title}
                              </h4>
                              <ExternalLink
                                size={14}
                                className="text-brand-primary/20 group-hover:text-brand-primary transition-colors"
                              />
                            </div>
                            <p className="text-[10px] text-brand-primary/30 font-bold truncate">
                              {project.url}
                            </p>
                          </a>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                {/* Sidebar column */}
                <div className="space-y-8">
                  <div className="bg-brand-primary rounded-[40px] p-8 text-white shadow-premium">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 opacity-60">
                      Verified Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-4 py-2 bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/20 transition-colors"
                        >
                          {skill.skillName}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar contact info */}
                  <div className="p-8 space-y-6">
                    <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] opacity-30">
                      Quick Info
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary/40">
                          <MapPin size={14} />
                        </div>
                        <span className="text-xs font-black text-brand-primary/60 uppercase tracking-widest">
                          India (Primary)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CandidateProfileModal;
