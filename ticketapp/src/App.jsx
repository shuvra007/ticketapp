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
import RefundJourney from './pages/Refund';
import ContactUs from './pages/Contact';
import RulesPage from './components/Rule';
import HelpCenter from './pages/Help';
import PrivacyPolicy from './pages/Privacy';
import AboutUs from './pages/About';
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
                       <Route 
                        path="/refund" 
                        element={<RefundJourney/>} 
                    />
                    
                    <Route 
                        path="/contact" 
                        element={<ContactUs/>} 
                    />
                    <Route 
                        path="/rules" 
                        element={<RulesPage/>} 
                    />
                     <Route 
                        path="/help" 
                        element={<HelpCenter/>} 
                    />
                    <Route 
                        path="/privacy" 
                        element={<PrivacyPolicy/>} 
                    />
                    <Route 
                        path="/about" 
                        element={<AboutUs/>} 
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;