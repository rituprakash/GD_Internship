
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AddTask from "./auth/addtask";
import ListTask from "./auth/tasklist";
import UpdateTask from "./auth/updatetask";
import DeleteTask from "./auth/deletetask"; 
import Login from "./auth/login";
import OTPVerification from "./auth/OTPVerification";


const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: "/verify-otp", element: <OTPVerification/> },
    { path: 'login/', element: <Login /> },
    { path: 'addtask/', element: <AddTask /> },
    { path: 'tasklist/', element: <ListTask /> },
    { path: '/updatetask/:id', element: <UpdateTask /> }, 
    { path: '/deletetask/:id', element: <DeleteTask /> },
    
]);

export default router;
