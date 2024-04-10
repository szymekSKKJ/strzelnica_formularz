"use client";

import styles from "./styles.module.scss";
import pistolImage from "../../../../public/reservation_visit_form/pistol.png";
import rifleImage from "../../../../public/reservation_visit_form/rifle.png";
import Image from "next/image";
import { useState } from "react";

const ChooseWeapon = () => {
  const [weaponeTypes, setWeaponeTypes] = useState([
    {
      id: 1,
      type: "pistolet",
      srcImage: pistolImage,
      choosen: false,
    },
    {
      id: 2,
      type: "karabin",
      srcImage: rifleImage,
      choosen: false,
    },
  ]);

  return (
    <div className={`${styles.chooseWeapon}`}>
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
              <th>Nazwa</th>
              <th>Producent</th>
              <th>Kaliber</th>
              <th>Amunicja</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Glock 17</td>
              <td>Glock</td>
              <td>9x19mm</td>
              <td>9x19mm Parabellum</td>
            </tr>
            <tr className={`${styles.choosen}`}>
              <td>Glock 17</td>
              <td>Glock</td>
              <td>9x19mm</td>
              <td>9x19mm Parabellum</td>
            </tr>
            <tr>
              <td>Glock 17</td>
              <td>Glock</td>
              <td>9x19mm</td>
              <td>9x19mm Parabellum</td>
            </tr>
            <tr>
              <td>Glock 17</td>
              <td>Glock</td>
              <td>9x19mm</td>
              <td>9x19mm Parabellum</td>
            </tr>
            <tr>
              <td>Glock 17</td>
              <td>Glock</td>
              <td>9x19mm</td>
              <td>9x19mm Parabellum</td>
            </tr>
            <tr>
              <td>Glock 17</td>
              <td>Glock</td>
              <td>9x19mm</td>
              <td>9x19mm Parabellum</td>
            </tr>
            <tr>
              <td>Glock 17</td>
              <td>Glock</td>
              <td>9x19mm</td>
              <td>9x19mm Parabellum</td>
            </tr>
            <tr>
              <td>Glock 17</td>
              <td>Glock</td>
              <td>9x19mm</td>
              <td>9x19mm Parabellum</td>
            </tr>
            <tr>
              <td>Glock 17</td>
              <td>Glock</td>
              <td>9x19mm</td>
              <td>9x19mm Parabellum</td>
            </tr>
            <tr>
              <td>Glock 17</td>
              <td>Glock</td>
              <td>9x19mm</td>
              <td>9x19mm Parabellum</td>
            </tr>
            <tr>
              <td>Glock 17</td>
              <td>Glock</td>
              <td>9x19mm</td>
              <td>9x19mm Parabellum</td>
            </tr>
            <tr>
              <td>Glock 17</td>
              <td>Glock</td>
              <td>9x19mm</td>
              <td>9x19mm Parabellum</td>
            </tr>
            <tr>
              <td>Glock 17</td>
              <td>Glock</td>
              <td>9x19mm</td>
              <td>9x19mm Parabellum</td>
            </tr>
            <tr>
              <td>Glock 17</td>
              <td>Glock</td>
              <td>9x19mm</td>
              <td>9x19mm Parabellum</td>
            </tr>
            <tr>
              <td>Glock 17</td>
              <td>Glock</td>
              <td>9x19mm</td>
              <td>9x19mm Parabellum</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChooseWeapon;
