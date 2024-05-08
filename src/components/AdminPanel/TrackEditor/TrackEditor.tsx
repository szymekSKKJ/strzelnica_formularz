"use client";

import Button from "@/components/UI/Button/Button";
import styles from "./styles.module.scss";
import { useRouter } from "next/navigation";
import { Table, Cell, Row } from "@szymekskkj/table";
import { useState } from "react";
import { trackAdd } from "@/app/api/track/add/route";
import { trackDeleteById } from "@/app/api/track/delete/byId/route";

interface TrackEditorInterface {
  data: { id: string }[];
}

const TrackEditor = ({ data: initialData }: TrackEditorInterface) => {
  const [data, setData] = useState(
    initialData.map((data) => {
      return {
        ...data,
        isSelected: false,
        isNew: false,
        isModified: false,
      };
    })
  );

  const router = useRouter();

  const headers = [
    {
      key: "isSelected",
      displayName: "",
    },
    {
      key: "id",
      displayName: "Id",
    },
  ];

  return (
    <div className={`${styles.trackEditor}`}>
      <div className={`${styles.header}`}>
        <Button
          onClick={() => {
            router.push("/admin_panel");
          }}>
          Powrót
        </Button>
        <Button
          onClick={() => {
            setData((currentValue) => {
              const copiedCurrentValue = [...currentValue];

              copiedCurrentValue.unshift({
                id: crypto.randomUUID(),
                isNew: true,
                isSelected: false,
                isModified: false,
              });

              return copiedCurrentValue;
            });
          }}>
          Dodaj
        </Button>
        <Button
          className={`${styles.save}`}
          onClick={async () => {
            const dataToAdd = data.filter((data) => data.isNew === true);

            const createdData = await Promise.all(
              dataToAdd.map(async (data) => {
                const response = await trackAdd();

                if (response.error === null) {
                  return {
                    ...response.data!,
                    isSelected: false,
                    isNew: false,
                    isModified: false,
                  };
                }
              })
            ).then((createdData) => createdData.filter((data) => data !== null && data !== undefined));

            setData((currentValue) => {
              const copiedCurrentValue = [...currentValue];
              const copiedCurrentValueWithoutNewRows = copiedCurrentValue.filter((data) => data.isNew === false);

              createdData.forEach((data) => {
                copiedCurrentValueWithoutNewRows.unshift(data);
              });

              return copiedCurrentValueWithoutNewRows;
            });
          }}>
          Zapisz
        </Button>
      </div>
      <h2>Tory</h2>
      <div className={`${styles.selectedItemsActions}`}>
        <button
          className={`${styles.delete}`}
          onClick={async () => {
            const rowsToDelete = data.filter((data) => data.isSelected === true);

            await Promise.all(
              rowsToDelete.map(async (data) => {
                const { id } = data;

                await trackDeleteById(id);
              })
            );

            setData((currentValue) => {
              const copiedCurrentValue = [...currentValue];
              const copiedCurrentValueWithoutSelectedRows = copiedCurrentValue.filter((data) => data.isSelected === false);

              rowsToDelete.forEach((data) => {
                const { id } = data;

                const index = copiedCurrentValueWithoutSelectedRows.findIndex((data) => data.id === id)!;

                copiedCurrentValueWithoutSelectedRows.slice(index, 1);
              });

              return copiedCurrentValueWithoutSelectedRows;
            });
          }}>
          <i className="fa-regular fa-trash-can"></i>
        </button>
      </div>
      <div className={`${styles.tableWrapper}`}>
        <Table headers={headers} setData={setData}>
          {data.map((data) => {
            const { id } = data;

            const columnKeys = Object.keys(data);

            return (
              <Row key={id}>
                {Object.values(data).map((value, index) => {
                  return (
                    <Cell key={columnKeys[index]} isEditable={true}>
                      {value}
                    </Cell>
                  );
                })}
              </Row>
            );
          })}
        </Table>
      </div>
    </div>
  );
};

export default TrackEditor;
