export const forwardings = (formData) => {
    const message = {
        nick_name : "닉네임을 입력해주세요.",
        email : "이메일을 입력해주세요.",
        login_id : "아이디를 입력해주세요.",
        password : "비밀번호를 입력해주세요.",
        passwordConfirm : "비밀번호가 올바르지 않습니다."
    };

    const emptyField = Object.entries(formData).find(
        ([key,value]) => {
            return typeof value === "string" && value.trim() === "";
        }
    );

    if (emptyField) {
        const[key] = emptyField;

        return message[key];
    }

    return null;
};