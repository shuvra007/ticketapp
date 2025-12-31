import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import Navbar from './components/Navbar'; 
import Home from './pages/Home';      
import BusTicket from './pages/BusTicket';
const App = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar /> 
                <ToastContainer position="top-right" autoClose={3000} />
                
                <Routes>
                    <Route 
                        path="/register" 
                        element={!user ? <Register /> : <Navigate to="/todos" />} 
                    />
                    <Route path="/" element={<Home />} />
                    <Route 
                        path="/login" 
                        element={!user ? <Login /> : <Navigate to="/todos" />} 
                    />
                    <Route path="/bus-tickets" element={<BusTicket />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-otp" element={<VerifyOtp />} /> 

                  
                    <Route 
                        path="/profile" 
                        element={user ? <Profile /> : <Navigate to="/login" />} 
                    />

                   
                </Routes>
            </div>
        </Router>
    );
};

export default App;