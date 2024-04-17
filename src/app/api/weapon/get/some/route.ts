import createResponse, { Response } from "@/app/api/createResponse";
import prisma from "@/prisma/prisma";
import { $Enums } from "@prisma/client";
import { NextRequest } from "next/server";

const GET = async (request: NextRequest) => {
  try {
    const urlParams = request.nextUrl.searchParams;

    const take = parseInt(urlParams.get("take") as string);
    const skip = parseInt(urlParams.get("skip") as string);

    const response = await prisma.weapon.findMany({
      take: take,
      skip: skip,
      select: {
        manufacturer: true,
        id: true,
        type: true,
        model: true,
        caliber: true,
        quantity: true,
        rentalCost: true,
      },
    });

    return createResponse(null, response);
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { GET };

const weaponGetSome = async (
  take: number = 50,
  skip: number = 0
): Promise<
  Response<
    {
      id: string;
      caliber: string;
      type: $Enums.WeaponType;
      model: string;
      quantity: number;
      rentalCost: number;
      manufacturer: {
        id: string;
        name: string;
      };
    }[]
  >
> => {
  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/weapon/get/some/?take=${take}&skip=${skip}`, {
    cache: "no-cache",
  }).then(async (response) => await response.json());
};

export { weaponGetSome };
