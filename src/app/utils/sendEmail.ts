import nodeMailer from "nodemailer";
import config from "../config";

const sendEmail = async (email: string, html: string) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"Health Care" <janeyrahman900@gmail.com>',
    to: email,
    subject: "Reset Password",
    html,
  });
};

export default sendEmail;
