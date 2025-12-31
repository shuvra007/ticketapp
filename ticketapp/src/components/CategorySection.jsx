import React from 'react';
import { motion } from 'framer-motion';
import { FaBus, FaPlane, FaTrain, FaShip, FaCarSide, FaMotorcycle } from 'react-icons/fa';

const categories = [
  { id: 1, name: 'বাস টিকেট', icon: <FaBus />, count: '৪৫০+ রুট', color: 'from-blue-500 to-indigo-600' },
  { id: 2, name: 'ফ্লাইট টিকেট', icon: <FaPlane />, count: '১২০+ এয়ারলাইন্স', color: 'from-cyan-500 to-blue-500' },
  { id: 3, name: 'ট্রেন টিকেট', icon: <FaTrain />, count: 'সকল আন্তঃনগর', color: 'from-emerald-500 to-teal-600' },
  { id: 4, name: 'লঞ্চ টিকেট', icon: <FaShip />, count: '৮০+ লঞ্চ', color: 'from-rose-500 to-red-600' },
  { id: 5, name: 'প্রাইভেট কার', icon: <FaCarSide />, count: '২৪/৭ সার্ভিস', color: 'from-amber-500 to-orange-600' },
  { id: 6, name: 'বাইক শেয়ার', icon: <FaMotorcycle />, count: 'দ্রুত গন্তব্য', color: 'from-purple-500 to-fuchsia-600' },
];

// এনিমেশন ভেরিয়েন্ট
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const CategorySection = () => {
  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-gray-800 mb-4"
          >
            টিকেটের <span className="text-indigo-600">ক্যাটাগরি</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-gray-500 max-w-xl mx-auto font-medium"
          >
            আপনার পছন্দের বাহনটি বেছে নিন এবং যাত্রা শুরু করুন আমাদের বিশ্বস্ত সার্ভিসের সাথে।
          </motion.p>
        </div>

        {/* Categories Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {categories.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 10,
                boxShadow: "0px 20px 40px rgba(0,0,0,0.1)" 
              }}
              className="relative group cursor-pointer bg-white p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center justify-center transition-all duration-300"
            >
              {/* Animated Background Blur on Hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${item.color} rounded-[2rem] transition-opacity`} />

              {/* Icon Container */}
              <div className={`text-4xl mb-4 p-4 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                {item.icon}
              </div>

              {/* Category Info */}
              <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
              <p className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                {item.count}
              </p>

              {/* Decorative "Spark" effect on Hover */}
              <motion.div 
                className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full blur-xl opacity-0 group-hover:opacity-50"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;