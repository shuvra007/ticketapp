import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = '/login';
    };

    // 🟢 Cloudinary আপডেট: লিংক চেক করার লজিকটি একবার লিখে সব জায়গায় ব্যবহার করা হলো
    const profileImage = user?.user?.profilePic
        ? (user.user.profilePic.startsWith('http')
            ? user.user.profilePic
            : `https://ticketapp-od6i.onrender.com/uploads/${user.user.profilePic}`)
        : 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

    // Framer Motion Variants
    const drawerVariants = {
        hidden: { x: '-100%', opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
        exit: {
            x: '-100%',
            opacity: 0,
            transition: { ease: 'easeInOut', duration: 0.3 }
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    // 🌟 কমন লিঙ্কগুলো (ডেস্কটপ ও মোবাইলের জন্য বাংলা)
    const NavLinks = ({ onClick = () => { } }) => {
        if (user?.user?.role === 'admin') {
            return (
                <>
                    <Link to="/admin" onClick={onClick} className="flex items-center space-x-2 p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-medium transition-colors">
                        <span className="text-xl">📊</span><span>Admin Dashboard</span>
                    </Link>
                    {/* The Validation tool is part of Dashboard natively so we route to /admin directly or anchor it */}
                    <Link to="/admin" onClick={onClick} className="flex items-center space-x-2 p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-medium transition-colors">
                        <span className="text-xl">🔍</span><span>Validate Ticket</span>
                    </Link>
                    <Link to="/admin" onClick={onClick} className="flex items-center space-x-2 p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-medium transition-colors">
                        <span className="text-xl">📈</span><span>Revenue Stats</span>
                    </Link>
                </>
            );
        }

        return (
            <>
                <Link to="/bus-tickets" onClick={onClick} className="flex items-center space-x-2 p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-medium transition-colors">
                    <span className="text-xl">🚌</span><span>বাস টিকেট</span>
                </Link>
                <Link to="/train-tickets" onClick={onClick} className="flex items-center space-x-2 p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-medium transition-colors">
                    <span className="text-xl">🚆</span><span>ট্রেন টিকেট</span>
                </Link>
                {user?.user && (
                    <Link to="/my-tickets" onClick={onClick} className="flex items-center space-x-2 p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-bold transition-colors">
                        <span className="text-xl">🎫</span><span>আমার টিকেট</span>
                    </Link>
                )}
            </>
        );
    };

    return (
        <>
            {/* Main Navbar */}
            <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">

                        {/* 1. Logo & Mobile Hamburger */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsOpen(true)}
                                className="md:hidden mr-3 p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                            <Link to="/" className="text-2xl font-black text-indigo-600 tracking-tighter flex items-center">
                                <span className="text-gray-800">E-Ticket Booking</span>
                            </Link>
                        </div>

                        {/* 2. Desktop Navigation Links */}
                        <div className="hidden md:flex items-center space-x-4">
                            <NavLinks />
                        </div>

                        {/* 3. User Actions (Desktop) */}
                        <div className="hidden md:flex items-center space-x-5">
                            {user?.user ? (
                                <div className="flex items-center space-x-4 border-l pl-5">
                                    <Link to="/profile" className="flex items-center space-x-2 group">
                                        <img
                                            src={profileImage}
                                            className="w-9 h-9 rounded-full border-2 border-indigo-500 object-cover"
                                            alt="Profile"
                                        />
                                        <span className="font-semibold text-gray-700 group-hover:text-indigo-600">{user?.user?.name}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-500 text-sm font-bold hover:bg-red-50 px-3 py-1 rounded-lg transition"
                                    >
                                        লগআউট
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="text-gray-600 font-semibold hover:text-indigo-600">লগইন</Link>
                                    <Link to="/register" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition transform hover:scale-105">
                                        যুক্ত হোন
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Profile Icon (Shortcut) */}
                        {!user?.user && (
                            <Link to="/login" className="md:hidden text-indigo-600 font-bold text-sm">লগইন</Link>
                        )}
                        {user?.user && (
                            <Link to="/profile" className="md:hidden">
                                <img
                                    src={profileImage}
                                    className="w-8 h-8 rounded-full border border-indigo-500 object-cover"
                                    alt="User"
                                />
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* --- Framer Motion Drawer --- */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Background Overlay */}
                        <motion.div
                            variants={overlayVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50]"
                        />

                        {/* Left Side Drawer */}
                        <motion.div
                            variants={drawerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed top-0 left-0 h-full w-[300px] bg-white z-[60] shadow-2xl flex flex-col"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold italic tracking-tight">E-Ticket</h2>
                                    <p className="text-[10px] opacity-80 uppercase tracking-widest">Travel Made Easy</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                                >
                                    <span className="text-2xl">&times;</span>
                                </button>
                            </div>

                            {/* Drawer Body */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {user?.user && (
                                    <div className="mb-6 p-4 bg-gray-50 rounded-2xl flex items-center space-x-3 border border-gray-100">
                                        <img
                                            src={profileImage}
                                            className="w-12 h-12 rounded-full border-2 border-indigo-100 object-cover"
                                            alt="User"
                                        />
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-gray-800 truncate">{user?.user?.name}</p>
                                            <p className="text-xs text-indigo-600 font-medium">Verified Passenger</p>
                                        </div>
                                    </div>
                                )}

                                <nav className="space-y-2 flex flex-col">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">মেনু</p>
                                    <NavLinks onClick={() => setIsOpen(false)} />

                                    <hr className="my-4 border-gray-100" />

                                    {user?.user && (
                                        <>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">অ্যাকাউন্ট সেটিংস</p>

                                            <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-50 rounded-xl transition">
                                                <span className="text-xl">👤</span> <span>আমার প্রোফাইল</span>
                                            </Link>

                                        </>
                                    )}
                                </nav>
                            </div>

                            {/* Drawer Footer */}
                            <div className="p-4 border-t border-gray-100">
                                {user?.user ? (
                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-3.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all duration-300"
                                    >
                                        লগআউট
                                    </button>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link to="/login" onClick={() => setIsOpen(false)} className="py-3 text-center border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50">লগইন</Link>
                                        <Link to="/register" onClick={() => setIsOpen(false)} className="py-3 text-center bg-indigo-600 text-white rounded-xl font-bold shadow-sm hover:bg-indigo-700">যুক্ত হোন</Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;