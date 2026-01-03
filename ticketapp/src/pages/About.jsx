import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaRocket, FaUsers, FaGlobe, FaAward, FaCode, FaHeart, FaArrowRight } from 'react-icons/fa';

const AboutUs = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  // Physics Config
  const springTransition = { type: "spring", stiffness: 100, damping: 20 };

  const stats = [
    { label: "যাত্রী সংখ্যা", value: "১০০কে+", icon: <FaUsers /> },
    { label: "সফল সফর", value: "৫০কে+", icon: <FaRocket /> },
    { label: "পার্টনার্স", value: "৫০০+", icon: <FaGlobe /> },
    { label: "পুরস্কার", value: "১২+", icon: <FaAward /> },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      
      {/* ১. Hero Section - Cinematic Entrance */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative h-screen flex flex-col items-center justify-center px-6 text-center border-b border-white/5"
      >
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="z-10"
        >
          <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[8px] mb-6 block">Our Story</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-8">
            REDEFINING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
              TRAVEL.
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            আমরা শুধু টিকেট বিক্রি করি না; আমরা প্রতিটি যাত্রীর নিরাপদ সফর নিশ্চিত করতে আধুনিক প্রযুক্তির সমন্বয় ঘটাই।
          </p>
        </motion.div>

        {/* Floating Abstract Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ y: [0, 100, 0], x: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 blur-[150px] rounded-full" />
          <motion.div animate={{ y: [0, -100, 0], x: [0, -50, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 blur-[150px] rounded-full" />
        </div>
      </motion.section>

      {/* ২. Stats Section - Physics Counters */}
      <section className="py-32 container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 text-center group hover:bg-white/10 transition-all"
            >
              <div className="text-3xl text-indigo-500 mb-4 flex justify-center group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">{stat.value}</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ৩. Mission & Vision - Split Physics Design */}
      <section className="py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={springTransition}
            className="space-y-10"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
              স্মার্ট প্রযুক্তি, <br /> নিরাপদ যাত্রা।
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              আমাদের লক্ষ্য হলো বাংলাদেশের টিকেট বুকিং সিস্টেমকে আন্তর্জাতিক মানে নিয়ে যাওয়া। আমরা বিশ্বাস করি প্রতিটি যাত্রীর সময় অত্যন্ত মূল্যবান। তাই আমরা সার্ভিস চার্জ কমিয়ে এবং ইউজার এক্সপেরিয়েন্স বাড়িয়ে ইসিই টিকেটকে দেশের এক নম্বর চয়েজ হিসেবে গড়ে তুলছি।
            </p>
            <motion.button 
              whileHover={{ scale: 1.05, gap: "2rem" }}
              className="flex items-center gap-4 bg-indigo-600 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest"
            >
              Join Our Journey <FaArrowRight />
            </motion.button>
          </motion.div>

          {/* Interactive Feature Grid */}
          <div className="grid grid-cols-2 gap-6">
            <motion.div whileHover={{ y: -20 }} className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[3rem] h-64 flex flex-col justify-end">
              <FaCode className="text-3xl mb-4" />
              <h4 className="font-bold text-xl">স্মার্ট অ্যালগরিদম</h4>
            </motion.div>
            <motion.div whileHover={{ y: -20 }} className="bg-white/5 border border-white/10 p-8 rounded-[3rem] h-64 flex flex-col justify-end mt-12">
              <FaHeart className="text-3xl text-pink-500 mb-4" />
              <h4 className="font-bold text-xl">ইউজার ফোকাসড</h4>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ৪. Team Callout - Modern Glass Card */}
      <section className="py-40 container mx-auto px-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="relative bg-gradient-to-r from-slate-900 to-indigo-950 p-12 md:p-24 rounded-[5rem] overflow-hidden border border-white/5 text-center"
        >
          {/* Animated Background Mesh */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
             <div className="absolute w-[500px] h-[500px] bg-indigo-500 blur-[120px] rounded-full -top-48 -left-48" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter italic">আমাদের সাথে আপনার প্রতিটি পথ হোক সহজ ও সাবলীল।</h2>
            <p className="text-slate-400 mb-12 text-lg">ECE TICKET পরিবারের অংশ হওয়ার জন্য ধন্যবাদ। আমরা আপনার আস্থার মর্যাদা রক্ষায় বদ্ধপরিকর।</p>
            <div className="flex flex-wrap justify-center gap-4">
               <div className="px-8 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest text-indigo-400">Innovation</div>
               <div className="px-8 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest text-purple-400">Security</div>
               <div className="px-8 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest text-emerald-400">Speed</div>
            </div>
          </div>
        </motion.div>
      </section>

     
    </div>
  );
};

export default AboutUs;