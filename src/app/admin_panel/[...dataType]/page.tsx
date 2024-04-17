import { ammunitionGetSome } from "@/app/api/ammunition/get/some/route";
import { manufacturerOfAmmunitionGetSome } from "@/app/api/manufacturerOfAmmunition/get/some/route";
import { manufacturerOfWeaponGetSome } from "@/app/api/manufacturerOfWeapon/get/some/route";
import { weaponGetSome } from "@/app/api/weapon/get/some/route";
import AmmunitionEditor from "@/components/AdminPanel/AmmunitionEditor/AmmunitionEditor";
import ManufacturerOfAmmunitionEditor from "@/components/AdminPanel/ManufacturerOfAmmunitionEditor/ManufacturerOfAmmunitionEditor";

import ManufacturerOfWeaponEditor from "@/components/AdminPanel/ManufacturerOfWeaponEditor/ManufacturerOfWeaponEditor";
import WeaponEditor from "@/components/AdminPanel/WeaponEditor/WeaponEditor";
import { randomUUID } from "crypto";

interface componentProps {
  params: { dataType: string[] };
}

const availableRoutes = [
  {
    route: "producenci_broni",
    title: "Producenci broni",
    getDataCallback: async () => {
      return await manufacturerOfWeaponGetSome();
    },
    editor: ManufacturerOfWeaponEditor,
  },
  {
    route: "producenci_amunicji",
    title: "Producenci amunicji",
    getDataCallback: async () => {
      return manufacturerOfAmmunitionGetSome();
    },
    editor: ManufacturerOfAmmunitionEditor,
  },
  {
    route: "bronie",
    title: "Bronie",
    getDataCallback: async () => {
      return await weaponGetSome();
    },
    editor: WeaponEditor,
  },
  {
    route: "amunicja",
    title: "Amunicja",
    getDataCallback: async () => {
      return await ammunitionGetSome();
    },
    editor: AmmunitionEditor,
  },
];

const DataTypePage = async ({ params: { dataType } }: componentProps) => {
  const firstRouteSegment = dataType[0];

  const foundRoute = availableRoutes.find((data) => data.route === firstRouteSegment);

  if (foundRoute) {
    const dataResponse = await foundRoute.getDataCallback();

    const { editor: Editor } = foundRoute;

    console.log(dataResponse.error);

    if (dataResponse.error === null) {
      //@ts-ignore
      return <Editor data={dataResponse.data!}></Editor>;
    } else {
      return <p>Wystąpił błąd. Spróbuj ponownie</p>;
    }
  } else {
    return <p>Page not found</p>;
  }
};

export default DataTypePage;
