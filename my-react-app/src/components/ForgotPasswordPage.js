// ForgotPasswordPage.js
import React, { useState } from 'react';
import api from '../api';
import '../App.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Enter new password

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        api.post('/auth/forgot-password/', { email })
            .then(response => {
                setStep(2);
            })
            .catch(error => {
                console.error('Error sending OTP:', error);
            });
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        api.post('/auth/verify-otp/', { email, otp })
            .then(response => {
                setStep(3);
            })
            .catch(error => {
                console.error('Error verifying OTP:', error);
            });
    };

    const handleNewPasswordSubmit = (e) => {
        e.preventDefault();
        api.post('/auth/reset-password/', { email, otp, new_password: newPassword })
            .then(response => {
                alert('Password reset successfully!');
                // Redirect to login page
            })
            .catch(error => {
                console.error('Error resetting password:', error);
            });
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            {step === 1 && (
                <form onSubmit={handleEmailSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Send OTP</button>
                </form>
            )}
            {step === 2 && (
                <form onSubmit={handleOtpSubmit}>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button type="submit">Verify OTP</button>
                </form>
            )}
            {step === 3 && (
                <form onSubmit={handleNewPasswordSubmit}>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Reset Password</button>
                </form>
            )}
        </div>
    );
};

export default ForgotPasswordPage;
