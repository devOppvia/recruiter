import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MessageSquare,
  Clock,
  User,
  LifeBuoy,
  Send,
  ChevronRight,
  Filter,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Link,
  Trash2,
  File,
  FileText,
} from "lucide-react";
import {
  toggleSupportModal,
  setActiveTicket,
  addMessage,
} from "../../store/slices/supportSlice";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import SupportModal from "../../components/modals/SupportModal";
import {
  getAllSupportApi,
  getAllSupportMessagesApi,
  addSupportMessageApi,
  COMPANY_ID,
} from "../../helper/api";
import { io } from "socket.io-client";

const IMG_URL = import.meta.env.VITE_IMG_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const SupportPage = () => {
  const dispatch = useDispatch();
  const { tickets, activeTicketId } = useSelector((state) => state.support);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [ticketsData, setTicketsData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef(null);
  const socketRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const scrollToBottom = () => {
    const el = messagesContainerRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    setFilePreview({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    });
  };

  const activeTicket = ticketsData.find((t) => t.id === activeTicketId);

  const handleSendReply = async (e) => {
    e.preventDefault();

    if (!activeTicketId) return;
    if (!replyText.trim() && !selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("supportId", activeTicketId);
      formData.append("message", replyText);
      formData.append("isRepliedByAdmin", false);
      if (selectedFile) {
        formData.append("attachment", selectedFile); // 👈 IMPORTANT
      }

      const res = await addSupportMessageApi(formData);

      if (res?.status) {
        setReplyText("");
        // fetchMessages(activeTicketId);
        setSelectedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Send message error", err);
    }
  };

  const filteredTickets = ticketsData.filter((t) =>
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const fetchTickets = async (search = "") => {
    try {
      setLoading(true);

      const res = await getAllSupportApi({
        companyId: COMPANY_ID,
        module: "",
        search,
      });

      if (res?.status) {
        setTicketsData(res.data || []);

        if (res.data?.length && !activeTicketId) {
          dispatch(setActiveTicket(res.data[0].id));
        }
      }
    } catch (err) {
      console.error("Error fetching tickets", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (ticketId) => {
    try {
      const res = await getAllSupportMessagesApi({
        supportId: ticketId,
      });

      if (res?.status) {
        setMessages(res.data || []);
      }
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (activeTicketId) {
      fetchMessages(activeTicketId);
    }
    if (activeTicketId && socketRef.current) {
      socketRef.current.emit("join_support", activeTicketId);
    }
  }, [activeTicketId]);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    // register company
    socketRef.current.emit("register_company", COMPANY_ID);

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("new_message", (data) => {
      if (data.supportId === activeTicketId) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === data.id)) return prev;
          return [...prev, data];
        });

        // scrollToBottom(); // ✅ no timeout needed
      }
    });

    return () => {
      socketRef.current.off("new_message");
    };
  }, [activeTicketId]);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const timeout = setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 150); // ⬅️ important delay (for framer motion)

    return () => clearTimeout(timeout);
  }, [messages, activeTicketId]);

  const ticketAttachmentUrl =
    IMG_URL +
      "/" +
      filteredTickets?.find((tik) => tik.id === messages?.[0]?.supportId)
        ?.attachment || null;

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/10";
      case "in-progress":
        return "text-amber-500 bg-amber-500/10 border-amber-500/10";
      case "resolved":
        return "text-brand-primary/40 bg-brand-primary/5 border-brand-primary/5";
      default:
        return "text-brand-primary/40 bg-brand-primary/5 border-brand-primary/5";
    }
  };

  return (
    <div className="space-y-8 pb-10 h-[calc(100vh-140px)] flex flex-col">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 shrink-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-brand-primary text-editorial tracking-tighter">
            Help & <span className="text-brand-primary/40">Support</span>
          </h1>
          <p className="text-sm font-bold text-brand-primary/30">
            Get expert assistance and track your support history.
          </p>
        </div>
        <Button
          onClick={() => dispatch(toggleSupportModal())}
          className="rounded-2xl px-6 py-4 h-auto shadow-soft bg-brand-primary hover:bg-brand-primary-light transition-all flex items-center gap-2 group"
        >
          <Plus
            size={20}
            strokeWidth={3}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          <span className="font-black uppercase tracking-widest text-xs">
            New Ticket
          </span>
        </Button>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Left: Ticket List */}
        <div
          className={`w-full md:w-[25vw] flex flex-col gap-6 shrink-0 ${activeTicketId ? "hidden md:flex" : "flex"}`}
        >
          <div className="relative group shrink-0">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-primary/30 group-focus-within:text-brand-primary transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-brand-primary/5 shadow-soft focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm font-bold placeholder:text-brand-primary/20 transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
            {filteredTickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                layout
                onClick={() => {
                  dispatch(setActiveTicket(ticket.id));
                  fetchMessages(ticket.id);
                }}
                className={`p-6 rounded-[32px] border cursor-pointer transition-all duration-300 group ${
                  activeTicketId === ticket.id
                    ? "bg-brand-primary border-brand-primary shadow-premium"
                    : "bg-white border-brand-primary/5 shadow-soft hover:shadow-premium hover:border-brand-primary/10"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${activeTicketId === ticket.id ? "text-white/60" : "text-brand-primary/40"}`}
                  >
                    {ticket.ticketType}
                  </span>
                  <div
                    className={`px-2.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                      activeTicketId === ticket.id
                        ? "bg-white/10 text-white border-white/10"
                        : getStatusColor(ticket.status)
                    }`}
                  >
                    {ticket.status}
                  </div>
                </div>
                <h3
                  className={`text-xl font-black tracking-tight mb-2 line-clamp-1 ${activeTicketId === ticket.id ? "text-white" : "text-brand-primary"}`}
                >
                  {ticket.subject}
                </h3>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${activeTicketId === ticket.id ? "bg-white/10 text-white/60" : "bg-brand-primary/5 text-brand-primary/30"}`}
                  >
                    <Clock size={12} strokeWidth={3} />
                  </div>
                  <span
                    className={`text-[10px] font-bold truncate ${activeTicketId === ticket.id ? "text-white/40" : "text-brand-primary/30"}`}
                  >
                    {new Date(ticket.createdAt).toString("dd/MM/yyyy hh:mm a")}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Conversation View */}
        <div
          className={`flex-1 bg-white rounded-[40px] border border-brand-primary/5 shadow-premium overflow-hidden flex flex-col ${activeTicketId ? "flex" : "hidden md:flex"}`}
        >
          <AnimatePresence mode="wait">
            {activeTicket ? (
              <motion.div
                key={activeTicket.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col min-h-0"
              >
                {/* Ticket Header */}
                <div className="p-8 border-b border-brand-primary/5 bg-brand-primary/2 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => dispatch(setActiveTicket(null))}
                      className="md:hidden p-3 bg-white rounded-2xl text-brand-primary/40 hover:text-brand-primary shadow-soft"
                    >
                      <ArrowLeft size={18} strokeWidth={3} />
                    </button>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-black text-brand-primary tracking-tighter uppercase">
                          {activeTicket.subject}
                        </h2>
                        <div
                          className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(activeTicket.status)}`}
                        >
                          {activeTicket.status}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/20" />
                          {activeTicket.id}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/20" />
                          {activeTicket.category}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center gap-3">
                    {/* <Button
                      variant="secondary"
                      className="rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-soft"
                    >
                      {activeTicket.status === "resolved"
                        ? "Reopen"
                        : "Mark as Resolved"}
                    </Button> */}
                  </div>
                </div>

                {/* Messages Area */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 min-h-0  overflow-y-auto p-10 space-y-8 no-scrollbar bg-brand-primary/[0.01]"
                >
                  {activeTicket?.attachment && ticketAttachmentUrl && (
                    <div className="relative flex gap-6 items-center group max-h-40 w-fit bg-gray-100 p-4 border rounded-xl mx-auto overflow-hidden">
                      <div className="flex gap-2 items-center justify-center h-full w-full">
                        <FileText size={24} className="text-brand-primary" />
                        <p className="text-brand-primary text-sm font-bold">
                          {activeTicket?.attachment}
                        </p>
                      </div>

                      <div className="transition-all duration-300 flex flex-col items-center justify-center gap-4 rounded-xl">
                        <div className="flex gap-4">
                          <button
                            onClick={() =>
                              window.open(ticketAttachmentUrl, "_blank")
                            }
                            className="px-4 py-2 text-xs font-bold bg-white text-black rounded-lg hover:bg-gray-200"
                          >
                            View
                          </button>

                          {/* Download Button */}
                          <a
                            href={ticketAttachmentUrl}
                            download={activeTicket?.attachment}
                            className="px-4 py-2 text-xs font-bold bg-brand-primary text-white rounded-lg hover:bg-brand-primary-light"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-5 ${msg.isRepliedByAdmin ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-soft relative overflow-hidden ${
                          msg.isRepliedByAdmin
                            ? "bg-linear-to-br from-brand-primary to-brand-primary-light text-white"
                            : "bg-white text-brand-primary"
                        }`}
                      >
                        {msg.isRepliedByAdmin ? (
                          <User size={20} strokeWidth={2.5} />
                        ) : (
                          <LifeBuoy size={20} strokeWidth={2.5} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                      </div>
                      <div
                        className={`max-w-[70%] space-y-2 ${msg.isRepliedByAdmin ? "text-right" : ""}`}
                      >
                        <div
                          className={`p-6 rounded-[24px] break-words  max-w-100  text-sm font-bold leading-relaxed shadow-soft border ${
                            msg.isRepliedByAdmin
                              ? "bg-brand-primary text-white border-brand-primary"
                              : "bg-white text-brand-primary/80 border-brand-primary/5"
                          }`}
                        >
                          {msg.message}
                          {msg.attachment && (
                            <a
                              href={IMG_URL + "/" + msg.attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex ${msg.isRepliedByAdmin ? "bg-white/20 text-white" : "bg-brand-primary text-white"} p-2 rounded-lg items-center gap-2 mt-2`}
                            >
                              <File className="w-5 h-5" />
                              <span className="text-[9px] font-bold uppercase tracking-widest">
                                open attachment
                              </span>
                            </a>
                          )}
                        </div>

                        <p className="text-[10px] font-black text-brand-primary/20 uppercase tracking-widest">
                          {new Date(msg.createAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Area */}

                {activeTicket.status == "OPEN" ? (
                  <div className="p-8 border-t border-brand-primary/5 bg-white shrink-0">
                    {filePreview && (
                      <div className="mb-4 p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {filePreview.type.startsWith("image/") ? (
                            <img
                              src={filePreview.url}
                              alt={filePreview.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                              <File className="w-5 h-5 text-brand-primary" />
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-bold text-brand-primary truncate max-w-[200px]">
                              {filePreview.name}
                            </p>
                            <p className="text-[9px] text-brand-primary/40 uppercase">
                              {filePreview.type}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setFilePreview(null);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <form onSubmit={handleSendReply} className="relative group">
                      <textarea
                        placeholder="Write your message here..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows="2"
                        className="w-full pl-6 pr-32 py-5 rounded-[24px] bg-brand-primary/5 border border-brand-primary/5 focus:ring-4 focus:ring-brand-primary/5 outline-none text-sm font-bold placeholder:text-brand-primary/20 transition-all resize-none group-focus-within:bg-white group-focus-within:border-brand-primary/10"
                      />

                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg"
                        >
                          <Link className="w-5 h-5" />
                        </button>

                        <Button
                          onClick={handleSendReply}
                          disabled={activeTicket.status == "CLOSED" || (!selectedFile && !replyText.trim())}
                          className="rounded-xl px-6 py-3 h-auto shadow-premium bg-brand-primary hover:bg-brand-primary-light transition-all flex items-center gap-2 group/btn"
                        >
                          <span className="font-black uppercase tracking-widest text-[10px]">
                            Send
                          </span>
                          <Send
                            size={14}
                            strokeWidth={3}
                            className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
                          />
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="p-8 border-t text-center font-semibold border-brand-primary/5 bg-white shrink-0">
                    Ticket is closed
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6"
              >
                <div className="w-24 h-24 rounded-[32px] bg-brand-primary/5 flex items-center justify-center text-brand-primary/20 animate-pulse-slow">
                  <MessageSquare size={48} strokeWidth={1} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-brand-primary tracking-tighter uppercase">
                    Select a Conversation
                  </h3>
                  <p className="text-sm font-bold text-brand-primary/30 max-w-md mx-auto">
                    Choose a ticket from the left to view the conversation or
                    open a new one if you need help.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-8">
                  <div className="p-6 rounded-3xl bg-brand-primary/2 border border-brand-primary/5 text-left space-y-3">
                    <ShieldCheck size={24} className="text-brand-primary/20" />
                    <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-widest">
                      Secure Support
                    </h4>
                    <p className="text-[9px] font-bold text-brand-primary/40 leading-relaxed">
                      Encrypted end-to-end communication.
                    </p>
                  </div>
                  <div className="p-6 rounded-3xl bg-brand-primary/2 border border-brand-primary/5 text-left space-y-3">
                    <CheckCircle2 size={24} className="text-brand-primary/20" />
                    <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-widest">
                      Rapid Response
                    </h4>
                    <p className="text-[9px] font-bold text-brand-primary/40 leading-relaxed">
                      Typical response time under 4 hours.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <SupportModal />
    </div>
  );
};

export default SupportPage;
