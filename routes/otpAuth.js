const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const UserOTPVerification = require('../models/otVerificationModel');
const { loginOTP } = require('../controllers/authController');


// Configure nodemailer transporter
let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
        user: "OTPrielverse@gmail.com",
        pass: "ymgnaljwgigunnpm",
    },
});

router.get('/test', (req, res) => {
    res.send("OTP Sent"); 
})

// Route Handlers
router.post('/send-otp-email', async (req, res) => {
    const { email } = req.body;
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from: "otp@rielverse.com",
            to: email,
            subject: "Email Verification Code",
            html: `<p>Use this code <b>${otp}</b> to verify</p>
                   <p>This code <b>expires in 2 minutes</b></p>`,
        };

        // Hash OTP
        const saltRounds = 10;
        const hashedOtp = await bcrypt.hash(otp, saltRounds);

        // Save OTP
        await UserOTPVerification.create({
            email,
            otp: hashedOtp,
            createdAt: Date.now(),
            expiredAt: Date.now() + 300000, // Expires in 5 minutes
        });

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({
            status: "pending",
            message: "Verification OTP email sent",
            data: { email },
        });
    } catch (e) {
        res.status(500).json({ status: "failed", message: e.message });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const userOtpVerification = await UserOTPVerification.findOne({ email });
        if (!userOtpVerification) {
            return res.status(400).json({ status: "failed", message: "Invalid email" });
        }

        const isOtpValid = await bcrypt.compare(otp, userOtpVerification.otp);
        if (!isOtpValid) {
            return res.status(400).json({ status: "failed", message: "Invalid or expired OTP" });
        }

        await UserOTPVerification.deleteOne({ email });
        // Here need to write the logic for JWT Token
        const token = await loginOTP(req, res);

        res.status(200).json({
            status: true,
            message: "OTP verified successfully",
            data: { email, token },
        });
    } catch (e) {
        res.status(500).json({ status: "failed", message: e.message });
    }
});

router.post('/resend-otp', async (req, res) => {
    const { email } = req.body;
    try {
        const userOtpVerification = await UserOTPVerification.findOne({ email });
        if (!userOtpVerification) {
            return res.status(400).json({ status: "failed", message: "Invalid email" });
        }

        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from: "otp@rielverse.com",
            to: email,
            subject: "Email Verification Code",
            html: `<p>Use this code <b>${otp}</b> to verify</p>
                   <p>This code <b>expires in 2 minutes</b></p>`,
        };

        const saltRounds = 10;
        const hashedOtp = await bcrypt.hash(otp, saltRounds);

        await UserOTPVerification.updateOne(
            { email },
            { otp: hashedOtp, createdAt: Date.now(), expiredAt: Date.now() + 300000 }
        );

        await transporter.sendMail(mailOptions);

        res.json({
            status: "pending",
            message: "Verification OTP email resent",
            data: { email },
        });
    } catch (e) {
        res.status(500).json({ status: "failed", message: e.message });
    }
});

module.exports = router;
