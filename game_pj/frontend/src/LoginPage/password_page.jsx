import React, { useState } from "react";
import EmailVerfication from "./Login_Components/EmailVerfication";
import { ps_check } from "../login_api/login_auth";
const Password_Check = () => {
    /* 
        이메일, 인증코드, 코드 일치 여부 -> state로 나눌생각
    */
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);

    const handleSendCode = async () => {
        // auth/email/send-code 해당 주소로 전송
        // email 값이 비어있으면
        if (!email) {
            alert("이메일을 입력해주세요.");
            return;
        }
        // 이메일 유효성 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // 이메일 형식이 올바르지 않으면
        if (!emailRegex.test(email.trim())) {
            alert("올바른 이메일 형식을 입력해주세요.");
            return;
        }
        // auth/email/send-code 해당 주소로 전송
        const data = {
            email: email.trim(),
        };
        console.log("email = ", email);
        console.log("data = ", data);
        console.log("typeof email = ", typeof email);
        try {
            const response = await ps_check(data);
            console.log(response);
            setIsCodeSent(true);
        } catch (e) {
            console.log(e.response?.data);
        }
    }

    const handleVerifyCode = async () => {
        // FastAPI 요청
    }
    return (
        <EmailVerfication
            email={email}
            setEmail={setEmail}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            isCodeSent={isCodeSent}
            handleSendCode={handleSendCode}
            handleVerifyCode={handleVerifyCode}
        />
    )
}
export default Password_Check;