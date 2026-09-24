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
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [formData,setFormData] = useState({
        nickname: "",
        email: "",
        login_id : "",
        password : "",
        passwordConfirm : "",
        agreement : false
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name,value,type,checked} = e.target;

        setFormData((prev) => {
            const newFormData = {
                ...prev
            };
            
            if(type === "checkbox"){
                newFormData[name] = checked;
            } else{
                newFormData[name] = value;
            }
        });
    };

    const forwarding = async(formData) =>{
        const nick_name = formData.get("nickname")?.trim();
        const email = formData.get("email")?.trim();
        const login_id = formData.get("login_id")?.trim();
        const password = formData.get("password");
        const passwordConfirm = formData.get("passwordConfirm");
    
        // 1. 빈 입력값 검사
        if (!nick_name){
            alert("닉네임을 입력해주세요.");
            return;
        }

        if (!email){
            alert("이메일을 입력해주세요.");
            return;
        }

        if (!login_id){
            alert("아이디를 입력해주세요.");
            return;
        }

        if (!password){
            alert("비밀번호를 입력해주세요.");
            return;
        }

        // 2. 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)){
            alert("올바른 이메일 형식으로 입력해주세요.");
            return;
        }

        // 3. 비밀번호 확인 검사
        if (password !== passwordConfirm){
            alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요");
            return;
        }
        // 4. 위 조건을 통과하면 
        // post(api)
        // fetch,axios 모듈 사용해서 
        // http://localhost/auth/signup 해당 주소로
        // 데이터 전송
        try{
            const response = await axios.post(
                "http://localhost:8000/auth/signup",
                {
                    nickname : nick_name,
                    email : email,
                    login_id : login_id,
                    password : password
                }
            );

            console.log(response.data);

            alert("회원가입이 완료했습니다.");

            navigate("/"); // 회원가입을 완료하면 메인 페이지로 이동
        } catch (error){
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
                <form 
                  className='signup-form'
                  action = {forwarding}
                >
                    {/* 닉네임*/}
                    <UserInput
                        label="닉네임"
                        id="nickname"
                        name="nickname"
                        type="text"
                        placeholder="닉네임을 입력하세요"
                        value = {nickname}
                        onChange = {handleChange}
                    />
                    {/* 이메일 */}
                    <UserInput
                        label="이메일"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="이메일을 입력하세요"
                        value = {email}
                        onChange = {handleChange}
                    />
                    {/*아이디*/}
                    <UserInput
                        label="아이디"
                        id="login_id"
                        name="login_id"
                        type='text'
                        placeholder='아이디를 입력하세요'
                        value = {loginId}
                        onChange = {handleChange}
                    />
                    {/*비밀번호*/}
                    <UserInput
                        label="비밀번호"
                        id="password"
                        name="password"
                        type="password"
                        placeholder='비밀번호를 입력하세요'
                        value = {password}
                        onChange = {handleChange}
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
                            value = {passwordConfirm}
                            onChange = {handleChange}
                        />
                    </div>
                    {/*체크박스*/}
                    <input
                        id="agreement"
                        name="agreement"
                        type='checkbox'
                    />
                    <label htmlFor='agreement'>체크박스</label>
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