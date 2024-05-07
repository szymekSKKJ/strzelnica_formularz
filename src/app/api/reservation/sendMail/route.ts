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
    to: emailTo,
    subject: "Potwierdzenie rezerwacji - strzelnica Precision",
    html: htmlContent,
  };

  const response = await transporter.sendMail(message);

  console.log(response);
};

export default reservationSendMail;
