"use client";

import { manufacturerOfWeaponAdd } from "@/app/api/manufacturerOfWeapon/add/route";
import { ValueSetterParams } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useRef, useState } from "react";

import styles from "./styles.module.scss";
import "@ag-grid-community/styles/ag-grid.css"; // Core CSS
import "@ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { useRouter } from "next/navigation";
import { manufacturerOfWeaponDelete } from "@/app/api/manufacturerOfWeapon/delete/route";
import { manufacturerOfWeaponGetSome } from "@/app/api/manufacturerOfWeapon/get/some/route";
import Button from "@/components/UI/Button/Button";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

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
  },
  {
    field: "name",
    headerName: "Nazwa",
    editable: (params: ValueSetterParams) => {
      return params.data.isEditable;
    },
    flex: 1,
    cellRenderer: null,
    cellEditor: null,
    valueSetter: null,
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
  },
];

type ManufacturerOfWeapon = {
  id: string;
  name: string | null;
};

interface componentProps {
  data: ManufacturerOfWeapon[];
}

const ManufacturerOfWeaponEditor = ({ data }: componentProps) => {
  const router = useRouter();

  const formattedData = data.map((data) => {
    return {
      ...data,
      isEditable: false,
      isSelected: false,
    };
  });

  const [rowData, setRowData] = useState(formattedData);
  const [columnDefs, setColDefs] = useState(
    columnHeaders.map((data) => {
      const { field, headerName, editable, flex, cellRenderer, valueSetter } = data;

      return {
        field: field,
        headerName: headerName,
        flex: flex,
        valueSetter: valueSetter,
        editable: editable,
        cellRenderer: cellRenderer,
      };
    })
  );
  const [skip, setSkip] = useState(0);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [areAllDataGot, setAreAllDataGot] = useState(false);

  const gridRef = useRef<AgGridReact<any>>(null);

  return (
    <div className={`${styles.manufacturerOfWeaponEditor}`}>
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
            const isAnyRowInvalid = rowData.find((data) => {
              const { isEditable } = data;

              if (isEditable === true) {
                const isAnyCellEmpty = Object.values(data).some((value) => {
                  if (value === null || value === undefined) {
                    return true;
                  } else if (value.toString().trim().length === 0) {
                    return true;
                  }
                });

                if (isAnyCellEmpty) {
                  return true;
                }
              }
            });

            if (isAnyRowInvalid === undefined) {
              const rowsToAdd = rowData.filter((data) => data.isEditable);

              const addedRows = await Promise.all(
                rowsToAdd.map(async (data) => {
                  const { name } = data;

                  const dataResponse = await manufacturerOfWeaponAdd(name!.toLocaleLowerCase());

                  if (dataResponse.error === null) {
                    return dataResponse.data!;
                  }
                })
              ).then((data) => data.filter((data) => data !== undefined));

              const mergedArrays = mergeArrays(
                rowData,
                addedRows.map((data) => {
                  return {
                    ...data,
                    isEditable: false,
                    isSelected: false,
                  };
                }),
                "id"
              );

              setRowData(mergedArrays);
            }
          }}>
          Zapisz
        </Button>
      </div>
      <h2>Producenci broni</h2>
      <div className={`${styles.selectedItemsActions}`}>
        <button
          className={`${styles.delete}`}
          onClick={async () => {
            const selectedData = rowData.filter((data) => data.isSelected);

            await Promise.all(
              selectedData.map(async (data) => {
                await manufacturerOfWeaponDelete(data.id);
              })
            );

            setRowData((currentValue) => {
              const copiedCurrentValue = structuredClone(currentValue);

              const dataAfterRemove = copiedCurrentValue.filter((data, index) => {
                const foundElement = selectedData.find((dataLocal) => dataLocal.id === data.id);

                if (foundElement) {
                  return false;
                } else {
                  return true;
                }
              });

              return dataAfterRemove;
            });
          }}>
          <i className="fa-regular fa-trash-can"></i>
        </button>
      </div>
      <div className={`${styles.tableWrapper}`}>
        <div className={"ag-theme-quartz"} style={{ width: "100%", height: "100%" }}>
          <AgGridReact
            ref={gridRef}
            onPaginationChanged={async (event) => {
              if (event.newPageSize) {
                const currentPaginationPageSizeValue = event.api.paginationGetPageSize() - paginationPageSize;
                const newSkipValue = (event.api.paginationGetCurrentPage() + 1) * event.api.paginationGetPageSize() - currentPaginationPageSizeValue + 1;

                if (areAllDataGot === false) {
                  const response = await manufacturerOfWeaponGetSome(currentPaginationPageSizeValue, newSkipValue);

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
                  const response = await manufacturerOfWeaponGetSome(paginationPageSize, currentSkipValue + 1);

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
              if (params.data && params.data.isEditable) {
                return { backgroundColor: "#ccf0ff" };
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ManufacturerOfWeaponEditor;
