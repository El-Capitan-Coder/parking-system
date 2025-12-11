<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>OTP Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding:20px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; padding:30px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color:#333; text-align:center;">Email Verification</h2>
        <p style="font-size:16px; color:#555;">
            Hello, <br><br>
            Thank you for signing up with <strong>PASOK</strong>. To complete your registration, please use the verification code below:
        </p>
        <div style="text-align:center; margin:20px 0;">
            <span style="display:inline-block; font-size:28px; font-weight:bold; color:#2c3e50; letter-spacing:6px; padding:15px 25px; border:2px dashed #2c3e50; border-radius:6px;">
                {{ $otp }}
            </span>
        </div>
        <p style="font-size:16px; color:#555;">
            This code will expire in <strong>2 minutes</strong>. If you did not request this, please ignore this email.
        </p>
        <p style="font-size:14px; color:#888; text-align:center; margin-top:30px;">
            &copy; {{ date('Y') }} PASOK. All rights reserved.
        </p>
    </div>
</body>
</html>
