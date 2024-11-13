
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { setAccessToken, setRefreshToken } from "../../store/authSlice";
import { isTokenExpiringSoon } from './authUtils';

const API_BASE_URL = 'http://127.0.0.1:8000/api/token/refresh/';

export const checkAuth = (Component) => {
    function Wrapper(props) {
        const user = useSelector(store => store.auth.user);
        const accessToken = useSelector(store => store.auth.accessToken);
        const refreshToken = useSelector(store => store.auth.refreshToken);
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const [isRefreshing, setIsRefreshing] = useState(false);

        useEffect(() => {
            const checkToken = async () => {
                // Ensure user is logged in and refreshToken is available
                if (!user || !refreshToken) {
                    navigate('/login');
                    return;
                }

                // Check if token is expiring soon and initiate refresh 
                if (isTokenExpiringSoon(accessToken) && !isRefreshing) {
                    setIsRefreshing(true);
                    try {
                        const response = await axios.post(API_BASE_URL, {
                            refresh: refreshToken,
                        });
                        const { access, refresh } = response.data; // acessing returned new token
                        dispatch(setAccessToken(access));
                        dispatch(setRefreshToken(refresh)); // Setting the new refresh and acess token in Redux state
                    } catch (error) {
                        console.error("Token refresh failed:", error.response ? error.response.data : error.message);
                        navigate('/login');
                    } finally {
                        setIsRefreshing(false);
                    }
                }
            };
        
            checkToken();
        }, [user, accessToken, refreshToken, dispatch, navigate, isRefreshing]);
        
        return <Component {...props} />;
    }

    return Wrapper;
};

export default checkAuth;
