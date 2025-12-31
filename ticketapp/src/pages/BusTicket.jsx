import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaBus, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaChevronRight } from 'react-icons/fa';
import { MdChair } from 'react-icons/md';
import { GiSteeringWheel } from 'react-icons/gi';
// আপনার তৈরি করা কাস্টম এপিআই ইন্টারসেপ্টর ইমপোর্ট করুন
import api from '../autoapi'; 
import { toast } from 'react-toastify';

const BusTicket = () => {
  const locations = ["RUET", "Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna"];
  
  const ruetBuses = [
    { id: "ECE", name: "ECE - Electronics & Comm.", isAC: true },
    { id: "EEE", name: "EEE - Electrical Power", isAC: true },
    { id: "CSE", name: "CSE - Software Giant", isAC: true },
    { id: "CIVIL", name: "CIVIL - Infrastructure", isAC: false },
    { id: "ME", name: "ME - Mechanical Titan", isAC: false }
  ];

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [from, setFrom] = useState(locations[0]);
  const [to, setTo] = useState(locations[1]);
  const [selectedBus, setSelectedBus] = useState(ruetBuses[0]);
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
      toast.error("আসন তালিকা লোড করতে সমস্যা হয়েছে"); // এরর টোস্ট
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
        toast.warning("সর্বোচ্চ ৫টি সিট বুক করা যাবে!"); // ওয়ার্নিং টোস্ট
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
        from, to, // ব্যাকএন্ডে separately পাঠানোর জন্য
        journeyDate,
        totalAmount: selectedSeats.length * seatPrice
      };
      
      await api.post('/bookings/book-seats', bookingData);
      
      toast.success("বুকিং সফল হয়েছে! শুভ যাত্রা।", {
        position: "top-center",
        autoClose: 3000,
      }); // সাকসেস টোস্ট
      
      setSelectedSeats([]);
      fetchAvailability(); 
    } catch (error) {
      const msg = error.response?.data?.message || "বুকিং ব্যর্থ হয়েছে!";
      toast.error(msg); // এরর টোস্ট
    } finally {
      setLoading(false);
    }
  };

  // সিট লিস্ট জেনারেশন লজিক
  const initialSeats = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    label: `${String.fromCharCode(65 + Math.floor(i / 4))}${(i % 4) + 1}`,
    isBooked: occupiedSeats.includes(i + 1),
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-['Hind_Siliguri'] pb-12">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 pt-16 pb-8 px-6 shadow-sm">
        <div className="container mx-auto max-w-6xl">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black text-indigo-600 mb-6 flex items-center gap-2">
                <FaBus /> RUET Transit Services
            </motion.h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Starting From</label>
                    <select value={from} onChange={(e)=>setFrom(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm appearance-none">
                        {locations.map(l => <option key={l}>{l}</option>)}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Destination</label>
                    <select value={to} onChange={(e)=>setTo(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm appearance-none">
                        {locations.map(l => <option key={l}>{l}</option>)}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</label>
                    <input type="date" value={journeyDate} onChange={(e)=>setJourneyDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Bus</label>
                    <select value={selectedBus.id} onChange={(e)=>setSelectedBus(ruetBuses.find(b => b.id === e.target.value))} className="w-full bg-indigo-50 border border-indigo-100 p-3 rounded-xl outline-none text-sm font-bold text-indigo-700">
                        {ruetBuses.map(bus => <option key={bus.id} value={bus.id}>{bus.name}</option>)}
                    </select>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Seat Map Area */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100 relative">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-bold">সিট নির্বাচন করুন</h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><MdChair className="text-slate-200 text-lg" /> Available</div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-rose-300"><MdChair className="text-rose-100 text-lg" /> Booked</div>
                </div>
              </div>

              {fetching ? (
                 <div className="h-96 flex flex-col items-center justify-center gap-2 text-indigo-500 animate-pulse font-bold">লোড হচ্ছে...</div>
              ) : (
                <div className="max-w-xs mx-auto bg-slate-50 rounded-3xl p-6 border-2 border-dashed border-slate-200">
                    <div className="flex justify-end mb-8"><GiSteeringWheel className="text-4xl text-slate-300" /></div>
                    <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                    {initialSeats.map((seat) => (
                        <div key={seat.id} className={`${seat.id % 4 === 2 ? 'mr-6' : ''} flex justify-center`}>
                        <motion.button
                            disabled={seat.isBooked}
                            whileTap={!seat.isBooked ? { scale: 0.8 } : {}}
                            onClick={() => handleSeatClick(seat)}
                            className={`relative text-4xl transition-all 
                                ${seat.isBooked ? 'text-rose-100' : 
                                  selectedSeats.includes(seat.id) ? 'text-indigo-600' : 'text-slate-300 hover:text-indigo-200'}`}
                        >
                            <MdChair />
                            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400">
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
            <motion.div layout className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl sticky top-10">
              <h3 className="text-2xl font-black mb-6">বুকিং সামারি</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-indigo-500/50 text-sm">
                    <span className="text-indigo-200">বাস:</span> <span className="font-bold">{selectedBus.id}</span>
                </div>
                <div className="py-4 px-6 bg-white/10 rounded-2xl flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-indigo-100">সিট নম্বর:</span>
                    <span className="text-xl font-black text-yellow-300">
                        {selectedSeats.length > 0 ? selectedSeats.map(id => initialSeats[id-1].label).join(", ") : "---"}
                    </span>
                </div>
              </div>
              <div className="mb-10 text-center">
                  <p className="text-indigo-200 text-xs uppercase font-bold">মোট ভাড়া</p>
                  <h4 className="text-4xl font-black italic">৳{selectedSeats.length * seatPrice}</h4>
              </div>
              <button 
                onClick={confirmBooking}
                disabled={selectedSeats.length === 0 || loading || fetching}
                className={`w-full py-5 rounded-2xl font-black text-xl transition-all 
                ${selectedSeats.length > 0 ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-indigo-300 cursor-not-allowed'}`}
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