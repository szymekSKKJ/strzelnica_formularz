import createResponse, { Response } from "@/app/api/createResponse";
import prisma from "@/prisma/prisma";
import { NextRequest } from "next/server";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;

    await prisma.track.delete({
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

const trackDeleteById = async (id: string) => {
  const formData = new FormData();

  formData.set("id", `${id}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/track/delete/byId`, {
    method: "POST",
    cache: "no-store",
    body: formData,
  }).then(async (response) => await response.json());
};

export { trackDeleteById };
