import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Users,
  MapPin,
  Clock,
  UserPlus,
  Pause,
  Play,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  LayoutGrid,
  Eye,
  CircleDashed,
  PauseCircle,
  CircleCheck,
  CircleFadingArrowUp,
  CircleX,
} from "lucide-react";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import CreateJobWizard from "./CreateJobWizard";
import JobDetailsModal from "./JobDetailsModal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { toggleWizard, setStatusFilter } from "../../store/slices/jobsSlice";
import {
  getJobData,
  deleteJobPostApi,
  updateJobStatusApi,
} from "../../helper/api";
import toast from "react-hot-toast";
import { cn } from "../../utils/cn";

const JobPostingPage = () => {
  const dispatch = useDispatch();
  const { statusFilter } = useSelector((state) => state.jobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [fetchedJobs, setFetchedJobs] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 9,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    const companyId = localStorage.getItem("companyId");

    try {
      const payload = {
        companyId: companyId,
        currentPage: pagination.currentPage,
        itemsPerPage: pagination.itemsPerPage,
        search: debouncedSearch || undefined,
      };
      if (statusFilter !== "All" && statusFilter !== "all") {
        payload.jobStatus = statusFilter.toUpperCase();
      }

      const response = await getJobData(payload);
      if (response.status) {
        setFetchedJobs(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Fetch Jobs Error:", error);
      toast.error(error || "Failed to load job postings");
    } finally {
      setIsLoading(false);
    }
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    statusFilter,
    debouncedSearch,
  ]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteJobPostApi(jobToDelete);
      if (response.status) {
        toast.success(response.message || "Job deleted successfully");
        fetchJobs(); // Refresh the list
        setIsDeleteModalOpen(false);
      } else {
        toast.error(response.message || "Failed to delete job");
      }
    } catch (error) {
      console.error("Delete Job Error:", error);
      toast.error(error || "An error occurred while deleting the job");
    } finally {
      setIsDeleting(false);
      setActiveMenu(null);
    }
  };

  const confirmDelete = (jobId) => {
    setJobToDelete(jobId);
    setIsDeleteModalOpen(true);
    setActiveMenu(null);
  };

  const statusTabs = [
    { name: "All", icon: LayoutGrid, count: null },
    { name: "Review", icon: Eye, count: null },

    { name: "Approved", icon: CircleDashed, count: null },
    { name: "Paused", icon: PauseCircle, count: null },
    { name: "Completed", icon: CircleCheck, count: null },
    { name: "Rejected", icon: CircleX, count: null },
    { name: "Draft", icon: CircleFadingArrowUp, count: null },
  ];

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
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const moveToReview = async (jobId) => {
    try {
      const response = await updateJobStatusApi(jobId, { jobStatus: "REVIEW" });
      if (response.status) {
        toast.success(response.message || "Job moved to review successfully");
        fetchJobs(); // Refresh the list
        setIsDeleteModalOpen(false);
      } else {
        toast.error(response.message || "Failed to move job to review");
      }
    } catch (error) {
      console.error("Move to Review Error:", error);
      toast.error(error || "An error occurred while moving the job to review");
    } finally {
      setIsDeleting(false);
      setActiveMenu(null);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-brand-primary text-editorial tracking-tighter">
            Job <span className="text-brand-primary/40">Postings</span>
          </h1>
          <p className="text-sm font-bold text-brand-primary/30">
            Manage your active internship opportunities and applicant pool.
          </p>
        </div>

        {/* Quota Highlight */}
        {/* <div className="hidden lg:flex items-center gap-4 bg-brand-primary/5 px-6 py-3 rounded-2xl border border-brand-primary/5">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-brand-primary/40 uppercase tracking-widest leading-none mb-1">Active Quota</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-brand-primary tabular-nums">{usage.jobPostings.current} / {usage.jobPostings.max}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                        </div>
                    </div>
                </div> */}

        <Button
          onClick={() => dispatch(toggleWizard())}
          className="rounded-2xl px-6 py-4 h-auto shadow-soft bg-brand-primary hover:bg-brand-primary-light transition-all flex items-center gap-2 group"
        >
          <Plus
            size={20}
            strokeWidth={3}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          <span className="font-black uppercase tracking-widest text-xs">
            Create New Job
          </span>
        </Button>
      </div>

      {/* Filter Hub */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-1.5 bg-brand-primary/5 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
          {statusTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                dispatch(setStatusFilter(tab.name));
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shrink-0 ${
                statusFilter === tab.name
                  ? "bg-white text-brand-primary shadow-soft"
                  : "text-brand-primary/40 hover:text-brand-primary hover:bg-white/50"
              }`}
            >
              <tab.icon size={16} />
              {tab.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/30 group-focus-within:text-brand-primary transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-brand-primary/5 rounded-2xl text-sm font-bold text-brand-primary outline-none focus:border-brand-primary/20 focus:ring-4 focus:ring-brand-primary/5 transition-all shadow-soft"
          />
        </div>
      </div>

      {/* Job Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-brand-primary/20" size={40} />
          <p className="text-xs font-black text-brand-primary/20 uppercase tracking-[0.2em]">
            Synchronizing Talent data...
          </p>
        </div>
      ) : fetchedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-brand-primary/10">
          <div className="w-16 h-16 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-primary/20 mb-6">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-black text-brand-primary tracking-tighter mb-2">
            No Postings Found
          </h3>
          <p className="text-sm font-bold text-brand-primary/30 max-w-xs text-center leading-relaxed">
            Adjust your filters or initiate a new recruitment cycle.
          </p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {fetchedJobs.map((job) => (
            <motion.div
              key={job.id}
              variants={item}
              className="bg-white rounded-[32px] p-8 shadow-soft border border-brand-primary/5 hover:border-brand-primary/10 transition-all group overflow-hidden relative"
            >
              {/* Status Icon Background */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl transition-all duration-500" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <Badge
                    status={job.jobStatus?.toLowerCase() || "pending"}
                    size="sm"
                  />
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === job.id ? null : job.id)
                    }
                    className="p-2 -mr-2 rounded-xl text-brand-primary/30 hover:bg-brand-primary/5 hover:text-brand-primary transition-all"
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="space-y-1 mb-6">
                  <div className="flex gap-4 pb-1 items-center">
                    <h3 className="text-xl font-black text-brand-primary tracking-tight leading-tight group-hover:text-brand-primary-light transition-colors line-clamp-1">
                      {job.jobTitle}
                    </h3>
                    <span className="text-xs h-fit bg-slate-100 border-slate-300 border-[0.5px] text-slate-500 px-2 py-0.5 font-medium rounded-full">
                      {job.applicationType?.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-[11px] font-black text-brand-primary/40 uppercase tracking-widest">
                    {job.jobCategory?.categoryName} ·{" "}
                    {job.jobSubCategory?.subCategoryName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/50">
                    <Users size={14} strokeWidth={3} />
                    <span>{job.numberOfOpenings} Openings</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/50">
                    <MapPin size={14} strokeWidth={3} />
                    <span className="capitalize">
                      {job.jobType?.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/50">
                    <Clock size={14} strokeWidth={3} />
                    <span>{job.internshipDuration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/50">
                    <UserPlus size={14} strokeWidth={3} />
                    <span>{job.appliedCandidates} Applicants</span>
                  </div>
                </div>

                {/* Skills Chips - Expandable */}
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {(job.skills || []).slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase tracking-wider rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                  {(job.skills || []).length > 3 && (
                    <span className="px-2.5 py-1 bg-brand-primary/5 text-brand-primary/40 text-[10px] font-black uppercase tracking-wider rounded-lg hover:text-brand-primary cursor-pointer transition-colors">
                      + {(job.skills || []).length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-brand-primary/5">
                  <div>
                    <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest mb-0.5">
                      Monthly Stipend
                    </p>
                    <p className="text-sm font-black text-brand-primary tracking-tight">
                      {job.stipend === "YES"
                        ? `₹${job.minStipend} - ${job.maxStipend}`
                        : "Unpaid"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest mb-1">
                      Internship
                    </p>
                    <Button
                      onClick={() => handleViewDetails(job)}
                      variant="ghost"
                      className="text-brand-primary font-black uppercase tracking-widest text-[10px] hover:bg-brand-primary/5 px-4 rounded-xl"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>

              {/* Dropdown Menu Mockup */}
              <AnimatePresence>
                {activeMenu === job.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute top-16 right-8 w-48 bg-white glass-morphism rounded-2xl shadow-premium z-20 border border-brand-primary/10 overflow-hidden"
                  >
                    {job.jobStatus === "DRAFT" && (
                      <button
                        onClick={() => moveToReview(job.id)}
                        className="w-full px-5 py-3.5 text-left text-xs font-bold text-blue-500 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                      >
                        <Eye size={14} /> Review
                      </button>
                    )}
                    <button
                      onClick={() => confirmDelete(job.id)}
                      className="w-full px-5 py-3.5 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <Trash2 size={14} /> Delete Job
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination Controls */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-10">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="p-3 rounded-2xl bg-white border border-brand-primary/5 text-brand-primary disabled:opacity-20 hover:bg-brand-primary/5 transition-all shadow-soft"
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "w-10 h-10 rounded-xl text-xs font-black transition-all",
                    pagination.currentPage === page
                      ? "bg-brand-primary text-white shadow-premium"
                      : "bg-white text-brand-primary/40 hover:bg-brand-primary/5 hover:text-brand-primary",
                  )}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="p-3 rounded-2xl bg-white border border-brand-primary/5 text-brand-primary disabled:opacity-20 hover:bg-brand-primary/5 transition-all shadow-soft"
          >
            <ChevronRight size={20} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Overlays */}
      <CreateJobWizard />
      <JobDetailsModal
        job={selectedJob}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteJob}
        isLoading={isDeleting}
        title="Delete Posting"
        message="Are you sure you want to delete this job posting? This action cannot be undone and all applicant data for this job will be lost."
        confirmText="Delete Job"
        type="danger"
      />
    </div>
  );
};

export default JobPostingPage;
