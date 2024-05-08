"use server";

import { createTransport } from "nodemailer";

const reservationSendMail = async (emailTo: string, htmlContent: string) => {
  const transporter = createTransport({
    service: "gmail",
    host: "smpt.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const message = {
    from: process.env.NODEMAILER_EMAIL,
    to: emailTo,
    subject: "Potwierdzenie rezerwacji - strzelnica Precision",
    html: htmlContent,
  };

  await transporter.sendMail(message);
};

export default reservationSendMail;
