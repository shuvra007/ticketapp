import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCommentDots, FaMapMarkerAlt, FaPaperPlane, FaGlobeAmericas, FaCompass, FaHeart, FaSmile, FaRocket } from 'react-icons/fa';
const ImmersiveContact = () => {
  const [formState, setFormState] = useState('idle');

  // Physics & Animation Configs
  const headerSpring = { type: "spring", stiffness: 300, damping: 15, delay: 0.2 };
  const floatTransition = { duration: 4, repeat: Infinity, ease: "easeInOut" };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('sending');
    setTimeout(() => setFormState('sent'), 2800);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      
      {/* ১. ব্যাকগ্রাউন্ড পপিং আইকনস (Floating behind text) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }} transition={floatTransition}
          className="absolute top-20 left-[10%] text-6xl text-indigo-200"
        ><FaSmile /></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ ...floatTransition, delay: 1 }}
          className="absolute top-40 left-[40%] text-8xl text-purple-100"
        ><FaHeart /></motion.div>
        <motion.div 
          animate={{ x: [0, 30, 0], opacity: [0.1, 0.2, 0.1] }} transition={{ ...floatTransition, delay: 0.5 }}
          className="absolute top-10 right-[20%] text-7xl text-pink-100"
        ><FaRocket /></motion.div>
        {/* আপনি চাইলে এখানে আপনার ছোট ইমেজ সার্কেল ও দিতে পারেন */}
        <motion.div 
          animate={{ scale: [0.8, 1, 0.8] }} transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-1/4 left-[5%] w-32 h-32 bg-indigo-50 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        />
      </div>

      {/* ২. অটো-স্লাইডিং টেক্সট বার */}
      <div className="bg-slate-50/50 border-y border-slate-100 py-4 mt-6 overflow-hidden flex whitespace-nowrap z-10 relative">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 items-center"
        >
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="text-[10px] font-black tracking-[5px] uppercase flex items-center gap-3 text-slate-400">
              <FaGlobeAmericas className="text-indigo-400" /> WE'RE ONLINE • READY TO CHAT • RUET TECHNOLOGY • CONNECT NOW
            </span>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20">
        
        {/* ৩. লেফট সেকশন: ফিজিক্স টেক্সট এবং ম্যাপ */}
        <div className="space-y-12">
          <div className="relative">
            {/* "Waiting" Indicator */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <span className="text-xs font-bold text-rose-500 tracking-tighter uppercase">We are waiting for your message</span>
            </motion.div>

            <motion.h1 
              initial={{ y: -200, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={headerSpring}
              className="text-7xl md:text-9xl font-black tracking-tighter leading-none"
            >
              Let's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                Connect.
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="text-slate-500 mt-6 text-xl max-w-sm font-medium"
            >
              আমরা আপনার সাথে কথা বলার জন্য মুখিয়ে আছি। 
            </motion.p>
          </div>

          {/* অ্যাডভান্সড ম্যাপ কার্ড */}
          <div className="relative h-80 w-full rounded-[3rem] bg-white border border-slate-100 overflow-hidden shadow-2xl shadow-indigo-100/50">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  initial={{ x: 600, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 12, delay: 1 }}
                  className="absolute top-12 right-10 bg-white shadow-2xl px-6 py-3 rounded-2xl border border-slate-50 z-20"
                >
                  <p className="text-xs font-black text-slate-800 uppercase tracking-widest">📍 RUET, Rajshahi</p>
                </motion.div>

                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
                  className="relative flex flex-col items-center"
                >
                  <FaMapMarkerAlt className="text-7xl text-indigo-600 drop-shadow-2xl" />
                  <motion.div 
                    animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="absolute -bottom-2 w-16 h-16 bg-indigo-400 rounded-full blur-2xl"
                  />
                </motion.div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 bg-slate-900 text-white p-5 rounded-3xl flex justify-between items-center shadow-xl">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-500 rounded-xl">
                    <FaCompass className="animate-spin-slow" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">Our team is active</span>
               </div>
               <span className="text-[10px] font-black text-indigo-400">ONLINE NOW</span>
            </div>
          </div>
        </div>

        {/* ৪. রাইট সেকশন: এনিমেটেড ইনপুট ফর্ম */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 md:p-14 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(99,102,241,0.1)] border border-slate-50 relative overflow-hidden"
        >
          {/* Form Inner Background Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50" />

          <AnimatePresence mode="wait">
            {formState !== 'sent' ? (
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="group space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 ml-2">Full Name</label>
                  <motion.div whileFocus-within={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400 }}>
                    <div className="relative">
                      <FaUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        required type="text" placeholder="শুভ্র হাসান"
                        className="w-full bg-slate-50 border-none py-5 pl-16 pr-6 rounded-3xl focus:ring-2 ring-indigo-500/10 focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                  </motion.div>
                </div>

                <div className="group space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 ml-2">Description</label>
                  <motion.div whileFocus-within={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400 }}>
                    <div className="relative">
                      <FaCommentDots className="absolute left-6 top-8 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                      <textarea 
                        required rows="5" placeholder="কিভাবে সাহায্য করতে পারি?"
                        className="w-full bg-slate-50 border-none py-6 pl-16 pr-6 rounded-[2.5rem] focus:ring-2 ring-indigo-500/10 focus:bg-white transition-all shadow-inner resize-none"
                      />
                    </div>
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right py-6 rounded-3xl font-black text-white text-lg flex items-center justify-center gap-4 shadow-2xl shadow-indigo-100 transition-all duration-500 group relative overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {formState === 'sending' ? (
                      <motion.div key="sending" animate={{ x: [0, 400], opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>
                        <FaPaperPlane className="text-2xl" />
                      </motion.div>
                    ) : (
                      <motion.span key="idle" className="flex items-center gap-3">
                        Send Message <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.6 }}
                className="text-center py-12"
              >
                 <motion.div 
                    animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-teal-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-8 shadow-2xl shadow-emerald-100"
                 >
                    <FaPaperPlane />
                 </motion.div>
                 <h2 className="text-3xl font-black text-slate-900 mb-2">Message Sent! 🙌</h2>
                 <p className="text-slate-500">আমরা আপনার বার্তাটি পেয়েছি। শীঘ্রই দেখা হবে!</p>
                 <button onClick={() => setFormState('idle')} className="mt-10 font-bold text-indigo-600 hover:underline">নতুন একটি পাঠান</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

    </div>
  );
};

export default ImmersiveContact;