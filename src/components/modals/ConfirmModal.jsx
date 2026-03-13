import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Trash2, HelpCircle } from "lucide-react";
import Button from "../Button";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // 'danger' | 'info' | 'warning'
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <Trash2 size={24} strokeWidth={2.5} />;
      case "warning":
        return <AlertCircle size={24} strokeWidth={2.5} />;
      default:
        return <HelpCircle size={24} strokeWidth={2.5} />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case "danger":
        return "bg-red-500/10 text-red-500";
      case "warning":
        return "bg-amber-500/10 text-amber-500";
      default:
        return "bg-brand-primary/5 text-brand-primary";
    }
  };

  const getConfirmBtnClass = () => {
    switch (type) {
      case "danger":
        return "bg-red-500 hover:bg-red-600 shadow-red-500/20";
      case "warning":
        return "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20";
      default:
        return "bg-brand-primary hover:bg-brand-primary-light shadow-brand-primary/20";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
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
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[40px] shadow-premium overflow-hidden border border-white/60 flex flex-col"
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-soft ${getIconBg()}`}
              >
                {getIcon()}
              </div>
              <div>
                <h2 className="text-xl font-black text-brand-primary tracking-tighter uppercase leading-tight">
                  {title}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-white hover:bg-brand-primary/5 rounded-2xl text-brand-primary/40 hover:text-brand-primary transition-all shadow-soft"
            >
              <X size={18} strokeWidth={3} />
            </button>
          </div>

          {/* Body */}
          <div className="px-8 pb-8 pt-2">
            <p className="text-sm font-bold text-brand-primary/40 leading-relaxed mb-8">
              {message}
            </p>

            <div className="flex gap-4">
              <Button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 rounded-2xl py-4 h-auto shadow-soft bg-brand-primary/5 text-brand-primary hover:bg-brand-primary/10 transition-all"
              >
                <span className="font-black uppercase tracking-widest text-[10px]">
                  {cancelText}
                </span>
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 rounded-2xl py-4 h-auto shadow-premium text-white transition-all flex items-center justify-center gap-3 ${getConfirmBtnClass()}`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="font-black uppercase tracking-widest text-[10px]">
                    {confirmText}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
