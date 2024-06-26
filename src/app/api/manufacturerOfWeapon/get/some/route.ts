import createResponse, { Response } from "@/app/api/createResponse";
import prisma from "@/prisma/prisma";
import { NextRequest } from "next/server";

const GET = async (request: NextRequest) => {
  try {
    const urlParams = request.nextUrl.searchParams;

    const take = parseInt(urlParams.get("take") as string);
    const skip = parseInt(urlParams.get("skip") as string);

    const data = await prisma.manufacturerOfWeapon.findMany({
      take: take,
      skip: skip,
    });

    return createResponse(null, data);
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { GET };

export const dynamic = "force-dynamic";

const manufacturerOfWeaponGetSome = async (
  take: number = 50,
  skip: number = 0
): Promise<
  Response<
    {
      id: string;
      name: string;
    }[]
  >
> => {
  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/manufacturerOfWeapon/get/some/?take=${take}&skip=${skip}`, {
    cache: "no-store",
  }).then(async (response) => await response.json());
};

export { manufacturerOfWeaponGetSome };
