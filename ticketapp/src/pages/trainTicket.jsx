import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrain, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaUserTag, FaInfoCircle } from 'react-icons/fa';
import { TbArmchair, TbAirConditioning } from 'react-icons/tb';
import { MdOutlineAirlineSeatReclineExtra } from 'react-icons/md';
import api from '../autoapi';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
// 🌟 Payment Modal Import
import PaymentModal from '../components/PaymentModal';

const TrainTicket = () => {
  // 🌟 Real Railway Stations
  const stations = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Cumilla", "Mymensingh", "Brahmanbaria"];

  // 🌟 Advanced Train Classes
  const availableTrains = [
    { id: "TRN_SUBARNA", name: "Subarna Express (701)", class: "SNIGDHA (AC)", price: 1200, features: ['AC', 'Food', 'Recliner'] },
    { id: "TRN_SONAR", name: "Sonar Bangla (787)", class: "AC_SEAT", price: 1500, features: ['AC', 'Premium', 'WiFi'] },
    { id: "TRN_PARABAT", name: "Parabat Express (709)", class: "SHOVON CHAIR", price: 650, features: ['Non-AC', 'Fan', 'Standard'] },
  ];

  const coaches = [
    { id: 'KA', label: 'ক (Ka)', start: 1, end: 40 },
    { id: 'KHA', label: 'খ (Kha)', start: 41, end: 80 },
    { id: 'GA', label: 'গ (Ga)', start: 81, end: 120 }
  ];

  // States
  const [activeCoach, setActiveCoach] = useState(coaches[0]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [from, setFrom] = useState(stations[0]);
  const [to, setTo] = useState(stations[1]);
  const [selectedTrain, setSelectedTrain] = useState(availableTrains[0]);
  const [journeyDate, setJourneyDate] = useState(new Date().toISOString().split('T')[0]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // 🌟 Payment States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookingPayload, setBookingPayload] = useState(null);

  const fetchAvailability = useCallback(async () => {
    setFetching(true);
    try {
      // API call reuses your bus booking logic
      const { data } = await api.get('/bookings/availability', {
        params: { busId: selectedTrain.id, date: journeyDate, from, to }
      });
      setOccupiedSeats(data.bookedSeats || []);
    } catch (error) {
      console.error("Availability error:", error);
      toast.error("আসন তালিকা লোড করতে সমস্যা হয়েছে", { theme: "dark" });
      setOccupiedSeats([]);
    } finally {
      setFetching(false);
    }
  }, [selectedTrain.id, journeyDate, from, to]);

  useEffect(() => {
    setSelectedSeats([]);
    fetchAvailability();
  }, [fetchAvailability]);

  // Handle Seat Selection
  const handleSeatClick = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length < 4) { // ট্রেনের ক্ষেত্রে সর্বোচ্চ ৪টি সিট
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        toast.warning("সর্বোচ্চ ৪টি সিট বুক করা যাবে!", { theme: "dark" });
      }
    }
  };

  // 🌟 Confirm Booking - Opens Payment Modal instead of direct API call
  const confirmBooking = () => {
    const payload = {
      busId: selectedTrain.id,
      seatIds: selectedSeats,
      route: `${from} to ${to}`,
      from, to,
      journeyDate,
      totalAmount: selectedSeats.length * selectedTrain.price,
      busType: `Train: ${selectedTrain.class}`,
      couponCode: "" // ট্রেনের জন্য কুপন কোড নেই
    };
    setBookingPayload(payload);
    setIsPaymentModalOpen(true);
  };

  // 🌟 Handle Payment Success Callback
  const handlePaymentSuccess = (tranId) => {
    setIsPaymentModalOpen(false);
    toast.success("বুকিং সফল হয়েছে! শুভ যাত্রা।", { theme: "dark", position: "top-center" });
    setSelectedSeats([]);
    fetchAvailability();
  };

  // Prevent same from/to selection
  const handleFromChange = (e) => {
    const newFrom = e.target.value;
    setFrom(newFrom);
    if (newFrom === to) setTo(stations.find(l => l !== newFrom));
  };

  const handleToChange = (e) => {
    const newTo = e.target.value;
    setTo(newTo);
    if (newTo === from) setFrom(stations.find(l => l !== newTo));
  };

  // Generate seats for the currently active coach
  const generateCoachSeats = () => {
    const seats = [];
    let seatLabelIndex = 1;
    for (let i = activeCoach.start; i <= activeCoach.end; i++) {
      const row = Math.ceil(seatLabelIndex / 4);
      const col = ['A', 'B', 'C', 'D'][(seatLabelIndex - 1) % 4];
      seats.push({
        id: i, // Global ID for DB (1 to 120)
        label: `${row}${col}`, // Local label for UI (1A, 1B...)
        isBooked: occupiedSeats.includes(i),
        isWindow: col === 'A' || col === 'D'
      });
      seatLabelIndex++;
    }
    return seats;
  };

  const coachSeats = generateCoachSeats();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 font-['Plus_Jakarta_Sans',sans-serif] pb-20 relative overflow-hidden">

      {/* 🌟 Background Cyber-Rail Grid & Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-[#0f1b2d] to-transparent" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-teal-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      </div>

      {/* 🌟 Top Glassmorphic Search Bar */}
      <div className="relative z-10 border-b border-white/5 bg-slate-900/40 backdrop-blur-2xl pt-24 pb-10 px-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                  <FaTrain />
                </div>
                Rail<span className="text-emerald-400">Booking</span>
              </h2>
            </div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 bg-[#0a1120] p-4 rounded-3xl border border-white/10 shadow-inner">
            {/* From */}
            <div className="bg-slate-800/50 p-3 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1 block mb-1">Departure</label>
              <div className="flex items-center gap-3 text-white">
                <FaMapMarkerAlt className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                <select value={from} onChange={handleFromChange} className="w-full bg-transparent outline-none text-sm font-bold appearance-none cursor-pointer">
                  {stations.map(l => <option key={l} value={l} className="bg-slate-800">{l}</option>)}
                </select>
              </div>
            </div>

            {/* To */}
            <div className="bg-slate-800/50 p-3 rounded-2xl border border-white/5 hover:border-teal-500/30 transition-colors group">
              <label className="text-[10px] font-black text-teal-500 uppercase tracking-widest ml-1 block mb-1">Destination</label>
              <div className="flex items-center gap-3 text-white">
                <FaMapMarkerAlt className="text-slate-500 group-hover:text-teal-400 transition-colors" />
                <select value={to} onChange={handleToChange} className="w-full bg-transparent outline-none text-sm font-bold appearance-none cursor-pointer">
                  {stations.map(l => <option key={l} value={l} className="bg-slate-800">{l}</option>)}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="bg-slate-800/50 p-3 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Journey Date</label>
              <div className="flex items-center gap-3 text-white">
                <FaCalendarAlt className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                <input type="date" value={journeyDate} onChange={(e) => setJourneyDate(e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold cursor-pointer [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
              </div>
            </div>

            {/* Train Selector */}
            <div className="bg-slate-800/50 p-3 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1 block mb-1">Select Train</label>
              <div className="flex items-center gap-3 text-white">
                <FaTrain className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                <select value={selectedTrain.id} onChange={(e) => setSelectedTrain(availableTrains.find(b => b.id === e.target.value))} className="w-full bg-transparent outline-none text-sm font-bold appearance-none cursor-pointer text-emerald-50">
                  {availableTrains.map(train => <option key={train.id} value={train.id} className="bg-slate-800">{train.name}</option>)}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 🌟 Main Booking Area */}
      <div className="container mx-auto max-w-7xl px-6 mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ========================================== */}
          {/* 🌟 LEFT: ADVANCED TRAIN COACH UI */}
          {/* ========================================== */}
          <div className="lg:col-span-8">
            <div className="bg-[#0f172a] rounded-[2.5rem] p-8 shadow-2xl border border-white/5 relative overflow-hidden">

              {/* Decorative Train Top */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50 rounded-b-full" />

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                {/* Coach Tabs */}
                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                  {coaches.map(coach => (
                    <button
                      key={coach.id}
                      onClick={() => setActiveCoach(coach)}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeCoach.id === coach.id ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                      {coach.label}
                    </button>
                  ))}
                </div>

                {/* Legends */}
                <div className="flex gap-4 bg-black/20 px-5 py-3 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase"><span className="w-3 h-3 rounded-md bg-[#1e293b] border border-slate-600 block"></span> Available</div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase"><span className="w-3 h-3 rounded-md bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] block"></span> Selected</div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-rose-400 uppercase"><span className="w-3 h-3 rounded-md bg-rose-500/20 border border-rose-500/50 block"></span> Booked</div>
                </div>
              </div>

              {fetching ? (
                <div className="h-[500px] flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
                  <p className="text-emerald-400 font-bold tracking-widest uppercase text-xs animate-pulse">Syncing Coach Data...</p>
                </div>
              ) : (
                /* 🌟 REALISTIC TRAIN CARRIAGE CONTAINER */
                <div className="max-w-md mx-auto relative mt-4">
                  {/* Train Nose/Connector */}
                  <div className="w-24 h-8 bg-gradient-to-b from-[#1e293b] to-[#0f172a] mx-auto rounded-t-2xl border-t-2 border-x-2 border-white/10 flex items-center justify-center">
                    <div className="w-12 h-1 bg-black/50 rounded-full" />
                  </div>

                  {/* Train Body */}
                  <div className="bg-gradient-to-b from-[#1e293b] to-[#111827] rounded-[3rem] p-4 pt-10 pb-16 border-2 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">

                    {/* Windows Strip (Left & Right) */}
                    <div className="absolute left-2 top-10 bottom-10 w-2 bg-black/40 rounded-full flex flex-col gap-4 py-4 px-[2px]">
                      {Array.from({ length: 10 }).map((_, i) => <div key={`w-l-${i}`} className="w-1 flex-1 bg-emerald-500/10 rounded-full" />)}
                    </div>
                    <div className="absolute right-2 top-10 bottom-10 w-2 bg-black/40 rounded-full flex flex-col gap-4 py-4 px-[2px]">
                      {Array.from({ length: 10 }).map((_, i) => <div key={`w-r-${i}`} className="w-1 flex-1 bg-emerald-500/10 rounded-full" />)}
                    </div>

                    {/* The Seats Grid */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeCoach.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-4 gap-y-5 gap-x-3 px-6"
                      >
                        {coachSeats.map((seat) => {
                          const isSelected = selectedSeats.includes(seat.id);
                          return (
                            <div key={seat.id} className={`${seat.id % 4 === 2 ? 'mr-10' : ''} flex justify-center relative group`}>

                              {/* Tooltip on hover */}
                              <div className="absolute -top-8 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                                Seat {seat.label} {seat.isWindow && '(Window)'}
                              </div>

                              <motion.button
                                disabled={seat.isBooked}
                                whileHover={!seat.isBooked ? { scale: 1.1, y: -2 } : {}}
                                whileTap={!seat.isBooked ? { scale: 0.9 } : {}}
                                onClick={() => handleSeatClick(seat.id)}
                                className={`
                                                        relative w-12 h-14 rounded-t-xl rounded-b-md flex flex-col items-center justify-start pt-2 transition-all duration-200 border-b-4
                                                        ${seat.isBooked
                                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-900 cursor-not-allowed'
                                    : isSelected
                                      ? 'bg-emerald-500 border-emerald-700 text-white shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                                      : 'bg-[#334155] border-[#1e293b] text-slate-400 hover:bg-[#475569]'}
                                                    `}
                              >
                                {/* Train Seat Graphic Elements */}
                                <div className={`w-8 h-3 rounded-full mb-1 opacity-50 ${isSelected ? 'bg-white' : 'bg-black'}`} /> {/* Headrest */}
                                <MdOutlineAirlineSeatReclineExtra size={20} className={isSelected ? 'text-white' : seat.isBooked ? 'text-rose-500/30' : 'text-emerald-500/30'} />

                                <span className={`absolute -bottom-3 text-[9px] font-black uppercase tracking-wider ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`}>
                                  {seat.label}
                                </span>
                              </motion.button>
                            </div>
                          );
                        })}
                      </motion.div>
                    </AnimatePresence>

                    {/* Train Floor Texture Aisle */}
                    <div className="absolute top-10 bottom-16 left-1/2 -translate-x-1/2 w-8 bg-[repeating-linear-gradient(0deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)] pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================== */}
          {/* 🌟 RIGHT: SUMMARY & CHECKOUT (Hologram UI) */}
          {/* ========================================== */}
          <div className="lg:col-span-4">
            <motion.div layout className="bg-gradient-to-b from-[#0f172a] to-[#0a1120] rounded-[2.5rem] p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-emerald-500/20 sticky top-32 overflow-hidden">

              {/* Holographic glowing orb behind the summary */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 blur-[120px] rounded-full opacity-20 pointer-events-none" />

              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="p-2 bg-emerald-500/20 rounded-lg"><FaUserTag className="text-emerald-400" /></div>
                <h3 className="text-xl font-black uppercase tracking-widest text-emerald-50">Booking Panel</h3>
              </div>

              <div className="space-y-5 mb-8 relative z-10">
                {/* Train Info */}
                <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Selected Train</p>
                  <p className="font-black text-lg text-emerald-400">{selectedTrain.name.split(' ')[0]}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[10px] bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-300"><TbAirConditioning /> {selectedTrain.class}</span>
                    <span className="flex items-center gap-1 text-[10px] bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-300"><TbArmchair /> Recliner</span>
                  </div>
                </div>

                {/* Seat Info */}
                <div className="bg-black/30 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500" />
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Assigned Berths/Seats</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.length > 0 ? (
                      selectedSeats.map(id => {
                        // Find coach and label from global ID
                        const targetCoach = coaches.find(c => id >= c.start && id <= c.end);
                        const seatNumInCoach = id - targetCoach.start + 1;
                        const label = `${Math.ceil(seatNumInCoach / 4)}${['A', 'B', 'C', 'D'][(seatNumInCoach - 1) % 4]}`;

                        return (
                          <span key={id} className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-sm font-black shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            {targetCoach.label.split(' ')[0]}-{label}
                          </span>
                        )
                      })
                    ) : (
                      <span className="text-sm font-bold text-slate-600">No seats selected</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="mb-10 text-center bg-[#070b14] py-6 rounded-2xl border border-emerald-500/20 relative z-10 shadow-inner">
                <p className="text-emerald-500/70 text-[10px] uppercase font-black tracking-[4px] mb-2">Total Fare</p>
                <h4 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-200">
                  ৳{selectedSeats.length * selectedTrain.price}
                </h4>
              </div>

              {/* 🌟 Checkout Button triggers Payment Modal */}
              <button
                onClick={confirmBooking}
                disabled={selectedSeats.length === 0 || loading || fetching}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all relative overflow-hidden group
                ${selectedSeats.length > 0 ? 'bg-emerald-500 text-white hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(16,185,129,0.4)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
              >
                {/* Button Shine Effect */}
                {selectedSeats.length > 0 && <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:animate-[shine_1s_ease-in-out]" />}

                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaCheckCircle className="text-lg" />}
                  {loading ? "Processing..." : "Confirm Journey"}
                </span>
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-500">
                <FaInfoCircle /> Note: Tickets are non-refundable 24hrs prior.
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* 🌟 Payment Modal Wrapper added here */}
      {bookingPayload && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          bookingData={bookingPayload}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shine { 100% { left: 200%; } }
      `}} />
    </div>
  );
};

export default TrainTicket;