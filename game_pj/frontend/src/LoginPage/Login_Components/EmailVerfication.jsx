import UserInput from "../../Components/UserInput";
import UserButton from "../../Components/UserButton";
const EmailVerfication = ({
    email, // 사용자가 이메일을 입력하면 저장할 함수
    setEmail, // Email 이메일 상태 관리 함수
    verificationCode, // 인증번호 코드를 저장할 함수
    setVerficationCode, // verficationCode set 인증번호 코드를 저장할 함수
    isCodeSent, // 코드 일치 여부(bool)
    handleSendCode, // 인증번호를 발송하면 해당 Rest api주소에 보냄.
    handleVerifyCode, // 유저가 인증번호 입력한 값을 rest api 주소로 보냄.
}) => {
    return (
        <div>
            <UserInput
                label="이메일"
                id="email"
                name="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <UserButton
                type="button"
                onClick={handleSendCode}
                text_human="인증번호 발송"
            />
            {/*인증번호 버튼을 누른 경우*/}
            {isCodeSent && (
                <>
                    <UserInput
                        label="인증번호"
                        id="verificationCode"
                        name="verificationCode"
                        type="text"
                        placeholder="인증번호를 입력하세요"
                        value={verificationCode}
                        onChange={(e) => {
                            setVerficationCode(e.target.value)
                        }}
                    />

                    <UserButton
                        type="button"
                        onClick={handleVerifyCode}
                        text_human="인증번호 확인"
                    />
                </>
            )}
        </div>
    )
}
export default EmailVerfication