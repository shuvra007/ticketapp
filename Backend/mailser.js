const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, otp, userName, type) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS 
        }
    });

    // টাইপ অনুযায়ী মেসেজ এবং কালার সেট করা
    let primaryColor = "#4F46E5"; // Default Indigo
    let secondaryMessage = "";
    let actionContent = "";

    if (type === 'verify') {
        primaryColor = "#10B981"; // Green for Success/Verify
        secondaryMessage = "Thank you for registering! Please use the OTP below to verify your account.";
        actionContent = `
            <div style="background: #F0FDF4; border: 1px solid #BBF7D0; padding: 20px; text-align: center; font-size: 30px; font-weight: bold; letter-spacing: 8px; color: #166534; border-radius: 12px; margin: 20px 0;">
                ${otp}
            </div>`;
    } else if (type === 'reset') {
        primaryColor = "#EF4444"; // Red for Reset/Security
        secondaryMessage = "We received a request to reset your password. Use the secure OTP below to proceed:";
        actionContent = `
            <div style="background: #FEF2F2; border: 1px solid #FECACA; padding: 20px; text-align: center; font-size: 30px; font-weight: bold; letter-spacing: 8px; color: #991B1B; border-radius: 12px; margin: 20px 0;">
                ${otp}
            </div>`;
    } else if (type === 'notify') {
        primaryColor = "#3B82F6"; 
        secondaryMessage = "You have an upcoming task that needs your attention.";
        actionContent = `
            <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 15px; color: #1E40AF; text-align: left; font-size: 16px; margin: 20px 0;">
                <strong>Quest Alert:</strong> ${subject.replace('⏰ Task Reminder: ', '')} <br/>
                <small style="color: #60a5fa;">Don't forget to complete your mission!</small>
            </div>`;
    }
    else if (type === 'booking') {
        primaryColor = "#4F46E5"; // Indigo for Booking
        secondaryMessage = "Great news! Your bus seat reservation has been confirmed. Below are your journey details:";
        
        // otp প্যারামিটারটি এখানে আপনার বুকিং অবজেক্ট (data) হিসেবে কাজ করবে
        const { busId, seatIds, journeyDate, from, to, totalAmount } = otp; 
        
        actionContent = `
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 25px; border-radius: 16px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: bold;">BUS ID</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1e293b;">${busId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: bold;">ROUTE</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1e293b;">${from} to ${to}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: bold;">DATE</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1e293b;">${journeyDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: bold;">SEATS</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #4F46E5;">${seatIds.join(", ")}</td>
                    </tr>
                    <tr style="border-top: 1px dashed #cbd5e1;">
                        <td style="padding: 15px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 800;">TOTAL PAID</td>
                        <td style="padding: 15px 0 0 0; text-align: right; font-size: 20px; font-weight: 800; color: #10B981;">৳${totalAmount}</td>
                    </tr>
                </table>
            </div>`;
    }

    const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: ${primaryColor}; padding: 25px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">TodoApp Support</h1>
        </div>
        
        <div style="padding: 30px;">
            <h2 style="color: #111827; margin-top: 0;">Hello ${userName},</h2>
            <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
                ${secondaryMessage}
            </p>

            ${actionContent}

            <p style="color: #6B7280; font-size: 14px;">
                This request was generated on ${new Date().toLocaleString()}. If you didn't request this, please ignore this email.
            </p>
        </div>

        <div style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">&copy; 2025 TodoApp. Built with ❤️ by শুভ্র হাসান.</p>
        </div>
    </div>`;

    await transporter.sendMail({
        from: `"TodoApp" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: htmlContent
    });
};

module.exports = sendEmail;