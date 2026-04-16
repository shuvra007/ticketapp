import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import banner from "../../public/login.jpg"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isLoading } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(login({ email, password })).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                toast.success(`Welcome back!`);
                const userRole = res.payload?.user?.role;
                if (userRole === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/profile');
                }
            } else {
                toast.error(res.payload || "Login failed! Please check your credentials.");
            }
        });
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
                    alt="Login Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-transparent"></div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-5/12 flex items-center justify-center p-8 md:p-16 bg-white z-10"
            >
                <div className="w-full max-w-md">
                    <div className="mb-10 text-left">
                        <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Login</h2>
                        <p className="text-gray-500">Welcome back! Please enter your details.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1 group-focus-within:text-blue-600 transition">Email Address</label>
                                <input
                                    type="email" placeholder="example@mail.com" required
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1 group-focus-within:text-blue-600 transition">Password</label>
                                <input
                                    type="password" placeholder="••••••••" required
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                Remember me
                            </label>
                            <Link to="/forgot-password" size="sm" className="text-sm font-bold text-blue-600 hover:underline">Forgot password?</Link>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            disabled={isLoading}
                            className={`w-full p-4 rounded-2xl font-bold text-lg shadow-xl transition-all mt-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                                }`}
                        >
                            {isLoading ? 'Signing In...' : 'Login'}
                        </motion.button>
                    </form>

                    <div className="mt-10 text-center pt-6 border-t border-gray-50">
                        <p className="text-gray-600">
                            Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline ml-1">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;