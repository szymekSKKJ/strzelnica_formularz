import { NextRequest } from "next/server";
import prisma from "@/prisma/prisma";
import createResponse from "../../createResponse";
import { WeaponType } from "@prisma/client";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    console.log("as");

    const manufacturer = JSON.parse(formData.get("manufacturers") as string) as string;
    const caliber = formData.get("caliber") as string;
    const type = formData.get("type") as WeaponType;
    const model = formData.get("model") as string;
    const rentalCost = parseFloat(formData.get("rentalCost") as string);
    const quantity = parseInt(formData.get("modequantityl") as string);

    const doesAlreadyExists = await prisma.weapon.findUnique({
      where: {
        model: model,
      },
    });

    if (doesAlreadyExists) {
      await prisma.weapon.update({
        where: {
          model: model,
        },
        data: {
          quantity: { increment: quantity },
          manufacturer: {
            connect: { name: manufacturer },
          },
        },
      });
    } else {
      await prisma.weapon.create({
        data: {
          caliber: caliber,
          type: type,
          model: model,
          rentalCost: rentalCost,
          quantity: quantity,
          manufacturer: {
            connect: { name: manufacturer },
          },
        },
      });
    }

    return createResponse(null, {});
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { POST };

const weaponAdd = async (caliber: string, type: WeaponType, manufacturers: string, model: string, rentalCost: number, quantity: number) => {
  const formData = new FormData();

  formData.set("caliber", `${caliber}`);
  formData.set("type", `${type}`);
  formData.set("manufacturers", `${JSON.stringify(manufacturers)}`);
  formData.set("model", `${model}`);
  formData.set("rentalCost", `${rentalCost}`);
  formData.set("quantity", `${quantity}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/weapon/add`, {
    method: "POST",
    body: formData,
  }).then(async (respone) => await respone.json());
};

export { weaponAdd };
