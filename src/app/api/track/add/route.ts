import createResponse, { Response } from "@/app/api/createResponse";
import prisma from "@/prisma/prisma";
import { NextRequest } from "next/server";

const POST = async (request: NextRequest) => {
  try {
    const prismaResponse = await prisma.track.create({
      data: {},
    });

    return createResponse(null, prismaResponse);
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { POST };

const trackAdd = async (): Promise<
  Response<{
    id: string;
  }>
> => {
  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/track/add`, {
    method: "POST",
    cache: "no-store",
  }).then(async (response) => await response.json());
};

export { trackAdd };
