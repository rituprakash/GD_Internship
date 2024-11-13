
// import axios from "axios";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import { useDispatch } from "react-redux";
// import { setUser } from "./store/authSlice";

// function App() {
//     const [username, setUserName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [passwordConf, setPasswordConf] = useState('');
//     const [usernameError, setUsernameError] = useState('');
//     const [emailError, setEmailError] = useState('');
//     const [passwordError, setPasswordError] = useState('');
//     const [passwordConfError, setPasswordConfError] = useState('');
//     const [passwordStrength, setPasswordStrength] = useState({ text: '', color: '' });
//     const [generalErrorMessage, setGeneralErrorMessage] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     // Regular expressions for validation
//     const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;

//     // Real-time validation functions
//     const handleUsernameChange = (event) => {
//         const value = event.target.value;
//         setUserName(value);
//         setUsernameError(usernameRegex.test(value) ? '' : 'Username must start with a letter.');
//     };

//     const handleEmailChange = (event) => {
//         const value = event.target.value;
//         setEmail(value);
//         setEmailError(emailRegex.test(value) ? '' : 'Email must start with a letter and be valid.');
//     };

//     const handlePasswordChange = (event) => {
//         const value = event.target.value;
//         setPassword(value);

//         // Password strength evaluation
//         evaluatePasswordStrength(value);
        
//         setPasswordError(value.length >= 6 ? '' : 'Password must be at least 6 characters long.');
//     };

//     const handlePasswordConfChange = (event) => {
//         const value = event.target.value;
//         setPasswordConf(value);
//         setPasswordConfError(value === password ? '' : 'Passwords do not match.');
//     };

//     // Function to evaluate password strength
//     function evaluatePasswordStrength(password) {
//         let strength = { text: 'Weak', color: 'red' };
        
//         if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
//             strength = { text: 'Strong', color: 'green' };
//         } else if (password.length >= 6 && ((/[A-Z]/.test(password) && /[0-9]/.test(password)) || /[^A-Za-z0-9]/.test(password))) {
//             strength = { text: 'Medium', color: 'orange' };
//         }

//         setPasswordStrength(strength);
//     }

//     function validateInput() {
//         setGeneralErrorMessage('');
//         return !(usernameError || emailError || passwordError || passwordConfError);
//     }

//     function registerUser() {
//         if (!validateInput()) return;

//         const user = {
//             username,
//             email,
//             password1: password,
//             password2: passwordConf
//         };

//         axios.post('http://127.0.0.1:8000/dailytasks/signup/', user)
//             .then(response => {
//                 const { uid, username, email } = response.data;
//                 dispatch(setUser({ userId: uid, username, email }));
//                 sessionStorage.setItem('userId', uid);
//                 setSuccessMessage('Registration successful! Please check your email for the OTP.');

//                 setTimeout(() => navigate('/verify-otp', { state: { userId: uid } }), 3000);
//             })
//             .catch(error => {
//                 if (error.response && error.response.data) {
//                     const { non_field_errors, username, email, password1, password2 } = error.response.data;
//                     let messages = [];
//                     if (non_field_errors) messages = messages.concat(non_field_errors);
//                     if (username) messages.push(`Username: ${username.join(' ')}`);
//                     if (email) messages.push(`Email: ${email.join(' ')}`);
//                     if (password1) messages.push(`Password: ${password1.join(' ')}`);
//                     if (password2) messages.push(`Confirm Password: ${password2.join(' ')}`);
//                     setGeneralErrorMessage(messages.join(' '));
//                 } else {
//                     setGeneralErrorMessage('Failed to connect to API.');
//                 }
//             });
//     }

//     return (
//         <div>
//             <Navbar />
//             <div className="container">
//                 <div className="row justify-content-center">
//                     <div className="col-sm-8 col-md-6 col-lg-4 mt-3">
//                         <div className="card bg-light" style={{ maxHeight: "83vh", overflowY: "auto" }}>
//                             <div className="card-body">
//                                 <h1 className="card-title text-center">Sign Up</h1>
//                                 {generalErrorMessage && <div className="alert alert-danger">{generalErrorMessage}</div>}
//                                 {successMessage && <div className="alert alert-success">{successMessage}</div>}
                                
//                                 <div className="form-group">
//                                     <label>Username:</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         value={username}
//                                         onChange={handleUsernameChange}
//                                     />
//                                     {usernameError && <small className="text-danger">{usernameError}</small>}
//                                 </div>
                                
//                                 <div className="form-group">
//                                     <label>Email:</label>
//                                     <input
//                                         type="email"
//                                         className="form-control"
//                                         value={email}
//                                         onChange={handleEmailChange}
//                                     />
//                                     {emailError && <small className="text-danger">{emailError}</small>}
//                                 </div>
                                
//                                 <div className="form-group">
//                                     <label>Password:</label>
//                                     <input
//                                         type="password"
//                                         className="form-control"
//                                         value={password}
//                                         onChange={handlePasswordChange}
//                                     />
//                                     {passwordError && <small className="text-danger">{passwordError}</small>}
//                                     <div style={{ color: passwordStrength.color }}>
//                                         <small>{password ? passwordStrength.text : 'Enter a strong password with minimum 6 character including atleast one upperacse, lowercase, number and alphanumeric character'}</small>
//                                     </div>
//                                 </div>
                                
//                                 <div className="form-group">
//                                     <label>Confirm Password:</label>
//                                     <input
//                                         type="password"
//                                         className="form-control"
//                                         value={passwordConf}
//                                         onChange={handlePasswordConfChange}
//                                     />
//                                     {passwordConfError && <small className="text-danger">{passwordConfError}</small>}
//                                 </div>
                                
//                                 <div className="form-group">
//                                     <button className="btn btn-dark btn-block" onClick={registerUser}>Submit</button>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="text-center mt-3">
//                             <p>Already have an account? <a href="/login">Login here</a></p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     );
// }

// export default App;







import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useDispatch } from "react-redux";
import { setUser } from "./store/authSlice";

function App() {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordConfError, setPasswordConfError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({ text: '', color: '' });
    const [generalErrorMessage, setGeneralErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Regular expressions for validation
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;

    // Real-time validation functions
    const handleUsernameChange = (event) => {
        const value = event.target.value;
        setUserName(value);
        setUsernameError(usernameRegex.test(value) ? '' : 'Username must start with a letter.');
    };

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);
        setEmailError(emailRegex.test(value) ? '' : 'Email must start with a letter and be valid.');
    };

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);

        // Password strength evaluation
        evaluatePasswordStrength(value);
        
        setPasswordError(value.length >= 6 ? '' : 'Password must be at least 6 characters long.');
    };

    const handlePasswordConfChange = (event) => {
        const value = event.target.value;
        setPasswordConf(value);
        setPasswordConfError(value === password ? '' : 'Passwords do not match.');
    };

    // Function to evaluate password strength
    function evaluatePasswordStrength(password) {
        let strength = { text: 'Weak', color: 'red' };
        
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
            strength = { text: 'Strong', color: 'green' };
        } else if (password.length >= 6 && ((/[A-Z]/.test(password) && /[0-9]/.test(password)) || /[^A-Za-z0-9]/.test(password))) {
            strength = { text: 'Medium', color: 'orange' };
        }

        setPasswordStrength(strength);
    }

    function validateInput() {
        setGeneralErrorMessage('');
        return !(usernameError || emailError || passwordError || passwordConfError);
    }

    function registerUser() {
        if (!validateInput()) return;

        const user = {
            username,
            email,
            password1: password,
            password2: passwordConf
        };

        axios.post('http://127.0.0.1:8000/dailytasks/signup/', user)
            .then(response => {
                const { uid, username, email } = response.data;
                dispatch(setUser({ userId: uid, username, email }));
                sessionStorage.setItem('userId', uid);
                setSuccessMessage('Registration successful! Please check your email for the OTP.');

                setTimeout(() => navigate('/verify-otp', { state: { userId: uid } }), 3000);
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    const { non_field_errors, username, email, password1, password2 } = error.response.data;
                    let messages = [];
                    if (non_field_errors) messages = messages.concat(non_field_errors);
                    if (username) messages.push(`Username: ${username.join(' ')}`);
                    if (email) messages.push(`Email: ${email.join(' ')}`);
                    if (password1) messages.push(`Password: ${password1.join(' ')}`);
                    if (password2) messages.push(`Confirm Password: ${password2.join(' ')}`);
                    setGeneralErrorMessage(messages.join(' '));
                } else {
                    setGeneralErrorMessage('Failed to connect to API.');
                }
            });
    }

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-sm-10 col-md-8 col-lg-6 mt-3">
                        <div className="card bg-light" style={{ maxHeight: "83vh", overflowY: "auto" }}>
                            <div className="card-body">
                                <h2 className="card-title text-center">Sign Up</h2>
                                {generalErrorMessage && <div className="alert alert-danger">{generalErrorMessage}</div>}
                                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                                
                                <div className="form-group">
                                    <label>Username:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={handleUsernameChange}
                                    />
                                    {usernameError && <small className="text-danger">{usernameError}</small>}
                                </div>
                                
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                    {emailError && <small className="text-danger">{emailError}</small>}
                                </div>
                                
                                <div className="form-group">
                                    <label>Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                    {passwordError && <small className="text-danger">{passwordError}</small>}
                                    <div style={{ color: passwordStrength.color }}>
                                        <small>{password ? passwordStrength.text : 'mininmum of 6 characters with at least one uppercase, lowercase, number and special character.'}</small>
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label>Confirm Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwordConf}
                                        onChange={handlePasswordConfChange}
                                    />
                                    {passwordConfError && <small className="text-danger">{passwordConfError}</small>}
                                </div>
                                
                                <div className="form-group">
                                    <button className="btn btn-dark btn-block" onClick={registerUser}>Submit</button>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-3">
                            <p>Already have an account? <a href="/login">Login here</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;


