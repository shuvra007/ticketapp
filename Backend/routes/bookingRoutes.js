const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middlewares/authMiddleware');
const sendEmail = require('../mailser');
const User = require('../models/User');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
router.get('/availability', async (req, res) => {
    try {
        const { busId, date, from, to } = req.query;
        
        // ওই নির্দিষ্ট বাসের ওই তারিখের সব বুকিং খুঁজে বের করা
        const bookings = await Booking.find({ busId, journeyDate: date, from, to });
        
        // সব বুকিং থেকে সিট আইডিগুলো একটা অ্যারেতে নেওয়া
        let bookedSeats = [];
        bookings.forEach(b => {
            bookedSeats = [...bookedSeats, ...b.seatIds];
        });

        res.json({ bookedSeats });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});
router.get('/my-tickets', protect, async (req, res) => {
    try {
        // ইউজারের আইডি দিয়ে তার সব বুকিং খুঁজে বের করা এবং লেটেস্টগুলো আগে দেখানো
        const tickets = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
        
        if (!tickets) {
            return res.status(404).json({ message: "কোনো টিকেট পাওয়া যায়নি" });
        }

        res.status(200).json({ tickets });
    } catch (err) {
        console.error("Fetch Tickets Error:", err.message);
        res.status(500).json({ message: "টিকেট ফেচ করতে সমস্যা হয়েছে", error: err.message });
    }
});
router.post('/book-seats', protect, async (req, res) => {
    console.log("User ID:", req.user.id);
    console.log("Body:", req.body);

    try {
        // ১. ফ্রন্টএন্ড থেকে route আসছে, তাই সেটিকে split করে from/to নিতে হবে অথবা সরাসরি route ব্যবহার করতে হবে।
        // আপনার ফ্রন্টএন্ড কোডে route: `${from} to ${to}` এভাবে আছে।
        const { busId, seatIds, journeyDate, route, totalAmount } = req.body;
        
        // রুট থেকে from এবং to আলাদা করা (যদি আপনার মডেলে from/to আলাদা থাকে)
        const [from, to] = route.split(' to ');

        const userId = req.user.id; // 'const' বা 'let' যোগ করতে হবে

        // ২. ডাবল বুকিং চেক করার সময় একই ফিল্ড ব্যবহার করুন
        const existingBookings = await Booking.find({ 
            busId, 
            journeyDate, 
            from, 
            to 
        });

        let alreadyBooked = [];
        existingBookings.forEach(b => {
            alreadyBooked = [...alreadyBooked, ...b.seatIds];
        });

        const isTaken = seatIds.some(id => alreadyBooked.includes(id));
        if (isTaken) {
            return res.status(400).json({ message: "দুঃখিত, এক বা একাধিক সিট ইতিমধ্যে বুক হয়ে গেছে!" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "ইউজার খুঁজে পাওয়া যায়নি!" });
        }
                const newBooking = new Booking({
            userId,
            busId,
            seatIds,
            journeyDate,
            from, 
            to,
            totalAmount,
            busType: req.body.busType || "Standard" // যদি ফ্রন্টএন্ড থেকে না আসে তবে ডিফল্ট
        });

        await newBooking.save();
    
    
        res.status(201).json({ message: "বুকিং সফল হয়েছে!", booking: newBooking });

    } catch (err) {
        console.error("Booking Error:", err.message);
        res.status(500).json({ message: "বুকিং ব্যর্থ হয়েছে", error: err.message });
    }
});

// আপনার ফাইলের একদম ওপরে এই দুটি লাইন আছে কিনা নিশ্চিত করুন:
// const puppeteer = require('puppeteer-core');
// const chromium = require('@sparticuz/chromium');

router.get('/download/:id', protect, async (req, res) => {
    let browser; // finally ব্লকে ব্রাউজার ক্লোজ করার জন্য ভেরিয়েবলটি বাইরে রাখা হলো
    
    try {
        const ticket = await Booking.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: "টিকেট পাওয়া যায়নি" });
        }

        const journeyDate = new Date(ticket.journeyDate).toLocaleDateString('en-US', { 
            day: '2-digit', month: 'long', year: 'numeric' 
        });

        // ==========================================
        // 🌟 THE PREMIUM HTML & CSS TEMPLATE (BUS VERSION)
        // ==========================================
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap');
                    @import url('https://fonts.googleapis.com/css2?family=Libre+Barcode+39+Text&display=swap');
                    
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Plus Jakarta Sans', sans-serif; 
                        background: #f1f5f9; 
                        padding: 40px; 
                        display: flex; 
                        justify-content: center; 
                    }
                    
                    /* The Main Card */
                    .ticket-card {
                        width: 850px;
                        background: #ffffff;
                        border-radius: 20px;
                        display: flex;
                        overflow: hidden;
                        box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                        border: 2px solid #e2e8f0;
                        position: relative;
                    }

                    /* Background Watermark (Bus Icon) */
                    .watermark {
                        position: absolute;
                        top: 50%; left: 40%;
                        transform: translate(-50%, -50%);
                        font-size: 250px;
                        opacity: 0.03;
                        z-index: 0;
                    }

                    /* Left Section: Main Details */
                    .main-section {
                        flex: 1;
                        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                        position: relative;
                        z-index: 1;
                    }

                    .header {
                        background: linear-gradient(90deg, #0f172a 0%, #1e293b 100%);
                        color: white;
                        padding: 20px 30px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 4px solid #fbbf24;
                    }

                    .header h1 { font-size: 24px; font-weight: 800; letter-spacing: 2px; }
                    .header p { font-size: 10px; opacity: 0.8; letter-spacing: 1px; }

                    .content { padding: 30px; }

                    .route-box {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        background: #f8fafc;
                        padding: 20px 30px;
                        border-radius: 15px;
                        border: 1px solid #e2e8f0;
                        margin-bottom: 30px;
                    }

                    .city { text-align: center; }
                    .city h2 { font-size: 36px; color: #0f172a; font-weight: 800; }
                    .city p { font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; }

                    .divider {
                        flex: 1;
                        height: 2px;
                        border-bottom: 3px dashed #4f46e5;
                        margin: 0 20px;
                        position: relative;
                    }
                    /* Bus Icon in Divider */
                    .divider::after {
                        content: '🚌';
                        position: absolute;
                        top: -16px;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 22px;
                        color: #4f46e5;
                        background: #f8fafc;
                        padding: 0 10px;
                    }

                    .grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 20px;
                        margin-bottom: 20px;
                    }

                    .info-box {
                        background: white;
                        padding: 15px;
                        border-radius: 12px;
                        border-left: 4px solid #4f46e5;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                    }
                    .info-box.gold { border-left-color: #fbbf24; }

                    .label { font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-bottom: 5px; }
                    .value { font-size: 16px; color: #0f172a; font-weight: 800; }

                    .stub-section {
                        width: 250px;
                        background: #4f46e5;
                        color: white;
                        padding: 30px;
                        display: flex;
                        flex-direction: column;
                        border-left: 3px dashed #ffffff;
                        position: relative;
                        z-index: 1;
                    }

                    .cutout-top { position: absolute; top: -15px; left: -15px; width: 30px; height: 30px; background: #f1f5f9; border-radius: 50%; }
                    .cutout-bottom { position: absolute; bottom: -15px; left: -15px; width: 30px; height: 30px; background: #f1f5f9; border-radius: 50%; }

                    .stub-header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 15px; margin-bottom: 20px; }
                    .stub-header h3 { font-size: 18px; font-weight: 800; }
                    
                    .stub-info { margin-bottom: 15px; }
                    .stub-label { font-size: 9px; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px; }
                    .stub-value { font-size: 16px; font-weight: 800; margin-top: 2px; }

                    .barcode {
                        font-family: 'Libre Barcode 39 Text', cursive;
                        font-size: 40px;
                        text-align: center;
                        margin-top: auto;
                        color: white;
                    }
                </style>
            </head>
            <body>
                <div class="ticket-card">
                    <div class="watermark">🚌</div>
                    
                    <div class="main-section">
                        <div class="header">
                            <div>
                                <h1>E-Ticket Booking</h1>
                                <p>PREMIUM BUS TICKET</p>
                            </div>
                            <div style="text-align: right;">
                                <p style="color: #fbbf24; font-weight: bold; font-size: 12px;">PREMIUM CLASS</p>
                            </div>
                        </div>

                        <div class="content">
                            <div class="route-box">
                                <div class="city">
                                    <h2>${ticket.from.substring(0,3).toUpperCase()}</h2>
                                    <p>${ticket.from}</p>
                                </div>
                                <div class="divider"></div>
                                <div class="city">
                                    <h2>${ticket.to.substring(0,3).toUpperCase()}</h2>
                                    <p>${ticket.to}</p>
                                </div>
                            </div>

                            <div class="grid">
                                <div class="info-box">
                                    <div class="label">Passenger ID</div>
                                    <div class="value">${ticket.userId.toString().substring(0,8).toUpperCase()}</div>
                                </div>
                                <div class="info-box">
                                    <div class="label">Date</div>
                                    <div class="value">${journeyDate}</div>
                                </div>
                                <div class="info-box">
                                    <div class="label">Coach Type</div>
                                    <div class="value">${ticket.busType || 'AC Coach'}</div>
                                </div>
                                <div class="info-box gold">
                                    <div class="label">Total Paid</div>
                                    <div class="value">৳ ${ticket.totalAmount}</div>
                                </div>
                            </div>

                            <div style="margin-top: 20px; padding: 15px; background: #fef2f2; border-radius: 10px; border: 1px solid #fee2e2;">
                                <p style="color: #ef4444; font-size: 11px; font-weight: 700;">
                                    ⚠️ IMPORTANT: Please arrive at the boarding counter 30 minutes before departure. Carry a valid ID matching the booking details.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="stub-section">
                        <div class="cutout-top"></div>
                        <div class="cutout-bottom"></div>

                        <div class="stub-header">
                            <h3>BUS TICKET</h3>
                            <p style="font-size: 10px; opacity: 0.8;">PASSENGER COPY</p>
                        </div>

                        <div class="stub-info">
                            <div class="stub-label">Route</div>
                            <div class="stub-value">${ticket.from.substring(0,3).toUpperCase()} ➔ ${ticket.to.substring(0,3).toUpperCase()}</div>
                        </div>

                        <div class="stub-info">
                            <div class="stub-label">Date</div>
                            <div class="stub-value" style="font-size: 14px;">${journeyDate}</div>
                        </div>

                        <div class="stub-info">
                            <div class="stub-label">Seat No(s)</div>
                            <div class="stub-value" style="color: #fbbf24; font-size: 22px;">${ticket.seatIds.join(', ')}</div>
                        </div>

                        <div class="barcode">
                            *${ticket._id.toString().substring(0, 6)}*
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        // ==========================================
        // 🌟 LAUNCH PUPPETEER (Vercel & Local Setup)
        // ==========================================
        console.log("PDF জেনারেট শুরু হচ্ছে...");

        const options = {
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        };

        // লোকাল পিসিতে চেক করার জন্য
        if (!options.executablePath) {
            options.executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        }

        browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({ 
            format: 'A4',
            landscape: true,
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });

        // 🌟 Send back to frontend
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="E-Ticket-${ticket._id}.pdf"`,
            'Content-Length': pdfBuffer.length
        });

        res.end(pdfBuffer);

    } catch (error) {
        console.error("Advanced PDF Error:", error);
        res.status(500).json({ message: "PDF জেনারেট করতে সমস্যা হয়েছে", error: error.message });
    } finally {
        // প্রসেস শেষ হলে ব্রাউজার ক্লোজ করা (খুবই গুরুত্বপূর্ণ)
        if (browser) {
            await browser.close();
        }
    }
});

router.put('/check-in/:id', protect, async (req, res) => {
    try {
        console.log("checked")
        const ticket = await Booking.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: "টিকেট পাওয়া যায়নি" });
        
        ticket.isCheckedIn = true;
        await ticket.save();
        
        res.json({ message: "Check-in successful", ticket });
    } catch (error) {
        res.status(500).json({ message: "চেক-ইন ব্যর্থ হয়েছে", error: error.message });
    }
});

module.exports = router;