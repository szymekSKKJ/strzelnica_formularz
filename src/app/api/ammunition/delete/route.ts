import { NextRequest } from "next/server";
import createResponse from "../../createResponse";
import prisma from "@/prisma/prisma";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const id = formData.get("id") as string;

    await prisma.ammunition.delete({
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

const ammunitionDelete = async (id: string) => {
  const formData = new FormData();

  formData.set("id", `${id}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ammunition/delete`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  }).then(async (response) => await response.json());
};

export { ammunitionDelete };
