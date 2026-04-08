import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { 
    FaBus, FaCalendarAlt, FaChair, FaQrcode, FaTicketAlt, 
    FaDownload, FaFacebookF, FaInstagram, FaMapMarkerAlt, 
    FaCompass, FaCheckCircle, FaShareAlt
} from 'react-icons/fa';
import api from '../autoapi'; 
import { FacebookShareButton } from 'react-share';

const MyTickets = () => {
    const { user } = useSelector((state) => state.auth);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);
    
    // Advanced States
    const [stampTicketId, setStampTicketId] = useState(null); // সিলমোহর এনিমেশনের জন্য
    const [activeTracking, setActiveTracking] = useState(null); // জিপিএস পপ-আপের জন্য
    const [isScratched, setIsScratched] = useState(false); // স্ক্র্যাচ কার্ডের জন্য

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const { data } = await api.get('/bookings/my-tickets');
                setTickets(data.tickets);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tickets:", error);
                setLoading(false);
            }
        };
        if (user?.token) fetchTickets();
    }, [user]);

    // 🌟 THE MAGIC: Swipe -> Stamp -> Backend Update -> GPS Modal
    const handleSwipeCheckIn = async (ticketId, info, ticketData) => {
        if (info.offset.y > 80) { // নিচে টানলে ট্রিগার হবে
            try {
                // ১. UI তে ইনস্ট্যান্ট সিলমোহর (Stamp) ফেলার এনিমেশন ট্রিগার
                setStampTicketId(ticketId);

                // ২. ব্যাকএন্ডে রিকোয়েস্ট পাঠানো (Check-in API)
                await api.put(`/bookings/check-in/${ticketId}`);
                
                // ৩. লোকাল স্টেট আপডেট করা
                setTickets(prev => prev.map(t => t._id === ticketId ? { ...t, isCheckedIn: true } : t));

                // ৪. ১.৫ সেকেন্ড পর (সিল পড়ার এনিমেশন শেষ হলে) জিপিএস পপ-আপ চালু করা
                setTimeout(() => {
                    setStampTicketId(null);
                    setIsScratched(false); // স্ক্র্যাচ কার্ড রিসেট
                    setActiveTracking(ticketData);
                }, 1500);

            } catch (error) {
                console.error("Check-in API failed:", error);
                alert("চেক-ইন ব্যর্থ হয়েছে। আপনার ইন্টারনেট কানেকশন চেক করুন।");
                setStampTicketId(null);
            }
        }
    };

    const handleDownloadPDF = async (ticketId) => {
        try {
            setDownloadingId(ticketId);
            const response = await api.get(`/bookings/download/${ticketId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Ticket-${ticketId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setDownloadingId(null);
        } catch (error) {
            console.error("Download failed:", error);
            alert("টিকেট ডাউনলোড করতে সমস্যা হয়েছে।");
            setDownloadingId(null);
        }
    };

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
    const ticketVariants = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center">
                <div className="w-14 h-14 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-indigo-400 font-bold tracking-widest uppercase mt-4 text-xs animate-pulse">Syncing Vault...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B1120] text-slate-300 font-['Plus_Jakarta_Sans',sans-serif] py-12 px-4 overflow-hidden relative">
            
            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-12 flex items-center gap-5">
                    <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-[1.2rem] flex items-center justify-center text-3xl text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                        <FaTicketAlt />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Ticket <span className="text-indigo-400">Vault</span></h1>
                        <p className="text-slate-500 font-bold text-xs mt-1 uppercase tracking-[3px]">Swipe down to check-in</p>
                    </div>
                </motion.div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-10">
                    {tickets.map((ticket) => {
                        const originalPrice = ticket.totalAmount || 0;
                        const discountedPrice = Math.round(originalPrice * 0.9);

                        return (
                            <motion.div key={ticket._id} variants={ticketVariants} className="flex flex-col md:flex-row relative group">
                                
                                {/* 🌟 BIG STAMP ANIMATION */}
                                <AnimatePresence>
                                    {(stampTicketId === ticket._id || ticket.isCheckedIn) && (
                                        <motion.div 
                                            initial={{ scale: 5, opacity: 0, rotate: -30 }}
                                            animate={{ scale: 1, opacity: 1, rotate: -15 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 150, damping: 10 }}
                                            className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
                                        >
                                            <div className="border-[6px] border-emerald-500 text-emerald-500 px-8 py-3 rounded-2xl font-black text-5xl tracking-[10px] uppercase bg-slate-900/40 backdrop-blur-sm shadow-[0_0_40px_rgba(16,185,129,0.3)]" style={{ filter: 'drop-shadow(4px 6px 4px rgba(0,0,0,0.5))' }}>
                                                VERIFIED
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Left Side: Ticket Main */}
                                <div className={`flex-1 bg-slate-800 border border-slate-700 rounded-3xl md:rounded-r-none p-8 relative z-10 overflow-hidden transition-all duration-500 ${ticket.isCheckedIn ? 'opacity-50 grayscale-[50%]' : ''}`}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-xs font-black uppercase tracking-widest">
                                            <FaBus /> {ticket.busType || 'Premium'}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-1">Departure</p>
                                            <p className="text-base font-black text-white flex items-center gap-2"><FaCalendarAlt className="text-indigo-500" /> {new Date(ticket.journeyDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    {/* 🌟 Curved Route Without Tail (Fixed) */}
                                    <div className="flex items-center justify-between bg-slate-900/80 p-6 rounded-2xl border border-slate-700 mt-6 relative">
                                        <div className="text-center w-20 relative z-10">
                                            <p className="text-3xl font-black text-white">{ticket.from.substring(0, 3).toUpperCase()}</p>
                                            <p className="text-xs font-bold text-slate-400 uppercase mt-1">{ticket.from}</p>
                                        </div>
                                        
                                        {/* Arc Animation */}
                                        <div className="flex-1 relative h-16 mx-4 flex items-center justify-center">
                                            {/* Beautiful Arc SVG */}
                                            <svg viewBox="0 0 200 50" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-50">
                                                <path d="M 0,40 Q 100,-10 200,40" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 6" />
                                            </svg>
                                            
                                            {/* Moving Icon */}
                                            <motion.div 
                                                animate={{ x: ["0%", "100%"], y: [15, -15, 15] }} // Arc simulation
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                className="absolute left-0 top-0 w-full"
                                            >
                                                <div className="text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)] -ml-3">
                                                    <FaBus size={20} />
                                                </div>
                                            </motion.div>
                                        </div>

                                        <div className="text-center w-20 relative z-10">
                                            <p className="text-3xl font-black text-white">{ticket.to.substring(0, 3).toUpperCase()}</p>
                                            <p className="text-xs font-bold text-slate-400 uppercase mt-1">{ticket.to}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 🌟 Draggable Swipe Line */}
                                <div className="hidden md:flex flex-col items-center relative w-10 bg-slate-800 z-20">
                                    <div className="h-full border-l-[3px] border-dashed border-slate-600 w-px absolute left-1/2 -translate-x-1/2" />
                                    
                                    {!ticket.isCheckedIn ? (
                                        <div className="absolute top-6 h-[75%] w-10 flex justify-center">
                                            <motion.div 
                                                drag="y"
                                                dragConstraints={{ top: 0, bottom: 140 }}
                                                dragElastic={0.05}
                                                dragSnapToOrigin={true}
                                                onDragEnd={(e, info) => handleSwipeCheckIn(ticket._id, info, ticket)}
                                                className="w-12 h-12 bg-indigo-600 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)] border-4 border-slate-800 flex items-center justify-center cursor-grab active:cursor-grabbing z-30 absolute hover:scale-110 transition-transform"
                                                title="Pull down to stamp & check-in"
                                            >
                                                <span className="text-white text-xl">🔽</span>
                                            </motion.div>
                                        </div>
                                    ) : (
                                        <div className="absolute bottom-12 bg-emerald-500 p-2.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)] z-30">
                                            <FaCheckCircle className="text-white text-lg" />
                                        </div>
                                    )}
                                </div>

                                {/* Right Side: Details & Stub */}
                                <div className={`w-full md:w-80 bg-slate-800 border border-slate-700 rounded-3xl md:rounded-l-none p-8 flex flex-col justify-between relative shadow-xl z-10 transition-all duration-500 ${ticket.isCheckedIn ? 'opacity-50' : ''}`}>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-[3px] mb-1">Seats</p>
                                        <p className="text-2xl font-black text-white flex items-center gap-2"><FaChair className="text-indigo-400" /> {ticket.seatIds.join(', ')}</p>
                                    </div>

                                    <div className="mt-6 bg-slate-900/80 p-4 rounded-xl border border-indigo-500/20">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-[10px] font-bold uppercase text-indigo-400 tracking-widest">App Discount (10%)</p>
                                            <span className="line-through text-slate-500 text-sm font-bold">৳ {originalPrice}</span>
                                        </div>
                                        <p className="text-3xl font-black text-white">৳ {discountedPrice}</p>
                                    </div>
                                    
                                    <div className="mt-6 bg-white p-3 rounded-2xl inline-block mx-auto opacity-90">
                                        <FaQrcode className="text-6xl text-slate-900" />
                                    </div>
                                    <p className="text-center text-[10px] mt-3 font-mono text-slate-500 tracking-[4px]">
                                        ID-{ticket._id.substring(ticket._id.length - 8).toUpperCase()}
                                    </p>

                                    {/* 🌟 Download Button 🌟 */}
                                    <button 
                                        onClick={() => handleDownloadPDF(ticket._id)}
                                        disabled={downloadingId === ticket._id}
                                        className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        {downloadingId === ticket._id ? (
                                            <span className="animate-pulse">Processing...</span>
                                        ) : (
                                            <><FaDownload /> Download PDF</>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* ========================================== */}
            {/* 🌟 ADVANCED GPS & REWARD MODAL */}
            {/* ========================================== */}
            <AnimatePresence>
                {activeTracking && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop Blur */}
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setActiveTracking(null)}
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0, y: 50 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.8, opacity: 0, y: -50 }}
                            transition={{ type: "spring", damping: 20, stiffness: 200 }}
                            className="bg-slate-900 border border-slate-700 rounded-[2.5rem] w-full max-w-lg p-8 relative z-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            <button onClick={() => setActiveTracking(null)} className="absolute top-6 right-6 w-8 h-8 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors z-20">&times;</button>
                            
                            <div className="flex items-center gap-3 mb-2">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                                    <FaCompass className="text-indigo-500 text-3xl" />
                                </motion.div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Live Tracking</h2>
                            </div>
                            <p className="text-slate-400 text-sm font-medium mb-8">রাজশাহী থেকে আপনার লাইভ জিপিএস কানেক্টেড।</p>

                            {/* 🌟 Advanced Radar GPS UI */}
                            <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 mb-8 relative overflow-hidden h-40 flex flex-col justify-center">
                                {/* Radar Circles */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    {[1, 2, 3].map(i => (
                                        <motion.div 
                                            key={i}
                                            animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-indigo-500 rounded-full"
                                        />
                                    ))}
                                </div>
                                
                                <div className="flex justify-between items-center relative z-10 w-full px-4">
                                    <div className="text-center">
                                        <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-indigo-500/50">
                                            <FaMapMarkerAlt className="text-indigo-400 text-lg" />
                                        </div>
                                        <p className="text-white font-bold text-xs uppercase tracking-widest">Rajshahi</p>
                                    </div>
                                    
                                    <div className="flex-1 relative h-0.5 bg-slate-600 mx-4">
                                        <motion.div 
                                            initial={{ left: "0%" }} animate={{ left: "100%" }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute top-1/2 -translate-y-1/2 -ml-3 w-6 h-6 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,1)] border-2 border-white flex items-center justify-center"
                                        >
                                            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                                        </motion.div>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-500/50">
                                            <FaMapMarkerAlt className="text-emerald-400 text-lg" />
                                        </div>
                                        <p className="text-white font-bold text-xs uppercase tracking-widest">{activeTracking.to}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 🌟 Interactive Scratch Card Reward */}
                            <div className="mb-8">
                                <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Your Journey Reward</p>
                                <div 
                                    onClick={() => setIsScratched(true)}
                                    className="relative w-full h-20 rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-r from-amber-200 to-yellow-500 border-2 border-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center justify-center"
                                >
                                    {/* Reward Text (Underneath) */}
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Coupon Code</p>
                                        <p className="text-3xl font-black text-slate-900 tracking-widest">RUET20</p>
                                    </div>

                                    {/* Cover Layer (Scratches away on click) */}
                                    <AnimatePresence>
                                        {!isScratched && (
                                            <motion.div 
                                                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                                                transition={{ duration: 0.5 }}
                                                className="absolute inset-0 bg-slate-700 flex items-center justify-center border-2 border-slate-600"
                                            >
                                                <p className="text-white font-black text-sm tracking-[5px] uppercase animate-pulse">Tap to Scratch ✨</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* 🌟 Real Social Sharing */}
                            <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Share Live Status</p>
                            <div className="flex gap-4">
                                
                                {/* 🌟 Facebook Share using react-share library */}
                                <FacebookShareButton 
                                    url="https://easyticket-flame.vercel.app"
                                    quote={`I'm travelling from Rajshahi to ${activeTracking?.to} using ECE Ticket! Safe and secure journey. 🚌✈️`}
                                    hashtag="#ECETicket"
                                    className="flex-1 w-full flex items-center justify-center gap-2 py-3.5 bg-[#1877F2] hover:bg-[#1877F2]/80 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all"
                                >
                                    <FaFacebookF className="text-lg" /> Facebook
                                </FacebookShareButton>

                                {/* 🌟 Instagram & Native OS Share Card (Best Modern Approach) */}
                                <button 
                                    onClick={async () => {
                                        const shareData = {
                                            title: 'ECE Ticket Journey',
                                            text: `I'm travelling from Rajshahi to ${activeTracking?.to} using ECE Ticket! 🚌✈️`,
                                            url: 'https://easyticket-flame.vercel.app'
                                        };
                                        
                                        // মোবাইলে থাকলে এটি রিয়েল OS শেয়ার কার্ড ওপেন করবে (যেখান থেকে Instagram বা অন্য অ্যাপ সিলেক্ট করা যায়)
                                        if (navigator.share) {
                                            try {
                                                await navigator.share(shareData);
                                            } catch (err) {
                                                console.error("Share cancelled or failed", err);
                                            }
                                        } else {
                                            // ডেস্কটপে থাকলে ক্লিপবোর্ড কপি ফলব্যাক
                                            navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                                            alert("ক্যাপশন ও লিঙ্ক কপি করা হয়েছে! Instagram ওপেন হচ্ছে...");
                                            window.open('https://instagram.com', '_blank');
                                        }
                                    }}
                                    className="flex-1 py-3.5 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] hover:opacity-90 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all"
                                >
                                    <FaInstagram className="text-lg" /> Instagram
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default MyTickets;