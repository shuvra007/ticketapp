import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes, FaGlassCheers, FaCheckCircle } from 'react-icons/fa';
import confetti from 'canvas-confetti';

const EmailSubscription = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');

  // ফিজিক্স কনফেটি এনিমেশন
  const fireConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1000,
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (email) {
      setIsOpen(true);
      fireConfetti();
    }
  };

  return (
    <div className="relative w-full">
      {/* ১. কম্প্যাক্ট ইনপুট ফিল্ড */}
      <form onSubmit={handleSend} className="w-full">
        <motion.div 
          whileFocus-within={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white transition-all duration-300 shadow-inner"
        >
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="আপনার ইমেইল" 
            className="bg-transparent border-none outline-none p-3 w-full text-slate-800 text-sm font-bold placeholder:text-slate-400" 
          />
          <motion.button 
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.9, rotate: -5 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-xl text-white shadow-lg shadow-indigo-200"
          >
            <FaPaperPlane size={14} />
          </motion.button>
        </motion.div>
      </form>

      {/* ২. মডার্ন ফিজিক্স পপ-আপ */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />

            {/* Popup Card */}
            <motion.div 
              initial={{ scale: 0.7, opacity: 0, y: 100, rotateX: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative bg-white w-full max-w-sm p-10 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] border border-white text-center"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <FaTimes size={18} />
              </button>

              {/* Animated Success Icon */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <motion.div 
                  animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="w-24 h-24 bg-gradient-to-tr from-indigo-50 to-purple-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto shadow-inner"
                >
                  <FaGlassCheers />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">Awesome! 🙌</h2>
                <p className="text-slate-500 text-sm mb-10 leading-relaxed px-4">
                  ধন্যবাদ, <span className="text-indigo-600 font-bold">শুভ্র হাসান</span>! আমরা আপনার ইমেইলটি পেয়েছি। শীঘ্রই আপনার সাথে যোগাযোগ হবে।
                </p>
              </motion.div>

              <motion.button 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsOpen(false)}
                className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[4px] shadow-2xl shadow-slate-200"
              >
                Continue
              </motion.button>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest"
              >
                <FaCheckCircle className="animate-bounce" /> Verified Subscription
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailSubscription;