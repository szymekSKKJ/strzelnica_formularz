import { manufacturerOfWeaponGetSome } from "@/app/api/manufacturerOfWeapon/get/some/route";
import ManufacturerOfWeaponEditor from "@/components/AdminPanel/ManufacturerOfWeaponEditor/ManufacturerOfWeaponEditor";

interface componentProps {
  params: { dataType: string[] };
}

const availableRoutes = [
  {
    route: "producenci_broni",
    title: "Producenci broni",
    getDataCallback: async () => {
      return await manufacturerOfWeaponGetSome(11);
    },
    editor: ManufacturerOfWeaponEditor,
  },
  {
    route: "producenci_amunicji",
    title: "Producenci amunicji",
    getDataCallback: async () => {
      return await manufacturerOfWeaponGetSome();
    },
    editor: ManufacturerOfWeaponEditor,
  },
  {
    route: "bronie",
    title: "Bronie",
    getDataCallback: async () => {
      return await manufacturerOfWeaponGetSome();
    },
    editor: ManufacturerOfWeaponEditor,
  },
  {
    route: "amunicnja",
    title: "Amunicja",
    getDataCallback: async () => {
      return await manufacturerOfWeaponGetSome();
    },
    editor: ManufacturerOfWeaponEditor,
  },
];

export const availableRoutesOnlyRoutes = availableRoutes.map((data) => data.route);

const DataTypePage = async ({ params: { dataType } }: componentProps) => {
  const firstRouteSegment = dataType[0];

  const foundRoute = availableRoutes.find((data) => data.route === firstRouteSegment);

  if (foundRoute) {
    const dataResponse = await foundRoute.getDataCallback();

    const { route, title, editor: Editor } = foundRoute;

    if (dataResponse.error === null) {
      return <Editor data={dataResponse.data!}></Editor>;
    } else {
      return <p>Wystąpił błąd. Spróbuj ponownie</p>;
    }
  } else {
    return <p>Page not found</p>;
  }
};

export default DataTypePage;
