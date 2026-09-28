import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserInput from "../Components/UserInput";
import { login, getMe } from "../login_api/login_auth";

const Login = () => {
    const navigate = useNavigate();
    const savedEmail = localStorage.getItem("savedEmail");
    const [formData, setFormData] = useState({
        email: savedEmail || "",
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
            password: formData.password,
            keep_login: formData.keepLogin
        };
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

            alert(response.data.message);

            const meResponse = await getMe();
            console.log("현재 로그인 사용자 : ", meResponse.data);

            if (formData.keepLogin) {
                localStorage.setItem("savedEmail", loginData.email);
            } else {
                localStorage.removeItem("savedEmail");
            }



        } catch (error) {
            console.error("로그인 에러:", error);

            const message = error.response?.data?.detail ||
                "로그인 중 오류가 발생했습니다.";

            alert(message);
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