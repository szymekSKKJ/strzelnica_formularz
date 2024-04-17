import { NextRequest } from "next/server";
import prisma from "@/prisma/prisma";
import createResponse, { Response } from "../../createResponse";
import { $Enums, WeaponType } from "@prisma/client";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const caliber = formData.get("caliber") as string;
    const type = formData.get("type") as WeaponType;
    const model = formData.get("model") as string;
    const rentalCost = parseFloat(formData.get("rentalCost") as string);
    const quantity = parseInt(formData.get("quantity") as string);
    const manufacturerName = formData.get("manufacturerName") as string;
    const id = (formData.get("id") as string) === "null" ? null : (formData.get("id") as string);

    const doesAlreadyExists =
      id === null
        ? await prisma.weapon.findUnique({
            where: {
              manufacturerOfWeaponName_model: {
                model: model,
                manufacturerOfWeaponName: manufacturerName,
              },
            },
          })
        : await prisma.weapon.findUnique({
            where: {
              id: id,
            },
          });

    if (doesAlreadyExists) {
      const existingData = doesAlreadyExists;

      if (id) {
        const response = await prisma.weapon.update({
          where: {
            id: existingData.id,
          },
          data: {
            caliber: caliber,
            type: type,
            model: model,
            rentalCost: rentalCost,
            quantity: quantity,
            manufacturerOfWeaponName: manufacturerName,
          },
        });

        return createResponse(null, response);
      } else {
        const response = await prisma.weapon.update({
          where: {
            id: existingData.id,
          },
          data: {
            quantity: { increment: quantity },
            rentalCost: rentalCost,
          },
        });

        return createResponse(null, response);
      }
    } else {
      const response = await prisma.weapon.create({
        data: {
          caliber: caliber,
          type: type,
          model: model,
          rentalCost: rentalCost,
          quantity: quantity,
          manufacturerOfWeaponName: manufacturerName,
        },
      });

      return createResponse(null, response);
    }
  } catch (error) {
    return createResponse(`${error}`, null);
  }
};

export { POST };

const weaponAdd = async (
  id: string | null,
  caliber: string,
  type: WeaponType,
  manufacturerName: string,
  model: string,
  rentalCost: number,
  quantity: number
): Promise<
  Response<{
    id: string;
    caliber: string;
    type: $Enums.WeaponType;
    manufacturerOfWeaponName: string;
    model: string;
    quantity: number;
    rentalCost: number;
  }>
> => {
  const formData = new FormData();

  formData.set("id", `${id}`);
  formData.set("caliber", `${caliber}`);
  formData.set("type", `${type}`);
  formData.set("manufacturerName", `${manufacturerName}`);
  formData.set("model", `${model}`);
  formData.set("rentalCost", `${rentalCost}`);
  formData.set("quantity", `${quantity}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/weapon/add`, {
    method: "POST",
    body: formData,
    cache: "no-cache",
  }).then(async (respone) => await respone.json());
};

export { weaponAdd };
