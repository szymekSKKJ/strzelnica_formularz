"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import ComponentsTransition, { TransitionButton } from "react-components-transition/ComponentsTransition";
import ChooseWeapon from "./ChooseWeapon/ChooseWeapon";
import ChooseTrack from "./ChooseTrack/ChooseTrack";
import ProvideUserData from "./ProvideUserData/ProvideUserData";
import Button from "../UI/Button/Button";
import "./animationsForComponentsTranstion.scss";
import ChoosDate from "./ChoosDate/ChoosDate";
import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: ["100", "300", "400", "500", "700", "900"] });

const ReservationVisitForm = () => {
  const [stages, setStages] = useState([
    {
      id: 1,
      order: 1,
      title: "Wybierz broń",
      isDone: false,
      faIconClassName: "fa-solid fa-gun",
      componentKey: "ChooseWeapon",
    },
    {
      id: 2,
      order: 2,
      title: "Wybierz tor",
      isDone: false,
      faIconClassName: "fa-solid fa-road",
      componentKey: "ChooseTrack",
    },
    {
      id: 3,
      order: 3,
      title: "Wybierz termin",
      isDone: false,
      faIconClassName: "fa-solid fa-calendar-days",
      componentKey: "ChooseDate",
    },
    {
      id: 4,
      order: 4,
      title: "Podaj dane",
      isDone: false,
      faIconClassName: "fa-solid fa-pen",
      componentKey: "ProvideUserData",
    },
    {
      id: 5,
      order: 5,
      title: "Podsumowanie",
      isDone: false,
      faIconClassName: "fa-solid fa-ballot-check",
      componentKey: "ChooseWeapon",
    },
  ]);
  const [currentStageId, setCurrentStageId] = useState(1);

  const [componentsTransitionContext, setComponentsTransitionContext] = useState();

  // const buttonElementRef = useRef<null | HTMLButtonElement>(null);

  const nextStage = stages[stages.findIndex((data) => data.id === currentStageId) + 1];
  const previousStage = stages[stages.findIndex((data) => data.id === currentStageId) - 1];

  // useEffect(() => {
  //   buttonElementRef.current = document.querySelector("#setNextStageButton");
  // }, []);

  return (
    <div className={`${styles.reservationVisitForm}`}>
      <div className={`${styles.stages}`}>
        {stages.map((data, index, array) => {
          const { isDone, id, title, faIconClassName, componentKey } = data;

          const lastNotDoneIndex = array.findIndex((data) => data.isDone === false);

          if (isDone || lastNotDoneIndex === index) {
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
                <p>
                  {title} <i className={`${faIconClassName}`}></i>
                </p>
                {isDone && (
                  <span>
                    <i className="fa-solid fa-check"></i>
                  </span>
                )}
              </TransitionButton>
            );
          } else {
            return (
              <button key={id} className={`${styles.stage} ${id === currentStageId ? styles.current : ""} ${roboto.className}`}>
                <p>
                  {title} <i className={`${faIconClassName}`}></i>
                </p>
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
        {previousStage && (
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
            <ChooseTrack
              key="ChooseTrack"
              weapon={{
                name: "Glock 19",
                caliber: "19mm",
                type: "pistol",
              }}></ChooseTrack>
            <ProvideUserData key="ProvideUserData"></ProvideUserData>
            <ChoosDate key="ChooseDate"></ChoosDate>
          </ComponentsTransition>
        </div>
        <Button
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
          show={nextStage ? nextStage.componentKey : undefined}
          onClick={() => {
            setStages((currentValue) => {
              const copiedCurrentValue = structuredClone(currentValue);

              copiedCurrentValue.find((data) => currentStageId === data.id)!.isDone = true;

              return copiedCurrentValue;
            });

            setCurrentStageId((currentValue) => currentValue + 1);
          }}>
          Dalej
        </Button>
      </div>
    </div>
  );
};

export default ReservationVisitForm;
