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

export const getMe = async () => {
    return axios.get(
        "http://localhost:8000/auth/me",
        {
            withCredentials : true
        }
    );
};

export const ps_check = async (data) => {
    return axios.post(
        "http://localhost:8000/auth/email/send-code",
        data,
        {
            withCredentials : true
        }
    )
}