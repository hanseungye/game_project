import React, { useState } from 'react';
import './human_acoount.css'
import UserInput from '../Components/UserInput';
import UserButton from '../Components/UserButton';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
const step = [
    { id: 1, label: "계정 생성" },
    { id: 2, label: "취향 설정" },
    { id: 3, label: "추천 시작" }
]
const text_promotion = [
    { label: "나만의 게임을 찾아보세요." },
    { label: "계정을 생성하고 추천 여정을 시작하세요." }
]

const Human_Account = () => {
    const [verificationCode, setVerificationCode] = useState(""); // 사용자가 입력한 인증번호
    const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 발송 여부
    const [emailVerified, setEmailVerfied] = useState(false); // 이메일 인증 완료 여부
    const [verificationMessage, setVerificationMessage] = useState("");

    const [formData, setFormData] = useState({
        nickname: "",
        email: "",
        login_id: "",
        password: "",
        passwordConfirm: "",
        agreement: false
    });
    const navigate = useNavigate();
    // 사용자가 입력한 text를 formData(stare) 객체에 저장한다.
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => {
            const newFormData = {
                ...prev
            };

            if (type === "checkbox") {
                newFormData[name] = checked;
            } else {
                newFormData[name] = value;
            }
            return newFormData;
        });
    };

    // 이메일 인증번호를 처리하는 함수
    const handleSendCode = async () => {
        const email = formData.email.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        // 이메일이 null이면
        if (!emailRegex.test(email)) {
            alert("올바른 이메일을 입력해주세요");
            return;
        }
        try {
            await axios.post(
                "http://localhost:8000/auth/email/send_code",
                {
                    email: email
                },
                {
                    // FastAPI가 설정한 쿠키를 브라우저가 주고받도록
                    // 하기 위해 사용한다.
                    withCredentials: true
                }
            );
            setIsCodeSent(true);
            setVerificationMessage(
                "인증번호가 이메일로 발송되었습니다."
            );

        } catch (e) {
            console.error(e);
            alert("올바른 이메일을 입력해주세요.");
        }
    };
    // 인증번호 일치 여부를 확인하는 함수
    const handleVerifyCode = async () => {
        const code = verificationCode.trim();
       
        // 인증번호를 입력 안한 경우
        if (!verificationCode.trim()) {
            alert("인증번호를 입력해주세요.");
            return;
        }
        else if (!code){
            alert("인증번호를 입력해주세요.");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:8000/auth/email/verify-code",
                {
                    email : formData.email,
                    code: code,
                },
                {
                    // FastAPI가 설정한 쿠키를 브라우저가 주고받도록
                    // 하기 위해 사용한다.
                    withCredentials: true
                }
            );

            // 이메일이 올바르게 입력되었으면
            if (response.data.verified) {
                // 이메일 인증 완료 여부에 따라 boolan값을 바꾼다.
                setEmailVerfied(true);

                setVerificationMessage(
                    "이메일 인증이 완료되었습니다."
                );

                alert("인증번호가 일치합니다.");
            }
        } catch (error) {
            console.error(error);

            setEmailVerfied(false);

            alert("인증번호가 일치하지 않습니다. 다시 입력해주세요.");
        }
    };
    const forwarding = async (e) => {
        e.preventDefault();
        const nick_name = formData.nickname.trim()
        const email = formData.email.trim()
        const login_id = formData.login_id.trim()
        const password = formData.password.trim()
        const passwordConfirm = formData.passwordConfirm.trim()


        // 1. 빈 입력값 검사
        if (!nick_name) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        if (!email) {
            alert("이메일을 입력해주세요.");
            return;
        }

        if (!login_id) {
            alert("아이디를 입력해주세요.");
            return;
        }

        if (!password) {
            alert("비밀번호를 입력해주세요.");
            return;
        }
        if (!passwordConfirm) {
            alert("비밀번호가 일치하지 않습니다!");
        }

        // 2. 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert("올바른 이메일 형식으로 입력해주세요.");
            return;
        }

        // 3. 비밀번호 확인 검사
        if (password !== passwordConfirm) {
            alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요");
            return;
        }
        // 4. 위 조건을 통과하면 
        // post(api)
        // fetch,axios 모듈 사용해서 
        // http://localhost/auth/signup 해당 주소로
        // 데이터 전송
        try {
            const response = await axios.post(
                "http://localhost:8000/auth/signup",
                {
                    nickname: nick_name,
                    email: email,
                    login_id: login_id,
                    password: password
                }
            );

            console.log(response.data);

            alert("회원가입이 완료했습니다.");

            navigate("/"); // 회원가입을 완료하면 메인 페이지로 이동
        } catch (error) {
            console.error(error);

            alert("회원가입 중 오류가 발생했습니다.");
        }
    }
    return (
        <div>
            <div className="step-container">
                {step.map((step, index) => {
                    return (
                        <div className="step-item" key={step.id}>
                            <div>
                                <span className="step-id">{step.id}</span>
                            </div>
                            <div>
                                <span className="step-label">{step.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className='text-container'>
                {text_promotion.map((pro, index) => {
                    return (
                        <div className='text-item' key={index}>
                            <p>{pro.label}</p>
                        </div>
                    );
                })}
            </div>
            <div className='signup-container'>
                {/*입력한 정보를 forwarding() 전달*/}
                <form
                    className='signup-form'
                    onSubmit={forwarding}
                >
                    {/* 닉네임*/}
                    <UserInput
                        label="닉네임"
                        id="nickname"
                        name="nickname"
                        type="text"
                        placeholder="닉네임을 입력하세요"
                        value={formData.nickname}
                        onChange={handleChange}
                    />
                    {/* 이메일 */}
                    <div className='email-row'>
                        <UserInput
                            label="이메일"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="이메일을 입력하세요"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <button
                            type="button"
                            onClick={handleSendCode}
                        >
                            인증번호 발송
                        </button>
                    </div>
                    {verificationMessage && (
                        <p className='verification-message'>
                            {verificationMessage}
                        </p>
                    )}
                    {/*올바르게 이메일을 입력하면 -> <input>,<button> 태그를 뛰운다. */}
                    {isCodeSent && !emailVerified && (
                        <div className='verification-row'>
                            <input
                                type="text"
                                placeholder='인증번호를 입력하세요'
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                            {/*인증번호 코드 입력 -> 버튼 클릭 -> handleVerifyCode(코드 전달)*/}
                            <button
                                type='button'
                                onClick={handleVerifyCode}
                            >
                                인증번호 확인
                            </button>
                        </div>

                    )}
                    {/*아이디*/}
                    <UserInput
                        label="아이디"
                        id="login_id"
                        name="login_id"
                        type='text'
                        placeholder='아이디를 입력하세요'
                        value={formData.login_id}
                        onChange={handleChange}
                    />
                    {/*비밀번호*/}
                    <UserInput
                        label="비밀번호"
                        id="password"
                        name="password"
                        type="password"
                        placeholder='비밀번호를 입력하세요'
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <p>
                        8자 이상, 영문/숫자/특수문자 중 2가지 이상 포함
                    </p>

                    {/*비밀번호 확인*/}
                    <div className='password-input'>
                        <UserInput
                            label="비밀번호 확인"
                            id="passwordConfirm"
                            name="passwordConfirm"
                            type='password'
                            placeholder='비밀번호를 다시 입력하세요'
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                        />
                    </div>
                    {/*체크박스*/}
                    <input
                        id="agreement"
                        name="agreement"
                        type='checkbox'
                        checked={formData.agreement}
                        onChange={handleChange}
                    />
                    <label htmlFor='agreement'>이용 약관에 동의합니다.</label>
                    {/*회원가입*/}
                    <div>
                        <UserButton
                            type="submit"
                            text_human="회원가입"
                        />
                    </div>
                </form>

                {/*로그인*/}
                <div className='login-link'>
                    <span>이미 계정이 있으신가요?</span>
                    <a href='/login'>로그인</a>
                </div>
            </div>
        </div>

    );
};
export default Human_Account;