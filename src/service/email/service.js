const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com", ///smtp - protocol of gmail which i s used for email
  secure: false,
     auth: {
    user: 'fathimariyaa096@gmail.com',
    pass: 'obkn mfgj sqkp yier',   
  },

});

async function sendMail(email,otp) {
  const mail = {
    from: "fathimariyaa096@gmail.com",
    to: email,
    subject: "OTP verification",
    html: `<!DOCTYPE html>
<html>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px;">
      <h2 style="color: #333333; text-align: center;">Your OTP Code</h2>
      <p style="color: #555555; font-size: 16px; line-height: 1.5; text-align: center;">
        Hello, 
      </p>
      <p style="color: #555555; font-size: 16px; line-height: 1.5; text-align: center;">
        Use the OTP below to complete your verification process. This OTP is valid for <b style="color: teal;">120 seconds</b>.
      </p>
      <p style="background-color: #f0f8ff; color: #333333; font-size: 24px; font-weight: bold; text-align: center; padding: 10px 20px; border-radius: 4px; letter-spacing: 2px; margin: 20px auto; display: inline-block;">
      ${otp}
      </p>
      <p style="color: #777777; font-size: 14px; text-align: center; line-height: 1.5;">
        If you did not request this OTP, please ignore this email or contact support for assistance.
      </p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      <p style="color: #555555; font-size: 14px; text-align: center;">
        Thank you,<br>
        <b>Your Company Team</b>
      </p>
    </div>
  </body>
</html>
`,
  };
  try {
    await transporter.sendMail(mail);
    return;
  } catch (error) {
    console.log(error); // coustom error
  }
}


module.exports=sendMail
