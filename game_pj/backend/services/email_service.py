import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from config import EMAIL_ADDRESS, EMAIL_APP_PASSWORD

def send_verification_email(
    receiver_email : str,
    verification_code: str      
):
    sender_email = EMAIL_ADDRESS
    app_passowrd = EMAIL_APP_PASSWORD
    print(f"비밀번호 로딩 : ", bool(EMAIL_APP_PASSWORD))
    print(f"비밀번호 길이 : ", len(EMAIL_APP_PASSWORD))
    message = MIMEMultipart()

    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = "GAME FIT 이메일 인증"

    body = f"""
    GAME FIT 회원가입 인증번호입니다.

    인증번호: {verification_code}

    인증번호는 일정 시간이 지나면 만료됩니다.
    """

    message.attach(
        MIMEText(body,"plain","utf-8")
    )

    with smtplib.SMTP_SSL(
        "smtp.gmail.com",
        465
    ) as smtp:
        smtp.login(
            sender_email,
            app_passowrd
        )

        smtp.sendmail(
            sender_email,
            receiver_email,
            message.as_string()
        )
def main():
    send_verification_email(
        receiver_email=EMAIL_ADDRESS,
        verification_code=EMAIL_APP_PASSWORD
    )


if __name__ == "__main__":
    main()