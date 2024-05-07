import { NextRequest } from "next/server";
import createResponse, { Response } from "../../createResponse";
import prisma from "@/prisma/prisma";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;

    await prisma.availableReservationHour.delete({
      where: {
        id: id,
      },
    });

    return createResponse(null, null);
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { POST };

const availableReservationHourDelete = async (id: string): Promise<Response<null>> => {
  const formData = new FormData();

  formData.set("id", `${id}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/availableReservationHour/delete/`, {
    body: formData,
    method: "POST",
    cache: "no-store",
  }).then(async (response) => await response.json());
};

export { availableReservationHourDelete };
