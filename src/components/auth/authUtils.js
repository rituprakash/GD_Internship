
import { jwtDecode } from 'jwt-decode';

export const isTokenExpiringSoon = (token) => {
    if (!token) return true; // missing tokens or expired one.

    const { exp } = jwtDecode(token); // Decoding the token to get expiration time
    return Date.now() >= exp * 1000 - 5 * 60 * 1000; // Checking if token will expire within 5 minutes
};
