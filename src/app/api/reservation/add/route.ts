import { NextRequest } from "next/server";
import createResponse from "../../createResponse";
import { reservationGetCheckIfAvailable } from "../get/checkIfAvailable/route";
import prisma from "@/prisma/prisma";
import reservationSendMail from "../sendMail/route";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const bookedForStart = new Date(formData.get(`bookedForStart`) as string);
    const bookedForEnd = new Date(formData.get(`bookedForEnd`) as string) as Date;
    const weaponsId = JSON.parse(formData.get(`weaponsId`) as string) as string[];
    const email = formData.get(`email`) as string;
    const firstName = formData.get(`firstName`) as string;
    const lastName = formData.get(`lastName`) as string;
    const phoneNumber = parseInt(formData.get(`phoneNumber`) as string);

    bookedForStart.setMilliseconds(0);
    bookedForStart.setSeconds(0);

    bookedForEnd.setMilliseconds(0);
    bookedForEnd.setSeconds(0);

    const response = await reservationGetCheckIfAvailable(bookedForStart, bookedForEnd, weaponsId);

    if (response.error === null && response.data!.availableTrack !== null && response.data!.notAvailableWeapons.length === 0) {
      const prismaResponse = await prisma.reservation.create({
        data: {
          bookedForStart: bookedForStart,
          bookedForEnd: bookedForEnd,
          weapons: {
            connect: weaponsId.map((value) => {
              return {
                id: value,
              };
            }),
          },
          trackId: response.data!.availableTrack!.id,
          email: email,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
        },
      });

      const prismaResponse1 = await prisma.weapon.findMany({
        where: {
          id: { in: weaponsId },
        },
        select: {
          caliber: true,
          manufacturerOfWeaponName: true,
          model: true,
        },
      });

      const bcryptedReservationIdSalt = bcrypt.genSaltSync(10);
      const bcryptedReservationId = bcrypt.hashSync(prismaResponse.id, bcryptedReservationIdSalt);
      const jwtToken = jwt.sign({ bcryptedReservationId: bcryptedReservationId, reservationId: prismaResponse.id }, `${process.env.JWT_TOKEN}`);

      const htmlContent = `
      <html>
        <body>
          <h1>Potwierdzenie rezerwacji - strzelnica Precision</h1>
          <p>Dane:</p>
          <p>${firstName} ${lastName}</p>
          <p>na godzinę ${bookedForStart.toLocaleDateString("pl-PL", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            weekday: "long",
          })} - ${bookedForEnd.toLocaleTimeString("pl-PL", {
        hour: "numeric",
        minute: "numeric",
      })}
          </p>
          <p>Nr telefonu: ${phoneNumber}</p>
          <p>Bronie</p>
            ${prismaResponse1.map((data) => {
              const { caliber, manufacturerOfWeaponName, model } = data;

              return `<p>${model} ${manufacturerOfWeaponName} ${caliber}</p>`;
            })}
          <p>W celu anulowania rezerwacji kliknij w poiższy link:</p>
          <a href="${process.env.NEXT_PUBLIC_URL}/cancelReservation/${jwtToken}">${process.env.NEXT_PUBLIC_URL}/cancelReservation/${jwtToken}
      }</a>
        </body>
      </html>
      `;

      await reservationSendMail(email, htmlContent);

      return createResponse(null, null);
    } else {
      throw new Error("Wybrane kryteria są nieprawidłowe");
    }
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { POST };

const reservationAdd = async (
  bookedForStart: Date,
  bookedForEnd: Date,
  weaponsId: string[],
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: number
) => {
  const formData = new FormData();

  formData.set(`bookedForStart`, `${bookedForStart}`);
  formData.set(`bookedForEnd`, `${bookedForEnd}`);
  formData.set(`weaponsId`, JSON.stringify(weaponsId));
  formData.set(`email`, `${email}`);
  formData.set(`firstName`, `${firstName}`);
  formData.set(`lastName`, `${lastName}`);
  formData.set(`phoneNumber`, `${phoneNumber}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/reservation/add`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  }).then(async (response) => await response.json());
};

export { reservationAdd };
