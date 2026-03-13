import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Select from "../../components/Select";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  ShieldCheck,
  Phone,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { companyCreateAccountApi } from "../../helper/api";

const Step1Account = ({ onNext, data, updateData }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const companyId = localStorage.getItem("companyId");

  const designationOptions = [
    { value: "HR", label: "HR" },
    { value: "RECRUITER", label: "RECRUITER" },
    { value: "CEO", label: "CEO" },
  ];

  const checkPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length > 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = checkPasswordStrength(data.password);

  const submit = async () => {
    try {
      if (!validator()) {
        return;
      }
      setIsLoading(true);
      const payload = {
        id: companyId ? companyId : "",
        companyName: data?.companyName,
        email: data?.email,
        designation: data?.designation,
        hrAndRecruiterName: data?.contactName,
        countryCode: "+91",
        phoneNumber: data?.phone,
        password: data?.password,
      };

      const response = await companyCreateAccountApi(payload);
      console.log("response : ", response);
      if (response.status) {
        localStorage.setItem("companyId", response?.data?.id);
        localStorage.setItem("formData", JSON.stringify(data));
        localStorage.setItem("currentStep", "2");

        toast.success("Account initialized successfully");
        onNext();
      }
    } catch (error) {
      console.log("error : ", error);
      toast.error(error || "Failed to initialize account");
    } finally {
      setIsLoading(false);
    }
  };

  const validator = () => {
    let errors = {};

    // Company Name Validation
    if (!data.companyName || data.companyName.trim().length < 3) {
      errors.companyName = "Company name must be at least 3 characters";
    }

    // Contact Name Validation
    if (!data.contactName || data.contactName.trim().length < 3) {
      errors.contactName = "Full name must be at least 3 characters";
    }

    // Designation Validation
    if (!data.designation || data.designation.trim().length < 2) {
      errors.designation = "Job title is required";
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = "Please enter a valid work email";
    }

    // Phone Validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!data.phone || !phoneRegex.test(data.phone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }

    // Password Validation
    if (strength < 100) {
      errors.password =
        "Please create a stronger password (all requirements must be met)";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="space-y-10">
      {/* Input Cards Row */}
      <div className="bg-brand-primary/2 rounded-[32px] p-8 border border-brand-primary/5 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <Input
            label="Corporate Identity: Company Name"
            placeholder="Acme Corporation Pvt Ltd"
            icon={Briefcase}
            value={data.companyName || ""}
            error={errors.companyName}
            onChange={(e) => updateData({ companyName: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Identity: Full Name"
            placeholder="Alexander Pierce"
            icon={User}
            value={data.contactName || ""}
            error={errors.contactName}
            onChange={(e) => updateData({ contactName: e.target.value })}
          />
          <Select
            label="Credential: Job Title"
            placeholder="Select your role"
            options={designationOptions}
            value={data.designation || ""}
            error={errors.designation}
            onChange={(val) => updateData({ designation: val })}
            className="rounded-[20px] bg-brand-primary/5 border-brand-primary/10"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Registry: Work Email"
            placeholder="alex@company.com"
            type="email"
            icon={Mail}
            value={data.email || ""}
            error={errors.email}
            onChange={(e) => updateData({ email: e.target.value })}
          />
          <Input
            label="Protocol: Phone Number"
            placeholder="99999 00000"
            type="tel"
            icon={Phone}
            value={data.phone || ""}
            error={errors.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
          />
        </div>
      </div>

      {/* Password Card */}
      <div className="bg-white rounded-[32px] p-8 border border-brand-primary/5 shadow-soft">
        <Input
          label="Security: Create Password"
          placeholder="Min 8 characters required"
          icon={ShieldCheck}
          type={showPassword ? "text" : "password"}
          value={data.password || ""}
          error={errors.password}
          onChange={(e) => updateData({ password: e.target.value })}
          rightAction={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center justify-center"
            >
              {showPassword ? (
                <EyeOff size={18} strokeWidth={3} />
              ) : (
                <Eye size={18} strokeWidth={3} />
              )}
            </button>
          }
        />

        {data.password && (
          <div className="mt-6 p-4 bg-brand-primary/2 rounded-2xl border border-brand-primary/5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">
                Entropy Analysis
              </span>
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${
                  strength <= 25
                    ? "text-red-500"
                    : strength <= 50
                      ? "text-orange-500"
                      : strength <= 75
                        ? "text-brand-accent"
                        : "text-emerald-500"
                }`}
              >
                {strength <= 25
                  ? "Critical"
                  : strength <= 50
                    ? "Limited"
                    : strength <= 75
                      ? "Optimized"
                      : "Maximum"}
              </span>
            </div>
            <div className="h-1.5 w-full bg-white rounded-full overflow-hidden flex gap-1">
              <div
                className={`h-full rounded-full transition-all duration-500 ${strength >= 25 ? "bg-red-400 w-1/4" : "w-0"}`}
              />
              <div
                className={`h-full rounded-full transition-all duration-500 ${strength >= 50 ? "bg-orange-400 w-1/4" : "w-0"}`}
              />
              <div
                className={`h-full rounded-full transition-all duration-500 ${strength >= 75 ? "bg-brand-accent w-1/4" : "w-0"}`}
              />
              <div
                className={`h-full rounded-full transition-all duration-500 ${strength >= 100 ? "bg-emerald-500 w-1/4" : "w-0"}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-8 border-t border-brand-primary/5 flex items-center justify-between gap-6">
        <Button
          size="lg"
          onClick={submit}
          isLoading={isLoading}
          className="h-16 px-12 rounded-[24px] bg-brand-primary text-white font-black uppercase tracking-[0.2em] text-xs shadow-premium hover:shadow-hover group"
        >
          <span className="flex items-center gap-3">
            Initialize Profile
            <ArrowRight
              size={16}
              strokeWidth={3}
              className="group-hover:translate-x-1 transition-transform"
            />
          </span>
        </Button>

        <div className="text-right">
          <p className="text-[10px] font-black text-brand-primary/20 uppercase tracking-widest mb-1">
            Already Member?
          </p>
          <button
            onClick={() => navigate("/")}
            className="text-sm font-black text-brand-primary hover:text-brand-primary-light transition-colors underline underline-offset-8 decoration-brand-primary/10"
          >
            Secure Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1Account;
