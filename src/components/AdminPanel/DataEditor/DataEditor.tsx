"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import { AgGridReact } from "@ag-grid-community/react"; // React Grid Logic
import "@ag-grid-community/styles/ag-grid.css"; // Core CSS
import "@ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { EditableCallbackParams, ModuleRegistry, RowClassRules, ValueGetterParams, ValueSetterParams } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import Button from "@/components/UI/Button/Button";
import { revalidateData } from "@/app/api/revalidate/route";
import { manufacturerOfWeaponGetAll } from "@/app/api/manufacturerOfWeapon/get/all/route";
import { manufacturerOfWeaponAdd } from "@/app/api/manufacturerOfWeapon/add/route";
import { revalidateTag } from "next/cache";
import { useRouter } from "next/navigation";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface componentProps {
  data: any[];
  title: string;
  columnHeaders: string[];
}

const Test = () => {
  return <button onClick={() => window.alert("Mission Launched")}>Launch!</button>;
};

const DataEditor = ({ title, data, columnHeaders }: componentProps) => {
  const [rowData, setRowData] = useState(data);
  const [columnDefs, setColDefs] = useState(
    columnHeaders.map((value) => {
      return {
        field: value,
        flex: 1,
        // valueGetter: (params: ValueGetterParams) => {
        //   return params.data.nazwa;
        // },
        valueSetter:
          value === "name"
            ? (params: ValueSetterParams) => {
                params.data.name = params.newValue;
                return true;
              }
            : undefined,
        editable:
          value === "name"
            ? (params) => {
                return params.data.isEditable;
              }
            : undefined,
        cellRenderer: value === "delete" ? Test : undefined,
      };
    })
  );
  const [rowsToDelete, setRowsToDelete] = useState([]);

  return (
    <div className={`${styles.dataEditor}`}>
      <div className={`${styles.header}`}>
        <Button>Powrót</Button>
        <Button
          onClick={() => {
            setRowData((currentValue) => {
              const copiedCurrentValue = structuredClone(currentValue);

              copiedCurrentValue.unshift({
                id: "auto generated",
                name: null,
                isEditable: true,
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

                  const dataResponse = await manufacturerOfWeaponAdd(name);

                  if (dataResponse.error === null) {
                    return dataResponse.data!;
                  }
                })
              );

              setRowData([...rowData.filter((data) => data.isEditable === undefined), ...addedRows]);
            }
          }}>
          Zapisz
        </Button>
      </div>
      <h2>{title}</h2>
      <div className={`${styles.tableWrapper}`}>
        <div className={"ag-theme-quartz"} style={{ width: "100%", height: "100%" }}>
          <AgGridReact
            stopEditingWhenCellsLoseFocus={true}
            rowData={rowData}
            columnDefs={columnDefs}
            getRowStyle={(params) => {
              if (params.data.isEditable) {
                return { backgroundColor: "#ccf0ff" };
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DataEditor;
