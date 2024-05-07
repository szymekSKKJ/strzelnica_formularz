import prisma from "@/prisma/prisma";
import { NextRequest } from "next/server";
import createResponse, { Response } from "../../createResponse";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const start = formData.get("start") as string;
    const end = formData.get("end") as string;

    await prisma.availableReservationHour.update({
      where: {
        id: id,
      },
      data: {
        start: start,
        end: end,
      },
    });

    return createResponse(null, null);
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { POST };

const availableReservationHourUpdate = async (id: string, start: string, end: string): Promise<Response<null>> => {
  const formData = new FormData();

  formData.set("id", `${id}`);
  formData.set("start", `${start}`);
  formData.set("end", `${end}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/availableReservationHour/update/`, {
    body: formData,
    method: "POST",
  }).then(async (response) => await response.json());
};

export { availableReservationHourUpdate };
