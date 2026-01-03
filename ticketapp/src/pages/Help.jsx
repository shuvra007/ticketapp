import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaBook, FaTicketAlt, FaQuestionCircle, FaUserCircle, FaRocket, FaShieldAlt } from 'react-icons/fa';

const HelpCenter = () => {
  const categories = [
    { id: 1, title: "বুকিং গাইড", icon: <FaTicketAlt />, color: "bg-blue-500", desc: "কিভাবে টিকেট কাটবেন এবং ম্যানেজ করবেন তার বিস্তারিত।" },
    { id: 2, title: "অ্যাকাউন্ট সেটিংস", icon: <FaUserCircle />, color: "bg-purple-500", desc: "পাসওয়ার্ড পরিবর্তন এবং প্রোফাইল ভেরিফিকেশন সংক্রান্ত তথ্য।" },
    { id: 3, title: "পেমেন্ট সমস্যা", icon: <FaShieldAlt />, color: "bg-emerald-500", desc: "নিরাপদ পেমেন্ট এবং রিফান্ড পলিসি সম্পর্কে জানুন।" },
    { id: 4, title: "সচরাচর জিজ্ঞাসা", icon: <FaQuestionCircle />, color: "bg-orange-500", desc: "আপনার সাধারণ সব প্রশ্নের তাৎক্ষণিক সমাধান এখানে।" },
  ];

  // Physics Transitions
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
    }
  };

  const itemVars = {
    hidden: { y: 40, opacity: 0, scale: 0.9 },
    visible: { 
      y: 0, opacity: 1, scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] pb-24 overflow-hidden">
      
      {/* ১. Hero Section - Physics Entrance */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ x: -100, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[4px] mb-6"
            >
              <FaRocket className="animate-pulse" /> Support 24/7
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight mb-8">
              আমরা কিভাবে <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                সাহায্য করতে পারি?
              </span>
            </h1>

            {/* Elastic Search Bar */}
            <motion.div 
              whileFocus-within={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative max-w-lg"
            >
              <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="আপনার সমস্যাটি লিখে সার্চ করুন..."
                className="w-full py-6 pl-16 pr-6 bg-white shadow-2xl shadow-indigo-100/50 rounded-[2rem] border-none outline-none text-slate-700 font-medium placeholder:text-slate-300 focus:ring-2 ring-indigo-500/20 transition-all"
              />
            </motion.div>
          </motion.div>

          {/* Floating Image Section */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: 10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 80, delay: 0.3 }}
            className="relative"
          >
            <motion.img 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              src="https://img.freepik.com/free-vector/organic-flat-customer-support_23-2148899174.jpg" 
              alt="Support Illustration" 
              className="w-full h-auto rounded-[4rem] drop-shadow-[0_50px_50px_rgba(99,102,241,0.15)]"
            />
            {/* Background Blob */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-50 blur-[100px] rounded-full opacity-60" />
          </motion.div>
        </div>
      </section>

      {/* ২. Category Cards - Staggered Physics */}
      <section className="container mx-auto px-6 relative z-10 -mt-16">
        <motion.div 
          variants={containerVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {categories.map((item) => (
            <motion.div 
              key={item.id}
              variants={itemVars}
              whileHover={{ y: -15, scale: 1.02 }}
              className="bg-white p-10 rounded-[3.5rem] shadow-xl shadow-slate-100 border border-slate-50 group cursor-pointer transition-all hover:shadow-2xl hover:shadow-indigo-100"
            >
              <div className={`w-16 h-16 rounded-[2rem] ${item.color} text-white flex items-center justify-center text-2xl mb-8 shadow-lg transition-transform group-hover:rotate-12`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-4">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                {item.desc}
              </p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest group-hover:gap-4 transition-all">
                আরও পড়ুন <span>→</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ৩. Quick Action - Bottom Floating Bar */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto mt-24 px-6"
      >
        <div className="bg-slate-900 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-3xl text-indigo-400">
              <FaBook />
            </div>
            <div>
              <h4 className="text-white text-2xl font-black">কিছুই খুঁজে পাচ্ছেন না?</h4>
              <p className="text-slate-400 text-sm mt-1">আমাদের ড্রকুমেন্টেশন আপনার কাজে আসতে পারে।</p>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl whitespace-nowrap relative z-10"
          >
            Visit Docs
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpCenter;