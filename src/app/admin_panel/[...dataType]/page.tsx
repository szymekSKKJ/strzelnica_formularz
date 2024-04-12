import { manufacturerOfWeaponGetAll } from "@/app/api/manufacturerOfWeapon/get/all/route";
import DataEditor from "@/components/AdminPanel/DataEditor/DataEditor";

interface componentProps {
  params: { dataType: string[] };
}

const availableRoutes = [
  {
    route: "producenci_broni",
    title: "Producenci broni",
    columnHeaders: ["id", "name", "delete"],
    dataCallback: async () => {
      return await manufacturerOfWeaponGetAll();
    },
  },
  {
    route: "producenci_amunicji",
    title: "Producenci amunicji",
    columnHeaders: [""],
    dataCallback: async () => {
      return await manufacturerOfWeaponGetAll();
    },
  },
  {
    route: "bronie",
    title: "Bronie",
    columnHeaders: [""],
    dataCallback: async () => {
      return await manufacturerOfWeaponGetAll();
    },
  },
  {
    route: "amunicnja",
    title: "Amunicja",
    columnHeaders: [""],
    dataCallback: async () => {
      return await manufacturerOfWeaponGetAll();
    },
  },
];

const DataTypePage = async ({ params: { dataType } }: componentProps) => {
  const firstRouteSegment = dataType[0];

  const foundRoute = availableRoutes.find((data) => data.route === firstRouteSegment);

  if (foundRoute) {
    const dataResponse = await foundRoute.dataCallback();

    const { columnHeaders, title } = foundRoute;

    if (dataResponse.error === null) {
      return <DataEditor data={dataResponse.data!} title={title} columnHeaders={columnHeaders}></DataEditor>;
    } else {
      return <p>Wystąpił błąd. Spróbuj ponownie</p>;
    }
  } else {
    return <p>Page not found</p>;
  }
};

export default DataTypePage;
