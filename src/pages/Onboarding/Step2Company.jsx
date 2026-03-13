import { useRef, useState, useEffect } from "react";
import {
  Building2,
  Globe2,
  ArrowRight,
  ArrowLeft,
  AlignLeft,
  ImagePlus,
  X,
  ChevronDown,
  Search,
  Check,
  Hash,
  Calendar,
  Users,
} from "lucide-react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { cn } from "../../utils/cn";
import {
  getIndustriesListApi,
  companyCreateAccountStep2Api,
} from "../../helper/api";
import toast from "react-hot-toast";

// Inline branded select matching the company panel design system
const BrandedSelect = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) =>
    (typeof o === "string" ? o : o.label)
      ?.toLowerCase()
      .includes(search?.toLowerCase()),
  );

  const selectedLabel = options.find(
    (o) => (typeof o === "string" ? o : o.value) === value,
  );
  const displayLabel = selectedLabel
    ? typeof selectedLabel === "string"
      ? selectedLabel
      : selectedLabel.label
    : "";

  return (
    <div className="flex flex-col gap-2 w-full group/select" ref={ref}>
      <div className="flex justify-between items-center ml-1">
        {label && (
          <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest transition-colors group-focus-within/select:text-brand-primary">
            {label}
          </label>
        )}
        {error && (
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
            {error}
          </span>
        )}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsOpen((p) => !p);
            setSearch("");
          }}
          className={cn(
            "w-full bg-brand-primary/5 border rounded-[20px] outline-none transition-all duration-300 shadow-soft",
            "hover:border-brand-primary/20 text-left flex items-center justify-between px-6 py-5",
            isOpen
              ? "bg-white border-brand-primary/30 ring-4 ring-brand-primary/5"
              : error
                ? "border-red-400"
                : "border-brand-primary/10",
          )}
        >
          <span
            className={cn(
              "font-bold text-[15px]",
              displayLabel ? "text-brand-primary" : "text-brand-primary/20",
            )}
          >
            {displayLabel || placeholder}
          </span>
          <ChevronDown
            size={16}
            strokeWidth={3}
            className={cn(
              "text-brand-primary/30 transition-transform shrink-0",
              isOpen && "rotate-180 text-brand-primary",
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-2 w-full bg-white border border-brand-primary/10 rounded-[20px] shadow-premium overflow-hidden">
            <div className="p-3 border-b border-brand-primary/5">
              <div className="relative">
                <Search
                  size={14}
                  strokeWidth={3}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-brand-primary/5 rounded-xl text-xs font-bold text-brand-primary placeholder:text-brand-primary/20 outline-none focus:ring-2 focus:ring-brand-primary/10"
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-xs font-bold text-brand-primary/30">
                  No options found
                </p>
              ) : (
                filtered.map((opt, idx) => {
                  const optValue = typeof opt === "string" ? opt : opt.value;
                  const optLabel = typeof opt === "string" ? opt : opt.label;
                  const isSelected = optValue === value;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onChange(optValue);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2.5 text-xs font-black rounded-xl text-left flex items-center justify-between transition-all",
                        isSelected
                          ? "bg-brand-primary/10 text-brand-primary"
                          : "text-brand-primary/60 hover:bg-brand-primary/5 hover:text-brand-primary",
                      )}
                    >
                      {optLabel}
                      {isSelected && (
                        <Check
                          size={13}
                          strokeWidth={3}
                          className="text-brand-primary shrink-0"
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Step2Company = ({ onNext, onBack, data, updateData }) => {
  const logoInputRef = useRef(null);
  const smallLogoInputRef = useRef(null);
  const [industries, setIndustries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await getIndustriesListApi();
        if (res.status) {
          setIndustries(
            res.data.map((item) => ({
              value: item.id,
              label: item.categoryName,
            })),
          );
        }
      } catch (error) {
        console.error("Failed to fetch industries:", error);
      }
    };
    fetchIndustries();
  }, []);

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the binary file for API call
    updateData({ [`${field}File`]: file });

    // Store preview for UI
    const reader = new FileReader();
    reader.onload = (ev) => updateData({ [field]: ev.target.result });
    reader.readAsDataURL(file);

    // Clear error if any
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const removeFile = (field, ref) => {
    updateData({ [field]: "", [`${field}File`]: null });
    if (ref.current) ref.current.value = "";
  };

  const validate = () => {
    const newErrors = {};

    if (!data.companyLogo) newErrors.companyLogo = "Required";
    if (!data.smallLogo) newErrors.smallLogo = "Required";

    if (!data.companyName) {
      newErrors.companyName = "Required";
    } else if (data.companyName.length < 3) {
      newErrors.companyName = "Too short (min 3)";
    } else if (data.companyName.length > 20) {
      newErrors.companyName = "Too long (max 20)";
    }

    if (!data.industry) newErrors.industry = "Required";
    if (!data.companySize) newErrors.companySize = "Required";
    if (!data.foundedYear) newErrors.foundedYear = "Required";
    if (!data.registrationNumber) newErrors.registrationNumber = "Required";

    const wordCount = data.description?.trim().split(/\s+/).length || 0;
    if (!data.description) {
      newErrors.description = "Required";
    } else if (wordCount < 20) {
      newErrors.description = `Need ${20 - wordCount} more words (min 20)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsLoading(true);
    const companyId = localStorage.getItem("companyId");

    try {
      const formData = new FormData();
      formData.append("id", companyId);
      formData.append("industryType", data.industry);
      formData.append("companySize", data.companySize);
      formData.append("companyIntro", data.description);
      formData.append("foundedYear", data.foundedYear);
      formData.append("panOrGst", data.registrationNumber);
      formData.append("websiteUrl", data.website || "");

      if (data.companyLogoFile) formData.append("logo", data.companyLogoFile);
      if (data.smallLogoFile) formData.append("smallLogo", data.smallLogoFile);

      const response = await companyCreateAccountStep2Api(formData);

      if (response.status) {
        toast.success(response.message || "Profile updated successfully");
        localStorage.setItem("currentStep", "4"); // Step 3 in UI, Step 4 in Wizard logic
        onNext();
      }

      localStorage.setItem("formData", JSON.stringify(data));
      localStorage.setItem("currentStep", "4");
    } catch (error) {
      console.error("Step 2 Error:", error);
      toast.error(error || "Submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Form Section: Company Core */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Building2 size={16} strokeWidth={3} />
          </div>
          <h3 className="text-lg font-black text-brand-primary tracking-tighter">
            Organizational Blueprint
          </h3>
        </div>

        <div className="space-y-6">
          {/* Company Identity Row: Logo + Name */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Logo Upload */}
            <div className="flex gap-4">
              {/* Main Logo */}
              <div className="space-y-2 shrink-0">
                <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                  Logo
                </p>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "companyLogo")}
                />
                {data.companyLogo ? (
                  <div className="relative w-[72px] h-[72px] group/logo">
                    <img
                      src={data.companyLogo}
                      alt="Company logo"
                      className="w-full h-full rounded-2xl object-cover border border-brand-primary/10 shadow-soft"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-brand-primary/60 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-brand-primary shadow-soft"
                      >
                        <ImagePlus size={13} strokeWidth={3} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFile("companyLogo", logoInputRef)}
                        className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-red-400 shadow-soft"
                      >
                        <X size={13} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className={cn(
                      "w-[72px] h-[72px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all group/upload",
                      errors.companyLogo
                        ? "border-red-400 bg-red-50 text-red-400"
                        : "border-brand-primary/15 bg-brand-primary/5 hover:border-brand-primary/30 hover:bg-brand-primary/10",
                    )}
                  >
                    <ImagePlus
                      size={18}
                      strokeWidth={2.5}
                      className={cn(
                        "transition-colors",
                        errors.companyLogo
                          ? "text-red-400"
                          : "text-brand-primary/25 group-hover/upload:text-brand-primary/50",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[8px] font-black uppercase tracking-widest",
                        errors.companyLogo
                          ? "text-red-400"
                          : "text-brand-primary/20 group-hover/upload:text-brand-primary/40",
                      )}
                    >
                      Logo
                    </span>
                  </button>
                )}
              </div>

              {/* Small Logo */}
              <div className="space-y-2 shrink-0">
                <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                  Small
                </p>
                <input
                  ref={smallLogoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "smallLogo")}
                />
                {data.smallLogo ? (
                  <div className="relative w-[72px] h-[72px] group/slogo">
                    <img
                      src={data.smallLogo}
                      alt="Small logo"
                      className="w-full h-full rounded-2xl object-cover border border-brand-primary/10 shadow-soft"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-brand-primary/60 opacity-0 group-hover/slogo:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => smallLogoInputRef.current?.click()}
                        className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-brand-primary shadow-soft"
                      >
                        <ImagePlus size={13} strokeWidth={3} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          removeFile("smallLogo", smallLogoInputRef)
                        }
                        className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-red-400 shadow-soft"
                      >
                        <X size={13} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => smallLogoInputRef.current?.click()}
                    className={cn(
                      "w-[72px] h-[72px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all group/upload",
                      errors.smallLogo
                        ? "border-red-400 bg-red-50 text-red-400"
                        : "border-brand-primary/15 bg-brand-primary/5 hover:border-brand-primary/30 hover:bg-brand-primary/10",
                    )}
                  >
                    <ImagePlus
                      size={18}
                      strokeWidth={2.5}
                      className={cn(
                        "transition-colors",
                        errors.smallLogo
                          ? "text-red-400"
                          : "text-brand-primary/25 group-hover/upload:text-brand-primary/50",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[8px] font-black uppercase tracking-widest",
                        errors.smallLogo
                          ? "text-red-400"
                          : "text-brand-primary/20 group-hover/upload:text-brand-primary/40",
                      )}
                    >
                      Small
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Company Name */}
            <div className="flex-1 w-full relative">
              <Input
                label="Company Name"
                placeholder="e.g. Acme Corporation Pvt Ltd"
                icon={Building2}
                value={data.companyName || ""}
                error={errors.companyName}
                onChange={(e) => updateData({ companyName: e.target.value })}
                className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 pl-14 shadow-soft"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BrandedSelect
              label="Industry Vertical"
              placeholder="Select an industry..."
              options={industries}
              value={data.industry || ""}
              error={errors.industry}
              onChange={(val) => updateData({ industry: val })}
            />
            <Input
              label="Global Website"
              placeholder="https://acme.org"
              icon={Globe2}
              value={data.website || ""}
              onChange={(e) => updateData({ website: e.target.value })}
              className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 pl-14 shadow-soft"
            />
          </div>
        </div>
      </div>

      {/* Form Section: Company Details */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Users size={16} strokeWidth={3} />
          </div>
          <h3 className="text-lg font-black text-brand-primary tracking-tighter">
            Company Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Company Size"
            placeholder="e.g. 25"
            icon={Users}
            type="number"
            min="1"
            value={data.companySize || ""}
            error={errors.companySize}
            onChange={(e) => updateData({ companySize: e.target.value })}
            className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 pl-14 shadow-soft"
          />
          <Input
            label="Founded Year"
            placeholder="e.g. 2015"
            icon={Calendar}
            type="number"
            min="1800"
            max={new Date().getFullYear()}
            value={data.foundedYear || ""}
            error={errors.foundedYear}
            onChange={(e) => updateData({ foundedYear: e.target.value })}
            className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 pl-14 shadow-soft"
          />
        </div>

        <Input
          label="PAN / GST / Registration Number"
          placeholder="e.g. AABCT1332L or 29AABCT1332L1ZR"
          icon={Hash}
          value={data.registrationNumber || ""}
          error={errors.registrationNumber}
          onChange={(e) =>
            updateData({ registrationNumber: e.target.value.toUpperCase() })
          }
          className="bg-brand-primary/5 border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white rounded-[20px] transition-all py-5 pl-14 shadow-soft"
        />
      </div>

      {/* Form Section: Narrative */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <AlignLeft size={16} strokeWidth={3} />
          </div>
          <h3 className="text-lg font-black text-brand-primary tracking-tighter">
            Company Narrative
          </h3>
        </div>

        <div className="group/ta space-y-2">
          <div className="flex justify-between items-end ml-1">
            <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest transition-colors group-focus-within/ta:text-brand-primary">
              Vision & Mission Statement
            </label>
            {errors.description && (
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                {errors.description}
              </span>
            )}
          </div>
          <div className="relative">
            <textarea
              className={cn(
                "w-full min-h-[160px] px-6 py-5 bg-brand-primary/5 border rounded-[24px] outline-none transition-all duration-300 shadow-soft",
                "placeholder:text-brand-primary/20 text-brand-primary font-bold text-[15px] resize-none",
                errors.description
                  ? "border-red-400 focus:border-red-500"
                  : "border-brand-primary/10 hover:border-brand-primary/20 focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5",
              )}
              placeholder="Briefly describe your company's core values, mission, and the impact you aim to create..."
              value={data.description || ""}
              onChange={(e) => updateData({ description: e.target.value })}
            />
            <div className="absolute bottom-5 right-6 px-3 py-1 bg-white border border-brand-primary/10 rounded-full shadow-soft flex items-center gap-2">
              <span className="text-[10px] font-black text-brand-primary/40 tabular-nums uppercase tracking-widest">
                {data.description?.trim().split(/\s+/).filter(Boolean).length ||
                  0}{" "}
                <span className="opacity-40">Words</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-brand-primary/5 flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={isLoading}
          className="h-14 px-8 rounded-2xl text-brand-primary/40 font-black uppercase tracking-widest text-[10px] hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
        >
          <span className="flex items-center gap-2">
            <ArrowLeft size={16} strokeWidth={3} />
            Protocol Reset
          </span>
        </Button>
        <Button
          size="lg"
          onClick={handleSubmit}
          isLoading={isLoading}
          className="h-14 px-10 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs shadow-premium hover:shadow-hover group"
        >
          <span className="flex items-center gap-3">
            Deploy Profile
            <ArrowRight
              size={16}
              strokeWidth={3}
              className="group-hover:translate-x-1 transition-transform"
            />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Step2Company;
