import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../autoapi';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.error("Invalid access. Please register first.");
            navigate('/register');
        }
    }, [email, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) return toast.warn("Please enter a valid 6-digit OTP");

        setIsLoading(true);
        try {
            const response = await api.post('/auth/verify-otp', { email, otp });
            toast.success(response.data.msg || "Verification Successful!");
            
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            toast.error(err.response?.data?.msg || "Invalid OTP or Expired!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white font-sans p-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-2xl shadow-blue-50 text-center"
            >
                <div className="mb-8">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                        📩
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Verify Email</h2>
                    <p className="text-gray-500 text-sm px-4">
                        We've sent a 6-digit code to <br />
                        <span className="font-bold text-gray-800">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <input 
                        type="text" 
                        maxLength="6"
                        placeholder="000000"
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl text-center text-3xl font-black tracking-[1rem] focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-200"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                    />

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        className={`w-full p-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${
                            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                        }`}
                    >
                        {isLoading ? 'Verifying...' : 'Verify Now'}
                    </motion.button>
                </form>

                <div className="mt-8">
                    <button 
                        onClick={() => navigate('/register')}
                        className="text-sm text-gray-400 hover:text-blue-600 transition-all underline underline-offset-4"
                    >
                        Change Email or Register Again
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyOtp;