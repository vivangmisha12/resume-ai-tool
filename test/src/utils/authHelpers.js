import Cookies from "js-cookie";

// Get access token from cookies
export const getAccessToken = () => Cookies.get("accessToken");

// Get refresh token from cookies
export const getRefreshToken = () => Cookies.get("refreshToken");

// Check if the token is expired
export const isTokenExpired = (token) => {
  try {
    // Decode the JWT token to check its expiration
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    return decoded.exp * 1000 < Date.now();  // Compare expiration time with current time
  } catch {
    return true;  // If there's an error decoding, treat it as expired
  }
};
