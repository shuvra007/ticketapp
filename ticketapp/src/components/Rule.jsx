import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FaFingerprint, FaShieldAlt, FaCheckCircle, FaBan, FaGavel, FaInfoCircle, FaLock } from 'react-icons/fa';

const UltimateRulesPage = () => {
  const constraintsRef = useRef(null);

  const rules = [
    { id: 1, title: "Account Safety", icon: <FaLock />, color: "bg-blue-500", desc: "আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।" },
    { id: 2, title: "No Spamming", icon: <FaBan />, color: "bg-rose-500", desc: "কমিউনিটিতে কোনো প্রকার অপ্রাসঙ্গিক বা ক্ষতিকর স্প্যামিং করা কঠোরভাবে নিষিদ্ধ।" },
    { id: 3, title: "Fair Refund", icon: <FaCheckCircle />, color: "bg-emerald-500", desc: "বুকিংয়ের নির্দিষ্ট সময়ের মধ্যে রিফান্ড রিকোয়েস্ট করলে তা দ্রুত প্রসেস করা হবে।" },
    { id: 4, title: "User Privacy", icon: <FaFingerprint />, color: "bg-indigo-500", desc: "আমরা আপনার ডাটা এনক্রিপ্টেড রাখি এবং তা কখনোই তৃতীয় পক্ষের সাথে শেয়ার করি না।" },
    { id: 5, title: "Verified Identity", icon: <FaShieldAlt />, color: "bg-purple-500", desc: "সঠিক নাম এবং পরিচয় দিয়ে অ্যাকাউন্ট ভেরিফিকেশন সম্পন্ন করুন।" }
  ];

  // Physics Spring Configs
  const dropSpring = { type: "spring", stiffness: 400, damping: 12 };
  const sliderSpring = { type: "spring", stiffness: 150, damping: 20 };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-100 overflow-hidden">
      
      {/* ১. ব্যাকগ্রাউন্ড ফ্লোটিং ফিজিক্স আইকনস */}
      <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
              rotate: [0, 360]
            }}
            transition={{ duration: 10 + i, repeat: Infinity, ease: "linear" }}
            className="absolute text-9xl"
            style={{ left: `${i * 20}%`, top: `${Math.random() * 80}%` }}
          >
            <FaGavel />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 relative z-10">
        
        {/* ২. হেডলাইন ড্রপ (Physics Pop) */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ y: -300, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...dropSpring, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white shadow-xl shadow-indigo-100/50 rounded-full border border-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[4px] mb-8"
          >
            <FaShieldAlt className="animate-bounce" /> Protection Guidelines
          </motion.div>

          <motion.h1 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={dropSpring}
            className="text-6xl md:text-9xl font-black tracking-tighter leading-none"
          >
            Rules of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              Engagement.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="text-slate-400 mt-8 text-xl max-w-2xl mx-auto"
          >
             আমাদের প্ল্যাটফর্মটিকে নিরাপদ এবং স্বচ্ছ রাখতে এই নিয়মগুলো ফিজিক্যালি মেনে চলা জরুরি। 
          </motion.p>
        </div>

        {/* ৩. ফিজিক্স ড্র্যাগবল স্লাইডার */}
        <div className="relative overflow-visible" ref={constraintsRef}>
          <motion.div 
            drag="x"
            dragConstraints={constraintsRef}
            className="flex gap-8 cursor-grab active:cursor-grabbing pb-12"
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={sliderSpring}
          >
            {rules.map((rule) => (
              <motion.div 
                key={rule.id}
                whileHover={{ y: -15, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="min-w-[320px] bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 relative group"
              >
                {/* Elastic Icon Circle */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, delay: 0.5 + rule.id * 0.1 }}
                  className={`w-16 h-16 rounded-3xl ${rule.color} text-white flex items-center justify-center text-2xl mb-8 shadow-xl`}
                >
                  {rule.icon}
                </motion.div>

                <h3 className="text-2xl font-black text-slate-800 mb-4">{rule.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium mb-6">
                  {rule.desc}
                </p>

                <div className="h-1.5 w-12 bg-slate-100 rounded-full group-hover:w-full group-hover:bg-indigo-500 transition-all duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ৪. ডাইনামিক কলআউট কার্ড (Bottom Pop) */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={dropSpring}
          className="mt-20 relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[4rem] blur opacity-10 group-hover:opacity-20 transition duration-1000" />
          
          <div className="relative bg-slate-900 rounded-[4rem] p-12 md:p-20 overflow-hidden flex flex-col md:flex-row items-center gap-12">
             <div className="flex-1 space-y-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl text-indigo-400">
                   <FaInfoCircle />
                </div>
                <h2 className="text-4xl font-black text-white">নিরাপদ থাকুন, <br />নিশ্চিন্তে থাকুন।</h2>
                <p className="text-slate-400 max-w-sm">
                  শুভ্র হাসান, আমাদের নিয়মগুলো আপনার ডাটা এবং অভিজ্ঞতার সর্বোচ্চ সুরক্ষা নিশ্চিত করে। 
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl"
                >
                  Contact Support
                </motion.button>
             </div>

             <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-64 h-64 bg-white/5 rounded-full flex items-center justify-center border border-white/10"
             >
                <FaShieldAlt className="text-[120px] text-indigo-500/20" />
             </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default UltimateRulesPage;