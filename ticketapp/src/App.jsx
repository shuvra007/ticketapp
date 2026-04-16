import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateUser, logout } from './store/authSlice';
import api from './autoapi';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BusTicket from './pages/BusTicket';
import TrainBooking from './pages/trainTicket';
import RefundJourney from './pages/Refund';
import ContactUs from './pages/Contact';
import RulesPage from './components/Rule';
import HelpCenter from './pages/Help';
import PrivacyPolicy from './pages/Privacy';
import AboutUs from './pages/About';
import MyTickets from './pages/myticket';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminLayout from './pages/Admin/AdminLayout';
import UsersList from './pages/Admin/UsersList';

const App = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const syncUser = async () => {
            if (user?.token) {
                try {
                    const { data } = await api.get('/auth/me');
                    // Sync user role and profile exactly into redux store
                    dispatch(updateUser({ token: user.token, user: data }));
                } catch (err) {
                    if (err.response?.status === 401 || err.response?.status === 403 || err.response?.status === 404) {
                        dispatch(logout()); // Purge state actively if token expired or banned
                    }
                }
            }
        };
        syncUser();
    }, [dispatch, user?.token]);

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <ToastContainer position="top-right" autoClose={3000} />

                <Routes>
                    <Route
                        path="/register"
                        element={!user ? <Register /> : <Navigate to="/" />}
                    />
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/login"
                        element={!user ? <Login /> : (user?.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/profile" />)}
                    />
                    <Route path="/bus-tickets" element={<BusTicket />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-otp" element={<VerifyOtp />} />


                    <Route
                        path="/profile"
                        element={user ? <Profile /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/refund"
                        element={<RefundJourney />}
                    />
                    <Route
                        path="/train-tickets"
                        element={<TrainBooking />}
                    />

                    <Route
                        path="/my-tickets"
                        element={user ? <MyTickets /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/contact"
                        element={<ContactUs />}
                    />
                    <Route
                        path="/rules"
                        element={<RulesPage />}
                    />
                    <Route
                        path="/help"
                        element={<HelpCenter />}
                    />
                    <Route
                        path="/privacy"
                        element={<PrivacyPolicy />}
                    />
                    <Route
                        path="/about"
                        element={<AboutUs />}
                    />
                    {/* Nested Admin Routes */}
                    <Route
                        path="/admin"
                        element={<AdminLayout />}
                    >
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<UsersList />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
};

export default App;