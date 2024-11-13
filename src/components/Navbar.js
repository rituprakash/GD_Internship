
import React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { removeUser } from '../store/authSlice';

function Navbar() {
    const accessToken = useSelector(state => state.auth.accessToken); // Get access token from Redux state
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = () => {
        if (accessToken) {
            axios.post('http://127.0.0.1:8000/dailytasks/logout/', {}, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })
            .then(() => {
                dispatch(removeUser()); // Clear the user from Redux state
                window.localStorage.removeItem('user'); // Clear from local storage
                navigate('/login'); 
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
        }
    };

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <div className="navbar-brand">
                <h4>MyToDo</h4>
            </div>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                    {accessToken ? (
                        // If accessToken is present, show Logout button
                        <li className="nav-item">
                            <span className="nav-link" onClick={logout} style={{ cursor: 'pointer' }}>
                                Logout
                            </span>
                        </li>
                    ) : (
                        // If accessToken is not present, show Login button
                        <li className="nav-item">
                            <NavLink to="/login" className="nav-link">
                                Login
                            </NavLink>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;


