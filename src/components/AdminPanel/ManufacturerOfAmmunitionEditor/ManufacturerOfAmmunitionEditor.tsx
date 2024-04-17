"use client";

import Button from "@/components/UI/Button/Button";
import styles from "./styles.module.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ValueSetterParams } from "@ag-grid-community/core";
import { manufacturerOfAmmunitionAdd } from "@/app/api/manufacturerOfAmmunition/add/route";
import { manufacturerOfAmmunitionDelete } from "@/app/api/manufacturerOfAmmunition/delete/route";
import { manufacturerOfAmmunitionGetSome } from "@/app/api/manufacturerOfAmmunition/get/some/route";

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
    cellRenderer: null,
    cellEditor: null,
    valueSetter: null,
    valueFormatter: null,
    resizable: true,
    minWidth: null,
    maxWidth: null,
  },
  {
    field: "name",
    headerName: "Producent",
    editable: (params: ValueSetterParams) => {
      return params.data.isEditable;
    },
    flex: 1,
    cellRenderer: null,
    cellEditor: null,
    valueSetter: null,
    cellEditorParams: null,
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
  }[];
}

const ManufacturerOfAmmunitionEditor = ({ data }: componentProps) => {
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

  const [skip, setSkip] = useState(0);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [areAllDataGot, setAreAllDataGot] = useState(false);

  return (
    <div className={`${styles.manufacturerOfAmmunitionEditor}`}>
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
                name: null,
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
              const addedRows: { id: string; name: string }[] = [];

              await Promise.all(
                rowsToAdd.map(async (data) => {
                  const { name } = data;

                  const response = await manufacturerOfAmmunitionAdd(name!.toLocaleLowerCase());

                  if (response.error === null) {
                    addedRows.push(response.data!);
                  }
                })
              );

              setRowData((currentValue) => {
                const copiedCurrentValue = structuredClone(currentValue);

                const copiedCurrentValueWithoutEditable = copiedCurrentValue.filter((data) => data.isEditable === false);

                addedRows.forEach((data) => {
                  copiedCurrentValueWithoutEditable.unshift({
                    ...data,
                    isEditable: false,
                    isSelected: false,
                  });
                });

                return copiedCurrentValueWithoutEditable;
              });
            }
          }}>
          Zapisz
        </Button>
      </div>
      <h2>Producenci amunicji</h2>
      <div className={`${styles.selectedItemsActions}`}>
        <button
          className={`${styles.delete}`}
          onClick={async () => {
            const rowsToDelete = rowData.filter((data) => data.isSelected);

            await Promise.all(
              rowsToDelete.map(async (data) => {
                const { id } = data;
                await manufacturerOfAmmunitionDelete(id);
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
                  const response = await manufacturerOfAmmunitionGetSome(currentPaginationPageSizeValue, newSkipValue);

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
                  const response = await manufacturerOfAmmunitionGetSome(paginationPageSize, currentSkipValue + 1);

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
    </div>
  );
};

export default ManufacturerOfAmmunitionEditor;
