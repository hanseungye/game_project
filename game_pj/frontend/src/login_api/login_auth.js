import axios from "axios";

export const login = async (loginData) => {
    return axios.post(
        "http://localhost:8000/auth/login",
        loginData,
        {
            withCredentials: true
        }
    );
};