import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  CircleAlert,
  Save,
  Plus,
} from "lucide-react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Textarea from "../../components/Textarea";
import CapsuleMultiSelect from "../../components/CapsuleMultiSelect";
import { getSubscriptionPackagesApi, COMPANY_ID } from "../../helper/api";

import {
  toggleWizard,
  nextStep,
  prevStep,
  updateDraft,
  resetWizard,
  addJob,
} from "../../store/slices/jobsSlice";
import {
  getJobCategoriesApi,
  getJobSubCategoriesApi,
  getSkillsApi,
  getjobLocationsApi,
  getPurchasedSubscriptionsApi,
  createJobOpeningApi,
} from "../../helper/api";
import toast from "react-hot-toast";
import { setCurrentPlanId } from "../../store/slices/subscriptionSlice";

const AI_TITLE_LIBRARY = {
  "Technology|Web Development": {
    Internship: [
      "Frontend Developer Intern",
      "Web Development Intern",
      "React Intern",
    ],
    Job: ["Frontend Developer", "Web Developer", "React Developer"],
  },
  "Engineering|Backend Engineering": {
    Internship: [
      "Backend Engineering Intern",
      "Node.js Intern",
      "API Development Intern",
    ],
    Job: ["Backend Engineer", "Node.js Developer", "Backend Software Engineer"],
  },
  "Design|UI/UX Design": {
    Internship: [
      "UI/UX Design Intern",
      "Product Design Intern",
      "UX Research Intern",
    ],
    Job: ["UI/UX Designer", "Product Designer", "UX Designer"],
  },
  "Marketing|Content Marketing": {
    Internship: [
      "Content Marketing Intern",
      "Content Strategy Intern",
      "SEO Content Intern",
    ],
    Job: [
      "Content Marketing Specialist",
      "Content Strategist",
      "SEO Content Writer",
    ],
  },
  "Business|Sales": {
    Internship: [
      "Sales Intern",
      "Business Development Intern",
      "Inside Sales Intern",
    ],
    Job: [
      "Sales Executive",
      "Business Development Executive",
      "Inside Sales Specialist",
    ],
  },
};

const BENEFIT_OPTIONS = [
  "Certificate",
  "Letter of Recommendation",
  "Pre-placement Offer",
  "Flexible Hours",
  "Work From Home",
  "Informal Dress Code",
  "Mentorship",
];

const EXPERIENCE_OPTIONS = [
  "0 to 1 Years",
  "1 to 2 Years",
  "2 to 3 Years",
  "3 to 4 Years",
  "4 to 5 Years",
  "5 to 7 Years",
  "7+ Years",
];

const WorkTypeOption = [
  { label: "Remote", value: "REMOTE" },
  { label: "Hybrid", value: "HYBRID" },
  { label: "On-Site", value: "ON_SITE" },
];

const JobTypeOption = [
  { label: "Full Time", value: "FULL_TIME" },
  { label: "Part Time", value: "PART_TIME" },
  { label: "Contract", value: "CONTRACT" },
  { label: "Any", value: "ANY" },
];

const CreateJobWizard = () => {
  const [showInReviewModal, setShowInReviewModal] = React.useState(false);
  const dispatch = useDispatch();
  const [categories, setCategories] = React.useState([]);
  const [subCategories, setSubCategories] = React.useState([]);
  const [skillOptions, setSkillOptions] = React.useState([]);
  const [jobLocations, setJobLocations] = React.useState([]);
  const [customBenefit, setCustomBenefit] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const companyId = localStorage.getItem("companyId");
  const currentPlanId = useSelector(
    (state) => state.subscription.currentPlanId,
  );
  const { isWizardOpen, currentStep, draft } = useSelector(
    (state) => state.jobs,
  );
  const { company } = useSelector((state) => state.profile);

  const fetchCategories = React.useCallback(async () => {
    try {
      const response = await getJobCategoriesApi();
      if (response.status) {
        setCategories(
          response.data.map((cat) => ({
            label: cat.categoryName,
            value: cat.id,
          })),
        );
      }
    } catch (error) {
      console.error("Fetch Categories Error:", error);
    }
  }, []);

  const fetchSubCategories = React.useCallback(async (categoryId) => {
    try {
      const response = await getJobSubCategoriesApi({
        categoryIds: categoryId,
      });
      if (response.status) {
        setSubCategories(
          response.data.map((sub) => ({
            label: sub.subCategoryName,
            value: sub.id,
          })),
        );
      }
    } catch (error) {
      console.error("Fetch Sub-Categories Error:", error);
    }
  }, []);

  const fetchSkills = React.useCallback(async (subCategoryId) => {
    try {
      const response = await getSkillsApi({
        subCategoryIds: subCategoryId,
      });
      if (response.status) {
        setSkillOptions(response.data.map((skill) => skill.skillName));
      }
    } catch (error) {
      console.error("Fetch Skills Error:", error);
    }
  }, []);

  const fetchActiveSubscription = React.useCallback(async (compId) => {
    try {
      const response = await getPurchasedSubscriptionsApi(compId);
      if (response.status && response.data?.length > 0) {
        // Assuming the first active one is what we need
        const active = response.data[0];
        setCurrentPlanId(active.id);
      }
    } catch (error) {
      console.error("Fetch Subscription Error:", error);
    }
  }, []);

  const fetchJobLocations = React.useCallback(async (companyId) => {
    try {
      const response = await getjobLocationsApi(companyId);

      if (response.status) {
        setJobLocations(
          response.data.map((loc) => ({
            label: loc,
            value: loc,
          })),
        );
      }
    } catch (error) {
      console.error("Fetch Job Locations Error:", error);
    }
  }, []);

  React.useEffect(() => {
    if (isWizardOpen) {
      fetchCategories();
      console.log("company id is : ", companyId);
      if (companyId) {
        fetchJobLocations(companyId);
        fetchActiveSubscription(companyId);
      }
    }
  }, [
    isWizardOpen,
    fetchCategories,
    fetchJobLocations,
    fetchActiveSubscription,
    companyId,
  ]);

  React.useEffect(() => {
    if (draft.jobCategoryId) {
      fetchSubCategories(draft.jobCategoryId);
    } else {
      setSubCategories([]);
    }
  }, [draft.jobCategoryId, fetchSubCategories]);

  React.useEffect(() => {
    if (draft.jobSubCategoryId) {
      fetchSkills(draft.jobSubCategoryId);
    } else {
      setSkillOptions([]);
    }
  }, [draft.jobSubCategoryId, fetchSkills]);

  const aiSuggestedTitles = React.useMemo(() => {
    if (!draft.category || !draft.subCategory) return [];
    const key = `${draft.category}|${draft.subCategory}`;
    const mapped = AI_TITLE_LIBRARY[key]?.[draft.applicationType];
    if (mapped?.length) return mapped;
    return draft.applicationType === "Job"
      ? [
          `${draft.subCategory} Specialist`,
          `${draft.subCategory} Associate`,
          `${draft.subCategory} Executive`,
        ]
      : [
          `${draft.subCategory} Intern`,
          `${draft.subCategory} Trainee`,
          `${draft.subCategory} Associate Intern`,
        ];
  }, [draft.applicationType, draft.category, draft.subCategory]);

  // console.log("isWizard Open")

  // 30-second Autosave Logic
  React.useEffect(() => {
    if (!isWizardOpen) return;

    const interval = setInterval(() => {
      localStorage.setItem("oppvia_job_draft", JSON.stringify(draft));
      console.log("Draft autosaved at", new Date().toLocaleTimeString());
    }, 30000);

    return () => clearInterval(interval);
  }, [draft, isWizardOpen]);

  // Load draft from localStorage on mount
  React.useEffect(() => {
    const savedDraft = localStorage.getItem("oppvia_job_draft");
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        dispatch(updateDraft(parsedDraft));
      } catch {
        console.error("Failed to parse saved draft");
      }
    }
  }, [dispatch]);

  const geocodeAddress = (address) => {
    return new Promise((resolve, reject) => {
      if (
        !window.google ||
        !window.google.maps ||
        !window.google.maps.Geocoder
      ) {
        resolve({ city: "", state: "" });
        return;
      }
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const components = results[0].address_components;
          let city = "";
          let state = "";
          components.forEach((component) => {
            if (component.types.includes("locality"))
              city = component.long_name;
            if (component.types.includes("administrative_area_level_1"))
              state = component.long_name;
          });
          resolve({ city, state });
        } else {
          resolve({ city: "", state: "" });
        }
      });
    });
  };

  const handleClose = () => {
    dispatch(toggleWizard());
    dispatch(resetWizard());
    // Do not clear localStorage here so it persists if they close accidentally
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!draft.jobCategoryId) return "Job Category is required";
        if (!draft.jobSubCategoryId) return "Sub-Category is required";
        if (!draft.title) return "Position Title is required";
        if (!draft.internsRequired || draft.internsRequired < 1)
          return "Number of openings is required";
        if (!draft.workType) return "Work Type is required";
        return true;
      case 2:
        if (!draft.location && draft.workType !== "REMOTE")
          return "Location is required";
        if (!draft.duration) return "Duration is required";
        if (!draft.workingHours) return "Working Hours is required";
        if (draft.applicationType === "Job" && !draft.experienceRange)
          return "Experience range is required";
        if (draft.applicationType === "Internship") {
          if (draft.stipend.type === "Paid") {
            if (!draft.stipend.minAmount || !draft.stipend.maxAmount)
              return "Stipend amount is required";
          }
        } else {
          if (!draft.salary.minAmount || !draft.salary.maxAmount)
            return "Salary amount is required";
        }
        if (draft.skills.length === 0) return "At least one skill is required";
        return true;
      case 3:
        if (!draft.description || draft.description.length < 50)
          return "About Job description must be at least 50 characters";
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    const validation = validateStep(currentStep);
    if (validation === true) {
      dispatch(nextStep());
    } else {
      toast.error(validation);
    }
  };

  const loadCurrentPlan = async () => {
    try {
      const res = await getSubscriptionPackagesApi(COMPANY_ID);

      if (res?.data) {
        const active = res.data.find((p) => p.isPurchased || p.isCurrent);

        if (active) {
          dispatch(setCurrentPlanId(active.id));
        }
      }
    } catch (err) {
      console.error("Error loading subscription:", err);
    }
  };

  useEffect(() => {
    if (COMPANY_ID) {
      loadCurrentPlan();
    }
  }, []);

  const handlePostInternship = async () => {
    const validation = validateStep(3);
    if (validation !== true) {
      toast.error(validation);
      return;
    }

    // if (!activeSubscriptionId) {
    //   toast.error("No active subscription found. Please check your plan.");
    //   return;
    // }

    setIsSubmitting(true);
    try {
      const locationString =
        draft.location || (draft.workType === "REMOTE" ? "Remote" : "");
      let geoInfo = { city: "", state: "" };

      if (locationString && locationString !== "Remote") {
        geoInfo = await geocodeAddress(locationString);
      }

      const payload = {
        aboutJob: draft.description,
        additionalBenefits: draft.benefits,
        companyId: companyId,
        internshipDuration: draft.duration,
        jobCategoryId: draft.jobCategoryId,
        jobSubCategoryId: draft.jobSubCategoryId,
        jobTitle: draft.title,
        jobType: draft.workType.toUpperCase(), // Matches values like 'REMOTE'
        location: locationString,
        city: geoInfo.city,
        state: geoInfo.state,
        maxStipend:
          draft.applicationType === "Internship"
            ? Number(draft.stipend.maxAmount)
            : Number(draft.salary.maxAmount),
        minStipend:
          draft.applicationType === "Internship"
            ? Number(draft.stipend.minAmount)
            : Number(draft.salary.minAmount),
        numberOfOpenings: Number(draft.internsRequired),
        otherRequirements: draft.otherInfo,
        skills: draft.skills,
        stipend:
          draft.applicationType === "Internship" &&
          draft.stipend.type === "Paid"
            ? "YES"
            : "NO",
        workingHours: draft.workingHours,
        subscriptionId: currentPlanId,
      };

      const response = await createJobOpeningApi(payload);
      if (response.status) {
        toast.success(response.message || "Job posted successfully!");
        localStorage.removeItem("oppvia_job_draft");
        handleClose();
        setShowInReviewModal(true);
      } else {
        toast.error(response.message || "Failed to post job");
      }
    } catch (error) {
      console.error("Post Job Error:", error);
      toast.error(error || "An error occurred while posting the job");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest px-1">
                  Application Type
                </label>
                <div className="flex p-1.5 bg-brand-primary/5 rounded-2xl gap-1">
                  {["Internship", "Job"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        dispatch(
                          updateDraft({
                            applicationType: type,
                            jobType:
                              type === "Job"
                                ? draft.jobType || "Full Time"
                                : "",
                          }),
                        )
                      }
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                        draft.applicationType === type
                          ? "bg-white text-brand-primary shadow-soft"
                          : "text-brand-primary/40 hover:text-brand-primary"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Job Category"
                  options={categories}
                  value={draft.jobCategoryId}
                  onChange={(val) => {
                    const selectedCat = categories.find((c) => c.value === val);
                    dispatch(
                      updateDraft({
                        jobCategoryId: val,
                        category: selectedCat?.label || "",
                        jobSubCategoryId: "",
                        subCategory: "",
                        title: "",
                      }),
                    );
                  }}
                />
                <Select
                  label="Sub-Category"
                  options={subCategories}
                  value={draft.jobSubCategoryId}
                  onChange={(val) => {
                    const selectedSub = subCategories.find(
                      (s) => s.value === val,
                    );
                    dispatch(
                      updateDraft({
                        jobSubCategoryId: val,
                        subCategory: selectedSub?.label || "",
                        title: "",
                      }),
                    );
                  }}
                  placeholder={
                    draft.jobCategoryId
                      ? "Select sub-category"
                      : "Select category first"
                  }
                />
              </div>

              <div className="space-y-3 pt-2">
                <Input
                  label="Position Title"
                  placeholder={
                    draft.category && draft.subCategory
                      ? `e.g. ${aiSuggestedTitles[0] || (draft.applicationType === "Job" ? "Full Stack Developer" : "Software Engineering Intern")}`
                      : "Select category and sub-category first"
                  }
                  value={draft.title}
                  onChange={(e) =>
                    dispatch(updateDraft({ title: e.target.value }))
                  }
                  className="bg-white rounded-2xl border-none shadow-soft h-14 text-sm font-bold"
                  disabled={!draft.category || !draft.subCategory}
                />
                {draft.category && draft.subCategory && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 px-1 flex items-center gap-2">
                      <Sparkles size={12} className="text-brand-accent" />
                      AI Suggested Titles
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestedTitles.map((title) => (
                        <button
                          key={title}
                          type="button"
                          onClick={() => dispatch(updateDraft({ title }))}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                            draft.title === title
                              ? "bg-brand-primary text-white"
                              : "bg-brand-primary/5 text-brand-primary hover:bg-brand-primary/10"
                          }`}
                        >
                          {title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                {/* <Select
                  label="Job Type"
                  options={JobTypeOption}
                  value={draft.jobType}
                  onChange={(val) => dispatch(updateDraft({ jobType: val }))}
                  placeholder="Select job type"
                /> */}
                <Input
                  label={
                    draft.applicationType === "Job"
                      ? "Openings"
                      : "Number of Interns Required"
                  }
                  type="number"
                  min="1"
                  value={draft.internsRequired}
                  onChange={(e) =>
                    dispatch(updateDraft({ internsRequired: e.target.value }))
                  }
                  className="bg-white rounded-2xl border-none shadow-soft h-14 text-sm font-bold"
                />
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest px-1">
                    Work Type
                  </label>
                  <div className="flex p-1.5 bg-brand-primary/5 rounded-2xl gap-1">
                    {WorkTypeOption.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          dispatch(updateDraft({ workType: type.value }))
                        }
                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                          draft.workType === type.value
                            ? "bg-white text-brand-primary shadow-soft"
                            : "text-brand-primary/40 hover:text-brand-primary"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* <div className="space-y-3">
                  <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest px-1">
                    Urgent Hiring
                  </label>
                  <div className="flex p-1.5 bg-brand-primary/5 rounded-2xl gap-1">
                    {["Yes", "No"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          dispatch(updateDraft({ urgentHiring: option }))
                        }
                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                          draft.urgentHiring === option
                            ? "bg-white text-brand-primary shadow-soft"
                            : "text-brand-primary/40 hover:text-brand-primary"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              {/* Conditional Location */}

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={
                  jobLocations.length > 0
                    ? "overflow-visible"
                    : "overflow-hidden"
                }
              >
                {console.log("location state data : ", jobLocations)}
                {jobLocations.length > 0 ? (
                  <Select
                    label="Job Location"
                    options={jobLocations}
                    value={draft.location}
                    onChange={(val) => dispatch(updateDraft({ location: val }))}
                    placeholder="Search and select location"
                    searchable
                  />
                ) : (
                  <Input
                    label="Job Location"
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={draft.location}
                    onChange={(e) =>
                      dispatch(updateDraft({ location: e.target.value }))
                    }
                    className="bg-white rounded-2xl border-none shadow-soft h-14 text-sm font-bold"
                  />
                )}
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {draft.applicationType === "Job" ? (
                  <Select
                    label="Experience Required"
                    options={EXPERIENCE_OPTIONS}
                    value={draft.experienceRange}
                    onChange={(val) =>
                      dispatch(updateDraft({ experienceRange: val }))
                    }
                    placeholder="Select experience range"
                  />
                ) : (
                  <Select
                    label={"Internship Duration"}
                    options={[
                      "1 Month",
                      "2 Months",
                      "3 Months",
                      "4 Months",
                      "6 Months",
                      "12 Months",
                    ]}
                    value={draft.duration}
                    onChange={(val) => dispatch(updateDraft({ duration: val }))}
                  />
                )}

                <Select
                  label="Employment Type"
                  options={JobTypeOption}
                  value={draft.workingHours}
                  onChange={(val) =>
                    dispatch(updateDraft({ workingHours: val }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {console.log("job type is : ==> ", draft)}

                <div className="space-y-4 col-span-2">
                  <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest px-1">
                    {draft.applicationType === "Job"
                      ? "Salary Details (LPA)"
                      : "Stipend Details"}
                  </label>

                  {draft.applicationType === "Internship" && (
                    <div className="flex p-1.5 bg-brand-primary/5 rounded-2xl gap-1">
                      {["Paid", "Unpaid"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateDraft({
                                stipend: { ...draft.stipend, type },
                              }),
                            )
                          }
                          className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                            draft.stipend.type === type
                              ? "bg-white text-brand-primary shadow-soft"
                              : "text-brand-primary/40 hover:text-brand-primary"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}

                  <AnimatePresence>
                    {(draft.applicationType === "Job" ||
                      (draft.applicationType === "Internship" &&
                        draft.stipend.type === "Paid")) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-2 gap-4 pt-2"
                      >
                        <Input
                          label={
                            draft.applicationType === "Job"
                              ? "Min Salary"
                              : "Min Stipend (₹)"
                          }
                          placeholder={
                            draft.applicationType === "Job" ? "350000" : "5000"
                          }
                          type="number"
                          value={
                            draft.applicationType === "Job"
                              ? draft.salary.minAmount
                              : draft.stipend.minAmount
                          }
                          onChange={(e) =>
                            draft.applicationType === "Job"
                              ? dispatch(
                                  updateDraft({
                                    salary: {
                                      ...draft.salary,
                                      minAmount: e.target.value,
                                    },
                                  }),
                                )
                              : dispatch(
                                  updateDraft({
                                    stipend: {
                                      ...draft.stipend,
                                      minAmount: e.target.value,
                                      amount: e.target.value,
                                    },
                                  }),
                                )
                          }
                          className="bg-white rounded-2xl border-none shadow-soft h-14 text-sm font-bold"
                        />
                        <Input
                          label={
                            draft.applicationType === "Job"
                              ? "Max Salary"
                              : "Max Stipend (₹)"
                          }
                          placeholder={
                            draft.applicationType === "Job" ? "650000" : "10000"
                          }
                          type="number"
                          value={
                            draft.applicationType === "Job"
                              ? draft.salary.maxAmount
                              : draft.stipend.maxAmount
                          }
                          onChange={(e) =>
                            draft.applicationType === "Job"
                              ? dispatch(
                                  updateDraft({
                                    salary: {
                                      ...draft.salary,
                                      maxAmount: e.target.value,
                                    },
                                  }),
                                )
                              : dispatch(
                                  updateDraft({
                                    stipend: {
                                      ...draft.stipend,
                                      maxAmount: e.target.value,
                                    },
                                  }),
                                )
                          }
                          className="bg-white rounded-2xl border-none shadow-soft h-14 text-sm font-bold"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-brand-primary/5">
                {/* <CapsuleMultiSelect
                  label="Languages"
                  placeholder="Search languages..."
                  selected={draft.languages || []}
                  onChange={(languages) => dispatch(updateDraft({ languages }))}
                  options={LANGUAGE_OPTIONS}
                  helperText="Select one or more preferred languages."
                /> */}
                <CapsuleMultiSelect
                  label="Required Skills"
                  placeholder="Search skills..."
                  selected={draft.skills}
                  onChange={(skills) => dispatch(updateDraft({ skills }))}
                  options={skillOptions}
                  helperText="Pick multiple skills by tapping capsules."
                />
                <div className="space-y-3">
                  <CapsuleMultiSelect
                    label="Perks & Benefits"
                    placeholder="Search or type a new benefit..."
                    selected={draft.benefits}
                    onChange={(benefits) => dispatch(updateDraft({ benefits }))}
                    options={BENEFIT_OPTIONS}
                    allowCreate
                    createButtonLabel="Add Benefit"
                    helperText="Select from suggestions or add your own below."
                  />
                  <div className="flex gap-3">
                    <Input
                      placeholder="e.g. Free Laptop, Gym Membership"
                      value={customBenefit}
                      onChange={(e) => setCustomBenefit(e.target.value)}
                      className="bg-white rounded-2xl border-none shadow-soft h-12 text-sm font-bold flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && customBenefit.trim()) {
                          const next = customBenefit.trim();
                          if (!draft.benefits.includes(next)) {
                            dispatch(
                              updateDraft({
                                benefits: [...draft.benefits, next],
                              }),
                            );
                          }
                          setCustomBenefit("");
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (customBenefit.trim()) {
                          const next = customBenefit.trim();
                          if (!draft.benefits.includes(next)) {
                            dispatch(
                              updateDraft({
                                benefits: [...draft.benefits, next],
                              }),
                            );
                          }
                          setCustomBenefit("");
                        }
                      }}
                      className="rounded-2xl px-6 h-12 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all font-black uppercase tracking-widest text-[10px]"
                    >
                      <Plus size={14} className="mr-2" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-fade-in no-scrollbar overflow-y-auto max-h-[60vh] pb-10">
            {/* Role Description & Requirements */}
            <div className="bg-brand-primary rounded-[32px] p-8 shadow-soft text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-xl font-black tracking-tight">
                  Role Information
                </h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all group">
                  <Sparkles
                    size={16}
                    className="text-brand-accent group-hover:rotate-12 transition-transform"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    AI Refine
                  </span>
                </button>
              </div>

              <div className="space-y-6 relative z-10">
                <Textarea
                  label="Role Description"
                  placeholder="Describe the role and team culture..."
                  value={draft.description}
                  onChange={(e) =>
                    dispatch(updateDraft({ description: e.target.value }))
                  }
                  className="bg-white/10 border-none text-white placeholder:text-white/30 rounded-2xl h-32 focus:ring-white/20 text-sm"
                />
                <Textarea
                  label="Other Information (Optional)"
                  placeholder="Mention perks, shift timings, etc..."
                  value={draft.otherInfo}
                  onChange={(e) =>
                    dispatch(updateDraft({ otherInfo: e.target.value }))
                  }
                  className="bg-white/10 border-none text-white placeholder:text-white/30 rounded-2xl h-24 focus:ring-white/20 text-sm"
                />
              </div>
            </div>

            {/* Side-by-Side Review Panel */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-1">
                <div className="h-px flex-1 bg-brand-primary/5" />
                <span className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">
                  Final Review
                </span>
                <div className="h-px flex-1 bg-brand-primary/5" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl p-6 shadow-soft border border-brand-primary/5 space-y-4">
                  <h4 className="text-xs font-black text-brand-primary uppercase tracking-tight border-b border-brand-primary/5 pb-2">
                    Basic Details
                  </h4>
                  <div className="space-y-3">
                    {[
                      { l: "Title", v: draft.title },
                      { l: "Work Type", v: draft.workType },
                      { l: "Location", v: draft.location || "Remote" },
                      { l: "Required", v: `${draft.internsRequired} Interns` },
                      { l: "Experience", v: draft.experienceRange || "—" },
                      { l: "Languages", v: draft.languages?.join(", ") || "—" },
                      {
                        l: "Age",
                        v:
                          draft.ageRange?.min && draft.ageRange?.max
                            ? `${draft.ageRange.min} - ${draft.ageRange.max}`
                            : "—",
                      },
                      { l: "Urgent Hiring", v: draft.urgentHiring || "No" },
                      ...(draft.applicationType === "Job"
                        ? [
                            {
                              l: "Job Type",
                              v: draft.applicationType || "Full Time",
                            },
                          ]
                        : []),
                    ].map((x) => (
                      <div
                        key={x.l}
                        className="flex justify-between items-center"
                      >
                        <span className="text-[10px] font-bold text-brand-primary/30 uppercase">
                          {x.l}
                        </span>
                        <span className="text-[11px] font-black text-brand-primary/80 truncate max-w-[120px]">
                          {x.v || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-soft border border-brand-primary/5 space-y-4">
                  <h4 className="text-xs font-black text-brand-primary uppercase tracking-tight border-b border-brand-primary/5 pb-2">
                    Terms & Comp
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        l:
                          draft.applicationType === "Job"
                            ? "Notice"
                            : "Duration",
                        v: draft.duration,
                      },
                      { l: "Hours", v: draft.workingHours },
                      {
                        l:
                          draft.applicationType === "Job"
                            ? "Salary"
                            : "Stipend",
                        v:
                          draft.applicationType === "Job"
                            ? `₹${draft.salary.minAmount} - ₹${draft.salary.maxAmount} LPA`
                            : draft.stipend.type === "Paid"
                              ? `₹${draft.stipend.minAmount} - ₹${draft.stipend.maxAmount}`
                              : draft.stipend.type,
                      },
                      { l: "Benefits", v: draft.benefits.join(", ") },
                    ].map((x) => (
                      <div
                        key={x.l}
                        className="flex justify-between items-center"
                      >
                        <span className="text-[10px] font-bold text-brand-primary/30 uppercase">
                          {x.l}
                        </span>
                        <span className="text-[11px] font-black text-brand-primary/80 truncate max-w-[120px]">
                          {x.v || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isWizardOpen && !showInReviewModal) return null;

  return (
    <>
      <AnimatePresence>
        {isWizardOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-[#f9fbfb] rounded-[48px] shadow-2xl overflow-hidden border border-white/20"
            >
              {/* Wizard Header */}
              <div className="px-10 pt-10 pb-6 flex justify-between items-center">
                <div className="flex gap-2">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        s === currentStep
                          ? "w-10 bg-brand-primary"
                          : s < currentStep
                            ? "w-4 bg-brand-primary/40"
                            : "w-4 bg-brand-primary/10"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-10 pb-6">
                <h2 className="text-3xl font-black text-brand-primary text-editorial tracking-tighter mb-2">
                  {currentStep === 1
                    ? "Job Basics"
                    : currentStep === 2
                      ? "Details & Pay"
                      : "Role Description"}
                </h2>
                <p className="text-sm font-bold text-brand-primary/30">
                  Step {currentStep} of 3 · Fill in the information to post your
                  internship.
                </p>
              </div>

              {/* Step Content */}
              <div className="px-10 py-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                {renderStep()}
              </div>

              {/* Wizard Footer */}
              <div className="px-10 py-10 bg-white/50 border-t border-brand-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    className="text-brand-primary/40 font-black uppercase tracking-widest text-[10px] hover:text-brand-primary px-4"
                  >
                    <Save size={14} className="mr-2" /> Save Draft
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  {currentStep > 1 && (
                    <button
                      onClick={() => dispatch(prevStep())}
                      className="p-4 rounded-2xl text-brand-primary/60 hover:bg-brand-primary/5 transition-all outline-none"
                    >
                      <ArrowLeft size={20} strokeWidth={3} />
                    </button>
                  )}
                  <Button
                    onClick={() =>
                      currentStep === 3 ? handlePostInternship() : handleNext()
                    }
                    disabled={isSubmitting}
                    className="rounded-2xl px-10 py-5 h-auto shadow-soft bg-brand-primary hover:bg-brand-primary-light transition-all flex items-center gap-3 min-w-[180px] justify-center"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="font-black uppercase tracking-widest text-xs">
                          {currentStep === 3 ? "Post Internship" : "Continue"}
                        </span>
                        {currentStep === 3 ? (
                          <CheckCircle2 size={16} strokeWidth={3} />
                        ) : (
                          <ArrowRight size={16} strokeWidth={3} />
                        )}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInReviewModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl border border-brand-primary/10"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                <CircleAlert size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-brand-primary tracking-tight mb-2">
                Your posting is in review
              </h3>
              <p className="text-sm font-semibold text-brand-primary/50 mb-7">
                We have received your job posting. It is now pending review and
                will appear as live once approved.
              </p>
              <Button
                onClick={() => setShowInReviewModal(false)}
                className="w-full rounded-2xl py-4 h-auto bg-brand-primary hover:bg-brand-primary-light font-black uppercase tracking-widest text-xs"
              >
                Okay
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateJobWizard;
