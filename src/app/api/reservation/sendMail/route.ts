"use server";

import { createTransport } from "nodemailer";

const reservationSendMail = async (emailTo: string, htmlContent: string) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const message = {
    from: `s.stepniak01@gmail.com`,
    to: emailTo,
    subject: "Potwierdzenie rezerwacji - strzelnica Precision",
    html: htmlContent,
  };

  const response = await transporter.sendMail(message);

  return response;
};

export default reservationSendMail;
