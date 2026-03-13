import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Calendar,
  Info,
  CheckCircle2,
  X,
  BellOff,
} from "lucide-react";
import { setNotifications } from "../store/slices/notificationSlice";
import { getNotificationsApi } from "../helper/api";

const typeIcons = {
  application: UserPlus,
  interview: Calendar,
  system: Info,
};

const typeColors = {
  application: "text-emerald-500 bg-emerald-500/10",
  interview: "text-brand-primary bg-brand-primary/5",
  system: "text-amber-500 bg-amber-500/10",
};

const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications } = useSelector((state) => state.notifications);

  

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute right-0 top-full mt-4 w-96 z-101">
        {/* Backdrop handle for closing */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="relative bg-white backdrop-blur-2xl rounded-[32px] shadow-premium border border-white/60 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-brand-primary/5 flex items-center justify-between bg-white">
            <div>
              <h3 className="text-sm font-black text-brand-primary uppercase tracking-widest">
                Notifications
              </h3>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[400px] overflow-y-auto no-scrollbar p-3 space-y-2">
            {notifications.length > 0 ? (
              notifications.map((notif, idx) => {
                const Icon = typeIcons[notif.type] || Info;
                const colorClass =
                  typeColors[notif.type] ||
                  "text-brand-primary bg-brand-primary/5";

                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/5 shadow-soft"
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-brand-primary/5 text-brand-primary">
                        <Info size={18} strokeWidth={2.5} />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-brand-primary">
                          {notif.title}
                        </h4>

                        <p className="text-[11px] font-bold text-brand-primary/60">
                          {notif.message}
                        </p>

                        <p className="text-[9px] font-black text-brand-primary/30 uppercase tracking-widest">
                          {new Date(notif.createdAt).toLocaleString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-[24px] bg-brand-primary/5 flex items-center justify-center text-brand-primary/20">
                  <BellOff size={32} strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-brand-primary/40 uppercase tracking-widest">
                    All caught up!
                  </h4>
                  <p className="text-[10px] font-bold text-brand-primary/20 uppercase tracking-widest">
                    No new notifications
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-brand-primary/5 bg-white/40 text-center">
            <button className="text-[10px] font-black text-brand-primary/40 hover:text-brand-primary uppercase tracking-widest transition-colors">
              View all history
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NotificationDropdown;
