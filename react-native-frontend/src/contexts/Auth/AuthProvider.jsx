// External Libraries
import { useState } from "react";
import PropTypes from "prop-types";
import * as SecureStore from "expo-secure-store";

// Internal Components
import { AuthContext } from "./AuthContext.js";

// Internal Utilities
import axiosInstance from "@/utils/axiosInstance.js";


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [error, setError] = useState("");


    const checkAuthStatus = async () => {
        try {
            const response = await axiosInstance.get("/check_auth_status/");
            setUser(response.data);
        } catch (err) {
            console.error(err);
            setUser(null);
        }
    };


    const login = async (credentials) => {
        try {
            const response = await axiosInstance.post("/login/", credentials);
            await SecureStore.setItemAsync("sessionToken", response.headers["x-session-token"]);
            await checkAuthStatus();
            return true;
        } catch (err) {
            console.error(err);
            setError("Authentication failed. Please check your credentials.");
            return false;
        }
    };


    const register = async (credentials) => {
        try {
            await axiosInstance.post("/register/", credentials);
            await login(credentials);
            return true;
        } catch (err) {
            console.error(err);
            setError("Failed to create account.");
            return false;
        }
    };


    const logout = async () => {
        try {
            await axiosInstance.post("/logout/");
            setUser(null);
        } catch (err) {
            console.error(err);
            setError("Logout failed. Please try again.");
        }
    };


    return (
        <AuthContext.Provider value={ { user, error, checkAuthStatus, login, register, logout } }>
            { children }
        </AuthContext.Provider>
    );
};


AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};


export default AuthProvider;
