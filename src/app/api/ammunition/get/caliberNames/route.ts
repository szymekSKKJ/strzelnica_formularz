import createResponse, { Response } from "@/app/api/createResponse";
import prisma from "@/prisma/prisma";
import { NextRequest } from "next/server";

const GET = async (request: NextRequest) => {
  try {
    const response = await prisma.ammunition.findMany({
      distinct: ["caliber"],
      select: {
        caliber: true,
      },
    });

    return createResponse(null, response);
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { GET };

export const dynamic = "force-dynamic";

const ammunitionGetCaliberNames = async (): Promise<
  Response<
    {
      caliber: string;
    }[]
  >
> => {
  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ammunition/get/caliberNames`, {
    cache: "no-store",
  }).then(async (response) => await response.json());
};

export { ammunitionGetCaliberNames };
