import axios from "axios";

const API_URL = "http://localhost:8000/auth"

export const sendVerificationCode = async (email) => {
    return axios.post(
        `${API_URL}/email/send_code`,
        {
            email
        },
        {
            withCredentials :true
        }
    );
};

export const verifyEmailCode = async (email,code) => {
    return axios.post(
        `${API_URL}/email/verify-code`,
        {
            email : email,
            code : code
        },
        {
            withCredentials : true
        }
    );
};

export const signup = async ({
    nickname,
    email,
    login_id,
    password
}) => {
    return axios.post(
        `${API_URL}/signup`,
        {
            nickname,
            email,
            login_id,
            password
        }
    );
};