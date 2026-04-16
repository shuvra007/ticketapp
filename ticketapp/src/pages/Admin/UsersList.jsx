import React, { useEffect, useState } from 'react';
import api from '../../autoapi';
import { toast } from 'react-toastify';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleBan = async (userId) => {
        try {
            const { data } = await api.put(`/admin/users/${userId}/ban`);
            toast.success(data.message);
            fetchUsers();
        } catch (error) {
            toast.error("Failed to toggle ban status");
        }
    };

    const changeRole = async (userId, newRole) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            toast.success("Role updated");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to update role");
        }
    };

    if (loading) return <div className="p-10 text-white">Loading Users...</div>;

    return (
        <div className="bg-[#070b14] min-h-screen p-10 font-sans text-slate-300">
            <h2 className="text-3xl font-black text-emerald-400 mb-8">User Management</h2>
            <div className="overflow-x-auto bg-[#0f172a] rounded-3xl p-6 shadow-xl border border-white/5">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 text-slate-400 uppercase tracking-widest text-xs">
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-white">{u.name}</td>
                                <td className="p-4 text-sm">{u.email}</td>
                                <td className="p-4">
                                    <select
                                        value={u.role}
                                        onChange={(e) => changeRole(u._id, e.target.value)}
                                        className="bg-[#070b14] border border-white/10 p-2 rounded-lg text-sm outline-none text-white focus:border-emerald-500"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="moderator">Moderator</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${u.isBanned ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                        {u.isBanned ? 'Banned' : 'Active'}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => toggleBan(u._id)}
                                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-colors ${u.isBanned ? 'bg-emerald-500 text-white hover:bg-emerald-400' : 'bg-rose-500 text-white hover:bg-rose-400'}`}
                                    >
                                        {u.isBanned ? "Unban" : "Ban"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersList;
