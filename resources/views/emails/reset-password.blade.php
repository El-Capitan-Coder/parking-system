<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>PASOK - Reset Password</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding:20px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; padding:30px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        
        <h2 style="color:#1E453E; text-align:center;">Reset Your Password</h2>
        
        <p style="font-size:16px; color:#555;">
            Hello, <br><br>
            We received a request to reset the password for your <strong>PASOK </strong> account. 
            To proceed, please click the button below:
        </p>
        
        <div style="text-align:center; margin:30px 0;">
            <a href="{{ $resetUrl }}" 
               style="background-color:#f77e2d; color:#fff; text-decoration:none; padding:15px 25px; border-radius:6px; font-size:16px; font-weight:bold; display:inline-block;">
                Reset My Password
            </a>
        </div>
        
        <p style="font-size:16px; color:#555;">
            This link will expire in <strong>30 minutes</strong>. <br>
            If you did not request a password reset, you can safely ignore this message.
        </p>
        
        <p style="font-size:14px; color:#888; text-align:center; margin-top:30px;">
            &copy; {{ date('Y') }} PASOK. All rights reserved.
        </p>
    </div>
</body>
</html>
