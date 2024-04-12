import { NextRequest } from "next/server";
import createResponse from "../../createResponse";
import prisma from "@/prisma/prisma";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const quantity = parseInt(formData.get("quantity") as string);

    const doesAlreadyExists = await prisma.manufacturerOfAmmunition.findUnique({
      where: {
        name: name,
      },
    });

    if (doesAlreadyExists) {
      await prisma.manufacturerOfAmmunition.update({
        where: {
          name: name,
        },
        data: {
          quantity: { increment: quantity },
        },
      });
    } else {
      await prisma.manufacturerOfAmmunition.create({
        data: {
          name: name,
          quantity: quantity,
        },
      });
    }

    return createResponse(null, {});
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { POST };

const manufacturerOfAmmunitionAdd = async (name: string, quantity: number) => {
  const formData = new FormData();

  formData.set("name", `${name}`);
  formData.set("quantity", `${quantity}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/manufacturerOfAmmunition/add`, {
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json());
};

export { manufacturerOfAmmunitionAdd };
