import createResponse from "@/app/api/createResponse";
import prisma from "@/prisma/prisma";
import { NextRequest } from "next/server";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const take = parseInt(formData.get("take") as string);
    const skip = parseInt(formData.get("skip") as string);

    const prismaResponse = await prisma.track.findMany({
      take: take,
      skip: skip,
    });

    return createResponse(null, prismaResponse);
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { POST };

const trackGetSome = async (take: number = 1000, skip: number = 0) => {
  const formData = new FormData();

  formData.set(`take`, `${take}`);
  formData.set(`skip`, `${skip}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/track/get/some`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  }).then(async (response) => await response.json());
};

export { trackGetSome };
