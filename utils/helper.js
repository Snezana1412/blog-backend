import nodemailer from "nodemailer";
import crypto from 'crypto';
import { verifyToken } from "./jwt.js";
import Verify from "../models/verify.tokens.model.js";

/* -------------- generate errors ------------- */
export const createError = (msg, status) => {
  const err = new Error(msg);
  if (status) err.status = status;
  return err;
};

/* ----------- generate verification ---------- */
export const gen_verification_token = async (user) => {
  const verify_token = crypto.randomBytes(16).toString("hex");

  return await Verify.create({
    token: verify_token,
    userid: user._id,
  });
};

/* ---------- generate email template --------- */
export const genEmailTemplate = (name, token, userid) => {
  const link = `https://localhost:3000/register/${token}/${userid}`;

  return `
        Dear ${name},
        Thank you for registering with our Blog! To complete your registration, please verify your email address by clicking the link below:

        <a href="${link}">Verify Email Address</a>

        If the button above does not work, please copy and paste the following URL into your web browser:

        <a href="${link}">${link}</a>

        This link will expire in 24 hours, so please complete your verification as soon as possible.
        If you did not create an account with us, please ignore this email.

        Thank you!
        Best regards,
    `;
};
/* ---------------- send emails --------------- */
export const sendEmail = async (user, token) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 465,
      secure: true, // user `true` for port 465
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Verify Your Blog Account! 😊",
      html: genEmailTemplate(user.fullname, token, user._id),
    });

  } catch (error) {
    console.error(error);
  }
};
