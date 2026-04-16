import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import api from '../../autoapi';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiCreditCard, FiMaximize, FiCheckCircle, FiXCircle, FiCpu } from 'react-icons/fi';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const [ticketIdInput, setTicketIdInput] = useState('');
    const [validateResult, setValidateResult] = useState(null);
    const [validating, setValidating] = useState(false);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await api.get('/admin/analytics');
                setStats(data);
            } catch (err) {
                toast.error("Failed to fetch analytics");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const handleValidate = async () => {
        if (!ticketIdInput) return;
        setValidating(true);
        setValidateResult(null);
        try {
            const { data } = await api.post('/admin/validate-ticket', { ticketId: ticketIdInput });
            // Simulate a slight delay for the "scanning" effect
            setTimeout(() => setValidateResult(data), 800);
        } catch (err) {
            setTimeout(() => {
                toast.error("Validation failed");
                setValidateResult({ valid: false, message: "Invalid or Fake Ticket!" });
            }, 800);
        } finally {
            setTimeout(() => setValidating(false), 800);
        }
    };

    // --- Framer Motion Variants ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute w-96 h-96 bg-emerald-600/20 blur-[120px] rounded-full animate-pulse" />
                <FiCpu className="text-emerald-400 text-6xl animate-pulse mb-6 relative z-10" />
                <p className="text-emerald-400 font-black tracking-[5px] uppercase text-sm relative z-10">Initializing Core...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030712] text-slate-300 p-6 md:p-10 font-sans relative overflow-hidden">

            {/* --- Background Ambient Glows --- */}
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* --- Header --- */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 mb-12">
                    <div className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-2xl backdrop-blur-xl shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                        <FiActivity className="text-emerald-400 text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">System <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Command</span></h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Network Online</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">

                    {/* --- Top Stats --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants} className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-[2rem] border border-white/[0.05] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FiCheckCircle className="text-8xl text-indigo-400" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-[3px] text-[10px] mb-2 flex items-center gap-2">
                                <FiMaximize className="text-indigo-400" /> Tickets Dispensed
                            </p>
                            <h2 className="text-5xl md:text-6xl font-black text-white">{stats?.totalTickets || 0}</h2>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-[2rem] border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FiCreditCard className="text-8xl text-emerald-400" />
                            </div>
                            <p className="text-emerald-400/80 font-bold uppercase tracking-[3px] text-[10px] mb-2 flex items-center gap-2">
                                <FiActivity className="text-emerald-400" /> Gross Revenue
                            </p>
                            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">
                                ৳ {stats?.totalRevenue?.toLocaleString() || 0}
                            </h2>
                        </motion.div>
                    </div>

                    {/* --- Chart Section --- */}
                    <motion.div variants={itemVariants} className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-[2rem] border border-white/[0.05] shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-white tracking-wide">Route Telemetry (Volume)</h3>
                        </div>
                        <div className="h-[400px] w-full">
                            {stats?.popularRoutes?.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.popularRoutes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            {/* Custom Gradient for Bars */}
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#059669" stopOpacity={0.3} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                            contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                                        />
                                        <Bar dataKey="ticketsSold" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-600">
                                    <FiActivity className="text-4xl mb-4 opacity-50" />
                                    <p className="uppercase tracking-[2px] text-xs font-bold">Awaiting Telemetry Data</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* --- Cyber Scanner UI --- */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-lg font-bold text-white mb-4 tracking-wide flex items-center gap-2">
                            <FiMaximize className="text-indigo-400" /> Security Validator
                        </h3>
                        <div className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-[2rem] border border-white/[0.05] shadow-2xl flex flex-col lg:flex-row gap-8 relative overflow-hidden">

                            {/* Left: Input */}
                            <div className="flex-1 flex flex-col justify-center">
                                <p className="text-slate-400 mb-6 text-sm font-medium">Input blockchain hash or scan QR directly into the terminal below to verify passenger authenticity.</p>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={ticketIdInput}
                                        onChange={(e) => setTicketIdInput(e.target.value)}
                                        placeholder="Enter UID Payload..."
                                        className="w-full bg-[#030712]/50 border border-white/[0.1] p-5 pl-6 rounded-2xl outline-none text-white font-mono placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
                                        onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
                                    />
                                    <button
                                        onClick={handleValidate}
                                        disabled={validating || !ticketIdInput}
                                        className="absolute right-2 top-2 bottom-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 rounded-xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]"
                                    >
                                        {validating ? "Scanning" : "Execute"}
                                    </button>
                                </div>
                            </div>

                            {/* Right: Output Monitor */}
                            <div className="flex-1 bg-[#030712] border border-white/[0.05] rounded-2xl p-6 relative overflow-hidden min-h-[200px] flex items-center justify-center font-mono shadow-inner">

                                {/* Scanning Laser Animation */}
                                {validating && (
                                    <>
                                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(16,185,129,0.1)_50%,transparent_100%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
                                        <motion.div
                                            animate={{ top: ['0%', '100%', '0%'] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            className="absolute left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)] z-10"
                                        />
                                    </>
                                )}

                                <AnimatePresence mode="wait">
                                    {!validateResult && !validating && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-slate-600 text-sm uppercase tracking-[3px]">
                                            System Standing By...
                                        </motion.p>
                                    )}

                                    {validating && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-emerald-500 text-sm uppercase tracking-[3px] animate-pulse">
                                            Analyzing Block...
                                        </motion.p>
                                    )}

                                    {validateResult && !validating && (
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="w-full"
                                        >
                                            {validateResult.valid ? (
                                                <div className="text-center bg-emerald-500/[0.05] border border-emerald-500/20 p-6 rounded-xl">
                                                    <FiCheckCircle className="text-5xl text-emerald-400 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                    <h4 className="text-2xl font-black text-emerald-400 tracking-widest uppercase mb-1">Authentic</h4>
                                                    <p className="text-emerald-200/50 text-[10px] tracking-[2px] mb-4">Verification Successful</p>

                                                    <div className="bg-[#030712] rounded-lg p-3 inline-block border border-emerald-500/10">
                                                        <p className="text-slate-300 text-xs mb-1">UID: <span className="text-white">{validateResult?.ticketDetails?._id || 'N/A'}</span></p>
                                                        <p className="text-emerald-400 font-bold text-sm">
                                                            {validateResult?.ticketDetails?.from || 'Unknown'} <span className="text-slate-500 mx-2">➔</span> {validateResult?.ticketDetails?.to || 'Unknown'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center bg-rose-500/[0.05] border border-rose-500/20 p-6 rounded-xl">
                                                    <FiXCircle className="text-5xl text-rose-500 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                                                    <h4 className="text-2xl font-black text-rose-500 tracking-widest uppercase mb-1">Compromised</h4>
                                                    <p className="text-rose-200/50 text-[10px] tracking-[2px] mb-4">Verification Failed</p>
                                                    <p className="text-rose-400 text-sm bg-[#030712] inline-block px-4 py-2 rounded-lg border border-rose-500/10">
                                                        {validateResult.message}
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;