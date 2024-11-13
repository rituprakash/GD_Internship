
import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        userId: null,
        accessToken: null,
        refreshToken: null,
    },
    
    reducers: {
        setUser: (state, action) => {
            const { userId, username, email, mobile, accessToken, refreshToken, rememberMe } = action.payload;
            state.user = { username, email, mobile };
            state.userId = userId;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;

            const storage = rememberMe ? window.localStorage : window.sessionStorage;
            storage.setItem('user', JSON.stringify({ 
                userId, 
                username, 
                email, 
                mobile, 
                accessToken, 
                refreshToken 
            }));
        },

        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
            const userData = JSON.parse(window.localStorage.getItem('user') || window.sessionStorage.getItem('user'));
            if (userData) {
                userData.accessToken = action.payload;
                const storage = window.localStorage.getItem('user') ? window.localStorage : window.sessionStorage;
                storage.setItem('user', JSON.stringify(userData));
            }
        },

        setRefreshToken: (state, action) => {
            state.refreshToken = action.payload; // reducer for setting refresh token
            const userData = JSON.parse(window.localStorage.getItem('user') || window.sessionStorage.getItem('user'));
            if (userData) {
                userData.refreshToken = action.payload;
                const storage = window.localStorage.getItem('user') ? window.localStorage : window.sessionStorage;
                storage.setItem('user', JSON.stringify(userData));
            }
        },

        removeUser: (state) => {
            state.user = null;
            state.userId = null;
            state.accessToken = null;
            state.refreshToken = null;
            window.localStorage.removeItem('user');
            window.sessionStorage.removeItem('user');
        },

        setUserFromStorage: (state) => {
            const user = JSON.parse(window.localStorage.getItem('user') || window.sessionStorage.getItem('user'));
            if (user) {
                const { userId, username, email, mobile, accessToken, refreshToken } = user;
                state.user = { username, email, mobile };
                state.userId = userId;
                state.accessToken = accessToken;
                state.refreshToken = refreshToken;
            } else {
                state.user = null;
                state.userId = null;
                state.accessToken = null;
                state.refreshToken = null;
            }
        }
    }
});

// Export actions
export const { setUser, removeUser, setUserFromStorage, setAccessToken, setRefreshToken } = authSlice.actions;

// Export reducer
export default authSlice.reducer;



