import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserFromStorage } from "../../store/authSlice";

function AutoLogin(props){
    const dispatch = useDispatch();
    useEffect(()=>{dispatch(setUserFromStorage())},[])
    return props.children
}

export default AutoLogin;