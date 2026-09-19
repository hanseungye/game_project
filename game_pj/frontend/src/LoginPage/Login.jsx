import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const handleHuman = () => {
        navigate("/account");
    }
    return (
        <main>
            <section>
                <header>
                    <h1>GAME FIT</h1>
                    <h2>다시 오신 것을 환영합니다</h2>
                    <p>로그인</p>
                </header>

                {/*로그인 */}
                <form>
                    <div>
                        <label htmlFor="email">이메일</label>
                        <br></br>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="이메일을 입력하세요"
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password">비밀번호</label>
                        <br></br>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            autoComplete="current-password"
                        />
                    </div>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                name="keepLogin"
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