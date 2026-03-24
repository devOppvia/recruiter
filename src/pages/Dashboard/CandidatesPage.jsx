import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  Mail,
  CheckSquare,
  ChevronDown,
  ExternalLink,
  Video,
  MapPin,
  GraduationCap,
  Loader2,
  TicketCheck,
  X,
  FileQuestion,
  List,
  Eye,
  CheckCheck,
  CheckSquareIcon,
  Briefcase,
} from "lucide-react";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import InterviewModal from "../../components/modals/InterviewModal";
import CandidateProfileModal from "../../components/modals/CandidateProfileModal";
import InterviewTab from "./InterviewTab";
import {
  getCandidatesDataApi,
  updateCandidateStatusApi,
  resumeDownloadApi,
} from "../../helper/api";
import toast from "react-hot-toast";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

const CandidatesPage = () => {
  // Local State
  const [candidates, setCandidates] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openedCandidateIds, setOpenedCandidateIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [counts, setCounts] = useState({
    all: 0,
    fresh: 0,
    opened: 0,
    shortlisted: 0,
    interview: 0,
    hired: 0,
    rejected: 0,
  });

  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState("candidates");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [profileModal, setProfileModal] = useState({
    isOpen: false,
    candidateId: null,
  });
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedCandidateForInterview, setSelectedCandidateForInterview] =
    useState(null);

  const isOpened = (candidateId) => openedCandidateIds.includes(candidateId);

  const interviewStatusDisplay = {
    YES: { text: "Yes, I’ll attend", icon: TicketCheck },
    NO: { text: "No, I can’t make it", icon: X },
    MAYBE: { text: "Maybe, not sure yet", icon: FileQuestion },
    NOT_ANSWERED: { text: "Not Answered", icon: FileQuestion },
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchCandidates = useCallback(async () => {
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
        payload.status = statusFilter.toLocaleUpperCase();
      }

      const response = await getCandidatesDataApi(payload);
      if (response.status) {
        setCandidates(response.data || []);
        setPagination(response.pagination);
        setCounts(response.counts);
      } else {
        toast.error(response.message || "Failed to fetch candidates");
      }
    } catch (error) {
      console.error("Fetch Candidates Error:", error);
      toast.error(
        error?.message || "An error occurred while loading candidates",
      );
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
    if (activeTab === "candidates") {
      fetchCandidates();
    }
  }, [fetchCandidates, activeTab]);

  const statusOptions = [
    { name: "All", icon: List, count: null },
    { name: "Review", icon: Eye, count: null },

    { name: "Shortlisted", icon: CheckSquare, count: null },
    { name: "Interview", icon: CheckCheck, count: null },
    { name: "Hired", icon: CheckSquareIcon, count: null },
    { name: "Rejected", icon: X, count: null },
  ];

  const statusTransitions = {
    REVIEW: "SHORTLISTED",
    SHORTLISTED: "INTERVIEW",
    INTERVIEW: "HIRED",
    HIRED: "REJECTED",
  };

  const handleCandidateStatusUpdate = async (ids, status) => {
    try {
      const updatePromises = ids.map((id) =>
        updateCandidateStatusApi(id, { status }),
      );
      setIsLoading(true);
      const results = await Promise.all(updatePromises);

      if (results.every((res) => res.status)) {
        toast.success("Candidate status updated successfully");
        // Update local state
        setCandidates((prev) =>
          prev.map((c) =>
            ids.includes(c.id) ? { ...c, candidateStatus: status } : c,
          ),
        );
        setSelectedIds([]);
        fetchCandidates();
        setIsLoading(false);
      } else {
        toast.error("Failed to update some candidates");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      setIsLoading(false);
      toast.error(error?.message || "Failed to update status");
    }
  };

  const handleBulkAction = (status) => {
    handleCandidateStatusUpdate(selectedIds, status);
  };

  const handleOpenProfile = (candidate) => {
    setProfileModal({
      isOpen: true,
      candidateId: candidate.internId,
    });
  };

  const markCandidateOpened = (id) => {
    if (!openedCandidateIds.includes(id)) {
      setOpenedCandidateIds((prev) => [...prev, id]);
    }
  };

  const handleNextStepClick = (candidate, nextStatus) => {
    if (nextStatus === "INTERVIEW") {
      setSelectedCandidateForInterview(candidate);
      setIsInterviewModalOpen(true);
    } else {
      handleCandidateStatusUpdate([candidate.id], nextStatus);
    }
  };

  const handleDownloadResume = async (candidate) => {
    try {
      const response = await resumeDownloadApi(candidate.internId);
      // If API returns blob, convert it to blob
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and click it
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${candidate.internId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download Resume Error:", error);
      toast.error("Error downloading resume");
    }
  };

  const handleRejectClick = (candidate) => {
    handleCandidateStatusUpdate([candidate.id], "REJECTED");
  };

  const someSelected = selectedIds.length > 0;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-brand-primary text-editorial tracking-tighter">
            Pipeline <span className="text-brand-primary/40">Management</span>
          </h1>
          <div className="flex items-center gap-6 mt-2">
            <button
              onClick={() => setActiveTab("candidates")}
              className={`text-sm font-black uppercase tracking-widest transition-all ${activeTab === "candidates" ? "text-brand-primary" : "text-brand-primary/20 hover:text-brand-primary/40"}`}
            >
              Candidates
            </button>
            <button
              onClick={() => setActiveTab("interviews")}
              className={`text-sm font-black uppercase tracking-widest transition-all ${activeTab === "interviews" ? "text-brand-primary" : "text-brand-primary/20 hover:text-brand-primary/40"}`}
            >
              Interviews
            </button>
          </div>
        </div>
      </div>

      {activeTab === "candidates" ? (
        <>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-1.5 bg-brand-primary/5 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
              {statusOptions.map((s) => (
                <button
                  key={s.name}
                  onClick={() => {
                    setStatusFilter(s.name);
                    setPagination((prev) => ({ ...prev, currentPage: 1 }));
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shrink-0 ${
                    statusFilter === s.name
                      ? "bg-white text-brand-primary shadow-soft"
                      : "text-brand-primary/40 hover:text-brand-primary hover:bg-white/50"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80 group">
              <Search
                size={18}
                strokeWidth={3}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-primary transition-colors"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                }}
                placeholder="Search candidates..."
                className="w-full pl-12 pr-6 py-4 bg-brand-primary/5 border-none rounded-2xl text-xs font-bold text-brand-primary placeholder:text-brand-primary/20 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all shadow-inner"
              />
            </div>
          </div>

          <AnimatePresence>
            {someSelected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="flex items-center gap-4 bg-brand-primary p-4 rounded-[28px] shadow-premium"
              >
                <div className="flex items-center gap-3 pl-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-black">
                    {selectedIds.length}
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-widest">
                    Candidates Selected
                  </span>
                </div>
                <div className="flex gap-2 ml-auto">
                  <Button
                    size="sm"
                    className="bg-white text-brand-primary hover:bg-white/90 rounded-xl px-5 h-10 font-black uppercase tracking-widest text-[10px] shadow-soft transition-all"
                    onClick={() => handleBulkAction("shortlisted")}
                  >
                    Shortlist
                  </Button>
                  <Button
                    size="sm"
                    className="bg-transparent border border-white/20 text-white hover:bg-white/10 rounded-xl px-5 h-10 font-black uppercase tracking-widest text-[10px] transition-all"
                    onClick={() => handleBulkAction("rejected")}
                  >
                    Reject
                  </Button>
                  <div className="w-px h-10 bg-white/10 mx-1" />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white/60 hover:text-white font-black uppercase tracking-widest text-[10px]"
                    onClick={() => setSelectedIds([])}
                  >
                    Deselect
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-brand-primary/5 rounded-[48px] border border-dashed border-brand-primary/10">
              <Loader2
                size={40}
                className="text-brand-primary animate-spin mb-4"
              />
              <p className="text-sm font-black uppercase tracking-widest text-brand-primary/40">
                Loading candidates...
              </p>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {candidates.map((c) => (
                <motion.div
                  key={c.id}
                  variants={item}
                  className={`group bg-white rounded-[32px] border border-brand-primary/5 shadow-soft hover:shadow-premium transition-all duration-500 overflow-hidden ${selectedIds.includes(c.id) ? "ring-2 ring-brand-primary ring-offset-4 ring-offset-brand-primary/5 bg-brand-primary/2" : ""}`}
                >
                  <div
                    className="p-5 md:p-6 cursor-pointer"
                    onClick={() => {
                      const willOpen = expandedId !== c.id;
                      setExpandedId(willOpen ? c.id : null);
                      if (willOpen) markCandidateOpened(c.id);
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[400px_1fr_180px_220px_60px] gap-6 max-sm:flex max-sm:flex-col items-center">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary text-xl font-black shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                          <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent" />
                          {c?.intern?.fullName?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-black text-brand-primary tracking-tight truncate group-hover:text-brand-primary-light transition-colors">
                            {c.intern?.fullName}
                          </h3>
                          <p className="text-[11px] font-bold text-brand-primary/30 uppercase tracking-widest truncate">
                            {c.intern?.email}
                          </p>
                        </div>
                      </div>

                      <div className="hidden md:block space-y-1">
                        <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">
                          Applied for
                        </p>
                        <p className="text-sm font-black text-brand-primary/80 truncate">
                          {c?.job?.jobTitle}
                        </p>
                      </div>

                      <div className="hidden md:block">
                        <Badge
                          status={c.candidateStatus}
                          size="sm"
                          className="rounded-xl px-4 py-1.5"
                        />
                      </div>

                      <div className="hidden md:block space-y-1.5">
                        {c.candidateStatus !== "HIRED" &&
                          c.candidateStatus !== "REJECTED" && (
                            <>
                              <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">
                                Next Step
                              </p>
                              <div
                                className="flex items-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {c.candidateStatus &&
                                  statusTransitions[c.candidateStatus] && (
                                    <>
                                      {c.candidateStatus === "INTERVIEW" &&
                                      c.interview &&
                                      c.interview.length > 0 &&
                                      c.interview[0]?.interviewDate &&
                                      c.interview[0]?.interviewTime ? (
                                        new Date(
                                          `${c.interview[0].interviewDate} ${c.interview[0].interviewTime}`,
                                        ) > new Date() ? (
                                          <Button
                                            size="sm"
                                            disabled
                                            className="rounded-xl w-40 px-4 py-1.5 h-auto font-black uppercase tracking-widest text-[9px] shadow-soft bg-brand-primary/30 text-brand-primary/50 cursor-not-allowed"
                                          >
                                            Hire (After{" "}
                                            {c.interview[0].interviewDate} @{" "}
                                            {new Date(
                                              `1970-01-01T${c.interview[0].interviewTime}`,
                                            ).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              hour12: true,
                                            })}
                                            )
                                          </Button>
                                        ) : (
                                          <Button
                                            size="sm"
                                            className="rounded-xl px-4 py-1.5 h-auto font-black uppercase tracking-widest text-[9px] shadow-soft bg-brand-primary"
                                            onClick={() =>
                                              handleNextStepClick(
                                                c,
                                                statusTransitions[
                                                  c.candidateStatus
                                                ],
                                              )
                                            }
                                          >
                                            {
                                              statusTransitions[
                                                c.candidateStatus
                                              ]
                                            }
                                          </Button>
                                        )
                                      ) : (
                                        <Button
                                          size="sm"
                                          className="rounded-xl px-4 py-1.5 h-auto font-black uppercase tracking-widest text-[9px] shadow-soft bg-brand-primary"
                                          onClick={() =>
                                            handleNextStepClick(
                                              c,
                                              statusTransitions[
                                                c.candidateStatus
                                              ],
                                            )
                                          }
                                        >
                                          {statusTransitions[c.candidateStatus]}
                                        </Button>
                                      )}
                                    </>
                                  )}
                                {c.candidateStatus !== "REJECTED" &&
                                  c.candidateStatus !== "HIRED" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="rounded-xl px-4 py-1.5 h-auto font-black uppercase tracking-widest text-[9px] text-red-500 hover:bg-red-50"
                                      onClick={() => handleRejectClick(c)}
                                    >
                                      Reject
                                    </Button>
                                  )}
                              </div>
                            </>
                          )}
                      </div>

                      <div className="hidden md:flex justify-end">
                        <div
                          className={`w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary/40 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 ${expandedId === c.id ? "rotate-180 bg-brand-primary text-white" : ""}`}
                        >
                          <ChevronDown size={18} strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === c.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-brand-primary/5"
                      >
                        <div className="p-6 pt-2 md:pl-[126px] md:pr-12 md:pb-10">
                          <div className="bg-brand-primary/5 rounded-[32px] p-8 space-y-8 border border-brand-primary/5">
                            <div className="flex items-center justify-between md:hidden pb-4 border-b border-brand-primary/5">
                              <Badge status={c.status} />
                              <p className="text-xs font-black text-brand-primary/40 uppercase tracking-widest">
                                {c.position}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                              <div className="space-y-2">
                                <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">
                                  Education
                                </p>
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-primary/40 shadow-soft">
                                    <GraduationCap
                                      size={14}
                                      strokeWidth={2.5}
                                    />
                                  </div>
                                  <span className="text-xs font-black capitalize text-brand-primary/70">
                                    {c.intern?.degreeOrCourse ||
                                      c.intern?.highestQualification}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">
                                  Experience
                                </p>
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-primary/40 shadow-soft">
                                    <Briefcase size={14} strokeWidth={2.5} />
                                  </div>
                                  <span className="text-xs font-black text-brand-primary/70">
                                    {c.intern.experience !== "" &&
                                    c.intern.experience !== "0"
                                      ? c.intern.experience
                                      : "NA"}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">
                                  Phone
                                </p>
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-primary/40 shadow-soft">
                                    <Mail size={14} strokeWidth={2.5} />
                                  </div>
                                  <span className="text-xs font-black text-brand-primary/70">
                                    {c?.intern?.mobileNumber}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2 text-right lg:text-left">
                                <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">
                                  Application Date
                                </p>
                                <p className="text-xs font-black text-brand-primary/40 py-2">
                                  {new Date(c.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">
                                Verified Skills
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {c?.intern.skills.map((skill) => (
                                  <span
                                    key={skill.id}
                                    className="px-4 py-2 bg-white text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-xl shadow-soft border border-brand-primary/5"
                                  >
                                    {skill.skillName}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {c.interview.length > 0 &&
                              c.interview.map((int, index) => (
                                <div
                                  key={index}
                                  className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white p-5 rounded-[24px] shadow-premium border border-brand-primary/5"
                                >
                                  <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                                    <Video size={18} strokeWidth={3} />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-[10px] font-black text-brand-primary/20 uppercase tracking-widest mb-0.5">
                                      Scheduled Interview
                                    </p>
                                    <h4 className="text-sm font-black text-brand-primary uppercase tracking-wide">
                                      {int.interviewType} — {int.interviewDate}{" "}
                                      @ {int.interviewTime}
                                    </h4>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${int.interviewStatus === "YES" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                                    >
                                      {int.interviewStatus !== null
                                        ? interviewStatusDisplay[
                                            int.interviewStatus
                                          ].text
                                        : interviewStatusDisplay.NOT_ANSWERED
                                            .text}
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-brand-primary font-black uppercase tracking-widest text-[9px] hover:bg-brand-primary/5"
                                    >
                                      Change
                                    </Button>
                                  </div>
                                </div>
                              ))}

                            <div className="pt-6 border-t border-brand-primary/5 flex flex-wrap gap-3">
                              <Button
                                onClick={() => handleOpenProfile(c)}
                                className="rounded-2xl px-8 font-black uppercase tracking-widest text-[10px] shadow-soft"
                              >
                                View Full Profile
                              </Button>

                              <Button
                                onClick={() => handleDownloadResume(c)}
                                variant="secondary"
                                className="rounded-2xl px-6 h-10 font-black uppercase tracking-widest text-[10px] bg-white border border-brand-primary/10 text-brand-primary/60 hover:text-brand-primary hover:border-brand-primary/20 hover:shadow-soft transition-all shadow-soft"
                              >
                                <Download size={13} strokeWidth={3} />
                                Resume
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!isLoading && candidates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-brand-primary/40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-inbox"
              >
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
              </svg>
              <p className="mt-4 text-lg font-semibold">No candidates found</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )}

          {!isLoading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-10">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage - 1,
                  }))
                }
                disabled={!pagination.hasPrevPage}
                className="p-3 rounded-2xl bg-white border border-brand-primary/5 text-brand-primary disabled:opacity-20 hover:bg-brand-primary/5 transition-all shadow-soft"
              >
                <ChevronDown size={20} strokeWidth={3} className="rotate-90" />
              </button>
              <div className="flex items-center gap-2">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, currentPage: i + 1 }))
                    }
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${pagination.currentPage === i + 1 ? "bg-brand-primary text-white shadow-premium" : "bg-white text-brand-primary/40 hover:bg-brand-primary/5 shadow-soft border border-brand-primary/5"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                  }))
                }
                disabled={!pagination.hasNextPage}
                className="p-3 rounded-2xl bg-white border border-brand-primary/5 text-brand-primary disabled:opacity-20 hover:bg-brand-primary/5 transition-all shadow-soft"
              >
                <ChevronDown size={20} strokeWidth={3} className="-rotate-90" />
              </button>
            </div>
          )}
        </>
      ) : (
        <InterviewTab candidates={candidates} />
      )}

      <InterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        candidate={selectedCandidateForInterview}
        onInterviewScheduled={() => fetchCandidates()}
        // onSuccess={(id, status) => handleCandidateStatusUpdate([id], status)}
      />
      <CandidateProfileModal
        isOpen={profileModal.isOpen}
        onClose={() => setProfileModal({ ...profileModal, isOpen: false })}
        candidateId={profileModal.candidateId}
      />
    </div>
  );
};

export default CandidatesPage;
