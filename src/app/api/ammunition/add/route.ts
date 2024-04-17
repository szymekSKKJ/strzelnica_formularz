import { NextRequest } from "next/server";
import prisma from "@/prisma/prisma";
import createResponse, { Response } from "../../createResponse";
import { $Enums, AmmunitionType } from "@prisma/client";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const manufacturerOfAmmunitionName = formData.get("manufacturerOfAmmunitionName") as string;
    const name = formData.get("name") as string;
    const caliber = formData.get("caliber") as string;
    const pricePerItem = parseFloat(formData.get("pricePerItem") as string);
    const type = formData.get("type") as AmmunitionType;
    const quantity = parseInt(formData.get("quantity") as string);

    const doesAlreadyExists = await prisma.ammunition.findUnique({
      where: {
        manufacturerOfAmmunitionName_caliber: {
          manufacturerOfAmmunitionName: manufacturerOfAmmunitionName,
          caliber: caliber,
        },
      },
    });

    if (doesAlreadyExists) {
      const existingData = doesAlreadyExists;

      await prisma.ammunition.update({
        where: {
          id: existingData.id,
        },
        data: {
          quantity: { increment: quantity },
        },
      });
    } else {
      const response = await prisma.ammunition.create({
        data: {
          name: name,
          caliber: caliber,
          manufacturerOfAmmunitionName: manufacturerOfAmmunitionName,
          pricePerItem: pricePerItem,
          type: type,
          quantity: quantity,
        },
      });

      return createResponse(null, response);
    }
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { POST };

const ammunitionAdd = async (
  name: string,
  caliber: string,
  manufacturerOfAmmunitionName: string,
  pricePerItem: number,
  type: AmmunitionType,
  quantity: number
): Promise<
  Response<{
    id: string;
    name: string;
    caliber: string;
    manufacturerOfAmmunitionName: string;
    quantity: number;
    pricePerItem: number;
    type: $Enums.AmmunitionType;
  }>
> => {
  const formData = new FormData();

  formData.set("name", `${name}`);
  formData.set("caliber", `${caliber}`);
  formData.set("manufacturerOfAmmunitionName", `${manufacturerOfAmmunitionName}`);
  formData.set("pricePerItem", `${pricePerItem}`);
  formData.set("type", `${type}`);
  formData.set("quantity", `${quantity}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ammunition/add`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  }).then(async (respone) => await respone.json());
};

export { ammunitionAdd };
