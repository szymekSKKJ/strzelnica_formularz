import { NextRequest } from "next/server";
import prisma from "@/prisma/prisma";
import createResponse from "../../createResponse";
import { AmmunitionType } from "@prisma/client";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const manufacturer = JSON.parse(formData.get("manufacturers") as string) as string;
    const name = formData.get("name") as string;
    const caliber = formData.get("caliber") as string;
    const pricePerItem = parseFloat(formData.get("pricePerItem") as string);
    const type = formData.get("type") as AmmunitionType;
    const quantity = parseInt(formData.get("quantity") as string);

    const doesAlreadyExists = await prisma.ammunition.findUnique({
      where: {
        caliber: caliber,
      },
    });

    if (doesAlreadyExists) {
      await prisma.ammunition.update({
        where: {
          caliber: caliber,
        },
        data: {
          quantityTotal: { increment: quantity },
          manufacturer: {
            update: {
              where: {
                name: manufacturer,
              },
              data: {
                quantity: quantity,
              },
            },
          },
        },
      });
    } else {
      await prisma.ammunition.create({
        data: {
          name: name,
          caliber: caliber,
          manufacturer: {
            connect: { name: manufacturer },
          },
          pricePerItem: pricePerItem,
          type: type,
          quantityTotal: quantity,
        },
      });

      await prisma.manufacturerOfAmmunition.update({
        where: {
          name: manufacturer,
        },
        data: {
          quantity: { increment: quantity },
        },
      });
    }

    return createResponse(null, {});
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { POST };

const ammunitionAdd = async (name: string, caliber: string, manufacturer: string, pricePerItem: number, type: AmmunitionType, quantity: number) => {
  const formData = new FormData();

  formData.set("name", `${name}`);
  formData.set("caliber", `${caliber}`);
  formData.set("manufacturer", `${manufacturer}`);
  formData.set("pricePerItem", `${pricePerItem}`);
  formData.set("type", `${type}`);
  formData.set("quantity", `${quantity}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ammunition/add`, {
    method: "POST",
    body: formData,
  }).then(async (respone) => await respone.json());
};

export { ammunitionAdd };
