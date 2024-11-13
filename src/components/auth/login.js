
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";

function Login() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(window.localStorage.getItem('user') || window.sessionStorage.getItem('user'));
        if (userData && userData.accessToken) {
            dispatch(setUser({ ...userData, rememberMe: true }));
            navigate('/tasklist/');
        }
    }, [dispatch, navigate]);

    function userLogin() {
        axios.post('http://127.0.0.1:8000/dailytasks/login/', {
            username: username,
            password: password,
            remember_me: rememberMe
        })
        .then(response => {
            setErrorMessage('');
            const user = {
                userId: response.data.userId,
                username: response.data.username, // Include the username
                email: response.data.email,
                mobile: response.data.mobile,
                accessToken: response.data.access,
                refreshToken: response.data.refresh,
                rememberMe: rememberMe
            };
    
            dispatch(setUser(user));
    
            navigate('/tasklist');
        })
        .catch(error => {
            setErrorMessage('Invalid username or password');
            console.error('Login failed:', error);
        });
    }
    

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-sm-8 col-md-6 col-lg-4">
                        <div className="card bg-light">
                            <div className="card-body">
                                <h1 className="card-title text-center">Login</h1>
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
                                    <label>Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="rememberMe"
                                            checked={rememberMe}
                                            onChange={(event) => setRememberMe(event.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="rememberMe">
                                            Remember Me
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <button className="btn btn-dark btn-block" onClick={userLogin}>Login</button>
                                </div>
                                <div className="text-center">
                                    <p>Don't have an account..? <Link className="text-danger" to="/">Sign Up</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
