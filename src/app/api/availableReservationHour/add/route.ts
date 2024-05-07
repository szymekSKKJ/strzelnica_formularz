import { NextRequest } from "next/server";
import createResponse, { Response } from "../../createResponse";
import prisma from "@/prisma/prisma";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const hourStart = formData.get("hourStart") as string;
    const hourEnd = formData.get("hourEnd") as string;

    const prismaResponse = await prisma.availableReservationHour.create({
      data: {
        start: hourStart,
        end: hourEnd,
      },
    });

    return createResponse(null, { id: prismaResponse.id });
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { POST };

const availableReservationHourAdd = async (hourStart: string, hourEnd: string): Promise<Response<{ id: string }>> => {
  const formData = new FormData();

  formData.set("hourStart", `${hourStart}`);
  formData.set("hourEnd", `${hourEnd}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/availableReservationHour/add`, {
    body: formData,
    method: "POST",
    cache: "no-store",
  }).then(async (response) => await response.json());
};

export { availableReservationHourAdd };
