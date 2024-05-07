import createResponse, { Response } from "@/app/api/createResponse";
import prisma from "@/prisma/prisma";
import { NextRequest } from "next/server";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const bookedForStart = new Date(formData.get(`bookedForStart`) as string);
    const bookedForEnd = new Date(formData.get(`bookedForEnd`) as string) as Date;
    // const weaponsId = JSON.parse(formData.get(`weaponsId`) as string) as string[];
    const weaponsId = ["fd9910e3-2f67-42b8-bae1-ee1afe5eda3b"];

    bookedForStart.setMilliseconds(0);
    bookedForStart.setSeconds(0);

    bookedForEnd.setMilliseconds(0);
    bookedForEnd.setSeconds(0);

    const prismaResponse1 = await Promise.all(
      weaponsId.map(async (value) => {
        const response = await prisma.weapon.findUnique({
          where: {
            id: value,
          },
          select: {
            id: true,
            quantity: true,
            model: true,
            manufacturerOfWeaponName: true,
            reservation: {
              where: {
                bookedForStart: bookedForStart,
              },
            },
          },
        });

        if (response !== null) {
          return response;
        }
      })
    ).then((data) => data.filter((data) => data !== undefined));

    const weaponsThatAreNotAvailabe = prismaResponse1.filter((response) => {
      const { quantity, reservation } = response;

      if (reservation.length >= quantity) {
        return response;
      }
    });

    const modifiedWeaponsThatAreNotAvailable = weaponsThatAreNotAvailabe.map((data) => {
      const { id } = data;

      return {
        weaponId: id,
        reservation: {
          start: bookedForStart,
          end: bookedForEnd,
        },
      };
    });

    const prismaResponse2 = await prisma.track.findFirst({
      where: {
        OR: [
          {
            reservations: {
              none: {
                bookedForStart: bookedForStart,
              },
            },
          },
          {
            reservations: {
              none: {},
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    return createResponse(null, { notAvailableWeapons: modifiedWeaponsThatAreNotAvailable, availableTrack: prismaResponse2 });
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { POST };

const reservationGetCheckIfAvailable = async (
  bookedForStart: Date,
  bookedForEnd: Date,
  weaponsId: string[]
): Promise<
  Response<{
    notAvailableWeapons: {
      weaponId: string;
      reservation: {
        start: Date;
        end: Date;
      };
    }[];
    availableTrack: {
      id: string;
    } | null;
  }>
> => {
  const formData = new FormData();

  formData.set(`bookedForStart`, `${bookedForStart}`);
  formData.set(`bookedForEnd`, `${bookedForEnd}`);
  formData.set(`weaponsId`, `${JSON.stringify(weaponsId)}`);

  return await fetch(new Request(`${process.env.NEXT_PUBLIC_URL}/api/reservation/get/checkIfAvailable`), {
    method: "POST",
    body: formData,
    cache: "no-store",
  }).then(async (response) => await response.json());
};

export { reservationGetCheckIfAvailable };
