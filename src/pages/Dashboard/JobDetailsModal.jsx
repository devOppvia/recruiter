import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Clock,
  Users,
  Briefcase,
  IndianRupee,
  Star,
  ShieldCheck,
  Share2,
} from "lucide-react";
import Button from "../../components/Button";
import Badge from "../../components/Badge";

const JobDetailsModal = ({ job, isOpen, onClose }) => {
  if (!job) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-primary/20 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl h-[90vh] bg-white rounded-[40px] shadow-premium overflow-hidden border border-white/60 flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-30 p-3 bg-white/80 backdrop-blur-md rounded-2xl text-brand-primary/40 hover:text-brand-primary hover:bg-white shadow-soft transition-all"
            >
              <X size={20} strokeWidth={3} />
            </button>

            {/* Left: Job Summary Card (Sticky in scroll) */}
            <div className="w-full md:w-[350px] bg-brand-primary/5 p-8 flex flex-col border-r border-brand-primary/5">
              <div className="mb-8">
                <Badge
                  status={job.jobStatus?.toLowerCase() || "pending"}
                  size="sm"
                  className="mb-6"
                />
                <h2 className="text-3xl font-black text-brand-primary tracking-tighter leading-tight mb-2">
                  {job.jobTitle}
                </h2>
                <p className="text-[11px] font-black text-brand-primary/40 uppercase tracking-widest">
                  {job.jobCategory?.categoryName} ·{" "}
                  {job.jobSubCategory?.subCategoryName}
                </p>
              </div>

              <div className="space-y-6 flex-1">
                <div className="space-y-4">
                  {[
                    {
                      icon: <MapPin size={16} />,
                      label: "Position Type",
                      value: job.applicationType?.toLowerCase(),
                    },
                    {
                      icon: <MapPin size={16} />,
                      label: "Work Type",
                      value: job.jobType?.toLowerCase(),
                    },
                    {
                      icon: <MapPin size={16} />,
                      label: "Employment Type",
                      value: job.employmentType
                        ?.toLowerCase()
                        ?.replace("_", " "),
                    },
                    {
                      icon: <Clock size={16} />,
                      label: "Duration",
                      value: job.internshipDuration,
                    },
                    {
                      icon: <Users size={16} />,
                      label: "Openings",
                      value: job.numberOfOpenings,
                    },
                    {
                      icon: <Briefcase size={16} />,
                      label: "Hours",
                      value: job.workingHours,
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary/40 group-hover:text-brand-primary shadow-soft transition-all">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest">
                          {item.label}
                        </p>
                        <p className="text-sm font-black text-brand-primary capitalize">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-brand-primary/10">
                  <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest mb-3">
                    Compensation
                  </p>
                  <div className="p-4 bg-white rounded-2xl shadow-soft">
                    <div className="flex items-center gap-3 text-brand-primary mb-1">
                      <IndianRupee size={18} strokeWidth={3} />
                      <span className="text-lg font-black">
                        {job.stipend === "YES"
                          ? `₹${job.minStipend} - ${job.maxStipend}`
                          : "Unpaid"}
                      </span>
                    </div>
                    <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-7">
                      Monthly Stipend
                    </p>
                  </div>
                </div>
              </div>

              {/* <div className="mt-8 flex gap-3">
                <Button className="flex-1 rounded-2xl py-4 font-black uppercase tracking-widest text-xs h-auto shadow-soft">
                  Edit Posting
                </Button>
                <button className="p-4 bg-white rounded-2xl text-brand-primary/40 hover:text-brand-primary shadow-soft transition-all">
                  <Share2 size={20} />
                </button>
              </div> */}
            </div>

            {/* Right: Full Details Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-10 no-scrollbar bg-white relative">
              <div className="max-w-2xl space-y-12">
                {/* Description */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                      <Star size={16} strokeWidth={3} />
                    </div>
                    <h3 className="text-sm font-black text-brand-primary uppercase tracking-widest">
                      Role Description
                    </h3>
                  </div>
                  <p className="text-base text-brand-primary/70 leading-relaxed font-medium">
                    {job.aboutJob || "No description provided."}
                  </p>
                </section>

                {/* Skills */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                      <ShieldCheck size={16} strokeWidth={3} />
                    </div>
                    <h3 className="text-sm font-black text-brand-primary uppercase tracking-widest">
                      Required Skills
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(job.skills || []).map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-brand-primary/5 text-brand-primary text-xs font-black uppercase tracking-wide rounded-xl border border-brand-primary/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Benefits */}
                {job.additionalBenefits?.length > 0 && (
                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                        <Star size={16} strokeWidth={3} />
                      </div>
                      <h3 className="text-sm font-black text-brand-primary uppercase tracking-widest">
                        Perks & Benefits
                      </h3>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {job.additionalBenefits.map((benefit, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm font-bold text-brand-primary/60"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Other Info */}
                {job.otherRequirements && (
                  <section className="p-8 bg-brand-primary/5 rounded-[32px] border border-brand-primary/5 space-y-4 mb-10">
                    <h3 className="text-sm font-black text-brand-primary uppercase tracking-widest">
                      Additional Information
                    </h3>
                    <p className="text-sm text-brand-primary/60 leading-relaxed font-bold italic">
                      "{job.otherRequirements}"
                    </p>
                  </section>
                )}
                
                
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JobDetailsModal;
