import styles from "./styles.module.scss";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { addDateToUserSelectedData, userSelectedDataSignal } from "../ReservationVisitForm";
import DataPicker from "./DataPicker/DataPicker";
import { availableReservationHourGetSome } from "@/app/api/availableReservationHour/get/some/route";
import { reservationGetCheckIfAvailable } from "@/app/api/reservation/get/checkIfAvailable/route";

const ChoosDate = () => {
  const [availableHours, setAvailableHours] = useState<
    {
      id: string;
      start: Date;
      end: Date;
    }[]
  >([]);
  const [additionalInformation, setAdditionalInformation] = useState<
    (
      | {
          end: Date;
          start: Date;
          notAvailableWeapons?:
            | {
                weaponId: string;
                reservation: {
                  start: Date;
                  end: Date;
                };
              }[]
            | undefined;
          availableTrack?:
            | {
                id: string;
              }
            | null
            | undefined;
        }
      | undefined
    )[]
  >([]);
  const [pickedDate, setPickedData] = useState<{ start: Date; end: Date } | null>(
    userSelectedDataSignal.value.date === null ? null : userSelectedDataSignal.value.date
  );
  const [isLoading, setIsLoading] = useState(true);
  const [dateBeforeSetting, setDateBeforeSetting] = useState<{ pickedDate: { start: Date; end: Date } }>({
    pickedDate: {
      start: new Date(),
      end: new Date(),
    },
  });

  useEffect(() => {
    addDateToUserSelectedData(pickedDate); // O w tym miejscu się wykonuje (lewy ctrl + lewy pczysik myszy przeniesie cię do deklaracji)
  }, [pickedDate]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setIsLoading(true);

      const { pickedDate } = dateBeforeSetting;

      if (pickedDate) {
        const response1 = await availableReservationHourGetSome();

        if (response1.error === null) {
          const modifedResponse1 = response1.data!.map((data) => {
            // Start and end are in HH:MM format
            const { start, end, id } = data;

            const startDate = pickedDate?.start ? new Date(pickedDate?.start) : new Date();
            const endDate = pickedDate?.end ? new Date(pickedDate?.end) : new Date();

            startDate.setHours(parseInt(start.split(":")[0]));
            startDate.setMinutes(parseInt(start.split(":")[1]));
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            endDate.setHours(parseInt(end.split(":")[0]));
            endDate.setMinutes(parseInt(end.split(":")[1]));
            endDate.setSeconds(0);
            endDate.setMilliseconds(0);

            return {
              id: id,
              start: startDate,
              end: endDate,
            };
          });

          const weaponsId = userSelectedDataSignal.value.weapons.map((data) => data.id);

          const response2 = await Promise.all(
            modifedResponse1.map(async (data) => {
              const response = await reservationGetCheckIfAvailable(data.start, data.end, weaponsId);

              if (response.error === null) {
                return {
                  ...response.data,
                  end: data.end,
                  start: data.start,
                };
              }
            })
          );

          modifedResponse1.sort((a, b) => (a.start.getTime() > b.start.getTime() ? 1 : b.start.getTime() > a.start.getTime() ? -1 : 0));

          const modifedResponse2 = response2.filter((data) => {
            const { availableTrack, notAvailableWeapons } = data!;

            if (availableTrack === null || notAvailableWeapons!.length > 0) {
              return data;
            }
          });

          const modifedResponse1_1 = modifedResponse1.filter((data) => {
            const { start } = data;

            const foundNotAvailableData = modifedResponse2.find((dataLocal) => {
              const { start: startLocal } = dataLocal!;

              const startLocalDate = new Date(startLocal);

              if (start.getTime() === startLocalDate.getTime()) {
                return dataLocal;
              }
            });

            if (foundNotAvailableData === undefined) {
              return data;
            }
          });

          setAvailableHours(modifedResponse1_1);
          setAdditionalInformation(modifedResponse2);

          if (modifedResponse1_1[0] !== undefined) {
            if (userSelectedDataSignal.value.date === null) {
              setPickedData(modifedResponse1_1[0]);
            } else {
              setPickedData(userSelectedDataSignal.value.date);
            }
          } else {
            setPickedData(null);
          }

          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }
    });

    return () => {
      clearTimeout(timeout);
    };
  }, [dateBeforeSetting]);

  return (
    <div className={`${styles.choosDate}`}>
      <h2>Wybierz termin</h2>
      {additionalInformation.length !== 0 && (
        <div className={`${styles.additionalInformation}`}>
          {additionalInformation.map((data, index) => {
            const { end, start, notAvailableWeapons, availableTrack } = data!;

            return (
              <div key={index}>
                <p>
                  W godzinach{" "}
                  <span>
                    {start.toLocaleTimeString("pl-PL", {
                      hour: "numeric",
                      minute: "numeric",
                    })}{" "}
                    {"-"}{" "}
                    {end.toLocaleTimeString("pl-PL", {
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </span>
                  :
                </p>
                {notAvailableWeapons!.length > 0 && (
                  <div className={`${styles.notAvailableWeapons}`}>
                    <p>Brak dostępnych broni:</p>
                    {notAvailableWeapons!.map((data) => {
                      const { weaponId } = data;

                      const foundWeapon = userSelectedDataSignal.value.weapons.find((data) => data.id === weaponId)!;

                      return (
                        <p key={weaponId}>
                          {foundWeapon.model} {foundWeapon.manufacturer.name}
                        </p>
                      );
                    })}
                  </div>
                )}
                {availableTrack === null && <p className={`${styles.notTrackAvailable}`}>Brak dostępnych torów</p>}
              </div>
            );
          })}
        </div>
      )}
      <div className={`${styles.content} ${isLoading ? styles.loading : ""}`}>
        <div className={`${styles.dataPickerWrapper}`}>
          <DataPicker
            initialDate={pickedDate ? pickedDate.start : dateBeforeSetting.pickedDate.start}
            type="only-date"
            onSave={(value) => {
              const dateFrom = new Date(value);
              const dateTo = new Date(value);

              dateFrom.setSeconds(0);
              dateTo.setSeconds(0);

              setDateBeforeSetting({
                pickedDate: {
                  end: dateFrom,
                  start: dateTo,
                },
              });

              setPickedData((currentValue) => {
                const copiedCurrentValue = structuredClone(currentValue);

                if (copiedCurrentValue) {
                  dateFrom.setMinutes(copiedCurrentValue.end.getMinutes());
                  dateFrom.setHours(copiedCurrentValue.end.getHours());

                  dateTo.setMinutes(copiedCurrentValue.start.getMinutes());
                  dateTo.setHours(copiedCurrentValue.start.getHours());

                  return {
                    end: dateFrom,
                    start: dateTo,
                  };
                } else {
                  return null;
                }
              });
            }}
            style={{
              backgrondColor: "white",
              fontColor: "#00a1e6",
              hoverColor: "rgba(0, 161, 230, 0.15)",
              borderColor: "#00a1e6",
              borderRadius: "4px",
            }}></DataPicker>
        </div>
        <div className={`${styles.availableHours}`}>
          {availableHours.map((data) => {
            const { end, start } = data;

            const isThisDatePicked =
              end.getHours() === pickedDate?.end.getHours() &&
              start.getHours() === pickedDate.start.getHours() &&
              end.getMinutes() === pickedDate.end.getMinutes() &&
              start.getMinutes() === pickedDate.start.getMinutes();

            return (
              <div
                className={`${styles.availableHour} ${isThisDatePicked ? styles.picked : ""}`}
                key={`${end.getTime()}`}
                onClick={() => {
                  setPickedData((currentValue) => {
                    const copiedCurrentValue = structuredClone(currentValue);

                    copiedCurrentValue?.end.setHours(end.getHours());
                    copiedCurrentValue?.end.setMinutes(end.getMinutes());

                    copiedCurrentValue?.start.setHours(start.getHours());
                    copiedCurrentValue?.start.setMinutes(start.getMinutes());

                    return copiedCurrentValue;
                  });
                }}>
                <p>
                  {start.toLocaleTimeString("pl-PL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {end.toLocaleTimeString("pl-PL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChoosDate;
