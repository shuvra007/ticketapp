import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaBus, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaChevronRight } from 'react-icons/fa';
import { MdChair } from 'react-icons/md';
import { GiSteeringWheel } from 'react-icons/gi';
import api from '../autoapi'; 
import { toast } from 'react-toastify';

const BusTicket = () => {
  // রিয়েল লোকেশন ডেটা
  const locations = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Cox's Bazar"];
  
  // রিয়েল বাস অপারেটর ডেটা
  const availableBuses = [
    { id: "GREEN_LINE", name: "Green Line - Scania", isAC: true },
    { id: "HANIF", name: "Hanif Enterprise - Volvo", isAC: true },
    { id: "DESH", name: "Desh Travels - Hyundai", isAC: true },
    { id: "SHYAMOLI", name: "Shyamoli NR Travels", isAC: false },
    { id: "SHOHAGH", name: "Shohagh Paribahan", isAC: false }
  ];

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [from, setFrom] = useState(locations[0]); // Dhaka
  const [to, setTo] = useState(locations[4]); // Khulna
  const [selectedBus, setSelectedBus] = useState(availableBuses[0]);
  const [journeyDate, setJourneyDate] = useState(new Date().toISOString().split('T')[0]);
  const [occupiedSeats, setOccupiedSeats] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const seatPrice = selectedBus.isAC ? 1200 : 800;

  const fetchAvailability = useCallback(async () => {
    setFetching(true);
    try {
      const { data } = await api.get('/bookings/availability', {
        params: { busId: selectedBus.id, date: journeyDate, from, to }
      });
      setOccupiedSeats(data.bookedSeats || []);
    } catch (error) {
      console.error("Availability error:", error);
      toast.error("আসন তালিকা লোড করতে সমস্যা হয়েছে");
      setOccupiedSeats([]); 
    } finally {
      setFetching(false);
    }
  }, [selectedBus.id, journeyDate, from, to]);

  useEffect(() => {
    setSelectedSeats([]);
    fetchAvailability();
  }, [fetchAvailability]);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
    } else {
      if (selectedSeats.length < 5) {
        setSelectedSeats([...selectedSeats, seat.id]);
      } else {
        toast.warning("সর্বোচ্চ ৫টি সিট বুক করা যাবে!");
      }
    }
  };

  const confirmBooking = async () => {
    setLoading(true);
    try {
      const bookingData = {
        busId: selectedBus.id,
        seatIds: selectedSeats,
        route: `${from} to ${to}`,
        from, to, 
        journeyDate,
        totalAmount: selectedSeats.length * seatPrice,
        busType: selectedBus.isAC ? "AC" : "Non-AC"
      };
      
      await api.post('/bookings/book-seats', bookingData);
      
      toast.success("বুকিং সফল হয়েছে! শুভ যাত্রা।", {
        position: "top-center",
        autoClose: 3000,
      }); 
      
      setSelectedSeats([]);
      fetchAvailability(); 
    } catch (error) {
      toast.error("বুকিং ব্যর্থ হয়েছে! আবার চেষ্টা করুন।", {
        position: "top-center",
        autoClose: 3000,
      }); 
    } finally {
      setLoading(false);
    }
  };

  // From এবং To যেন সেম না হয় সেই লজিক
  const handleFromChange = (e) => {
    const newFrom = e.target.value;
    setFrom(newFrom);
    if (newFrom === to) {
      setTo(locations.find(l => l !== newFrom));
    }
  };

  const handleToChange = (e) => {
    const newTo = e.target.value;
    setTo(newTo);
    if (newTo === from) {
      setFrom(locations.find(l => l !== newTo));
    }
  };

  const initialSeats = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    label: `${String.fromCharCode(65 + Math.floor(i / 4))}${(i % 4) + 1}`,
    isBooked: occupiedSeats.includes(i + 1),
  }));

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 font-['Hind_Siliguri'] pb-12 relative overflow-hidden">
      
      {/* Background Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <div className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 pt-16 pb-8 px-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative z-10">
        <div className="container mx-auto max-w-6xl">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black text-emerald-400 mb-6 flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><FaBus /></div> Bus Ticket Booking
            </motion.h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-black text-emerald-500/80 uppercase tracking-wider">Starting From</label>
                    <select value={from} onChange={handleFromChange} className="w-full bg-[#070b14] border border-white/10 p-3 rounded-xl outline-none text-sm text-white appearance-none cursor-pointer focus:border-emerald-500/50 transition-colors">
                        {locations.map(l => <option key={l} value={l} className="bg-slate-900">{l}</option>)}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-black text-teal-500/80 uppercase tracking-wider">Destination</label>
                    <select value={to} onChange={handleToChange} className="w-full bg-[#070b14] border border-white/10 p-3 rounded-xl outline-none text-sm text-white appearance-none cursor-pointer focus:border-teal-500/50 transition-colors">
                        {locations.map(l => <option key={l} value={l} className="bg-slate-900">{l}</option>)}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-black text-emerald-500/80 uppercase tracking-wider">Date</label>
                    <input type="date" value={journeyDate} onChange={(e)=>setJourneyDate(e.target.value)} className="w-full bg-[#070b14] border border-white/10 p-3 rounded-xl outline-none text-sm text-white cursor-pointer focus:border-emerald-500/50 transition-colors [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-black text-emerald-500/80 uppercase tracking-wider">Select Bus</label>
                    <select value={selectedBus.id} onChange={(e)=>setSelectedBus(availableBuses.find(b => b.id === e.target.value))} className="w-full bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl outline-none text-sm font-bold text-emerald-400 cursor-pointer">
                        {availableBuses.map(bus => <option key={bus.id} value={bus.id} className="bg-slate-900">{bus.name}</option>)}
                    </select>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Seat Map Area */}
          <div className="lg:col-span-7">
            <div className="bg-[#0f172a] rounded-[3rem] p-8 shadow-2xl border border-white/5 relative">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-bold text-white">সিট নির্বাচন করুন</h3>
                <div className="flex gap-4 bg-black/20 px-4 py-2 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400"><MdChair className="text-slate-600 text-lg" /> Available</div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-rose-400"><MdChair className="text-rose-500/30 text-lg" /> Booked</div>
                </div>
              </div>

              {fetching ? (
                 <div className="h-96 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-emerald-500 font-bold text-xs tracking-widest uppercase animate-pulse">লোড হচ্ছে...</p>
                 </div>
              ) : (
                <div className="max-w-xs mx-auto bg-[#070b14] rounded-3xl p-6 border-2 border-dashed border-white/5 shadow-inner">
                    <div className="flex justify-end mb-8"><GiSteeringWheel className="text-4xl text-slate-700" /></div>
                    <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                    {initialSeats.map((seat) => (
                        <div key={seat.id} className={`${seat.id % 4 === 2 ? 'mr-6' : ''} flex justify-center`}>
                        <motion.button
                            disabled={seat.isBooked}
                            whileTap={!seat.isBooked ? { scale: 0.8 } : {}}
                            onClick={() => handleSeatClick(seat)}
                            className={`relative text-4xl transition-all 
                                ${seat.isBooked ? 'text-rose-500/30 cursor-not-allowed' : 
                                  selectedSeats.includes(seat.id) ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'text-slate-600 hover:text-emerald-300'}`}
                        >
                            <MdChair />
                            <span className={`absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold ${selectedSeats.includes(seat.id) ? 'text-emerald-300' : 'text-slate-500'}`}>
                                {seat.label}
                            </span>
                        </motion.button>
                        </div>
                    ))}
                    </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-5">
            <motion.div layout className="bg-gradient-to-b from-[#0f172a] to-[#0a1120] border border-emerald-500/20 rounded-[3rem] p-10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] sticky top-10">
              <h3 className="text-2xl font-black mb-6 text-white">বুকিং সামারি</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-slate-700 text-sm">
                    <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">বাস:</span> 
                    <span className="font-bold text-emerald-50">{selectedBus.name.split(' - ')[0]}</span>
                </div>
                <div className="py-4 px-6 bg-black/30 border border-white/5 rounded-2xl flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-slate-400">সিট নম্বর:</span>
                    <span className="text-xl font-black text-emerald-400">
                        {selectedSeats.length > 0 ? selectedSeats.map(id => initialSeats[id-1].label).join(", ") : "---"}
                    </span>
                </div>
              </div>
              <div className="mb-10 text-center bg-[#070b14] py-6 rounded-2xl border border-white/5">
                  <p className="text-emerald-500/70 text-[10px] uppercase font-black tracking-[4px] mb-2">মোট ভাড়া</p>
                  <h4 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-200">
                    ৳{selectedSeats.length * seatPrice}
                  </h4>
              </div>
              <button 
                onClick={confirmBooking}
                disabled={selectedSeats.length === 0 || loading || fetching}
                className={`w-full py-5 rounded-2xl font-black text-sm tracking-widest uppercase transition-all 
                ${selectedSeats.length > 0 ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:bg-emerald-400' : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'}`}
              >
                {loading ? "লোডিং..." : "বুকিং নিশ্চিত করুন"}
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BusTicket;