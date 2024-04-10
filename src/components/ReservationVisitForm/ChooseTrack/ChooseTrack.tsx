import { useState } from "react";
import styles from "./styles.module.scss";

const pistolTracks = [
  {
    id: 1,
    lengthInMeters: 10,
    choosen: false,
  },
  {
    id: 2,
    lengthInMeters: 15,
    choosen: false,
  },
  {
    id: 3,
    lengthInMeters: 20,
    choosen: false,
  },
  {
    id: 4,
    lengthInMeters: 25,
    choosen: false,
  },
  {
    id: 5,
    lengthInMeters: 30,
    choosen: false,
  },
];

const rifleTracks = [
  {
    id: 1,
    lengthInMeters: 30,
    choosen: false,
  },
  {
    id: 2,
    lengthInMeters: 40,
    choosen: false,
  },
  {
    id: 3,
    lengthInMeters: 50,
    choosen: false,
  },
  {
    id: 4,
    lengthInMeters: 75,
    choosen: false,
  },
  {
    id: 5,
    lengthInMeters: 100,
    choosen: false,
  },
  {
    id: 6,
    lengthInMeters: 125,
    choosen: false,
  },
  {
    id: 6,
    lengthInMeters: 150,
    choosen: false,
  },
];

interface componentProps {
  weapon: {
    type: "pistol" | "rifle";
    name: string;
    caliber: string;
  };
}

const ChooseTrack = ({ weapon }: componentProps) => {
  const [tracks, setTracks] = useState(weapon.type === "pistol" ? pistolTracks : rifleTracks);

  return (
    <div className={`${styles.chooseTrack}`}>
      <h2>Wybierz tor dla:</h2>
      <h3>Glock 19 {weapon.caliber}</h3>
      <div className={`${styles.tiles}`}>
        {tracks.map((data) => {
          const { id, lengthInMeters, choosen } = data;

          return (
            <div
              key={id}
              className={`${styles.tile} ${choosen ? styles.choosen : ""}`}
              onClick={() => {
                setTracks((currentValue) => {
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
              <div className={`${styles.iconWrapper}`} data-length={lengthInMeters}>
                <i className="fa-solid fa-road"></i>
              </div>
              <p>{lengthInMeters} metrów</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ChooseTrack;
