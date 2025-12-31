import { motion } from "framer-motion";
import { FaBus, FaPlane, FaTrain, FaCloud, FaStar } from "react-icons/fa";
import { IoEarthSharp } from "react-icons/io5";

const CTASection = () => {
  // ভাসমান আইকনগুলোর জন্য কনফিগ
  const floatingIcons = [
    { Icon: FaPlane, x: "10%", y: "20%", delay: 0, size: "text-4xl" },
    { Icon: FaBus, x: "85%", y: "15%", delay: 2, size: "text-3xl" },
    { Icon: FaTrain, x: "15%", y: "70%", delay: 1, size: "text-3xl" },
    { Icon: IoEarthSharp, x: "80%", y: "75%", delay: 3, size: "text-5xl" },
    { Icon: FaCloud, x: "40%", y: "10%", delay: 1.5, size: "text-5xl" },
    { Icon: FaCloud, x: "60%", y: "85%", delay: 2.5, size: "text-4xl" },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#05070a]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 relative z-10"
      >
        <div className="bg-gradient-to-br from-indigo-600 via-purple-700 to-fuchsia-600 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(79,70,229,0.4)]">
          
          {/* ১. টিপটিপ করা তারা (Twinkling Stars) */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.8, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <FaStar size={Math.random() * 10 + 5} />
            </motion.div>
          ))}

          {/* ২. ভাসমান ট্রাভেল আইকন (Floating Icons) */}
          {floatingIcons.map((item, index) => (
            <motion.div
              key={index}
              className={`absolute ${item.size} text-white/20 hidden md:block`}
              style={{ top: item.y, left: item.x }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 5 + index,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut",
              }}
            >
              <item.Icon />
            </motion.div>
          ))}

          {/* ৩. ব্যাকগ্রাউন্ড টেক্সচার */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>

          {/* ৪. মেইন কন্টেন্ট */}
          <div className="relative z-20">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-5xl md:text-7xl font-black mb-8 text-white leading-tight tracking-tighter">
                যাত্রা হোক <span className="text-yellow-300">আনন্দময়!</span>
              </h2>
              <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto font-medium">
                আজই আপনার প্রথম টিকেট বুক করুন এবং উপভোগ করুন আকর্ষণীয় ডিসকাউন্ট ও নিশ্চিত নিরাপত্তা।
              </p>
            </motion.div>

            {/* ৫. এনিমেটেড বাটন */}
            <motion.button
              whileHover={{ 
                scale: 1.1, 
                boxShadow: "0px 0px 30px rgba(255, 255, 255, 0.5)" 
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-700 px-16 py-6 rounded-full font-black text-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all flex items-center gap-4 mx-auto"
            >
              বুকিং শুরু করুন <FaPlane className="rotate-45" />
            </motion.button>
          </div>

          {/* ৬. নিচের ডেকোরেটিভ গ্লো */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-yellow-400/20 rounded-full blur-[80px]"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/20 rounded-full blur-[80px]"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;