export const emailCheck = (email,emailRegex) => {
    if (!emailRegex.test(email)){
        return "올바른 이메일을 입력해주세요.";
    }
    // 일치하면 null을 반환
    return null
}