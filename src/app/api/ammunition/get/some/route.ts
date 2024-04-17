import createResponse, { Response } from "@/app/api/createResponse";
import prisma from "@/prisma/prisma";
import { $Enums } from "@prisma/client";
import { NextRequest } from "next/server";

const GET = async (request: NextRequest) => {
  try {
    const urlParams = request.nextUrl.searchParams;

    const take = parseInt(urlParams.get("take") as string);
    const skip = parseInt(urlParams.get("skip") as string);

    const response = await prisma.ammunition.findMany({
      take: take,
      skip: skip,
    });

    return createResponse(null, response);
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { GET };

const ammunitionGetSome = async (
  take: number = 50,
  skip: number = 0
): Promise<
  Response<
    {
      id: string;
      name: string;
      caliber: string;
      manufacturerOfAmmunitionName: string | null;
      quantity: number;
      pricePerItem: number;
      type: $Enums.AmmunitionType;
    }[]
  >
> => {
  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ammunition/get/some/?take=${take}&skip=${skip}`, {
    cache: "no-store",
  }).then(async (response) => await response.json());
};

export { ammunitionGetSome };
