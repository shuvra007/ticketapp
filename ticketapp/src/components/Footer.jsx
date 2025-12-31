import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaQuoteLeft, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPaperPlane } from 'react-icons/fa';
import { FaBus, FaPlane, FaTrain, FaCloud, FaStar } from "react-icons/fa";
import CTASection from './CTA';
// --- Testimonials Data ---
const testimonials = [
  { id: 1, name: "শুভ আহমেদ", role: "নিয়মিত যাত্রী", text: "এই সাইট থেকে টিকেট কাটা অনেক সহজ। পেমেন্ট সিস্টেমটাও খুব ফাস্ট!", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "মালিহা খান", role: "ভ্রমণ পিপাসু", text: "কাস্টমার সাপোর্ট খুব চমৎকার। মাঝপথে সমস্যায় পড়েছিলাম, তারা সাথে সাথে সমাধান করে দিয়েছে।", avatar: "https://i.pravatar.cc/150?u=2" },
];

// --- FAQ Data ---
const faqs = [
  { question: "কিভাবে টিকেট রিটার্ন করব?", answer: "আপনার প্রোফাইল থেকে 'বুকিং হিস্ট্রি'তে গিয়ে রিটার্ন বাটনে ক্লিক করুন। যাত্রা শুরুর ৬ ঘণ্টা আগে রিটার্ন করলে নির্দিষ্ট চার্জ প্রযোজ্য হবে।" },
  { question: "আপনাদের সার্ভিস চার্জ কত?", answer: "আমরা নামমাত্র সার্ভিস চার্জ নিয়ে থাকি যা পেমেন্ট করার সময় বিস্তারিত ব্রেক-ডাউনে দেখতে পারবেন।" },
  { question: "বুকিং কনফার্মেশন কোথায় পাব?", answer: "বুকিং সফল হওয়ার পর আপনার ইমেইল এবং মোবাইল নাম্বারে এসএমএস-এর মাধ্যমে টিকেট পাঠিয়ে দেওয়া হবে।" },
];

const MainFooterSection = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  return (
    <div className="bg-[#05070a] text-white font-['Hind_Siliguri']">
      
      {/* --- Testimonials Section --- */}
      <section className="py-20 container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-black text-center mb-16"
        >
          যাত্রীরা আমাদের সম্পর্কে <span className="text-indigo-500">কি বলেন?</span>
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              className="bg-white/5 p-8 rounded-3xl border border-white/10 relative"
            >
              <FaQuoteLeft className="text-indigo-500 text-4xl mb-4 opacity-50" />
              <p className="text-gray-300 text-lg mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} className="w-12 h-12 rounded-full border-2 border-indigo-500" alt="" />
                <div>
                  <h4 className="font-bold">{t.name}</h4>
                  <p className="text-xs text-indigo-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-12 italic">সাধারণ জিজ্ঞাসা (FAQ)</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-white/10 rounded-2xl overflow-hidden shadow-lg bg-black/20">
                <button 
                  onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center transition-all hover:bg-white/5"
                >
                  <span className="text-lg md:text-xl font-bold">{faq.question}</span>
                  <motion.div animate={{ rotate: activeFAQ === idx ? 180 : 0 }}>
                    <FaChevronDown />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeFAQ === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-gray-400 leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-24 relative overflow-hidden">
       <CTASection/>
      </section>

      {/* --- Footer Section --- */}
      <footer className="pt-20 pb-10 border-t border-white/10 footer-glow">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-3xl font-black text-indigo-500 mb-6">ECE TICKET</h2>
            <p className="text-gray-400 leading-relaxed">আমরা দিচ্ছি দেশের সেরা ও নিরাপদ টিকেট বুকিং অভিজ্ঞতা। আমাদের সাথেই থাকুন আপনার প্রতিটি সফরে।</p>
          </div>
          <div>
            <h4 className="font-black mb-6 text-xl">লিঙ্কসমূহ</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="hover:text-indigo-400 cursor-pointer transition">আমাদের সম্পর্কে</li>
              <li className="hover:text-indigo-400 cursor-pointer transition">প্রাইভেসি পলিসি</li>
              <li className="hover:text-indigo-400 cursor-pointer transition">শর্তাবলী</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-6 text-xl">সাপোর্ট</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="hover:text-indigo-400 cursor-pointer transition">হেল্প সেন্টার</li>
              <li className="hover:text-indigo-400 cursor-pointer transition">রিফান্ড পলিসি</li>
              <li className="hover:text-indigo-400 cursor-pointer transition">যোগাযোগ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-6 text-xl">নিউজলেটার</h4>
            <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10 focus-within:border-indigo-500 transition">
              <input type="email" placeholder="আপনার ইমেইল" className="bg-transparent border-none outline-none p-3 w-full" />
              <button className="bg-indigo-600 p-4 rounded-xl hover:bg-indigo-700 transition">
                <FaPaperPlane />
              </button>
            </div>
            <div className="flex gap-4 mt-8">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <motion.a key={i} whileHover={{ y: -5 }} className="text-2xl text-gray-400 hover:text-indigo-500 cursor-pointer transition">
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center pt-10 border-t border-white/5 text-gray-500 text-sm">
          © {new Date().getFullYear()} ECE TICKET - সর্বস্বত্ব সংরক্ষিত।
        </div>
      </footer>
    </div>
  );
};

export default MainFooterSection;