"use client";

import Button from "@/components/UI/Button/Button";
import styles from "./styles.module.scss";

import { AgGridReact } from "@ag-grid-community/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ValueSetterParams } from "@ag-grid-community/core";
import { $Enums } from "@prisma/client";
import { manufacturerOfWeaponGetSome } from "@/app/api/manufacturerOfWeapon/get/some/route";
import { weaponAdd } from "@/app/api/weapon/add/route";
import { ammunitionGetSome } from "@/app/api/ammunition/get/some/route";
import { ammunitionGetCaliberNames } from "@/app/api/ammunition/get/caliberNames/route";
import { weaponDelete } from "@/app/api/weapon/delete/route";
import { weaponGetSome } from "@/app/api/weapon/get/some/route";

const mergeArrays = <T,>(arr1: T[], arr2: T[], key: keyof T) => {
  const merged = arr1.concat(arr2);

  const result = merged.reduce((acc: T[], obj) => {
    const found = acc.some((item) => item[key] === obj[key]);
    if (!found) {
      acc.push(obj);
    }
    return acc;
  }, []);
  return result;
};

const columnHeaders = [
  {
    field: "id",
    headerName: "Id",
    flex: 1,
    editable: null,
    valueFormatter: null,
    cellRenderer: null,
    cellEditor: null,
    valueSetter: null,
    cellEditorParams: null,
  },
  {
    field: "caliber",
    headerName: "Kaliber",
    flex: 1,
    editable: (params: ValueSetterParams) => {
      return params.data.isEditable;
    },
    valueFormatter: null,
    cellRenderer: null,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: [],
    },
    valueSetter: null,
  },
  {
    field: "type",
    headerName: "Typ",
    flex: 1,
    editable: (params: ValueSetterParams) => {
      return params.data.isEditable;
    },
    valueFormatter: null,
    cellRenderer: null,
    cellEditor: "agSelectCellEditor",
    valueSetter: null,
    cellEditorParams: {
      values: ["pistolet", "karabin"],
    },
  },
  {
    field: "manufacturer",
    headerName: "Producent",
    flex: 1,
    editable: (params: ValueSetterParams) => {
      return params.data.isEditable;
    },
    valueFormatter: null,
    cellRenderer: null,
    cellEditor: "agSelectCellEditor",
    valueSetter: null,
    cellEditorParams: {
      values: [],
    },
  },
  {
    field: "model",
    headerName: "Model",
    flex: 1,
    editable: (params: ValueSetterParams) => {
      return params.data.isEditable;
    },
    valueFormatter: null,
    cellRenderer: null,
    cellEditor: null,
    valueSetter: null,
    cellEditorParams: null,
  },
  {
    field: "rentalCost",
    headerName: "Koszt wypożyczenia",
    flex: 1,
    editable: (params: ValueSetterParams) => {
      return params.data.isEditable;
    },
    valueFormatter: (params: any) => {
      return `${(Math.round(parseFloat(params.value) * 100) / 100).toFixed(2)} zł`;
    },
    cellRenderer: null,
    cellEditor: null,
    valueSetter: null,
    cellEditorParams: null,
  },
  {
    field: "quantity",
    headerName: "Ilość",
    flex: 1,
    editable: (params: ValueSetterParams) => {
      return params.data.isEditable;
    },
    valueFormatter: null,
    cellRenderer: null,
    cellEditor: null,
    valueSetter: null,
    cellEditorParams: null,
  },
  {
    field: "select",
    headerName: "Zaznacz",
    editable: true,
    flex: null,
    cellRenderer: "agCheckboxCellRenderer",
    cellEditor: "agCheckboxCellEditor",
    valueSetter: (params: ValueSetterParams) => {
      if (params.data.isSelected === true) {
        params.data.isSelected = false;
      } else {
        params.data.isSelected = true;
      }
      return true;
    },
    cellEditorParams: null,
  },
];

type weapon = {
  id: string;
  caliber: string | null;
  type: $Enums.WeaponType | null;
  model: string | null;
  quantity: number | null;
  rentalCost: number | null;
  manufacturer: {
    id: string;
    name: string;
  } | null;
};

interface componentProps {
  data: weapon[];
}

const WeaponEditor = ({ data }: componentProps) => {
  const router = useRouter();

  const formattedData = data.map((data) => {
    const isAnyCellUndefined = Object.values(data).some((value) => value === undefined || value === null);

    return {
      ...data,
      manufacturer: data.manufacturer?.name as string | null,
      isEditable: isAnyCellUndefined,
      isSelected: false,
    };
  });

  const [rowData, setRowData] = useState(formattedData);
  const [columnDefs, setColDefs] = useState(
    columnHeaders.map((data) => {
      const { field, headerName, flex, editable, valueFormatter, cellRenderer, cellEditor, valueSetter, cellEditorParams } = data;

      return {
        field: field,
        headerName: headerName,
        flex: flex,
        editable: editable,
        valueFormatter: valueFormatter,
        cellRenderer: cellRenderer,
        cellEditor: cellEditor,
        valueSetter: valueSetter,
        cellEditorParams: cellEditorParams,
      };
    })
  );

  const [isEditorReady, setIsEditorReady] = useState(false);

  const [skip, setSkip] = useState(0);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [areAllDataGot, setAreAllDataGot] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const response1 = await manufacturerOfWeaponGetSome(1000);
      const response2 = await ammunitionGetCaliberNames();

      if (response1.error === null && response2.error === null) {
        setColDefs((currentValue) => {
          const copiedCurrentValue = [...currentValue];

          const manufacturerColumnData1 = copiedCurrentValue.find((data) => data.field === "manufacturer")!;

          manufacturerColumnData1.cellEditorParams!.values = response1.data!.map((data) => data.name);

          const manufacturerColumnData2 = copiedCurrentValue.find((data) => data.field === "caliber")!;

          manufacturerColumnData2.cellEditorParams!.values = response2.data!.map((data) => data.caliber);

          return copiedCurrentValue;
        });

        setIsEditorReady(true);
      }
    });

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    router.refresh();

    return () => {
      router.refresh();
    };
  }, []);

  return (
    <div className={`${styles.weaponEditor}`}>
      {isEditorReady && (
        <>
          <div className={`${styles.header}`}>
            <Button
              onClick={() => {
                router.push("/admin_panel");
              }}>
              Powrót
            </Button>
            <Button
              onClick={() => {
                setRowData((currentValue) => {
                  const copiedCurrentValue = structuredClone(currentValue);

                  copiedCurrentValue.unshift({
                    id: "auto generated",
                    caliber: null,
                    type: null,
                    manufacturer: null,
                    model: null,
                    quantity: null,
                    rentalCost: null,
                    isEditable: true,
                    isSelected: false,
                  });

                  return copiedCurrentValue;
                });
              }}>
              Dodaj
            </Button>
            <Button
              className={`${styles.save}`}
              onClick={async () => {
                const rowsToAdd = rowData.filter((data) => data.isEditable);

                const isAnyCellEmpty = rowsToAdd.find((data) => {
                  return Object.values(data).some((value) => {
                    if (value === null || value === undefined) {
                      return true;
                    } else if (Array.isArray(value) && value.length === 0) {
                      return true;
                    } else if (typeof value === "string" && value.trim().length === 0) {
                      return true;
                    }
                  });
                });

                if (isAnyCellEmpty === undefined) {
                  const addedRows: {
                    manufacturer: string | null;
                    isEditable: boolean;
                    isSelected: boolean;
                    id: string;
                    caliber: string | null;
                    type: $Enums.WeaponType | null;
                    model: string | null;
                    quantity: number | null;
                    rentalCost: number | null;
                  }[] = [];

                  await Promise.all(
                    rowsToAdd.map(async (data) => {
                      const { id, caliber, type, manufacturer, quantity, model, rentalCost } = data;

                      const newId = id === "auto generated" ? null : id;

                      const response = await weaponAdd(newId, caliber!, type!, manufacturer!, model!, rentalCost!, quantity!);

                      if (response.error === null) {
                        const manufacturer = response.data!.manufacturerOfWeaponName;

                        //@ts-ignore
                        delete response.data!.manufacturerOfWeaponName;

                        addedRows.push({
                          manufacturer: manufacturer,
                          ...response.data!,
                          isEditable: false,
                          isSelected: false,
                        });
                      }
                    })
                  );

                  setRowData((currentValue) => {
                    const copiedCurrentValue = structuredClone(currentValue);

                    const copiedCurrentValueWithoutEditable = copiedCurrentValue.filter((data) => data.isEditable === false);

                    addedRows.forEach((data) => {
                      copiedCurrentValueWithoutEditable.unshift({
                        ...data,
                      });
                    });
                    return copiedCurrentValueWithoutEditable;
                  });
                }
              }}>
              Zapisz
            </Button>
          </div>
          <h2>Bronie</h2>
          <div className={`${styles.selectedItemsActions}`}>
            <button
              className={`${styles.delete}`}
              onClick={async () => {
                const rowsToDelete = rowData.filter((data) => data.isSelected);

                await Promise.all(
                  rowsToDelete.map(async (data) => {
                    const { id } = data;

                    if (id !== "auto generated") {
                      await weaponDelete(id);
                    }
                  })
                );

                setRowData((currentValue) => {
                  const copiedCurrentValue = structuredClone(currentValue);

                  const copiedCurrentValueWithoutSelected = copiedCurrentValue.filter((data) => data.isSelected === false);

                  return copiedCurrentValueWithoutSelected;
                });
              }}>
              <i className="fa-regular fa-trash-can"></i>
            </button>
          </div>
          <div className={`${styles.tableWrapper}`}>
            <div className={"ag-theme-quartz"} style={{ width: "100%", height: "100%" }}>
              <AgGridReact
                onPaginationChanged={async (event) => {
                  if (event.newPageSize) {
                    const currentPaginationPageSizeValue = event.api.paginationGetPageSize() - paginationPageSize;
                    const newSkipValue = (event.api.paginationGetCurrentPage() + 1) * event.api.paginationGetPageSize() - currentPaginationPageSizeValue + 1;

                    if (areAllDataGot === false) {
                      const response = await weaponGetSome(currentPaginationPageSizeValue, newSkipValue);

                      if (response.error === null) {
                        const mergedArrays = mergeArrays(
                          rowData,
                          response.data!.map((data) => {
                            return {
                              ...data,
                              manufacturer: data.manufacturer?.name as string | null,
                              isEditable: false,
                              isSelected: false,
                            };
                          }),
                          "id"
                        );

                        setRowData(mergedArrays);

                        setPaginationPageSize(event.api.paginationGetPageSize());

                        if (response.data!.length === 0) {
                          setAreAllDataGot(true);
                        }
                      }
                    }
                  }
                  if (event.newPage) {
                    const currentSkipValue = skip + paginationPageSize;
                    setSkip(currentSkipValue);

                    if (areAllDataGot === false) {
                      const response = await weaponGetSome(paginationPageSize, currentSkipValue + 1);

                      if (response.error === null) {
                        const mergedArrays = mergeArrays(
                          rowData,
                          response.data!.map((data) => {
                            return {
                              ...data,
                              manufacturer: data.manufacturer?.name as string | null,
                              isEditable: false,
                              isSelected: false,
                            };
                          }),
                          "id"
                        );

                        setRowData(mergedArrays);

                        if (response.data!.length === 0) {
                          setAreAllDataGot(true);
                        }
                      }
                    }
                  }
                }}
                paginationPageSizeSelector={[10, 25, 50, 100, 200]}
                paginationPageSize={paginationPageSize}
                pagination={true}
                rowData={rowData}
                stopEditingWhenCellsLoseFocus={true}
                //@ts-ignore
                columnDefs={columnDefs}
                getRowStyle={(params) => {
                  if (params.data) {
                    const isAnyCellUndefined = Object.values(params.data).some((value) => value === undefined);

                    if (isAnyCellUndefined) {
                      return { backgroundColor: "#ffb3b3" };
                    } else if (params.data.isEditable) {
                      return { backgroundColor: "#ccf0ff" };
                    }
                  }
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeaponEditor;
