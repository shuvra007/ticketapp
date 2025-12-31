import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../autoapi';
import banner from "../../public/register.jpg"
import { Link, useNavigate } from 'react-router-dom';
const Register = () => {
        const [formData, setFormData] = useState({ name: '', email: '', password: '' });
        const [imagePreview, setImagePreview] = useState(null);
        const [file, setFile] = useState(null); 
        const navigate = useNavigate();
    
        const handleImageChange = (e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
                setFile(selectedFile); 
                setImagePreview(URL.createObjectURL(selectedFile));
            }
        };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            
            if (!file) return toast.warn("Please upload a profile picture!");
    
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('profilePic', file); 
    
            try {
                const response = await api.post('/auth/register', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success(response.data.msg);
                navigate('/verify-otp', { state: { email: formData.email } });
            } catch (err) {
                toast.error(err.response?.data?.msg || "Failed!");
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
                    alt="Banner" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Visual Depth Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 to-transparent"></div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-5/12 flex items-center justify-center p-8 md:p-16 bg-white z-10"
            >
                <div className="w-full max-w-md">
                    <div className="mb-8 text-left">
                        <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Sign Up</h2>
                        <p className="text-gray-500">Create your account to organize your tasks.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        <div className="flex justify-start mb-6">
                            <label className="relative cursor-pointer group">
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-[1.8rem] overflow-hidden flex items-center justify-center bg-gray-50 group-hover:border-blue-500 transition-all shadow-sm"
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <span className="text-xl block">📷</span>
                                            <span className="text-[10px] uppercase font-bold">Add Photo</span>
                                        </div>
                                    )}
                                </motion.div>
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>

                        <div className="space-y-4">
                            <input 
                                type="text" placeholder="Full Name" required
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            <input 
                                type="email" placeholder="Your email" required
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                            <input 
                                type="password" placeholder="Password" required
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-2"
                        >
                            Sign Up
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-gray-50">
                        <p className="text-gray-600">
                            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline ml-1">Log In</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;