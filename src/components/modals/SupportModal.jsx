import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, AlertCircle, LifeBuoy } from "lucide-react";
import { toggleSupportModal, addTicket } from "../../store/slices/supportSlice";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";
import Textarea from "../Textarea";
import { createSupportApi, COMPANY_ID } from "../../helper/api";

const SupportModal = () => {
  const dispatch = useDispatch();
  const { company: reduxCompany } = useSelector((state) => state.profile);
  const { isModalOpen } = useSelector((state) => state.support);
  const [attachment, setAttachment] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    category: "Technical",
    priority: "medium",
    message: "",
  });

  const categories = [
    "Technical",
    "Billing",
    "Account",
    "Feature Request",
    "Other",
  ];
  const priorities = ["low", "medium", "high"];
  console.log("comapny data : ", reduxCompany);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.message) return;

    try {
      const formDataApi = new FormData();
      const phone = reduxCompany.mobile;

      const parts = phone.split(" ");
      const countryCode = parts[0];
      const phoneNumber = parts.slice(1).join("").replace(/\s/g, "");

      formDataApi.append("fullName", reduxCompany?.name);
      formDataApi.append("email", reduxCompany?.email);
      formDataApi.append("phoneNumber", phoneNumber);
      formDataApi.append("countryCode", countryCode);
      formDataApi.append("companyId", COMPANY_ID);

      formDataApi.append("ticketType", formData.category);
      formDataApi.append("subject", formData.subject);
      formDataApi.append("message", formData.message);

      if (attachment) {
        formDataApi.append("attachment", attachment);
      }

      const res = await createSupportApi(formDataApi);

      if (res?.status) {
        dispatch(toggleSupportModal());

        setFormData({
          subject: "",
          category: "Technical",
          priority: "medium",
          message: "",
        });

        setAttachment(null);

        window.location.reload();
      }
    } catch (err) {
      console.error("Create ticket error:", err);
    }
  };

  if (!isModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(toggleSupportModal())}
          className="absolute inset-0 bg-brand-primary/20 backdrop-blur-xl"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-[40px] shadow-premium overflow-hidden border border-white/60 flex flex-col"
        >
          {/* Header */}
          <div className="px-10 pt-10 pb-6 flex justify-between items-center bg-brand-primary/2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary shadow-soft">
                <LifeBuoy size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-brand-primary tracking-tighter uppercase">
                  Open <span className="text-brand-primary/40">Ticket</span>
                </h2>
                <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">
                  We're here to help you
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch(toggleSupportModal())}
              className="p-3 bg-white hover:bg-brand-primary/5 rounded-2xl text-brand-primary/40 hover:text-brand-primary transition-all shadow-soft"
            >
              <X size={20} strokeWidth={3} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            <Input
              label="Subject"
              placeholder="Brief description of the issue"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="bg-brand-primary/2 rounded-2xl border-none shadow-soft"
            />

            <div className="grid grid-cols-2 gap-6">
              <Select
                label="Category"
                options={categories}
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val })}
              />
              <Select
                label="Priority"
                options={priorities}
                value={formData.priority}
                onChange={(val) => setFormData({ ...formData, priority: val })}
              />
            </div>

            <Textarea
              label="Message"
              placeholder="Detailed explanation..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="bg-brand-primary/2 rounded-2xl border-none shadow-soft h-32"
            />
            <div>
              <label className="block text-[11px] font-black text-brand-primary/40 uppercase tracking-widest mb-2">
                Attachment
              </label>

              <input
                type="file"
                onChange={(e) => setAttachment(e.target.files[0])}
                className="w-full text-sm font-bold file:mr-4 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-brand-primary file:text-white file:cursor-pointer bg-brand-primary/2 p-3 rounded-2xl"
              />

              {attachment && (
                <p className="text-[10px] mt-2 text-brand-primary/40 font-bold">
                  Selected: {attachment.name}
                </p>
              )}
            </div>

            <div className="p-4 bg-brand-primary/5 rounded-2xl flex items-start gap-3 border border-brand-primary/5">
              <AlertCircle
                size={18}
                className="text-brand-primary/40 shrink-0 mt-0.5"
              />
              <p className="text-[11px] font-bold text-brand-primary/60 leading-relaxed italic">
                Our support team typically responds within 4-6 business hours.
                High priority tickets are reviewed faster.
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="px-10 py-8 bg-brand-primary/2 border-t border-brand-primary/5 flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => dispatch(toggleSupportModal())}
              className="rounded-2xl px-6 py-4 h-auto shadow-soft"
            >
              <span className="font-black uppercase tracking-widest text-[10px]">
                Cancel
              </span>
            </Button>
            <Button
              onClick={handleSubmit}
              className="rounded-2xl px-8 py-4 h-auto shadow-soft bg-brand-primary hover:bg-brand-primary-light transition-all flex items-center gap-2 group"
              disabled={!formData.subject || !formData.message}
            >
              <span className="font-black uppercase tracking-widest text-[10px]">
                Submit Request
              </span>
              <Send
                size={14}
                strokeWidth={3}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SupportModal;
