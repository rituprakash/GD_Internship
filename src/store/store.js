
// Corrected 
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setUserFromStorage } from './authSlice'; 

// Creating the Redux store
const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});


store.dispatch(setUserFromStorage()); 

export default store;
