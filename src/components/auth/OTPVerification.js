
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../Navbar';

function OTPVerification() {
    const [otp, setOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [otpExpired, setOtpExpired] = useState(false);
    const [otpExpiryTime, setOtpExpiryTime] = useState(null);
    const navigate = useNavigate();

    const userId = useSelector((state) => state.auth.userId); // Access userId from Redux store
    console.log("User ID from Redux:", userId); 

    useEffect(() => {
        // Set OTP expiration time to 1 minute from now
        const expiryTime = new Date(Date.now() + 1 * 60 * 1000);
        setOtpExpiryTime(expiryTime);
    }, []);

    function handleOtpVerification() {
        setErrorMessage('');
        setSuccessMessage('');

        if (!otp) {
            setErrorMessage('Please enter the OTP.');
            return;
        }

        // Check if OTP has expired
        const now = new Date();
        if (otpExpiryTime && now >= otpExpiryTime) {
            setOtpExpired(true); // Show regenerate button if expired
            setErrorMessage('Your OTP has expired. Please regenerate it.');
            return;
        }

        // Sending the correct key "user_id" to the backend
        axios.post('http://127.0.0.1:8000/dailytasks/verify_otp/', { user_id: userId, otp })
            .then(response => {
                setSuccessMessage('Email verified successfully! You can now log in.');

                setTimeout(() => {
                    navigate('/login/');
                }, 3000); // Redirect after 3 seconds 
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.error || 'OTP verification failed.');
                    setOtpExpired(true); // Show regenerate button on failed OTP attempt
                } else {
                    setErrorMessage('Failed to connect to API');
                }
            });
    }

    // Function to handle OTP regeneration
    const handleRegenerateOtp = () => {
        axios.post('http://127.0.0.1:8000/dailytasks/resend_otp/', { user_id: userId })
            .then(response => {
                setSuccessMessage(response.data.message);
                setOtpExpired(false); // Reset the expired state
                setOtpExpiryTime(new Date(Date.now() + 1 * 60 * 1000)); // Reset expiry time to 1 minute
                setOtp(''); // Optionally clear the OTP input
            })
            .catch(error => {
                setErrorMessage('Failed to regenerate OTP. Please try again.');
            });
    };

    return (
        <div>
            <Navbar />
            <div className="container" style={{ minHeight: "100vh" }}>
                <div className="row justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <div className="col-sm-8 col-md-6 col-lg-4">
                        <div className="card bg-light">
                            <div className="card-body">
                                <h1 className="card-title text-center">Verify OTP</h1>
                                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                                <div className="form-group">
                                    <label>Enter OTP:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={otp}
                                        onChange={(event) => setOtp(event.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-dark btn-block" onClick={handleOtpVerification}>Verify OTP</button>
                                </div>
                                <p className="text-center text-warning">
                                    Please note: Your OTP will expire within 1 minute.
                                </p>
                                {/* Show the regenerate OTP button only if the OTP has expired */}
                                {otpExpired && (
                                    <div className="form-group text-center">
                                        <button className="btn btn-link" onClick={handleRegenerateOtp}>Regenerate OTP</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        );
    }
    
    export default OTPVerification;
    