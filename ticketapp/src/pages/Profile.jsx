import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../autoapi';
import { updateUser } from '../store/authSlice';
import { toast } from 'react-toastify'; 

// পুরনো ছবির জন্য এটি রাখা হলো, তবে Cloudinary এর ক্ষেত্রে এটি আর কাজে লাগবে না
const PF = "http://localhost:5000/uploads/";

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    // Local States
    const [name, setName] = useState(user?.user?.name || "");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.user) {
            setName(user.user.name);
            
            // 🟢 Cloudinary আপডেট: লিংকটি http দিয়ে শুরু হলে সরাসরি দেখাবে, নাহলে আগের লোকাল ফোল্ডার খুঁজবে
            const profileImage = user.user.profilePic;
            setPreview(profileImage 
                ? (profileImage.startsWith('http') ? profileImage : `${PF}${profileImage}`) 
                : 'https://cdn-icons-png.flaticon.com/512/149/149071.png');
        }
    }, [user]);

    // Handle Image Selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile)); // ব্রাউজারে ইনস্ট্যান্ট প্রিভিউ
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        if (file) {
            formData.append("profilePic", file);
        }

        try {
            const res = await api.put(`/auth/update-profile`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                const updatedUserData = {
                    ...user, 
                    user: res.data.user 
                };

                dispatch(updateUser(updatedUserData));
                localStorage.setItem('user', JSON.stringify(updatedUserData));

                toast.success("Profile Updated Successfully! ✅", {
                });            }
        } catch (err) {
            console.error("Update Error:", err);
            alert(err.response?.data?.msg || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Header Background */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                </div>
                
                <div className="px-8 pb-10">
                    {/* Profile Picture with Upload Icon */}
                    <div className="relative -mt-16 mb-8 flex justify-center">
                        <div className="relative group">
                            <img 
                                src={preview} 
                                alt="Profile" 
                                className="w-36 h-36 rounded-full border-4 border-white shadow-2xl object-cover bg-gray-100 transition-transform duration-300 group-hover:scale-105" 
                            />
                            <label className="absolute bottom-1 right-2 bg-indigo-500 p-2.5 rounded-full cursor-pointer shadow-lg hover:bg-indigo-600 transition-all transform hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                        </div>
                    </div>
                    
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-800">{user?.user?.name}</h2>
                        <p className="text-gray-500 font-medium italic">{user?.user?.email}</p>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-7">
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Full Name</label>
                            <input 
                                type="text"
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:bg-white outline-none transition-all shadow-sm"
                                placeholder="Edit your name"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all transform active:scale-95 ${
                                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:-translate-y-1'
                            }`}
                        >
                            {loading ? 'Updating...' : 'Save All Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;