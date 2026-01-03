import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaShieldAlt, FaDatabase, FaLock, FaCookieBite, FaEyeSlash, 
  FaSearch, FaFingerprint, FaUserShield, FaCheckCircle, FaFileContract 
} from 'react-icons/fa';

const PrivacyPolicyFinal = () => {
  // কার্ড ডাটা
  const mainCards = [
    { id: 1, title: "Data Collection", icon: <FaDatabase />, color: "bg-blue-500", text: "আমরা শুধুমাত্র আপনার প্রয়োজনীয় তথ্য সংগ্রহ করি।" },
    { id: 2, title: "Security Layers", icon: <FaLock />, color: "bg-purple-500", text: "আপনার ডাটা এনক্রিপ্টেড এবং সম্পূর্ণ সুরক্ষিত।" },
    { id: 3, title: "Cookie Policy", icon: <FaCookieBite />, color: "bg-pink-500", text: "কুকিজের মাধ্যমে আপনার অভিজ্ঞতা উন্নত করা হয়।" },
    { id: 4, title: "Third Party Sharing", icon: <FaEyeSlash />, color: "bg-teal-500", text: "আমরা কখনোই তথ্য তৃতীয় পক্ষের কাছে শেয়ার করি না।" },
  ];

  const updateHistory = [
    { title: "Data Anonymization", date: "JAN 2026", icon: <FaUserShield />, color: "text-purple-500" },
    { title: "Consent Update", date: "MAR 2026", icon: <FaCheckCircle />, color: "text-rose-500" },
    { title: "Breach Protocol", date: "APR 2026", icon: <FaFileContract />, color: "text-indigo-500" },
    { title: "Biometric Data", date: "MAY 2026", icon: <FaFingerprint />, color: "text-blue-500" },
  ];

  const springTransition = { type: "spring", stiffness: 300, damping: 20 };

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 pb-20 overflow-hidden">
      
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ x: -100, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          transition={springTransition}
        >
          <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-white w-fit rounded-full shadow-sm border border-slate-100">
            <FaShieldAlt className="text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-[3px] text-slate-500">Privacy First</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6">
            YOUR PRIVACY, <br />
            <span className="text-indigo-600">OUR PRIORITY.</span>
          </h1>
          <p className="text-slate-500 text-lg mb-10 max-w-md font-medium">
            আমরা আপনার তথ্য অত্যন্ত গোপনীয়তা এবং সুরক্ষার সাথে পরিচালনা করি। নিচে আমাদের স্বচ্ছ পলিসি বিস্তারিত দেখুন।
          </p>

          {/* সার্চ বার */}
          <motion.div 
            whileFocus-within={{ scale: 1.05 }}
            className="flex items-center bg-white px-6 py-4 rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-50 max-w-sm"
          >
            <FaSearch className="text-slate-300 mr-4" />
            <input type="text" placeholder="Search policy..." className="bg-transparent outline-none w-full text-sm font-medium" />
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative flex justify-center lg:justify-end"
        >
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-80 h-96 bg-white rounded-[3rem] shadow-2xl p-6 relative border border-slate-50"
          >
            <div className="w-full h-4 bg-slate-50 rounded-full mb-4" />
            <div className="w-3/4 h-3 bg-slate-50 rounded-full mb-8" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="w-full h-2 bg-slate-50 rounded-full" />
                    <div className="w-1/2 h-2 bg-slate-50 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
            {/* Floating Badges */}
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute -top-6 -right-6 w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <FaLock />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ২. মেইন পলিসি কার্ডস */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        {mainCards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ ...springTransition, delay: idx * 0.1 }}
            whileHover={{ y: -12 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 group transition-all"
          >
            <div className={`w-14 h-14 rounded-2xl ${card.color} text-white flex items-center justify-center text-xl mb-6 shadow-lg shadow-indigo-100`}>
              {card.icon}
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-3">{card.title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-medium mb-6">{card.text}</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-100" />)}
            </div>
          </motion.div>
        ))}
      </section>

      {/* ৩. আপডেট হিস্ট্রি সেকশন */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-white/60 backdrop-blur-xl rounded-[4rem] p-12 border border-white">
          <h2 className="text-4xl font-black mb-12 tracking-tight">Last Updated</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {updateHistory.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="flex items-center gap-5 p-6 bg-white rounded-3xl shadow-sm border border-slate-50"
              >
                <div className={`text-2xl ${item.color} bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">{item.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{item.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* কনফেটি সাকসেস বাটন (For Interaction) */}
      <div className="mt-20 flex justify-center">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[5px] shadow-2xl"
        >
          Download PDF
        </motion.button>
      </div>
    </div>
  );
};

export default PrivacyPolicyFinal;