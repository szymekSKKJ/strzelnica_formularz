"use client";

import Button from "@/components/UI/Button/Button";
import styles from "./styles.module.scss";
import { useRouter } from "next/navigation";
import { AmmunitionType } from "@prisma/client";
import { useEffect, useState } from "react";
import { ValueSetterParams } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { ammunitionAdd } from "@/app/api/ammunition/add/route";
import { manufacturerOfAmmunitionGetSome } from "@/app/api/manufacturerOfAmmunition/get/some/route";
import { ammunitionDelete } from "@/app/api/ammunition/delete/route";
import { ammunitionGetSome } from "@/app/api/ammunition/get/some/route";

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
    editable: null,
    flex: 1,
    cellEditor: null,
    valueSetter: null,
    cellEditorParams: null,
    cellRenderer: null,
    valueFormatter: null,
    resizable: true,
    minWidth: null,
    maxWidth: null,
  },
  {
    field: "name",
    headerName: "Nazwa",
    editable: (params: ValueSetterParams) => {
      return params.data.isEditable;
    },
    flex: 1,
    cellEditor: null,
    valueSetter: null,
    cellEditorParams: null,
    cellRenderer: null,
    valueFormatter: null,
    resizable: true,
    minWidth: null,
    maxWidth: null,
  },
  {
    field: "caliber",
    headerName: "Kaliber",
    editable: (params: ValueSetterParams) => {
      return params.data.isEditable;
    },
    flex: 1,
    cellEditor: null,
    valueSetter: null,
    cellEditorParams: null,
    cellRenderer: null,
    valueFormatter: null,
    resizable: true,
    minWidth: null,
    maxWidth: null,
  },
  {
    field: "manufacturerOfAmmunitionName",
    headerName: "Producent",
    editable: (params: ValueSetterParams) => {
      return params.data.isEditable;
    },
    flex: 1,
    cellEditor: "agSelectCellEditor",
    valueSetter: null,

    cellEditorParams: {
      values: [],
    },
    cellRenderer: null,
    valueFormatter: null,
    resizable: true,
    minWidth: null,
    maxWidth: null,
  },
  {
    field: "quantity",
    headerName: "Ilość",
    editable: (params: ValueSetterParams) => {
      return params.data.isEditable;
    },
    flex: 1,
    cellEditor: null,
    valueSetter: null,
    cellEditorParams: null,
    cellRenderer: null,
    valueFormatter: null,
    resizable: true,
    minWidth: null,
    maxWidth: null,
  },
  {
    field: "pricePerItem",
    headerName: "Cena za sztukę",
    editable: (params: ValueSetterParams) => {
      return params.data.isEditable;
    },
    flex: 1,
    cellEditor: null,
    valueSetter: null,
    cellEditorParams: null,
    cellRenderer: null,
    valueFormatter: (params: any) => {
      return `${(Math.round(parseFloat(params.value) * 100) / 100).toFixed(2)} zł`;
    },
    resizable: true,
    minWidth: null,
    maxWidth: null,
  },
  {
    field: "type",
    headerName: "Typ",
    editable: (params: ValueSetterParams) => {
      return params.data.isEditable;
    },
    flex: 1,
    cellEditor: "agSelectCellEditor",
    valueSetter: null,
    cellEditorParams: {
      values: ["pistoletowa", "karabinowa"],
    },
    cellRenderer: null,
    valueFormatter: null,
    resizable: true,
    minWidth: null,
    maxWidth: null,
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
    valueFormatter: null,
    resizable: false,
    minWidth: 100,
    maxWidth: 100,
  },
];

interface componentProps {
  data: {
    id: string;
    name: string | null;
    caliber: string | null;
    manufacturerOfAmmunitionName: string | null;
    quantity: number | null;
    pricePerItem: number | null;
    type: AmmunitionType | null;
  }[];
}

const AmmunitionEditor = ({ data }: componentProps) => {
  const router = useRouter();

  const formattedData = data.map((data) => {
    const isAnyCellUndefined = Object.values(data).some((value) => value === undefined || value === null);

    return {
      ...data,
      isEditable: isAnyCellUndefined,
      isSelected: false,
    };
  });

  const [rowData, setRowData] = useState(formattedData);
  const [columnDefs, setColDefs] = useState(
    columnHeaders.map((data) => {
      return {
        ...data,
      };
    })
  );
  const [isEditorReady, setIsEditorReady] = useState(false);

  const [skip, setSkip] = useState(0);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [areAllDataGot, setAreAllDataGot] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const response = await manufacturerOfAmmunitionGetSome(1000);

      if (response.error === null) {
        setColDefs((currentValue) => {
          const copiedCurrentValue = [...currentValue];

          const foundData = copiedCurrentValue.find((data) => data.field === "manufacturerOfAmmunitionName")!;

          foundData.cellEditorParams!.values = response.data!.map((data) => data.name);

          return copiedCurrentValue;
        });

        setIsEditorReady(true);
      }
    });

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className={`${styles.manufacturerOfAmmunitionEditor}`}>
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
                    id: "auto generate",
                    name: null,
                    caliber: null,
                    quantity: null,
                    manufacturerOfAmmunitionName: null,
                    pricePerItem: null,
                    type: null,
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
                    if (value === null) {
                      return true;
                    } else if (typeof value === "string" && value.trim().length === 0) {
                      return true;
                    }
                  });
                });

                if (isAnyCellEmpty === undefined) {
                  const addedRows: {
                    id: string;
                    name: string;
                    caliber: string;
                    manufacturerOfAmmunitionName: string;
                    quantity: number;
                    pricePerItem: number;
                    type: AmmunitionType;
                    isEditable: boolean;
                    isSelected: boolean;
                  }[] = [];

                  await Promise.all(
                    rowsToAdd.map(async (data) => {
                      const { name, caliber, quantity, manufacturerOfAmmunitionName, pricePerItem, type } = data;

                      const response = await ammunitionAdd(name!, caliber!, manufacturerOfAmmunitionName!, pricePerItem!, type!, quantity!);

                      if (response.error === null) {
                        addedRows.push({
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
                      copiedCurrentValueWithoutEditable.unshift({ ...data });
                    });

                    return copiedCurrentValueWithoutEditable;
                  });
                }
              }}>
              Zapisz
            </Button>
          </div>
          <h2>Amunicja</h2>
          <div className={`${styles.selectedItemsActions}`}>
            <button
              className={`${styles.delete}`}
              onClick={async () => {
                const rowsToRemove = rowData.filter((data) => data.isSelected);

                await Promise.all(
                  rowsToRemove.map(async (data) => {
                    const { id } = data;

                    await ammunitionDelete(id);
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
                      const response = await ammunitionGetSome(currentPaginationPageSizeValue, newSkipValue);

                      if (response.error === null) {
                        const mergedArrays = mergeArrays(
                          rowData,
                          response.data!.map((data) => {
                            return {
                              ...data,
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
                      const response = await ammunitionGetSome(paginationPageSize, currentSkipValue + 1);

                      if (response.error === null) {
                        const mergedArrays = mergeArrays(
                          rowData,
                          response.data!.map((data) => {
                            return {
                              ...data,
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
                stopEditingWhenCellsLoseFocus={true}
                rowData={rowData}
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

export default AmmunitionEditor;
