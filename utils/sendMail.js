import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async (email, otp, expiresIn) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"My Node App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is ${otp}. It will expire in ${expiresIn} minutes.`,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2>Your Verification Code</h2>
                    <p style="font-size: 24px; font-weight: bold; color: #4A90E2;">${otp}</p>
                    <p>This code will expire in <b>${expiresIn} minutes</b>.</p>
                   </div>`,
        };

        // Await the promise instead of using a callback
        const info = await transporter.sendMail(mailOptions);
        
        console.log('Message sent successfully! ID:', info.messageId);
        
        return {
            success: true,
            message: "Email sent successfully"
        };

    } catch (error) {
        console.error("Error sending email:", error);
        return {
            success: false,
            message: "Failed to send email"
        };
    }
};

