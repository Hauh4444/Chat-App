import { useState } from "react";
import PropTypes from "prop-types";
import * as SecureStore from "expo-secure-store";

import { AuthContext } from "./AuthContext.js";
import axiosInstance from "@/utils/axiosInstance.js";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [error, setError] = useState("");

    const checkAuthStatus = async () => {
        try {
            const response = await axiosInstance.get("/check_auth_status/");
            setUser(response.data);
            setError("");
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
        } catch (err) {
            console.error(err);
            setError("Authentication failed. Please check your credentials.");
        }
    };

    const register = async (credentials) => {
        try {
            await axiosInstance.post("/register/", credentials);
            await login(credentials);
        } catch (err) {
            console.error(err);
            if (err.response.status === 409) {
                setError("Username is taken.")
            } else {
                setError("Failed to create account.");
            }
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post("/logout/");
            setUser(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AuthContext.Provider value={ { user, error, setError, checkAuthStatus, login, register, logout } }>
            { children }
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProvider;
