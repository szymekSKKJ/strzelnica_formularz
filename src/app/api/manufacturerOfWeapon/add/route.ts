import { NextRequest } from "next/server";
import createResponse, { Response } from "../../createResponse";
import prisma from "@/prisma/prisma";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;

    const doesAlreadyExists = await prisma.manufacturerOfWeapon.findUnique({
      where: {
        name: name,
      },
    });

    if (doesAlreadyExists) {
      throw new Error(`Producent "${name}" jest już dodany`);
    } else {
      const response = await prisma.manufacturerOfWeapon.create({
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

const manufacturerOfWeaponAdd = async (
  name: string
): Promise<
  Response<{
    id: string;
    name: string;
  }>
> => {
  const formData = new FormData();

  formData.set("name", `${name}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/manufacturerOfWeapon/add`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  }).then(async (response) => await response.json());
};

export { manufacturerOfWeaponAdd };
