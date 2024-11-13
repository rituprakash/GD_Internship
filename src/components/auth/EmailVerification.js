
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EmailVerification() {
    const { uid, token } = useParams(); // Get uid and token from URL parameters
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Send the verification request to the backend
        axios.get(`http://127.0.0.1:8000/dailytasks/verify-email/${uid}/${token}/`)
            .then(response => {
                setMessage('Email verified successfully! You can now log in.');
                setTimeout(() => {
                    navigate('/login'); 
                }, 5000); // Redirect after 5 seconds
            })
            .catch(error => {
                setMessage('Invalid or expired otp.');
            });
    }, [uid, token, navigate]);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="alert alert-info text-center mt-5">
                        {message}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmailVerification;


