import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeUser } from '../../store/authSlice';

function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        axios.post('http://127.0.0.1:8000/dailytasks/logout/', {}, {
            withCredentials: true
        })
        .then(response => {
            if (response.status === 200) {
                console.log(response.data.message); 
                dispatch(removeUser()); 
                navigate('/login'); 
            } else {
                throw new Error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            
        });
    }

    React.useEffect(() => {
        handleLogout();
    }, );

    return null; 
}

export default Logout;
