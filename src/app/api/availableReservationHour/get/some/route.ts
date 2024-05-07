import { NextRequest } from "next/server";
import createResponse, { Response } from "../../../createResponse";
import prisma from "@/prisma/prisma";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const take = parseInt(formData.get("take") as string);
    const skip = parseInt(formData.get("skip") as string);

    const prismaResponse = await prisma.availableReservationHour.findMany({
      skip: skip,
      take: take,
    });

    return createResponse(null, prismaResponse);
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { POST };

const availableReservationHourGetSome = async (
  take: number = 100,
  skip: number = 0
): Promise<
  Response<
    {
      id: string;
      start: string;
      end: string;
    }[]
  >
> => {
  const formData = new FormData();

  formData.set("take", `${take}`);
  formData.set("skip", `${skip}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/availableReservationHour/get/some`, {
    body: formData,
    method: "POST",
    cache: "no-store",
  }).then(async (response) => await response.json());
};

export { availableReservationHourGetSome };
