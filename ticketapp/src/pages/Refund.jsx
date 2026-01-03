import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBoxOpen, FaClock, FaHeartBroken, FaWallet, 
  FaCreditCard, FaCheckCircle, FaChevronRight, FaInfoCircle 
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RefundJourney = () => {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState(null);
  const [method, setMethod] = useState('wallet');

  const reasons = [
    { id: 1, title: 'Damaged Product', icon: <FaHeartBroken />, desc: 'Item arrived broken or faulty' },
    { id: 2, title: 'Late Delivery', icon: <FaClock />, desc: 'The product arrived past the deadline' },
    { id: 3, title: 'Changed Mind', icon: <FaBoxOpen />, desc: 'I no longer need this item' },
  ];

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Animations variants
  const containerVars = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Hind_Siliguri'] py-12 px-4">
      <ToastContainer />
      <div className="max-w-2xl mx-auto">
        
        {/* Progress Tracker Visualization */}
        <div className="flex justify-between mb-12 relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0" />
          <motion.div 
            className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0" 
            initial={{ width: '0%' }}
            animate={{ width: `${(step - 1) * 50}%` }}
          />
          {[1, 2, 3].map((s) => (
            <div key={s} className="relative z-10">
              <motion.div 
                animate={{ 
                  scale: step === s ? 1.2 : 1,
                  backgroundColor: step >= s ? '#10b981' : '#e2e8f0'
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
              >
                {step > s ? <FaCheckCircle /> : s}
              </motion.div>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Reason Selection */}
          {step === 1 && (
            <motion.div key="step1" {...containerVars} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <h2 className="text-2xl font-black text-slate-800 mb-2">কেন রিফান্ড করতে চান? 🙌</h2>
              <p className="text-slate-500 mb-8">চিন্তা করবেন না, আমরা আপনাকে সাহায্য করতে এখানে আছি।</p>
              
              <div className="space-y-4">
                {reasons.map((r) => (
                  <motion.div 
                    key={r.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setReason(r)}
                    className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-5 ${
                      reason?.id === r.id ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className={`text-2xl ${reason?.id === r.id ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {r.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{r.title}</h4>
                      <p className="text-xs text-slate-500">{r.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button 
                disabled={!reason}
                onClick={nextStep}
                className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-30"
              >
                পরবর্তী ধাপ <FaChevronRight />
              </button>
            </motion.div>
          )}

          {/* Step 2: Refund Method */}
          {step === 2 && (
            <motion.div key="step2" {...containerVars} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <h2 className="text-2xl font-black text-slate-800 mb-2">টাকা কোথায় ফেরত নিতে চান? 💰</h2>
              <p className="text-slate-500 mb-8">সবচেয়ে দ্রুত এবং নিরাপদ পদ্ধতিটি বেছে নিন।</p>

              <div className="grid grid-cols-1 gap-4">
                <div 
                  onClick={() => setMethod('wallet')}
                  className={`p-6 rounded-3xl border-2 cursor-pointer relative overflow-hidden transition-all ${
                    method === 'wallet' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <FaWallet className="text-3xl text-indigo-500" />
                    <span className="bg-indigo-600 text-[10px] text-white px-2 py-1 rounded-full font-black animate-pulse">
                      RECOMMENDED (FASTEST)
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800">EasyTicket Wallet</h4>
                  <p className="text-xs text-slate-500">Instant credit after approval</p>
                </div>

                <div 
                  onClick={() => setMethod('card')}
                  className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                    method === 'card' ? 'border-slate-800 bg-slate-50' : 'border-slate-100'
                  }`}
                >
                  <FaCreditCard className="text-3xl text-slate-400 mb-4" />
                  <h4 className="font-bold text-slate-800">Original Payment Method</h4>
                  <p className="text-xs text-slate-500">Takes 5-7 working days</p>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={prevStep} className="flex-1 py-5 bg-slate-100 rounded-2xl font-bold text-slate-600">পিছনে যান</button>
                <button onClick={nextStep} className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl font-bold">নিশ্চিত করুন</button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success & Tracking */}
          {step === 3 && (
            <motion.div key="step3" {...containerVars} className="text-center">
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white mb-6">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
                >
                  <FaCheckCircle />
                </motion.div>
                <h2 className="text-3xl font-black text-slate-800 mb-2">We’ve got your request 🙌</h2>
                <p className="text-slate-500">আপনার রিফান্ড রিকোয়েস্টটি প্রসেসিং করা হচ্ছে।</p>
                
                <div className="mt-10 p-6 bg-slate-50 rounded-3xl text-left space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Order ID:</span> <span className="font-bold text-slate-700">#RUET-98231</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Refund Amount:</span> <span className="font-bold text-emerald-600">৳১২০০.০০</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Method:</span> <span className="font-bold text-slate-700 uppercase">{method}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Est. Arrival:</span> <span className="font-bold text-indigo-600">Within 24 Hours</span></div>
                </div>
              </div>

              <div className="bg-indigo-600 text-white p-6 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-indigo-700 transition-all">
                <FaInfoCircle className="text-2xl text-indigo-200" />
                <div className="text-left">
                    <p className="font-bold text-sm">কি হচ্ছে এখন?</p>
                    <p className="text-[10px] opacity-80">আমাদের টিম আপনার রিজন ভেরিফাই করছে। এরপর সাথে সাথেই টাকা চলে যাবে।</p>
                </div>
              </div>
              
              <button onClick={() => window.location.href = '/'} className="mt-8 text-slate-400 font-bold hover:text-indigo-600 underline">ব্যাক টু হোম</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RefundJourney;