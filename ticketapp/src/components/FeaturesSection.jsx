import React from 'react';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaShieldAlt, FaHeadset, FaMobileAlt, FaDollarSign, FaBusAlt } from 'react-icons/fa'; // React Icons ব্যবহার করা হয়েছে

const features = [
  {
    id: 1,
    icon: <FaTicketAlt />,
    title: 'দ্রুত টিকেট বুকিং',
    description: 'মাত্র কয়েকটি ক্লিকেই আপনার পছন্দের সিটটি বুক করুন। সহজ এবং দ্রুত প্রক্রিয়া।',
    color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    animation: {
      initial: { y: 50, opacity: 0, rotateX: 30 },
      animate: { y: 0, opacity: 1, rotateX: 0 },
      hover: { y: -10, rotate: 5 }
    }
  },
  {
    id: 2,
    icon: <FaShieldAlt />,
    title: 'নিরাপদ পেমেন্ট গেটওয়ে',
    description: 'আপনার পেমেন্ট সুরক্ষিত রাখতে আমরা অত্যাধুনিক এনক্রিপশন ব্যবহার করি।',
    color: 'bg-gradient-to-br from-green-500 to-emerald-600',
    animation: {
      initial: { x: -50, opacity: 0, rotateY: 30 },
      animate: { x: 0, opacity: 1, rotateY: 0 },
      hover: { scale: 1.05, rotateZ: -5 }
    }
  },
  {
    id: 3,
    icon: <FaHeadset />,
    title: '২৪/৭ সাপোর্ট',
    description: 'যেকোনো প্রয়োজনে আমাদের সাপোর্ট টিম সবসময় আপনার পাশে আছে।',
    color: 'bg-gradient-to-br from-red-500 to-orange-600',
    animation: {
      initial: { y: 50, opacity: 0, scale: 0.8 },
      animate: { y: 0, opacity: 1, scale: 1 },
      hover: { y: -15, scale: 1.08 }
    }
  },
  {
    id: 4,
    icon: <FaMobileAlt />,
    title: 'মোবাইল ফ্রেন্ডলি অ্যাপ',
    description: 'আপনার মোবাইল থেকেই সহজে বুকিং, ট্র্যাকিং এবং ম্যানেজ করুন।',
    color: 'bg-gradient-to-br from-yellow-500 to-amber-600',
    animation: {
      initial: { x: 50, opacity: 0, rotateZ: 30 },
      animate: { x: 0, opacity: 1, rotateZ: 0 },
      hover: { rotate: 10, scale: 1.05 }
    }
  },
  {
    id: 5,
    icon: <FaDollarSign />,
    title: 'সেরা দামে টিকেট',
    description: 'প্রতিযোগিতামূলক মূল্যে সেরা টিকেট অফার, যা আপনার বাজেট বাঁচায়।',
    color: 'bg-gradient-to-br from-sky-500 to-blue-600',
    animation: {
      initial: { y: 50, opacity: 0, rotateX: -30 },
      animate: { y: 0, opacity: 1, rotateX: 0 },
      hover: { rotateY: 15, scale: 1.05 }
    }
  },
  {
    id: 6,
    icon: <FaBusAlt />,
    title: 'বিশাল রুটের কাভারেজ',
    description: 'দেশজুড়ে বিস্তৃত রুটের কাভারেজ, আপনার পছন্দের গন্তব্যে পৌঁছান।',
    color: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
    animation: {
      initial: { x: -50, opacity: 0, rotateZ: -30 },
      animate: { x: 0, opacity: 1, rotateZ: 0 },
      hover: { x: -10, rotate: -5 }
    }
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-4xl md:text-6xl font-black text-gray-800 leading-tight mb-4"
          >
            কেন <span className="text-indigo-600">আমাদের</span> বেছে নেবেন?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto font-medium"
          >
            আপনার প্রতিটি ভ্রমণকে আরও সহজ, নিরাপদ এবং আনন্দদায়ক করতে আমরা প্রতিশ্রুতিবদ্ধ।
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={feature.animation.initial}
              whileInView={feature.animation.animate}
              whileHover={feature.animation.hover}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                type: 'spring', 
                stiffness: 120, 
                damping: 15, 
                delay: index * 0.1 
              }}
              className="relative group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 transition-all duration-300 overflow-hidden"
            >
              <div className={`text-5xl text-white ${feature.color} p-5 rounded-full inline-block mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">
                {feature.description}
              </p>

              {/* Decorative Pulse/Bubble Effect on Hover */}
              <motion.div 
                className="absolute -bottom-10 -right-10 w-24 h-24 bg-indigo-200 opacity-0 group-hover:opacity-20 rounded-full blur-2xl transition-opacity duration-500"
                animate={feature.animation.hover} // Use a subtle animation for this too
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;