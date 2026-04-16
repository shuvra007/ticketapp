import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdPeople } from 'react-icons/md';

const AdminLayout = () => {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-[#070b14] text-slate-300 font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-[#0f172a] border-r border-white/5 flex flex-col hidden md:flex min-h-screen sticky top-0">
                <div className="p-8 border-b border-white/5">
                    <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Admin Portal</h2>
                </div>
                <div className="flex-1 py-6 px-4 space-y-2 relative">
                    <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname === '/admin' ? 'bg-emerald-500/20 text-emerald-400 shadow-[inset_0_0_10px_rgba(52,211,153,0.1)]' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}>
                        <MdDashboard className="text-lg" /> Dashboard
                    </Link>
                    <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname.includes('/admin/users') ? 'bg-emerald-500/20 text-emerald-400 shadow-[inset_0_0_10px_rgba(52,211,153,0.1)]' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}>
                        <MdPeople className="text-lg" /> User Management
                    </Link>
                </div>
            </div>

            {/* Main Content View Container */}
            <div className="flex-1 overflow-x-hidden flex flex-col">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
