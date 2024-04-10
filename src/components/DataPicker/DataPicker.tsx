"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { Varela_Round } from "next/font/google";
import ClickEffect from "@/components/ClickEffect/ClickEffect";

const varela_Round = Varela_Round({ subsets: ["latin"], weight: ["400"] });

interface componentProps {
  onSave: (date: Date) => void;
  style?: {
    fontColor: string;
    backgrondColor: string;
    borderColor?: string;
    hoverColor?: string;
    borderRadius?: string;
  };
}

const DataPicker = ({ onSave, style }: componentProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [areMonthsOpen, setAreMonthsOpen] = useState(false);
  const [areYearsOpen, setAreYearsOpen] = useState(false);

  const componentElementRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    onSave(currentDate);
  }, [currentDate, onSave]);

  useEffect(() => {
    if (componentElementRef.current) {
      style?.hoverColor && componentElementRef.current.style.setProperty("--hover-color", style.hoverColor);
      style?.borderColor && componentElementRef.current.style.setProperty("--border-color", style.borderColor);
      style?.borderRadius && componentElementRef.current.style.setProperty("--border-radius", style.borderRadius);
    }
  }, [style]);

  const copiedCurrentDate = structuredClone(currentDate);
  const copiedCurrentDateMonth = copiedCurrentDate.getMonth();

  const days = [];
  const months = [];
  const years = [];
  const dayNames = [];

  copiedCurrentDate.setDate(1);

  const offest = copiedCurrentDate.getDay() === 0 ? 6 : copiedCurrentDate.getDay() - 1;

  for (let i = 0; i < offest; i++) {
    days.push("");
  }

  while (copiedCurrentDate.getMonth() === copiedCurrentDateMonth) {
    days.push(copiedCurrentDate.getDate());
    copiedCurrentDate.setDate(copiedCurrentDate.getDate() + 1);
  }

  copiedCurrentDate.setTime(currentDate.getTime());

  copiedCurrentDate.setMonth(0);

  for (let i = 0; i <= 11; i++) {
    months.push(
      copiedCurrentDate.toLocaleDateString("pl-PL", {
        month: "long",
      })
    );

    copiedCurrentDate.setMonth(copiedCurrentDate.getMonth() + 1);
  }

  copiedCurrentDate.setTime(currentDate.getTime());

  copiedCurrentDate.setFullYear(copiedCurrentDate.getFullYear() - 5);

  for (let i = 0; i <= 11; i++) {
    years.push(copiedCurrentDate.getFullYear());

    copiedCurrentDate.setFullYear(copiedCurrentDate.getFullYear() + 1);
  }

  copiedCurrentDate.setTime(currentDate.getTime());

  copiedCurrentDate.setDate(copiedCurrentDate.getDate() - copiedCurrentDate.getDay() + 1);

  for (let i = 0; i <= 6; i++) {
    dayNames.push(
      copiedCurrentDate.toLocaleDateString("pl-PL", {
        weekday: "short",
      })
    );

    copiedCurrentDate.setDate(copiedCurrentDate.getDate() + 1);
  }

  return (
    <div
      ref={componentElementRef}
      className={`${styles.dataPicker}`}
      style={{
        backgroundColor: style?.backgrondColor,
      }}>
      <div className={`${styles.header}`}>
        <button
          onClick={() => {
            if (areYearsOpen) {
              setCurrentDate((currentValue) => {
                const copiedCurrentValue = structuredClone(currentValue);

                copiedCurrentValue.setFullYear(copiedCurrentValue.getFullYear() - 12);
                copiedCurrentValue.setDate(1);

                return copiedCurrentValue;
              });
            } else {
              setCurrentDate((currentValue) => {
                const copiedCurrentValue = structuredClone(currentValue);

                copiedCurrentValue.setMonth(copiedCurrentValue.getMonth() - 1);
                copiedCurrentValue.setDate(1);

                return copiedCurrentValue;
              });
            }
          }}>
          <i
            className="fa-solid fa-angle-left"
            style={{
              color: style?.fontColor,
            }}></i>
          <ClickEffect></ClickEffect>
        </button>
        <p
          tabIndex={0}
          className={`${varela_Round.className}`}
          style={{
            color: style?.fontColor,
          }}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              setAreMonthsOpen((currentValue) => {
                if (currentValue === true && areYearsOpen === false) {
                  setAreYearsOpen(true);
                }
                return true;
              });
            }
          }}
          onClick={() => {
            setAreMonthsOpen((currentValue) => {
              if (currentValue === true && areYearsOpen === false) {
                setAreYearsOpen(true);
              }
              return true;
            });
          }}>
          {currentDate.toLocaleDateString("pl-PL", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          <ClickEffect></ClickEffect>
        </p>
        <button
          onClick={() => {
            if (areYearsOpen) {
              setCurrentDate((currentValue) => {
                const copiedCurrentValue = structuredClone(currentValue);

                copiedCurrentValue.setFullYear(copiedCurrentValue.getFullYear() + 12);
                copiedCurrentValue.setDate(1);

                return copiedCurrentValue;
              });
            } else {
              setCurrentDate((currentValue) => {
                const copiedCurrentValue = structuredClone(currentValue);

                copiedCurrentValue.setMonth(copiedCurrentValue.getMonth() + 1);
                copiedCurrentValue.setDate(1);

                return copiedCurrentValue;
              });
            }
          }}>
          <i
            className="fa-solid fa-angle-right"
            style={{
              color: style?.fontColor,
            }}></i>
          <ClickEffect></ClickEffect>
        </button>
      </div>
      <div className={`${styles.dayNames} ${areMonthsOpen || areYearsOpen ? styles.close : ""}`}>
        {dayNames.map((value) => {
          return (
            <div
              key={value}
              className={`${styles.dayName}`}
              style={{
                color: style?.fontColor,
              }}>
              {value}
            </div>
          );
        })}
      </div>
      <div className={`${styles.content}`}>
        <div
          className={`${styles.years} ${areYearsOpen ? styles.open : ""}`}
          style={{
            backgroundColor: style?.backgrondColor,
          }}>
          {years.map((value, index) => {
            return (
              <div
                tabIndex={areYearsOpen ? 0 : -1}
                key={index}
                className={`${styles.year} ${currentDate.getFullYear() === value ? styles.current : ""}`}
                onKeyUp={(event) => {
                  if (event.key === "Enter") {
                    setAreYearsOpen(false);
                    setCurrentDate((currentValue) => {
                      const copiedCurrentValue = structuredClone(currentValue);

                      copiedCurrentValue.setFullYear(value);

                      return copiedCurrentValue;
                    });
                  }
                }}
                onClick={() => {
                  setAreYearsOpen(false);
                  setCurrentDate((currentValue) => {
                    const copiedCurrentValue = structuredClone(currentValue);

                    copiedCurrentValue.setFullYear(value);

                    return copiedCurrentValue;
                  });
                }}
                style={{
                  color: style?.fontColor,
                }}>
                {value}
                <ClickEffect></ClickEffect>
              </div>
            );
          })}
        </div>
        <div
          className={`${styles.months} ${areMonthsOpen ? styles.open : ""}`}
          style={{
            backgroundColor: style?.backgrondColor,
          }}>
          {months.map((value, index) => {
            return (
              <div
                tabIndex={areMonthsOpen ? 0 : -1}
                key={index}
                className={`${styles.month} ${currentDate.getMonth() === index ? styles.current : ""}`}
                onKeyUp={(event) => {
                  if (event.key === "Enter") {
                    setAreMonthsOpen(false);
                    setCurrentDate((currentValue) => {
                      const copiedCurrentValue = structuredClone(currentValue);

                      copiedCurrentValue.setDate(1);
                      copiedCurrentValue.setMonth(index);

                      return copiedCurrentValue;
                    });
                  }
                }}
                onClick={() => {
                  setAreMonthsOpen(false);
                  setCurrentDate((currentValue) => {
                    const copiedCurrentValue = structuredClone(currentValue);

                    copiedCurrentValue.setDate(1);
                    copiedCurrentValue.setMonth(index);

                    return copiedCurrentValue;
                  });
                }}
                style={{
                  color: style?.fontColor,
                }}>
                {value}
                <ClickEffect></ClickEffect>
              </div>
            );
          })}
        </div>
        <div className={`${styles.days}`}>
          {days.map((value, index) => {
            return (
              <div
                tabIndex={value === "" ? -1 : 0}
                key={index}
                className={`${styles.day} ${value === currentDate.getDate() ? styles.current : ""} ${value === "" ? styles.empty : ""}`}
                onClick={() => {
                  setCurrentDate((currentValue) => {
                    const copiedCurrentValue = structuredClone(currentValue);

                    if (typeof value !== "string") {
                      copiedCurrentValue.setDate(value);
                    }

                    return copiedCurrentValue;
                  });
                }}
                onKeyUp={(event) => {
                  if (event.key === "Enter") {
                    setCurrentDate((currentValue) => {
                      const copiedCurrentValue = structuredClone(currentValue);

                      if (typeof value !== "string") {
                        copiedCurrentValue.setDate(value);
                      }

                      return copiedCurrentValue;
                    });
                  }
                }}
                style={{
                  color: style?.fontColor,
                }}>
                {value}
                {value !== "" && <ClickEffect></ClickEffect>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DataPicker;
