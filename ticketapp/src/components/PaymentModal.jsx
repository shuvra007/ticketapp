import React, { useState, useEffect } from 'react';
import api from '../autoapi';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentModal = ({ isOpen, onClose, bookingData, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data?.status === 'PAYMENT_SUCCESS') {
                onSuccess(event.data.tranId);
            } else if (event.data?.status === 'PAYMENT_FAIL' || event.data?.status === 'PAYMENT_CANCEL') {
                toast.error("Payment was cancelled or failed at the gateway.");
                setLoading(false);
            }
        };
        // Listen for communication from the popup window
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onSuccess]);

    if (!isOpen) return null;

    const handlePay = async () => {
        setLoading(true);
        try {
            // Overriding dummy check from deprecated backend mockup securely
            const payload = { ...bookingData, paymentDetails: { cardNumber: 'popup', expiry: 'ext', cvv: '123' } };
            const { data } = await api.post('/bookings/book-seats', payload);

            if (data.url) {
                // Open SSLCommerz page as a centered popup!
                const width = 600;
                const height = 700;
                const left = (window.screen.width / 2) - (width / 2);
                const top = (window.screen.height / 2) - (height / 2);
                window.open(data.url, 'SSLCommerzPayment', `width=${width},height=${height},top=${top},left=${left}`);
            }
        } catch (err) {
            toast.error("Failed to initialize secure payment gateway");
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-[#0f172a] rounded-3xl max-w-md w-full border border-emerald-500/20 shadow-2xl overflow-hidden text-slate-300">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-center shadow-lg relative">
                        <h2 className="text-xl font-black text-white uppercase tracking-widest">Confirm Payment</h2>
                    </div>
                    <div className="p-8 space-y-4">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-400">Route</span>
                            <span className="font-bold text-white uppercase">{bookingData.from} ➔ {bookingData.to}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-400">Date</span>
                            <span className="font-bold text-white">{bookingData.journeyDate}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-400">Seats</span>
                            <span className="font-bold text-emerald-400 text-lg">{bookingData.seatIds.join(', ')}</span>
                        </div>
                        <div className="flex justify-between pt-2 items-center">
                            <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Total Payable Amount</span>
                            <span className="text-4xl font-black text-white">৳ {bookingData.totalAmount}</span>
                        </div>

                        <div className="pt-8 flex gap-4">
                            <button onClick={onClose} disabled={loading} className="flex-1 bg-[#1e293b] text-white rounded-xl py-4 font-bold hover:bg-slate-700 transition-colors uppercase tracking-widest text-xs disabled:opacity-50">Cancel</button>
                            <button onClick={handlePay} disabled={loading} className="flex-1 bg-emerald-500 shadow-emerald-500/20 shadow-lg text-white rounded-xl py-4 font-black hover:bg-emerald-400 transition-colors uppercase tracking-widest text-xs disabled:opacity-50">
                                {loading ? "Processing..." : "Pay Now"}
                            </button>
                        </div>
                        <div className="text-center pt-4">
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Secured Seamlessly by SSLCommerz</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PaymentModal;
