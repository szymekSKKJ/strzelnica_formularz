import { NextRequest } from "next/server";
import createResponse from "../../createResponse";
import prisma from "@/prisma/prisma";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;

    const doesAlreadyExists = await prisma.manufacturerOfAmmunition.findUnique({
      where: {
        name: name,
      },
    });

    if (doesAlreadyExists) {
      throw new Error("Ten producent już istnieje");
    } else {
      const response = await prisma.manufacturerOfAmmunition.create({
        data: {
          name: name,
        },
      });

      return createResponse(null, response);
    }
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { POST };

const manufacturerOfAmmunitionAdd = async (name: string) => {
  const formData = new FormData();

  formData.set("name", `${name}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/manufacturerOfAmmunition/add`, {
    method: "POST",
    body: formData,
    cache: "no-cache",
  }).then(async (response) => await response.json());
};

export { manufacturerOfAmmunitionAdd };
