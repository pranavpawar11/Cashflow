import React, { useState } from 'react';
import '../css/forgotPassword.css';

function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handleOtpChange = (value, index) => {
        if (value.length > 1) {
            value = value.slice(-1); // Ensure only one character is accepted
        }
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Automatically move to the next input if not the last input
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            if (nextInput) {
                nextInput.focus();
            }
        }

        // Handle case where backspace is pressed (go back to previous input)
        if (!value && index > 0) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
            }
        }
    };

    const handleResetPassword = () => {
        if (newPassword === confirmPassword) {
            // Implement password reset logic here
            alert('Password reset successfully!');
        } else {
            alert('Passwords do not match!');
        }
    };

    return (
        <div className="container main-div">
            <div className="heading">
                <h2>Reset Password</h2>
                <p>{step === 1 ? 'Enter your email to receive the OTP' : step === 2 ? 'Enter the OTP sent to your email' : 'Create a new password'}</p>
            </div>

            <div className="inputs">
                {step === 1 && (
                    <>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="fa-solid fa-square-envelope"></i></span>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                aria-label="Email"
                            />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleNextStep}>Send Email</button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="otp-inputs">
                            {otp.map((value, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    id={`otp-input-${index}`}
                                    className="form-control otp-input"
                                    maxLength="1"
                                    value={value}
                                    onChange={(e) => handleOtpChange(e.target.value, index)}
                                />
                            ))}
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleNextStep}>Verify OTP</button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="fa-solid fa-key"></i></span>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                aria-label="New Password"
                            />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="fa-solid fa-key"></i></span>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                aria-label="Confirm Password"
                            />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleResetPassword}>Reset Password</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
