import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserInput from "../Components/UserInput";
import { login } from "../login_api/login_auth";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        keepLogin: false
    });

    const handleHuman = () => {
        navigate("/account");
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        const loginData = {
            email: formData.email.trim(),
            password: formData.password
        };
        console.log(loginData.password);
        if (!loginData.email) {
            alert("이메일을 입력해주세요.");
            return;
        }

        if (!loginData.password) {
            alert("비밀번호를 입력해주세요.");
            return;
        }
  
        try {
            const response = await login(loginData);

            console.log("응답 : ", response);
            console.log("응답 데이터: ", response.data);

        } catch (error) {
            console.log("에러:",error);
            console.log("서버 응답:",error.response);
            console.log("서버 데이터:",error.response?.data);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const handlekeepLoginChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked
        }));
    };
    return (
        <main>
            <section>
                <header>
                    <h1>GAME FIT</h1>
                    <h2>다시 오신 것을 환영합니다</h2>
                    <p>로그인</p>
                </header>

                {/*로그인 */}
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="">
                            이메일
                        </label>
                        <UserInput
                            id="email"
                            name="email"
                            type="email"
                            placeholder="이메일을 입력하세요"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <label>
                            비밀번호
                        </label>
                        <UserInput
                            id="password"
                            name="password"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <label>
                            <UserInput
                                id="keepLogin"
                                name="keepLogin"
                                type="checkbox"
                                checked={formData.keepLogin}
                                onChange={handlekeepLoginChange}
                            />
                            로그인 상태 유지
                        </label>

                        <button type="button">
                            비밀번호 찾기
                        </button>
                    </div>
                    <button type="submit">
                        로그인
                    </button>
                </form>

                <div>
                    <span>또는</span>
                </div>

                {/*Google 로그인*/}
                <button type="button">
                    Google로 계속하기
                </button>

                {/*회원가입*/}
                <footer>
                    <span>계정이 없으신가요?</span>
                    <button
                        type="button"
                        onClick={handleHuman}
                    >
                        회원가입
                    </button>
                </footer>
            </section>
        </main>
    )
}
export default Login;