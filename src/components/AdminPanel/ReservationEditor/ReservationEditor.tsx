"use client";

import Button from "@/components/UI/Button/Button";
import styles from "./styles.module.scss";
import { useRouter } from "next/navigation";
import { Table, Cell, Row } from "@szymekskkj/table";
import { useState } from "react";
import { reservationDelete } from "@/app/api/reservation/delete/route";

interface ReservationEditorProps {
  data: {
    id: string;
    bookedForStart: Date;
    bookedForEnd: Date;
    trackId: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: number;
  }[];
}

const ReservationEditor = ({ data: initialData }: ReservationEditorProps) => {
  const [data, setData] = useState(
    initialData.map((data) => {
      const { bookedForStart, bookedForEnd } = data;

      return {
        ...data,
        isSelected: false,
        bookedForStart: new Date(bookedForStart),
        bookedForEnd: new Date(bookedForEnd),
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
      displayName: "id",
    },
    {
      key: "bookedForStart",
      displayName: "Godzina rozpoczęcia",
      formatting: (value: Date) => {
        return value.toLocaleDateString("pl-PL", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          weekday: "long",
        });
      },
    },
    {
      key: "bookedForEnd",
      displayName: "Godzina zakończenia",
      formatting: (value: Date) => {
        return value.toLocaleDateString("pl-PL", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          weekday: "long",
        });
      },
    },
    {
      key: "email",
      displayName: "Email",
    },
    {
      key: "firstName",
      displayName: "Imię",
    },
    {
      key: "lastName",
      displayName: "Nazwisko",
    },
    {
      key: "phoneNumber",
      displayName: "Numer telefonu",
    },
  ];

  return (
    <div className={`${styles.reservationEditor}`}>
      <div className={`${styles.header}`}>
        <Button
          onClick={() => {
            router.push("/admin_panel");
          }}>
          Powrót
        </Button>
        <Button onClick={() => {}}>Dodaj</Button>
        <Button className={`${styles.save}`} onClick={async () => {}}>
          Zapisz
        </Button>
      </div>
      <h2>Rezerwacje</h2>
      <div className={`${styles.selectedItemsActions}`}>
        <button
          className={`${styles.delete}`}
          onClick={async () => {
            const rowsToDelete = data.filter((data) => data.isSelected === true);

            await Promise.all(
              rowsToDelete.map(async (data) => {
                const { id } = data;
                await reservationDelete(id);
              })
            );

            setData((currentValue) => {
              const copiedCurrentValue = [...currentValue];

              const dataWithoutSelectedRows = copiedCurrentValue.filter((data) => data.isSelected === false);

              return dataWithoutSelectedRows;
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
                    <Cell key={columnKeys[index]} isEditable={false}>
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

export default ReservationEditor;
