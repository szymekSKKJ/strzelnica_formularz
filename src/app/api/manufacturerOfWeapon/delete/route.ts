import prisma from "@/prisma/prisma";
import { NextRequest } from "next/server";
import createResponse from "../../createResponse";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const id = formData.get("id") as string;

    console.log(id);

    const response = await prisma.manufacturerOfWeapon.delete({
      where: {
        id: id,
      },
    });

    return createResponse(null, { response });
  } catch (e) {
    return createResponse(`${e}`, null);
  }
};

export { POST };

const manufacturerOfWeaponDelete = async (id: string) => {
  const formData = new FormData();

  formData.set("id", `${id}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/manufacturerOfWeapon/delete`, {
    method: "POST",
    body: formData,
    cache: "no-cache",
  }).then(async (response) => response.json());
};

export { manufacturerOfWeaponDelete };
