import { ammunitionGetSome } from "@/app/api/ammunition/get/some/route";
import { availableReservationHourGetSome } from "@/app/api/availableReservationHour/get/some/route";
import { manufacturerOfAmmunitionGetSome } from "@/app/api/manufacturerOfAmmunition/get/some/route";
import { manufacturerOfWeaponGetSome } from "@/app/api/manufacturerOfWeapon/get/some/route";
import { reservationGetSome } from "@/app/api/reservation/get/some/route";
import { weaponGetSome } from "@/app/api/weapon/get/some/route";
import AmmunitionEditor from "@/components/AdminPanel/AmmunitionEditor/AmmunitionEditor";
import AvailableHoursEditor from "@/components/AdminPanel/AvailableHoursEditor/AvailableHoursEditor";
import ManufacturerOfAmmunitionEditor from "@/components/AdminPanel/ManufacturerOfAmmunitionEditor/ManufacturerOfAmmunitionEditor";
import ManufacturerOfWeaponEditor from "@/components/AdminPanel/ManufacturerOfWeaponEditor/ManufacturerOfWeaponEditor";
import ReservationEditor from "@/components/AdminPanel/ReservationEditor/ReservationEditor";
import WeaponEditor from "@/components/AdminPanel/WeaponEditor/WeaponEditor";

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
  {
    route: "dostepne_godziny",
    title: "Dostępne godziny",
    getDataCallback: async () => {
      return await availableReservationHourGetSome();
    },
    editor: AvailableHoursEditor,
  },
  {
    route: "rezerwacje",
    title: "Rezerwacje",
    getDataCallback: async () => {
      return await reservationGetSome();
    },
    editor: ReservationEditor,
  },
];

const DataTypePage = async ({ params: { dataType } }: componentProps) => {
  const firstRouteSegment = dataType[0];

  const foundRoute = availableRoutes.find((data) => data.route === firstRouteSegment);

  if (foundRoute) {
    const dataResponse = await foundRoute.getDataCallback();

    const { editor: Editor } = foundRoute;

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
