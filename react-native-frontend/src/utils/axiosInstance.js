import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const { BACKEND_API_URL } = Constants.expoConfig.extra;

const axiosInstance = axios.create({
    baseURL: BACKEND_API_URL,
    headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync("sessionToken");
    if (token) config.headers.Authorization = `Bearer ${ token }`;
    return config;
});

export default axiosInstance;