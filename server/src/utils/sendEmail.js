import nodemailer from "nodemailer";
import ApiError from "./ApiError.js";

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      service: process.env.SMPT_SERVICE,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: email,
      subject: subject,
      text: message,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ApiError(500, "Email could not be sent");
  }
};

export default sendEmail;
