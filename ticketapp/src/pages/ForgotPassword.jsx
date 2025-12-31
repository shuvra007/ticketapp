import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../autoapi';
import { useNavigate, Link } from 'react-router-dom';
import banner from "../../public/reset.webp"

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            toast.success("OTP sent to your email!");
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.msg || "User not found!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            toast.success("Password Changed Successfully!");
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            toast.error(err.response?.data?.msg || "Invalid OTP or request failed!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans overflow-hidden">
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
                className="hidden lg:block lg:w-7/12 relative"
            >
                <img 
                    src={banner} 
                    alt="Forgot Password Banner" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-transparent"></div>
            </motion.div>

            {/* Right Side: Form Section */}
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-5/12 flex items-center justify-center p-8 md:p-16 bg-white z-10"
            >
                <div className="w-full max-w-md">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            // Step 1: Email Input
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="mb-10 text-left">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">🔑</div>
                                    <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Forgot Password</h2>
                                    <p className="text-gray-500">Enter your email to receive a 6-digit verification code.</p>
                                </div>

                                <form onSubmit={handleSendOTP} className="space-y-6">
                                    <div className="group">
                                        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Email Address</label>
                                        <input 
                                            type="email" placeholder="example@mail.com" required
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <motion.button 
                                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                                        disabled={isLoading}
                                        className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                                    >
                                        {isLoading ? "Sending..." : "Send OTP"}
                                    </motion.button>
                                </form>
                            </motion.div>
                        ) : (
                            // Step 2: OTP & New Password
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="mb-10 text-left">
                                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-2xl mb-6">🛡️</div>
                                    <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Set New Password</h2>
                                    <p className="text-gray-500">OTP sent to <span className="font-bold text-gray-800">{email}</span></p>
                                </div>

                                <form onSubmit={handleReset} className="space-y-4">
                                    <input 
                                        type="text" placeholder="Enter 6-digit OTP" required
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center tracking-widest font-bold"
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                    <input 
                                        type="password" placeholder="New Password" required
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <motion.button 
                                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                                        disabled={isLoading}
                                        className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-100 hover:bg-green-700 transition-all"
                                    >
                                        {isLoading ? "Updating..." : "Update Password"}
                                    </motion.button>
                                    <button 
                                        type="button" onClick={() => setStep(1)}
                                        className="w-full text-sm text-gray-400 mt-2 hover:text-gray-600"
                                    >
                                        Back to Email
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-10 text-center pt-6 border-t border-gray-50">
                        <p className="text-gray-600">
                            Remember password? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;