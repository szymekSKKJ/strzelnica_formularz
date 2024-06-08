"use client";

import styles from "./styles.module.scss";
import pistolImage from "../../../../public/reservation_visit_form/pistol.png";
import rifleImage from "../../../../public/reservation_visit_form/rifle.png";
import Image from "next/image";
import { useEffect, useLayoutEffect, useState } from "react";
import { weaponGetSome } from "@/app/api/weapon/get/some/route";
import { $Enums } from "@prisma/client";
import { addWeaponsToUserSelectedData, userSelectedDataSignal } from "../ReservationVisitForm";

const ChooseWeapon = () => {
  const [weaponeTypes, setWeaponeTypes] = useState([
    {
      id: 1,
      type: "pistolet",
      srcImage: pistolImage,
      choosen: true,
    },
    {
      id: 2,
      type: "karabin",
      srcImage: rifleImage,
      choosen: false,
    },
  ]);

  const [weaponsData, setWeaponsData] = useState<
    {
      id: string;
      caliber: string;
      type: $Enums.WeaponType;
      model: string;
      rentalCost: number;
      manufacturer: {
        id: string;
        name: string;
      };
      isChoosen: boolean;
    }[]
  >(
    userSelectedDataSignal.value.weapons.map((data) => {
      return {
        ...data,
        isChoosen: true,
      };
    })
  );

  useLayoutEffect(() => {
    (async () => {
      const response = await weaponGetSome(1000, 0);

      if (response.error === null) {
        const changedData = response.data!.map((data) => {
          //@ts-ignore
          delete data.quantity;

          return {
            ...data,
            isChoosen: weaponsData.some((dataLocal) => dataLocal.id === data.id),
          };
        });

        setWeaponsData(changedData);
      }
    })();
  }, []);

  useEffect(() => {
    const selectedWeapons = weaponsData.filter((data) => data.isChoosen);

    const changedData = selectedWeapons.map((data) => {
      const newObject = structuredClone(data);

      //@ts-ignore
      delete newObject.isChoosen;

      return {
        ...newObject,
      };
    });

    addWeaponsToUserSelectedData(changedData); // Tutaj widzisz, że aktualizuje się nasz signal z danymi użytkownika (lewy ctrl + lewy przycisk myszy)
  }, [weaponsData]);

  const chooseWeaponType = weaponeTypes.find((data) => data.choosen);

  return (
    <div className={`${styles.chooseWeapon} animationIn`}>
      <h2>Wybierz broń</h2>
      <div className={`${styles.tiles}`}>
        {weaponeTypes.map((data) => {
          const { id, type, srcImage, choosen } = data;

          return (
            <div
              key={id}
              className={`${styles.tile} ${choosen ? styles.choosen : ""}`}
              onClick={() => {
                setWeaponeTypes((currentValue) => {
                  const copiedCurrentValue = structuredClone(currentValue);

                  copiedCurrentValue.forEach((data) => {
                    if (data.id === id) {
                      data.choosen = true;
                    } else {
                      data.choosen = false;
                    }
                  });

                  return copiedCurrentValue;
                });
              }}>
              <div className={`${styles.imageWrapper}`}>
                <Image src={srcImage} alt="Zdjęcie broni"></Image>
              </div>
              <p>{type}</p>
            </div>
          );
        })}
      </div>
      <div className={`${styles.tableWrapper}`}>
        <table>
          <thead>
            <tr>
              <th>Model</th>
              <th>Producent</th>
              <th>Kaliber</th>
              <th>Koszt wypożyczenia</th>
            </tr>
          </thead>
          <tbody>
            {weaponsData.map((data) => {
              const { id, isChoosen, manufacturer, model, caliber, rentalCost, type } = data;

              if (chooseWeaponType!.type === type) {
                return (
                  <tr
                    className={`${isChoosen ? styles.choosen : ""}`}
                    key={id}
                    onClick={() => {
                      setWeaponsData((currentValue) => {
                        const copiedCurrentValue = structuredClone(currentValue);

                        const foundData = copiedCurrentValue.find((data) => data.id === id)!;

                        foundData.isChoosen = foundData.isChoosen ? false : true;

                        return copiedCurrentValue;
                      });
                    }}>
                    <td>{model}</td>
                    <td>{manufacturer.name}</td>
                    <td>{caliber}</td>
                    <td>{rentalCost} zł</td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChooseWeapon;
