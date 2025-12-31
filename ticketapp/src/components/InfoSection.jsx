import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaSearch, FaChair, FaMoneyCheckAlt, FaCheckCircle, FaStar, FaShieldAlt } from 'react-icons/fa';

const InfoSection = () => {
  // Parallax Effect Setup
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const howItWorks = [
    { id: 1, icon: <FaSearch />, title: "রুট খুঁজুন", desc: "আপনার গন্তব্য এবং ভ্রমণের তারিখ দিয়ে সার্চ করুন।" },
    { id: 2, icon: <FaChair />, title: "সিট বেছে নিন", desc: "পছন্দমতো সিট এবং অপারেটর ফিল্টার করে সিলেক্ট করুন।" },
    { id: 3, icon: <FaMoneyCheckAlt />, title: "পেমেন্ট করুন", desc: "বিকাশ, নগদ বা কার্ডের মাধ্যমে পেমেন্ট সম্পন্ন করুন।" },
  ];

  const whyChooseUs = [
    { id: 1, icon: <FaCheckCircle />, title: "১০০% ভেরিফাইড টিকেট", color: "text-blue-500" },
    { id: 2, icon: <FaStar />, title: "সেরা কাস্টমার রিভিউ", color: "text-yellow-500" },
    { id: 3, icon: <FaShieldAlt />, title: "নিরাপদ যাত্রা নিশ্চিত", color: "text-green-500" },
  ];

  return (
    <section className="relative py-24 bg-[#05070a] text-white overflow-hidden font-['Hind_Siliguri',_sans-serif]">
      
      {/* Parallax Background Elements */}
      <motion.div style={{ y: y1 }} className="absolute top-20 left-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]" />
      <motion.div style={{ y: y2 }} className="absolute bottom-20 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- How It Works Section --- */}
        <div className="mb-32">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center text-4xl md:text-6xl font-black mb-16 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse"
          >
            কিভাবে কাজ করে? ↓
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {howItWorks.map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ y: -10 }}
                className="magic-border-container rounded-3xl"
              >
                <div className="bg-[#0f1117] p-10 rounded-[22px] h-full flex flex-col items-center text-center">
                  <div className="text-5xl text-indigo-500 mb-6 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- Why Choose Us Section --- */}
        <div className="relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white/5 backdrop-blur-xl p-10 md:p-20 rounded-[4rem] border border-white/10 shadow-2xl">
            <div className="md:w-1/2">
              <motion.h2 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-6xl font-black mb-6 leading-tight"
              >
                কেন আমাদের <br /> <span className="text-indigo-500">বেছে নেবেন?</span>
              </motion.h2>
              <p className="text-gray-400 text-lg mb-8">
                আমরা শুধু টিকেট বিক্রি করি না, আপনার যাত্রার নিরাপত্তা এবং আরাম নিশ্চিত করাই আমাদের মূল লক্ষ্য।
              </p>
            </div>

            <div className="md:w-1/2 grid grid-cols-1 gap-6 w-full">
              {whyChooseUs.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex items-center gap-6 bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all"
                >
                  <div className={`text-3xl ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="text-xl font-bold tracking-wide">{item.title}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default InfoSection;