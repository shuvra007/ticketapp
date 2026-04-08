const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, otp, userName, type) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS 
        }
    });

    // 🌟 মডার্ন থিমের জন্য কালার প্যালেট
    let primaryColor = "#4F46E5"; // Default Indigo
    let secondaryMessage = "";
    let actionContent = "";
    let appName = "E-Ticket Booking"; // অ্যাপের নতুন নাম

    if (type === 'verify') {
        primaryColor = "#10B981"; // Emerald Green for Success
        secondaryMessage = "Welcome to the future of travel! Please use the secure code below to authenticate your account.";
        actionContent = `
            <div style="background: #022c22; border: 1px solid #10b981; padding: 25px; text-align: center; border-radius: 16px; margin: 25px 0; box-shadow: 0 10px 25px rgba(16,185,129,0.1);">
                <p style="margin: 0 0 10px 0; color: #a7f3d0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Your Verification Code</p>
                <div style="font-size: 36px; font-weight: 900; letter-spacing: 12px; color: #34d399; font-family: 'Courier New', monospace;">
                    ${otp}
                </div>
            </div>`;
    } else if (type === 'reset') {
        primaryColor = "#F43F5E"; // Rose Red for Security
        secondaryMessage = "We received a security request to reset your password. Use the one-time code below to proceed securely:";
        actionContent = `
            <div style="background: #fff1f2; border: 1px dashed #fda4af; padding: 25px; text-align: center; border-radius: 16px; margin: 25px 0;">
                <p style="margin: 0 0 10px 0; color: #fb7185; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Secure Reset Code</p>
                <div style="font-size: 36px; font-weight: 900; letter-spacing: 12px; color: #e11d48; font-family: 'Courier New', monospace;">
                    ${otp}
                </div>
            </div>`;
    } else if (type === 'notify') {
        primaryColor = "#3B82F6"; // Blue
        secondaryMessage = "You have an upcoming journey or important update that needs your attention.";
        actionContent = `
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%); border-left: 4px solid #3b82f6; padding: 20px; border-radius: 0 12px 12px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.02); margin: 25px 0;">
                <div style="color: #1e40af; font-size: 18px; font-weight: bold; margin-bottom: 8px;">
                    📢 System Alert
                </div>
                <div style="color: #3b82f6; font-size: 15px;">
                    ${subject.replace('⏰ Task Reminder: ', '')}
                </div>
            </div>`;
    }
    else if (type === 'booking') {
        primaryColor = "#0f172a"; // Dark Slate for Premium Ticket
        secondaryMessage = "Your digital boarding pass is ready! Your reservation has been securely confirmed. Have a safe journey.";
        
        const { busId, seatIds, journeyDate, from, to, totalAmount } = otp; 
        
        actionContent = `
            <div style="background: #0f172a; padding: 30px; border-radius: 20px; margin: 30px 0; box-shadow: 0 20px 40px rgba(0,0,0,0.15); border: 1px solid #334155; color: #ffffff;">
                
                <div style="border-bottom: 1px dashed #475569; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between;">
                    <div style="color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">E-Ticket Reference</div>
                    <div style="color: #38bdf8; font-weight: 900; font-family: monospace; font-size: 14px;">#${busId.substring(0,8).toUpperCase()}</div>
                </div>

                <table style="width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif;">
                    <tr>
                        <td style="padding: 10px 0; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; width: 40%;">Route</td>
                        <td style="padding: 10px 0; text-align: right; font-weight: 900; color: #f8fafc; font-size: 16px;">${from.substring(0,3).toUpperCase()} &rarr; ${to.substring(0,3).toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Date</td>
                        <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #e2e8f0; font-size: 14px;">${new Date(journeyDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Seats/Berth</td>
                        <td style="padding: 10px 0; text-align: right; font-weight: 900; color: #34d399; font-size: 18px; letter-spacing: 1px;">${seatIds.join(", ")}</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 20px 0 0 0;">
                            <div style="background: #1e293b; border-radius: 12px; padding: 15px; text-align: center; margin-top: 10px;">
                                <span style="color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 5px;">Total Transaction</span>
                                <span style="color: #38bdf8; font-size: 24px; font-weight: 900;">৳ ${totalAmount}</span>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>`;
    }

    // 🌟 Master HTML Wrapper (Modern & Clean)
    const htmlContent = `
    <div style="background-color: #f8fafc; padding: 40px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.05);">
            
            <div style="background: ${primaryColor}; padding: 35px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 1px;">${appName}</h1>
                <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">Next-Gen Travel Solutions</p>
            </div>
            
            <div style="padding: 40px 35px;">
                <h2 style="color: #0f172a; margin: 0 0 15px 0; font-size: 22px; font-weight: 800;">Hello ${userName},</h2>
                <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0;">
                    ${secondaryMessage}
                </p>

                ${actionContent}

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">
                        This automated security message was generated on <strong style="color: #64748b;">${new Date().toLocaleString()}</strong>. If you did not initiate this request, please contact support immediately.
                    </p>
                </div>
            </div>

            <div style="background-color: #0f172a; padding: 25px; text-align: center;">
                <p style="color: #64748b; font-size: 12px; margin: 0; font-weight: bold; letter-spacing: 1px;">
                    &copy; 2026 ${appName}. Built with 🩵 by শুভ্র হাসান.
                </p>
            </div>
            
        </div>
    </div>`;

    await transporter.sendMail({
        from: `"${appName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: htmlContent
    });
};

module.exports = sendEmail;