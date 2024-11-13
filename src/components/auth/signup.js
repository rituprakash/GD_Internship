import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";

function Signup() {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [mobile, setMobile] = useState(''); // Added mobile number state
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    function registerUser() {
        const user = {
            username: username,
            email: email,        // Include email in user object
            mobile: mobile,      // Include mobile number in user object
            password1: password,
            password2: passwordConf
        };
        axios.post('http://127.0.0.1:8000/dailytasks/signup/', user)
            .then(response => {
                setErrorMessage('');
                navigate('/Login');
            })
            .catch(error => {
                if (error.response.data.errors) {
                    setErrorMessage(Object.values(error.response.data.errors).join(' '));
                } else {
                    setErrorMessage('Failed to connect to API');
                }
            });
    }

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-sm-8 col-md-6 col-lg-4 mt-4">
                        <div className="card bg-light" style={{ maxHeight: "83vh", overflowY: "auto" }}>
                            <div className="card-body">
                                <h1 className="card-title text-center">Register</h1>
                                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                <div className="form-group">
                                    <label>Username:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={(event) => setUserName(event.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mobile Number:</label> 
                                    <input
                                        type="tel"
                                        className="form-control"
                                        value={mobile}
                                        onChange={(event) => setMobile(event.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwordConf}
                                        onChange={(event) => setPasswordConf(event.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-dark btn-block" onClick={registerUser}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
