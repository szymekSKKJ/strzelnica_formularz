import createResponse, { Response } from "@/app/api/createResponse";
import prisma from "@/prisma/prisma";
import { create } from "domain";

const GET = async () => {
  try {
    const data = await prisma.manufacturerOfWeapon.findMany();

    return createResponse(null, data);
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { GET };

const manufacturerOfWeaponGetAll = async (): Promise<
  Response<
    {
      id: string;
      name: string;
    }[]
  >
> => {
  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/manufacturerOfWeapon/get/all`, {
    cache: "no-cache",
  }).then(async (response) => await response.json());
};

export { manufacturerOfWeaponGetAll };
