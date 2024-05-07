"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import ComponentsTransition, { TransitionButton } from "react-components-transition/ComponentsTransition";
import ChooseWeapon from "./ChooseWeapon/ChooseWeapon";
import ProvideUserData from "./ProvideUserData/ProvideUserData";
import Button from "../UI/Button/Button";
import "./animationsForComponentsTranstion.scss";
import ChoosDate from "./ChoosDate/ChoosDate";
import { Roboto } from "next/font/google";
import { signal } from "@preact/signals";
import { useSignals } from "@preact/signals-react/runtime";
import { $Enums } from "@prisma/client";
import Summary from "./Summary/Summary";
import Finalized from "./Finalized/Finalized";
import { reservationAdd } from "@/app/api/reservation/add/route";

const roboto = Roboto({ subsets: ["latin"], weight: ["100", "300", "400", "500", "700", "900"] });

export const userSelectedDataSignal = signal<{
  weapons: {
    id: string;
    caliber: string;
    type: $Enums.WeaponType;
    model: string;
    rentalCost: number;
    manufacturer: {
      id: string;
      name: string;
    };
  }[];
  date: {
    start: Date;
    end: Date;
  } | null;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  } | null;
}>({
  weapons: [],
  date: null,
  userData: null,
});

export const addWeaponsToUserSelectedData = (
  weapons: {
    id: string;
    caliber: string;
    type: $Enums.WeaponType;
    model: string;
    rentalCost: number;
    manufacturer: {
      id: string;
      name: string;
    };
  }[]
) => {
  const copiedValue = { ...userSelectedDataSignal.value };

  copiedValue.weapons = weapons;

  userSelectedDataSignal.value = copiedValue;
};

export const addDateToUserSelectedData = (date: { start: Date; end: Date }) => {
  const copiedValue = { ...userSelectedDataSignal.value };

  copiedValue.date = date;

  userSelectedDataSignal.value = copiedValue;
};

export const addUserDataToUserSelectedData = (userData: { firstName: string; lastName: string; email: string; phoneNumber: string } | null) => {
  const copiedValue = { ...userSelectedDataSignal.value };

  copiedValue.userData = userData;

  userSelectedDataSignal.value = copiedValue;
};

const ReservationVisitForm = () => {
  useSignals();

  const [stages, setStages] = useState([
    {
      id: 1,
      order: 1,
      title: "Wybierz broń",
      isDone: false,
      faIconClassName: "fa-solid fa-gun",
      componentKey: "ChooseWeapon",
      isFilled: false,
    },
    {
      id: 2,
      order: 2,
      title: "Wybierz termin",
      isDone: false,
      faIconClassName: "fa-solid fa-calendar-days",
      componentKey: "ChooseDate",
      isFilled: false,
    },
    {
      id: 3,
      order: 3,
      title: "Podaj dane",
      isDone: false,
      faIconClassName: "fa-solid fa-pen",
      componentKey: "ProvideUserData",
      isFilled: false,
    },
    {
      id: 4,
      order: 4,
      title: "Podsumowanie",
      isDone: false,
      faIconClassName: "fa-solid fa-ballot-check",
      componentKey: "Summary",
      isFilled: true,
    },
    {
      id: 5,
      order: 5,
      title: "Gotowe",
      isDone: false,
      faIconClassName: "fa-solid fa-check",
      componentKey: "Finalized",
      isFilled: true,
    },
  ]);
  const [currentStageId, setCurrentStageId] = useState(1);

  const [componentsTransitionContext, setComponentsTransitionContext] = useState();

  const currentStageIndex = stages.findIndex((data) => data.id === currentStageId);

  const nextStage = currentStageIndex !== -1 ? stages[currentStageIndex + 1] : null;
  const previousStage = currentStageIndex !== -1 ? stages[currentStageIndex - 1] : null;

  const areAllStagesDone = stages.every((data) => data.isDone === true);

  useEffect(() => {
    const { weapons, date, userData } = userSelectedDataSignal.value;

    setStages((currentValue) => {
      const copiedCurrentValue = [...currentValue];

      if (weapons.length !== 0) {
        copiedCurrentValue.find((data) => data.id === 1)!.isFilled = true;
      } else {
        copiedCurrentValue.find((data) => data.id === 1)!.isFilled = false;
      }

      if (date !== null) {
        copiedCurrentValue.find((data) => data.id === 2)!.isFilled = true;
      } else {
        copiedCurrentValue.find((data) => data.id === 2)!.isFilled = false;
      }

      if (userData !== null) {
        copiedCurrentValue.find((data) => data.id === 3)!.isFilled = true;
      } else {
        copiedCurrentValue.find((data) => data.id === 3)!.isFilled = false;
      }

      return copiedCurrentValue;
    });
  }, [userSelectedDataSignal.value]);

  return (
    <div className={`${styles.reservationVisitForm}`}>
      <div className={`${styles.stages}`}>
        {stages.map((data, index, array) => {
          const { isDone, id, title, faIconClassName, componentKey } = data;

          const lastNotDoneIndex = array.findIndex((data) => data.isDone === false);

          if ((isDone || lastNotDoneIndex === index) && areAllStagesDone === false) {
            return (
              <TransitionButton
                show={componentKey}
                animationIn={{
                  className: "animationIn",
                  duration: 500,
                }}
                animationOut={{
                  className: "animationOut",
                  duration: 500,
                }}
                context={componentsTransitionContext}
                key={id}
                className={`${styles.stage} ${isDone || lastNotDoneIndex === index ? styles.done : ""} ${id === currentStageId ? styles.current : ""} ${
                  roboto.className
                }`}
                onClick={() => {
                  setCurrentStageId(id);
                }}>
                <p>{title}</p>
                <i className={`${faIconClassName}`}></i>
                {isDone && (
                  <span>
                    <i className="fa-solid fa-check"></i>
                  </span>
                )}
              </TransitionButton>
            );
          } else {
            return (
              <button
                key={id}
                className={`${styles.stage} ${id === currentStageId ? styles.current : ""} ${roboto.className} ${
                  isDone || lastNotDoneIndex === index ? styles.done : ""
                }`}>
                <p>{title}</p>
                <i className={`${faIconClassName}`}></i>
                {isDone && (
                  <span>
                    <i className="fa-solid fa-check"></i>
                  </span>
                )}
              </button>
            );
          }
        })}
      </div>
      <div className={`${styles.contentWrapper}`}>
        {previousStage && areAllStagesDone === false && (
          <Button
            animationIn={{
              className: "animationIn",
              duration: 500,
            }}
            animationOut={{
              className: "animationOut",
              duration: 500,
            }}
            context={componentsTransitionContext}
            style={{ fontSize: "22px", margin: "0px auto 25px 0px" }}
            show={previousStage.componentKey}
            onClick={() => {
              setCurrentStageId((currentValue) => currentValue - 1);
            }}>
            Powrót
          </Button>
        )}
        <div className={`${styles.content}`}>
          <ComponentsTransition firstVisible={"ChooseWeapon"} getContext={setComponentsTransitionContext}>
            <ChooseWeapon key="ChooseWeapon"></ChooseWeapon>
            <ProvideUserData key="ProvideUserData"></ProvideUserData>
            <ChoosDate key="ChooseDate"></ChoosDate>
            <Summary key="Summary"></Summary>
            <Finalized key="Finalized"></Finalized>
          </ComponentsTransition>
        </div>
        <Button
          disabled={stages[currentStageIndex].isFilled === false ? true : false}
          id="setNextStageButton"
          animationIn={{
            className: "animationIn",
            duration: 500,
          }}
          animationOut={{
            className: "animationOut",
            duration: 500,
          }}
          context={componentsTransitionContext}
          style={{ fontSize: "22px" }}
          show={nextStage ? nextStage.componentKey : stages[currentStageIndex]!.componentKey}
          onClick={async () => {
            setStages((currentValue) => {
              const copiedCurrentValue = structuredClone(currentValue);

              const foundData = copiedCurrentValue.find((data) => currentStageId === data.id);

              if (foundData) {
                foundData.isDone = true;

                if (foundData.componentKey === "Summary") {
                  copiedCurrentValue.find((data) => data.componentKey === "Finalized")!.isDone = true;
                }
              }

              return copiedCurrentValue;
            });

            setCurrentStageId((currentValue) => (currentValue < stages.length ? currentValue + 1 : currentValue));

            if (stages[currentStageIndex]!.componentKey === "Summary") {
              const { weapons, date, userData } = userSelectedDataSignal.value;

              const weaponsId = weapons.map((data) => data.id);

              console.log(weaponsId);

              const response = await reservationAdd(
                date!.start,
                date!.end,
                weaponsId,
                userData!.email,
                userData!.firstName,
                userData!.lastName,
                parseInt(userData!.phoneNumber)
              );

              console.log(response);
            }
          }}>
          {areAllStagesDone === true ? "Gotowe!" : stages[currentStageIndex]!.componentKey === "Summary" ? "Wyślij rezerwację" : "Dalej"}
        </Button>
      </div>
    </div>
  );
};

export default ReservationVisitForm;
