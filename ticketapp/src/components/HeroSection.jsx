import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const slides = [
  {
    image: "/images/1.jpg",
    headline: "ভ্রমণ যা আপনাকে আপন করে",
    text: "ভ্রমণ এখন আর বিলাসিতা নয় — এটি জীবন, কর্ম এবং আনন্দের এক অবিচ্ছেদ্য অংশ।",
    tagline: "প্রতিটি যাত্রা গুরুত্বপূর্ণ",
    cta: "আপনার যাত্রা শুরু করুন",
    gradient: "from-blue-400 via-indigo-400 to-purple-500",
  },
  {
    image: "/images/2.jpg",
    headline: "এক ক্লিকেই টিকেট বুক করুন",
    text: "রুট খুঁজুন, দাম তুলনা করুন, সিট পছন্দ করুন এবং দ্রুত নিশ্চিত করুন আপনার টিকেট।",
    tagline: "স্মার্ট ট্রাভেল, বেটার লাইফ",
    cta: "টিকেট খুঁজুন এখনই",
    gradient: "from-emerald-400 via-teal-400 to-cyan-500",
  },
  {
    image: "/images/3.jpg",
    headline: "আরামদায়ক ও নিরাপদ ভ্রমণ",
    text: "সেরা সব অপারেটর আর প্রিমিয়াম সিট নিয়ে আমাদের সাথেই নিশ্চিত করুন আপনার আরামদায়ক যাত্রা।",
    tagline: "আরামের টিকেট আপনার হাতে",
    cta: "রুটগুলো দেখুন",
    gradient: "from-orange-400 via-red-400 to-pink-500",
  },
  {
    image: "/images/4.jpg",
    headline: "আপনার সফর শুরু হোক এখান থেকেই",
    text: "যেকোনো সময়, যেকোনো স্থান থেকে দ্রুত এবং নির্ভরযোগ্যভাবে আপনার ভ্রমণের পরিকল্পনা করুন।",
    tagline: "আত্মবিশ্বাসের সাথে এগিয়ে চলুন",
    cta: "বুকিং শুরু করুন",
    gradient: "from-indigo-400 via-blue-400 to-sky-500",
  },
  {
    image: "/images/5.jpg",
    headline: "বিশ্বস্ত টিকেট বুকিং প্ল্যাটফর্ম",
    text: "হাজার হাজার যাত্রী প্রতিদিন আমাদের ওপর ভরসা করেন তাদের নিরবচ্ছিন্ন যাত্রার জন্য।",
    tagline: "ভ্রমণ যখন জীবনের অংশ",
    cta: "ভরসার সাথে বুক করুন",
    gradient: "from-yellow-400 via-amber-400 to-orange-500",
  },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-black font-['Hind_Siliguri',_sans-serif]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* Background Image - Mobile Optimized */}
          <motion.img
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6 }}
            src={slides[index].image}
            alt="Travel slide"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Overlay - Smarter Gradient for Mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 md:bg-gradient-to-r md:from-black/90 md:via-black/40 md:to-transparent z-10" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center z-20">
            <div className="container mx-auto px-6 md:px-12">
              <div className="max-w-3xl">
                <motion.span
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block mb-4 md:mb-6 px-4 py-1 text-[10px] md:text-sm font-bold tracking-widest uppercase rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md"
                >
                  ✨ {slides[index].tagline}
                </motion.span>

                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`text-4xl md:text-7xl lg:text-8xl font-black leading-[1.2] md:leading-[1.1] mb-4 md:mb-6 tracking-tighter bg-gradient-to-r ${slides[index].gradient} bg-clip-text text-transparent`}
                >
                  {slides[index].headline}
                </motion.h1>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm md:text-xl text-gray-300 max-w-xl leading-relaxed mb-8 md:mb-10"
                >
                  {slides[index].text}
                </motion.p>

                {/* Floating Button - Responsive Sizes */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <button className="spark-border group relative p-[1.5px] md:p-[2px] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl transition-transform active:scale-95">
                    <div className="relative z-10 bg-indigo-600 group-hover:bg-indigo-700 text-white px-6 py-3.5 md:px-10 md:py-5 rounded-[10px] md:rounded-[14px] flex items-center gap-2 md:gap-3 font-bold text-base md:text-lg transition-all duration-300">
                      {slides[index].cta}
                      <FaArrowRight className="text-sm md:text-base group-hover:translate-x-2 transition-transform" />
                    </div>
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators - Repositioned for Mobile */}
      <div className="absolute bottom-10 left-6 md:left-12 z-30 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all duration-500 rounded-full ${
              i === index ? "w-8 md:w-12 h-1.5 md:h-2.5 bg-white" : "w-1.5 md:w-2.5 h-1.5 md:h-2.5 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}