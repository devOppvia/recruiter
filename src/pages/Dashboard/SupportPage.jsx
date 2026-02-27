import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
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
    Loader2
} from 'lucide-react';
import { toggleSupportModal, setActiveTicket, addMessage } from '../../store/slices/supportSlice';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import SupportModal from '../../components/modals/SupportModal';

const SupportPage = () => {
    const dispatch = useDispatch();
    const { tickets, activeTicketId } = useSelector((state) => state.support);
    const [searchQuery, setSearchQuery] = useState('');
    const [replyText, setReplyText] = useState('');
    const chatEndRef = useRef(null);

    const activeTicket = tickets.find(t => t.id === activeTicketId);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeTicket?.messages]);

    const handleSendReply = (e) => {
        e.preventDefault();
        if (!replyText.trim() || !activeTicketId) return;
        dispatch(addMessage({ ticketId: activeTicketId, text: replyText }));
        setReplyText('');
    };

    const filteredTickets = tickets.filter(t =>
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10';
            case 'in-progress': return 'text-amber-500 bg-amber-500/10 border-amber-500/10';
            case 'resolved': return 'text-brand-primary/40 bg-brand-primary/5 border-brand-primary/5';
            default: return 'text-brand-primary/40 bg-brand-primary/5 border-brand-primary/5';
        }
    };

    return (
        <div className="space-y-8 pb-10 h-[calc(100vh-140px)] flex flex-col">
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
                    <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-black uppercase tracking-widest text-xs">New Ticket</span>
                </Button>
            </div>

            <div className="flex-1 flex gap-8 min-h-0">
                {/* Left: Ticket List */}
                <div className={`w-full md:w-[400px] flex flex-col gap-6 shrink-0 ${activeTicketId ? 'hidden md:flex' : 'flex'}`}>
                    <div className="relative group shrink-0">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-primary/30 group-focus-within:text-brand-primary transition-colors" size={18} />
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
                                onClick={() => dispatch(setActiveTicket(ticket.id))}
                                className={`p-6 rounded-[32px] border cursor-pointer transition-all duration-300 group ${activeTicketId === ticket.id
                                    ? 'bg-brand-primary border-brand-primary shadow-premium'
                                    : 'bg-white border-brand-primary/5 shadow-soft hover:shadow-premium hover:border-brand-primary/10'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${activeTicketId === ticket.id ? 'text-white/60' : 'text-brand-primary/40'}`}>
                                        {ticket.id}
                                    </span>
                                    <div className={`px-2.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${activeTicketId === ticket.id
                                        ? 'bg-white/10 text-white border-white/10'
                                        : getStatusColor(ticket.status)
                                        }`}>
                                        {ticket.status}
                                    </div>
                                </div>
                                <h3 className={`text-sm font-black tracking-tight mb-2 line-clamp-1 ${activeTicketId === ticket.id ? 'text-white' : 'text-brand-primary'}`}>
                                    {ticket.subject}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${activeTicketId === ticket.id ? 'bg-white/10 text-white/60' : 'bg-brand-primary/5 text-brand-primary/30'}`}>
                                        <Clock size={12} strokeWidth={3} />
                                    </div>
                                    <span className={`text-[10px] font-bold truncate ${activeTicketId === ticket.id ? 'text-white/40' : 'text-brand-primary/30'}`}>
                                        {ticket.lastMessage}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right: Conversation View */}
                <div className={`flex-1 bg-white rounded-[40px] border border-brand-primary/5 shadow-premium overflow-hidden flex flex-col ${activeTicketId ? 'flex' : 'hidden md:flex'}`}>
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
                                                <h2 className="text-xl font-black text-brand-primary tracking-tighter uppercase">{activeTicket.subject}</h2>
                                                <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(activeTicket.status)}`}>
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
                                        <Button variant="secondary" className="rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-soft">
                                            {activeTicket.status === 'resolved' ? 'Reopen' : 'Mark as Resolved'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar bg-brand-primary/[0.01]">
                                    {activeTicket.messages.map((msg) => (
                                        <div key={msg.id} className={`flex items-start gap-5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-soft relative overflow-hidden ${msg.sender === 'user'
                                                ? 'bg-linear-to-br from-brand-primary to-brand-primary-light text-white'
                                                : 'bg-white text-brand-primary'
                                                }`}>
                                                {msg.sender === 'user' ? <User size={20} strokeWidth={2.5} /> : <LifeBuoy size={20} strokeWidth={2.5} />}
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                            </div>
                                            <div className={`max-w-[70%] space-y-2 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                                                <div className={`p-6 rounded-[24px] text-sm font-bold leading-relaxed shadow-soft border ${msg.sender === 'user'
                                                    ? 'bg-brand-primary text-white border-brand-primary'
                                                    : 'bg-white text-brand-primary/80 border-brand-primary/5'
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                                <p className="text-[10px] font-black text-brand-primary/20 uppercase tracking-widest">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Reply Area */}
                                <div className="p-8 border-t border-brand-primary/5 bg-white shrink-0">
                                    <form onSubmit={handleSendReply} className="relative group">
                                        <textarea
                                            placeholder="Write your message here..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            rows="2"
                                            className="w-full pl-6 pr-32 py-5 rounded-[24px] bg-brand-primary/5 border border-brand-primary/5 focus:ring-4 focus:ring-brand-primary/5 outline-none text-sm font-bold placeholder:text-brand-primary/20 transition-all resize-none group-focus-within:bg-white group-focus-within:border-brand-primary/10"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                            <Button
                                                onClick={handleSendReply}
                                                disabled={!replyText.trim()}
                                                className="rounded-xl px-6 py-3 h-auto shadow-premium bg-brand-primary hover:bg-brand-primary-light transition-all flex items-center gap-2 group/btn"
                                            >
                                                <span className="font-black uppercase tracking-widest text-[10px]">Send</span>
                                                <Send size={14} strokeWidth={3} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </form>
                                </div>
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
                                    <h3 className="text-xl font-black text-brand-primary tracking-tighter uppercase">Select a Conversation</h3>
                                    <p className="text-sm font-bold text-brand-primary/30 max-w-md mx-auto">
                                        Choose a ticket from the left to view the conversation or open a new one if you need help.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-8">
                                    <div className="p-6 rounded-3xl bg-brand-primary/2 border border-brand-primary/5 text-left space-y-3">
                                        <ShieldCheck size={24} className="text-brand-primary/20" />
                                        <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Secure Support</h4>
                                        <p className="text-[9px] font-bold text-brand-primary/40 leading-relaxed">Encrypted end-to-end communication.</p>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-brand-primary/2 border border-brand-primary/5 text-left space-y-3">
                                        <CheckCircle2 size={24} className="text-brand-primary/20" />
                                        <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Rapid Response</h4>
                                        <p className="text-[9px] font-bold text-brand-primary/40 leading-relaxed">Typical response time under 4 hours.</p>
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
