import User from "../Models/auth.schema.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';


//Get all User
export const getUserDetail = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
//Register

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashPassword });
        await newUser.save();

        res.status(201).json({
            message: "Registration successful",
            user: {
                _id: newUser._id,
                email: newUser.email,
                username: newUser.username
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


//Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        console.log('Provided password:', password);
         console.log('Stored password:', user.password);
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({
            message: "Login successful",
            token,
            // user: {
            //     _id: user._id,
            //     email: user.email,
            //     username: user.username
            // }
        });
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//Forgot Password

export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const randomString = crypto.randomBytes(20).toString('hex');
        const expirationTimestamp = Date.now() + 3600000; // 1 hour

        user.randomString = randomString;
        user.expirationTimestamp = expirationTimestamp;
        await user.save();
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.MAIL,
                pass: process.env.SECRET_KEY
            }
        });
        

        const resetURL = `${process.env.RESET_URL}/reset-password/${randomString}`;
        await transporter.sendMail({
            from: process.env.MAIL,
            to: user.email,
            subject: 'Password Reset Request',
            text: `Dear ${user.username},\n\nSorry to hear you’re having trouble logging into your account. We got a message that you forgot your password. If this was you, you can get right back into your account or reset your password now.\n\nClick the following link to reset your password:\n${resetURL}\n\nIf you didn’t request a login link or a password reset, you can ignore this message.\n\nOnly people who know your account password or click the login link in this email can log into your account.`,
            html: `<p>Dear ${user.username},</p>
                   <p>Click the following link to reset your password:</p>
                   <p><a href="${resetURL}">${resetURL}</a></p>
                   <p>If you didn’t request a login link or a password reset, you can ignore this message.</p>
                   <p>Only people who know your account password or click the login link in this email can log into your account.</p>`
        });
        

        res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (error) {
        console.error("Error in forgetPassword:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


//ResetPassword
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        console.log('Received token:', token);
        console.log('Current time:', Date.now());

        const user = await User.findOne({
            randomString: token,
            expirationTimestamp: { $gt: Date.now() }
        });

        if (!user) {
            console.log('User not found or token expired');
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.randomString = null;
        user.expirationTimestamp = null;
        await user.save();

        res.status(200).json({ message: "Your new password has been updated" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};