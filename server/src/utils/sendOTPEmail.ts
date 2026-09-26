import { sendEmail } from "./sendEmail.js";

export const sendOTPEmail = async (email: string, otp: string) => {
  await sendEmail({
    to: email,
    subject: "Your OTP Verification Code",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>OTP Verification</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        "
      >
        <div
          style="
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          "
        >
          <div
            style="
              background: #2563eb;
              padding: 20px;
              text-align: center;
            "
          >
            <h1 style="color: white; margin: 0;">
              Mother Project
            </h1>
          </div>

          <div style="padding: 30px;">
            <h2 style="color: #333;">
              OTP Verification
            </h2>

            <p style="font-size: 16px; color: #555;">
              Use the following OTP to complete your verification:
            </p>

            <div
              style="
                text-align: center;
                margin: 30px 0;
              "
            >
              <span
                style="
                  display: inline-block;
                  padding: 15px 30px;
                  background: #f3f4f6;
                  border-radius: 8px;
                  font-size: 32px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  color: #2563eb;
                "
              >
                ${otp}
              </span>
            </div>

            <p style="font-size: 14px; color: #888;">
              This OTP will expire in
              <strong>5 minutes</strong>.
            </p>

            <p style="font-size: 14px; color: #888;">
              If you did not request this code,
              you can safely ignore this email.
            </p>
          </div>

          <div
            style="
              background: #f8f9fa;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
            "
          >
            © Mother Project. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `,
  });
};
