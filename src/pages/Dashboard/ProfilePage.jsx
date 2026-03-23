import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Globe,
  Info,
  Mail,
  Smartphone,
  Camera,
  Save,
  ShieldCheck,
  MapPin,
  Briefcase,
  CheckCircle2,
  Edit3,
  Users,
  Instagram,
  Linkedin,
  Youtube,
  FileText,
  Hash,
  Trash2,
  Search,
  Loader2,
} from "lucide-react";
import { updateProfile, toggleOtpModal } from "../../store/slices/profileSlice";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Textarea from "../../components/Textarea";
import SecureUpdateModal from "../../components/modals/SecureUpdateModal";
import {
  getCompanyProfileDetailsApi,
  getIndustriesListApi,
  editProfileApi,
  updateCompanyEmailWithOTP,
  updateComapanyMobileWithOTP,
} from "../../helper/api";
import toast from "react-hot-toast";

const IMG_URL = import.meta.env.VITE_IMG_URL;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { company: reduxCompany } = useSelector((state) => state.profile);
  const [activeTab, setActiveTab] = useState("general");
  const [industries, setIndustries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEmailUpdating, setIsEmailUpdating] = useState(false);
  const [isMobileUpdating, setIsMobileUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Refs for Google Places Autocomplete
  const hqInputRef = useRef(null);
  const hqAutocompleteRef = useRef(null);
  const branchRefs = useRef([]);
  const branchAutocompleteRefs = useRef([]);

  const [formData, setFormData] = useState({
    companyName: "",
    companySize: "",
    countryCode: "+91",
    hrAndRecruiterName: "",
    designation: "",
    phoneNumber: "",
    email: "",
    industryType: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    address: "",
    companyIntro: "",
    instagramUrl: "",
    linkdinUrl: "",
    youtubeUrl: "",
    websiteUrl: "",
    branchLocation: [""],
  });

  const [logoFile, setLogoFile] = useState(null);
  const [smallLogoFile, setSmallLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [smallLogoPreview, setSmallLogoPreview] = useState(null);

  const fetchProfileData = useCallback(async () => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) return;

    setIsLoading(true);
    try {
      const [profileRes, industriesRes] = await Promise.all([
        getCompanyProfileDetailsApi(companyId),
        getIndustriesListApi(),
      ]);

      if (profileRes.status) {
        const data = profileRes.data;
        setFormData({
          companyName: data.companyName || "",
          companySize: data.companySize || "",
          countryCode: data.countryCode || "+91",
          hrAndRecruiterName: data.hrAndRecruiterName || "",
          designation: data.designation || "",
          phoneNumber: data.phoneNumber || "",
          email: data.email || "",
          industryType: data.industryType?._id || data.industryType || "",
          country: data.country || "",
          state: data.state || "",
          city: data.city || "",
          zipCode: data.zipCode || "",
          address: data.address || "",
          companyIntro: data.companyIntro || "",
          instagramUrl: data.instagramUrl || "",
          linkdinUrl: data.linkdinUrl || "",
          youtubeUrl: data.youtubeUrl || "",
          websiteUrl: data.websiteUrl || "",
          branchLocation: data.branchLocation || [""],
        });
        if (data.logo) setLogoPreview(IMG_URL + "/" + data.logo);
        if (data.smallLogo) setSmallLogoPreview(IMG_URL + "/" + data.smallLogo);
        dispatch(updateProfile(data));
      }

      if (industriesRes.status) {
        setIndustries(industriesRes.data);
      }
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      toast.error("Failed to load profile details");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Callback ref for HQ Autocomplete — fires when the input actually mounts in the DOM
  const hqRefCallback = useCallback((node) => {
    hqInputRef.current = node;
    if (!node || !window.google) return;

    // Clean up previous instance
    if (hqAutocompleteRef.current) {
      window.google.maps.event.clearInstanceListeners(
        hqAutocompleteRef.current,
      );
    }

    const autocomplete = new window.google.maps.places.Autocomplete(node, {
      fields: [
        "place_id",
        "formatted_address",
        "address_components",
        "geometry",
      ],
      types: ["establishment", "geocode"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const updatedFields = {
        address: place.formatted_address || "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      };

      place.address_components.forEach((component) => {
        const types = component.types;
        if (types.includes("locality"))
          updatedFields.city = component.long_name;
        else if (types.includes("administrative_area_level_2"))
          updatedFields.city = updatedFields.city || component.long_name;

        if (types.includes("administrative_area_level_1"))
          updatedFields.state = component.long_name;
        if (types.includes("country"))
          updatedFields.country = component.long_name;
        if (types.includes("postal_code"))
          updatedFields.zipCode = component.long_name;
      });

      setFormData((prev) => ({ ...prev, ...updatedFields }));
    });

    hqAutocompleteRef.current = autocomplete;
  }, []);

  // Branch Autocomplete — callback ref factory for each branch input
  const branchRefCallback = useCallback(
    (index) => (node) => {
      branchRefs.current[index] = node;
      if (!node || !window.google) return;

      // Clean up previous instance for this index
      if (branchAutocompleteRefs.current[index]) {
        window.google.maps.event.clearInstanceListeners(
          branchAutocompleteRefs.current[index],
        );
      }

      const autocomplete = new window.google.maps.places.Autocomplete(node, {
        fields: ["formatted_address"],
        types: ["establishment", "geocode"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setFormData((prev) => {
            const updatedBranches = [...prev.branchLocation];
            updatedBranches[index] = place.formatted_address;
            return { ...prev, branchLocation: updatedBranches };
          });
        }
      });

      branchAutocompleteRefs.current[index] = autocomplete;
    },
    [],
  );

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "logo") {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setSmallLogoFile(file);
      setSmallLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    const companyId = localStorage.getItem("companyId");
    if (!companyId) return;

    setIsSaving(true);
    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "branchLocation") {
          dataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          dataToSend.append(key, formData[key]);
        }
      });

      if (logoFile) dataToSend.append("companyLogo", logoFile);
      if (smallLogoFile) dataToSend.append("companySmallLogo", smallLogoFile);

      const response = await editProfileApi(dataToSend, companyId);
      if (response.status) {
        // toast.success("Profile updated successfully");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchProfileData();
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Save Profile Error:", error);
      toast.error(error || "An error occurred while saving profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBranch = () => {
    setFormData({
      ...formData,
      branchLocation: [...formData.branchLocation, ""],
    });
  };

  const handleRemoveBranch = (index) => {
    const newBranches = formData.branchLocation.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      branchLocation: newBranches.length > 0 ? newBranches : [""],
    });
  };

  const handleBranchChange = (index, value) => {
    const newBranches = [...formData.branchLocation];
    newBranches[index] = value;
    setFormData({
      ...formData,
      branchLocation: newBranches,
    });
  };

  const handleEmailUpdate = async () => {
    const companyId = localStorage.getItem("companyId");
    setIsEmailUpdating(true);
    try {
      const res = await updateCompanyEmailWithOTP(companyId, {
        email: reduxCompany.email,
      });

      if (res.status) {
        dispatch(toggleOtpModal("email"));
        toast.success("OTP sent to your email");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setIsEmailUpdating(false);
    }
  };

  const handleMobileUpdate = async () => {
    const companyId = localStorage.getItem("companyId");
    setIsMobileUpdating(true);
    try {
      const res = await updateComapanyMobileWithOTP(companyId, {
        mobileNumber: reduxCompany.phoneNumber,
      });

      if (res.status) {
        dispatch(toggleOtpModal("mobile"));
        toast.success("OTP sent to your mobile");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setIsMobileUpdating(false);
    }
  };

  const tabs = [
    { id: "general", label: "General Info", icon: Building2 },
    { id: "locations", label: "Locations", icon: MapPin },
    { id: "contact", label: "Contact Details", icon: Smartphone },
    { id: "social", label: "Social & Links", icon: Globe },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4" />
        <p className="text-sm font-black uppercase tracking-widest text-brand-primary/40">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-brand-primary text-editorial tracking-tighter">
            Profile <span className="text-brand-primary/40">Management</span>
          </h1>
          <p className="text-sm font-bold text-brand-primary/30">
            View and update your company's official information.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-2xl px-8 py-4 h-auto shadow-soft bg-brand-primary hover:bg-brand-primary-light transition-all flex items-center gap-2 group"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Save
              size={18}
              strokeWidth={2.5}
              className="group-hover:scale-110 transition-transform"
            />
          )}
          <span className="font-black uppercase tracking-widest text-xs">
            {isSaving ? "Saving..." : "Save Changes"}
          </span>
        </Button>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="p-4 bg-emerald-500 text-white rounded-2xl flex items-center gap-3 shadow-premium"
          >
            <CheckCircle2 size={20} strokeWidth={3} />
            <span className="text-xs font-black uppercase tracking-widest">
              Settings updated request sent successfully!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        {/* Sidebar Navigation */}
        <div className="space-y-6">
          <div className="p-8 bg-white rounded-[40px] border border-brand-primary/5 shadow-soft text-center space-y-4">
            <div className="relative group mx-auto w-32 h-32">
              <div className="w-full h-full rounded-[40px] bg-brand-primary/5 flex items-center justify-center overflow-hidden border-2 border-brand-primary/10 shadow-soft">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-brand-primary/20" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-3 bg-brand-primary text-white rounded-2xl shadow-premium hover:scale-110 transition-transform cursor-pointer">
                <Camera size={18} strokeWidth={3} />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "logo")}
                  accept="image/*"
                />
              </label>
            </div>
            <div>
              <h3 className="text-xl font-black text-brand-primary tracking-tighter truncate">
                {formData.companyName}
              </h3>
              <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest mt-1">
                {industries.find((i) => i.value === formData.industryType)
                  ?.label || "Not Specified"}
              </p>
            </div>
            <label className="w-full flex items-center gap-2 px-4 py-3 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 hover:bg-brand-primary/10 transition-all cursor-pointer group">
              {smallLogoPreview ? (
                <img
                  src={smallLogoPreview}
                  alt="Small Logo"
                  className="w-8 h-8 rounded-lg object-cover border border-brand-primary/10"
                />
              ) : (
                <Camera
                  size={14}
                  strokeWidth={3}
                  className="text-brand-primary/30 group-hover:text-brand-primary transition-colors"
                />
              )}
              <span className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest group-hover:text-brand-primary transition-colors truncate">
                {smallLogoFile ? smallLogoFile.name : "Upload Small Logo"}
              </span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange(e, "smallLogo")}
                accept="image/*"
              />
            </label>
          </div>

          <div className="p-3 bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-soft space-y-1">
            {tabs.map((tab) => {
              const IsActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3.5 px-6 py-4 rounded-[24px] text-sm font-bold transition-all group ${
                    IsActive
                      ? "bg-brand-primary text-white shadow-premium"
                      : "text-brand-primary/60 hover:text-brand-primary hover:bg-white/60"
                  }`}
                >
                  <tab.icon size={18} strokeWidth={IsActive ? 3 : 2} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-10">
          <AnimatePresence mode="wait">
            {activeTab === "general" && (
              <motion.div
                key="general"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-[40px] border border-brand-primary/5 shadow-premium overflow-hidden">
                  <div className="px-10 py-8 border-b border-brand-primary/5 bg-brand-primary/2">
                    <h2 className="text-xl font-black text-brand-primary tracking-tighter uppercase font-editorial">
                      Company{" "}
                      <span className="text-brand-primary/40">Details</span>
                    </h2>
                  </div>
                  <div className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Input
                        label="Company Name"
                        icon={Building2}
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyName: e.target.value,
                          })
                        }
                        className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft"
                      />
                      <Input
                        label="Company Size"
                        icon={Users}
                        placeholder="e.g. 10-50"
                        value={formData.companySize}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companySize: e.target.value,
                          })
                        }
                        className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft"
                      />
                    </div>

                    <Select
                      label="Industry"
                      options={industries.map((item) => ({
                        label: item.categoryName,
                        value: item.id,
                      }))}
                      value={formData.industryType}
                      onChange={(val) =>
                        setFormData({ ...formData, industryType: val })
                      }
                    />

                    <div className="space-y-2">
                      <Textarea
                        label="Company Introduction"
                        placeholder="Tell us about your company..."
                        value={formData.companyIntro}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyIntro: e.target.value,
                          })
                        }
                        className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft h-32"
                      />
                      <p className="text-[10px] font-bold text-brand-primary/30 text-right mr-1">
                        {formData.companyIntro.length} characters entered
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "locations" && (
              <motion.div
                key="locations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-[40px] border border-brand-primary/5 shadow-premium overflow-hidden">
                  <div className="px-10 py-8 border-b border-brand-primary/5 bg-brand-primary/2">
                    <h2 className="text-xl font-black text-brand-primary tracking-tighter uppercase font-editorial">
                      Main{" "}
                      <span className="text-brand-primary/40">HQ Location</span>
                    </h2>
                  </div>
                  <div className="p-10 space-y-8">
                    <Input
                      ref={hqRefCallback}
                      label="Registered Address"
                      icon={Search}
                      placeholder="Search for your office location..."
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="bg-brand-primary/5 col-span-3 rounded-2xl border-brand-primary/10 shadow-soft"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Input
                        label="Country"
                        icon={MapPin}
                        value={formData.country}
                        disabled
                        className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft opacity-60"
                      />
                      <Input
                        label="State"
                        icon={MapPin}
                        value={formData.state}
                        disabled
                        className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft opacity-60"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Input
                        label="City"
                        icon={MapPin}
                        value={formData.city}
                        disabled
                        className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft opacity-60"
                      />
                      <Input
                        label="Zip Code"
                        icon={Hash}
                        value={formData.zipCode}
                        disabled
                        className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft opacity-60"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[40px] border border-brand-primary/5 shadow-premium overflow-hidden">
                  <div className="px-10 py-8 border-b border-brand-primary/5 bg-brand-primary/2 flex justify-between items-center">
                    <h2 className="text-xl font-black text-brand-primary tracking-tighter uppercase font-editorial">
                      Branch{" "}
                      <span className="text-brand-primary/40">Locations</span>
                    </h2>
                    <Button
                      onClick={handleAddBranch}
                      className="rounded-xl px-4 py-2 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20"
                    >
                      <span className="font-black uppercase tracking-widest text-[10px]">
                        + Add Branch
                      </span>
                    </Button>
                  </div>
                  <div className="p-10 space-y-6">
                    {formData.branchLocation.map((branch, index) => (
                      <div key={index} className="flex gap-4 items-end">
                        <Input
                          ref={branchRefCallback(index)}
                          label={`Branch ${index + 1}`}
                          icon={Search}
                          placeholder="Search for branch location..."
                          value={branch}
                          onChange={(e) =>
                            handleBranchChange(index, e.target.value)
                          }
                          className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft flex-1"
                        />
                        <Button
                          onClick={() => handleRemoveBranch(index)}
                          className="bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl p-3 h-auto"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-[40px] border border-brand-primary/5 shadow-premium overflow-hidden">
                  <div className="px-10 py-8 border-b border-brand-primary/5 bg-brand-primary/2">
                    <h2 className="text-xl font-black text-brand-primary tracking-tighter uppercase font-editorial">
                      HR &{" "}
                      <span className="text-brand-primary/40">
                        Recruiter Details
                      </span>
                    </h2>
                  </div>
                  <div className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Input
                        label="HR/Recruiter Name"
                        icon={Edit3}
                        value={formData.hrAndRecruiterName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hrAndRecruiterName: e.target.value,
                          })
                        }
                        className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft"
                      />
                      <Input
                        label="Designation"
                        icon={Briefcase}
                        value={formData.designation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            designation: e.target.value,
                          })
                        }
                        className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <Input
                        label="Country Code"
                        icon={Hash}
                        placeholder="+91"
                        disabled
                        value={formData.countryCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            countryCode: e.target.value,
                          })
                        }
                        className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft"
                      />
                      <Input
                        label="Phone Number"
                        icon={Smartphone}
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                          })
                        }
                        disabled
                        className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft md:col-span-2"
                      />
                    </div>

                    <Input
                      label="Official Email"
                      icon={Mail}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled
                      className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "social" && (
              <motion.div
                key="social"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-[40px] border border-brand-primary/5 shadow-premium overflow-hidden">
                  <div className="px-10 py-8 border-b border-brand-primary/5 bg-brand-primary/2">
                    <h2 className="text-xl font-black text-brand-primary tracking-tighter uppercase font-editorial">
                      Social{" "}
                      <span className="text-brand-primary/40">Presence</span>
                    </h2>
                  </div>
                  <div className="p-10 space-y-8">
                    <Input
                      label="Website URL"
                      icon={Globe}
                      placeholder="https://..."
                      value={formData.websiteUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, websiteUrl: e.target.value })
                      }
                      className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft"
                    />
                    <Input
                      label="LinkedIn URL"
                      icon={Linkedin}
                      placeholder="https://linkedin.com/company/..."
                      value={formData.linkdinUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, linkdinUrl: e.target.value })
                      }
                      className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft"
                    />
                    <Input
                      label="Instagram URL"
                      icon={Instagram}
                      placeholder="https://instagram.com/..."
                      value={formData.instagramUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instagramUrl: e.target.value,
                        })
                      }
                      className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft"
                    />
                    <Input
                      label="Youtube URL"
                      icon={Youtube}
                      placeholder="https://youtube.com/..."
                      value={formData.youtubeUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, youtubeUrl: e.target.value })
                      }
                      className="bg-brand-primary/5 rounded-2xl border-brand-primary/10 shadow-soft"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-[40px] border border-brand-primary/5 shadow-premium overflow-hidden">
                  <div className="px-10 py-8 border-b border-brand-primary/5 bg-brand-primary/2">
                    <h2 className="text-xl font-black text-brand-primary tracking-tighter uppercase font-editorial">
                      Contact{" "}
                      <span className="text-brand-primary/40">
                        Verification
                      </span>
                    </h2>
                  </div>
                  <div className="p-10 space-y-10">
                    {/* Email Card */}
                    <div className="p-8 bg-brand-primary/2 rounded-[32px] border border-brand-primary/5 flex items-center justify-between group hover:border-brand-primary/20 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-brand-primary shadow-soft">
                          <Mail size={24} strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">
                            Primary Email
                          </p>
                          <div className="flex items-center gap-3">
                            <h4 className="text-lg font-black text-brand-primary tracking-tight">
                              {reduxCompany.email}
                            </h4>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                              <CheckCircle2 size={12} strokeWidth={4} />
                              Verified
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleEmailUpdate()}
                        disabled={isEmailUpdating}
                        className="rounded-xl px-5 py-3 border-brand-primary-light/20 text-brand-primary hover:bg-brand-primary/5 flex items-center gap-2"
                      >
                        {isEmailUpdating ? (
                          <Loader2 size={12} strokeWidth={3} className="animate-spin" />
                        ) : null}
                        <span className="font-black uppercase tracking-widest text-[10px]">
                          {isEmailUpdating ? "Sending OTP..." : "Change Email"}
                        </span>
                      </Button>
                    </div>

                    {/* Mobile Card */}
                    <div className="p-8 bg-brand-primary/2 rounded-[32px] border border-brand-primary/5 flex items-center justify-between group hover:border-brand-primary/20 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-brand-primary shadow-soft">
                          <Smartphone size={24} strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">
                            Mobile Number
                          </p>
                          <div className="flex items-center gap-3">
                            <h4 className="text-lg font-black text-brand-primary tracking-tight">
                              {reduxCompany.phoneNumber}
                            </h4>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                              <CheckCircle2 size={12} strokeWidth={4} />
                              Verified
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleMobileUpdate()}
                        disabled={isMobileUpdating}
                        className="rounded-xl px-5 py-3 border-brand-primary-light/20 text-brand-primary hover:bg-brand-primary/5 flex items-center gap-2"
                      >
                        {isMobileUpdating ? (
                          <Loader2 size={12} strokeWidth={3} className="animate-spin" />
                        ) : null}
                        <span className="font-black uppercase tracking-widest text-[10px]">
                          {isMobileUpdating ? "Sending OTP..." : "Change Number"}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-amber-500/5 rounded-[32px] border border-amber-500/10 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <Info size={20} strokeWidth={3} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest">
                      About Contact Changes
                    </h4>
                    <p className="text-[11px] font-bold text-amber-700/60 leading-relaxed">
                      Updating your email or mobile number requires a multi-step
                      verification process to ensure account security. Access to
                      your current contact method is required to initiate the
                      change.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <SecureUpdateModal />
    </div>
  );
};

export default ProfilePage;
