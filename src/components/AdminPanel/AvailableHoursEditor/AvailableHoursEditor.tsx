"use client";

import styles from "./styles.module.scss";

import { useState } from "react";
import Button from "@/components/UI/Button/Button";
import { useRouter } from "next/navigation";
import { availableReservationHourAdd } from "@/app/api/availableReservationHour/add/route";
import { availableReservationHourDelete } from "@/app/api/availableReservationHour/delete/route";
import { availableReservationHourUpdate } from "@/app/api/availableReservationHour/update/route";
import { Cell, Row, Table } from "@szymekskkj/table";

interface componentProps {
  data: { id: string; start: string; end: string; isSelected: boolean; isNew: boolean; isModified: boolean }[];
}

const AvailableHoursEditor = ({ data: initialData }: componentProps) => {
  const router = useRouter();

  const [data, setData] = useState<{ id: string; start: Date; end: Date; isSelected: boolean; isNew: boolean; isModified: boolean }[]>(
    initialData.map((data) => {
      const { end, start } = data;

      const hoursEnd = {
        hours: parseInt(end.split(":")[0]),
        minutes: parseInt(end.split(":")[1]),
      };

      const hoursEndDate = new Date();

      hoursEndDate.setMinutes(hoursEnd.minutes);
      hoursEndDate.setHours(hoursEnd.hours);

      const hoursStart = {
        hours: parseInt(start.split(":")[0]),
        minutes: parseInt(start.split(":")[1]),
      };

      const hoursStartDate = new Date();

      hoursStartDate.setMinutes(hoursStart.minutes);
      hoursStartDate.setHours(hoursStart.hours);

      return {
        ...data,
        end: hoursEndDate,
        start: hoursStartDate,
        isNew: false,
        isSelected: false,
        isModified: false,
      };
    })
  );

  const headers = [
    {
      key: "isSelected",
      displayName: "",
    },
    {
      key: "id",
      displayName: "Id",
    },
    {
      key: "start",
      displayName: "Godzina rozpoczęcia",
      formatting: (value: Date) => {
        return value.toLocaleTimeString("pl-PL", {
          minute: "numeric",
          hour: "numeric",
        });
      },
    },
    {
      key: "end",
      displayName: "Godzina zakończenia",
      formatting: (value: Date) => {
        return value.toLocaleTimeString("pl-PL", {
          minute: "numeric",
          hour: "numeric",
        });
      },
    },
  ];

  return (
    <div className={`${styles.availableHoursEditor}`}>
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
              const copiedCurrentValue = structuredClone(currentValue);

              copiedCurrentValue.unshift({
                isSelected: false,
                id: crypto.randomUUID(),
                start: new Date(),
                end: new Date(),
                isNew: true,
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
            const newRows = data.filter((data) => data.isNew);
            const modifiedRows = data.filter((data) => data.isModified);

            const responsedDataForNewRows: {
              id: string;
              end: Date;
              start: Date;
              isNew: boolean;
              isSelected: boolean;
              isModified: boolean;
            }[] = [];

            await Promise.all(
              newRows.map(async (data) => {
                const { end: hoursEnd, start: hoursStart } = data;

                const formattedHoursStart = hoursStart.toLocaleTimeString("pl-PL", {
                  hour: "numeric",
                  minute: "numeric",
                });

                const formattedHoursEnd = hoursEnd.toLocaleTimeString("pl-PL", {
                  hour: "numeric",
                  minute: "numeric",
                });

                const response = await availableReservationHourAdd(formattedHoursStart, formattedHoursEnd);

                if (response.error === null) {
                  responsedDataForNewRows.push({
                    id: response.data!.id,
                    end: hoursEnd,
                    start: hoursStart,
                    isNew: false,
                    isSelected: false,
                    isModified: false,
                  });
                }
              })
            );

            setData((currentValue) => {
              const copiedCurrentValue = [...currentValue];

              const dataWithoutNewRows = copiedCurrentValue.filter((data) => data.isNew === false);

              const newData = [...dataWithoutNewRows, ...responsedDataForNewRows];

              return newData;
            });

            const responsedDataForModifiedRows: {
              id: string;
              end: Date;
              start: Date;
              isNew: boolean;
              isSelected: boolean;
              isModified: boolean;
            }[] = [];

            await Promise.all(
              modifiedRows.map(async (data) => {
                const { id, end: hoursEnd, start: hoursStart } = data;

                const formattedHoursStart = hoursStart.toLocaleTimeString("pl-PL", {
                  hour: "numeric",
                  minute: "numeric",
                });

                const formattedHoursEnd = hoursEnd.toLocaleTimeString("pl-PL", {
                  hour: "numeric",
                  minute: "numeric",
                });

                const response = await availableReservationHourUpdate(id, formattedHoursStart, formattedHoursEnd);

                if (response.error === null) {
                  responsedDataForModifiedRows.push({
                    id: id,
                    end: hoursEnd,
                    start: hoursStart,
                    isNew: false,
                    isSelected: false,
                    isModified: false,
                  });
                }
              })
            );

            setData((currentValue) => {
              const copiedCurrentValue = [...currentValue];

              const dataWithoutModifiedRows = copiedCurrentValue.filter((data) => data.isModified === false);

              const newData = [...dataWithoutModifiedRows, ...responsedDataForModifiedRows];

              return newData;
            });
          }}>
          Zapisz
        </Button>
      </div>
      <h2>Dostępne godziny</h2>
      <div className={`${styles.selectedItemsActions}`}>
        <button
          className={`${styles.delete}`}
          onClick={async () => {
            const rowsToDelete = data.filter((data) => data.isSelected);

            await Promise.all(
              rowsToDelete.map(async (data) => {
                const { id } = data;

                await availableReservationHourDelete(id);
              })
            );

            setData((currentValue) => {
              const copiedCurrentValue = [...currentValue];

              const dataWithoutNewRows = copiedCurrentValue.filter((data) => data.isSelected === false);

              return dataWithoutNewRows;
            });
          }}>
          <i className="fa-regular fa-trash-can"></i>
        </button>
      </div>
      <Table headers={headers} setData={setData} emptyText="Brak danych">
        {data.map((data) => {
          const { id } = data;

          const keys = Object.keys(data);

          return (
            <Row key={id}>
              {Object.values(data).map((value, index) => {
                return (
                  <Cell type={keys[index] !== "id" ? "time" : "text"} key={keys[index]} isEditable={keys[index] === "id" ? false : true}>
                    {value as string}
                  </Cell>
                );
              })}
            </Row>
          );
        })}
      </Table>
    </div>
  );
};

export default AvailableHoursEditor;
