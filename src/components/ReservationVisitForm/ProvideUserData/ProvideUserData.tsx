import Input from "@/components/UI/Input/Input";
import styles from "./styles.module.scss";
import Button from "@/components/UI/Button/Button";
import { useEffect, useState } from "react";
import { addUserDataToUserSelectedData, userSelectedDataSignal } from "../ReservationVisitForm";

const isStringEmpty = (string: string) => string.trim().length === 0;

const ProvideUserData = () => {
  const [userData, setUserData] = useState<{ firstName: string | null; lastName: string | null; email: string | null; phoneNumber: string | null }>(
    userSelectedDataSignal.value.userData === null
      ? {
          firstName: null,
          lastName: null,
          email: null,
          phoneNumber: null,
        }
      : userSelectedDataSignal.value.userData
  );

  useEffect(() => {
    const isAnyValueEmpty = Object.values(userData).some((value) => value === null);

    if (isAnyValueEmpty === false) {
      addUserDataToUserSelectedData(userData as { firstName: string; lastName: string; email: string; phoneNumber: string }); // Tutaj się wykonuje dodanie danych presonalnych użytkownika
    } else {
      addUserDataToUserSelectedData(null); // A tutaj ustawiamy null jeżeli jakikolwiek input jest pusty
    }
  }, [userData]);

  return (
    <div className={`${styles.provideUserData}`}>
      <h2>Podaj dane</h2>
      <form>
        <div className={`${styles.inputRow}`}>
          <Input
            value={userData.firstName ? userData.firstName : ""}
            placeholder="Imię"
            onInput={(event) => {
              const value = (event.currentTarget as HTMLInputElement).value;

              if (isStringEmpty(value) === false) {
                setUserData((currentValue) => {
                  const copiedCurrentValue = structuredClone(currentValue);

                  copiedCurrentValue.firstName = value;

                  return copiedCurrentValue;
                });
              } else {
                setUserData((currentValue) => {
                  const copiedCurrentValue = structuredClone(currentValue);

                  copiedCurrentValue.firstName = null;

                  return copiedCurrentValue;
                });
              }
            }}></Input>
          <Input
            value={userData.lastName ? userData.lastName : ""}
            placeholder="Nazwisko"
            onInput={(event) => {
              const value = (event.currentTarget as HTMLInputElement).value;

              if (isStringEmpty(value) === false) {
                setUserData((currentValue) => {
                  const copiedCurrentValue = structuredClone(currentValue);

                  copiedCurrentValue.lastName = value;

                  return copiedCurrentValue;
                });
              } else {
                setUserData((currentValue) => {
                  const copiedCurrentValue = structuredClone(currentValue);

                  copiedCurrentValue.lastName = null;

                  return copiedCurrentValue;
                });
              }
            }}></Input>
        </div>
        <Input
          value={userData.email ? userData.email : ""}
          placeholder="Email"
          onInput={(event) => {
            const value = (event.currentTarget as HTMLInputElement).value;

            const isEmailValid =
              isStringEmpty(value) === false &&
              String(value)
                .toLowerCase()
                .match(
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );

            if (isEmailValid !== null) {
              setUserData((currentValue) => {
                const copiedCurrentValue = structuredClone(currentValue);

                copiedCurrentValue.email = value;

                return copiedCurrentValue;
              });
            } else {
              setUserData((currentValue) => {
                const copiedCurrentValue = structuredClone(currentValue);

                copiedCurrentValue.email = null;

                return copiedCurrentValue;
              });
            }
          }}></Input>
        <Input
          value={userData.phoneNumber ? userData.phoneNumber : ""}
          placeholder="Numer telefonu"
          onInput={(event) => {
            const value = (event.currentTarget as HTMLInputElement).value;

            const sanitizedInput = value.replace(/[^\d]/g, "");

            const only9Digits = sanitizedInput.length > 9 ? sanitizedInput.slice(0, 9) : sanitizedInput;

            if (only9Digits.length === 9) {
              setUserData((currentValue) => {
                const copiedCurrentValue = structuredClone(currentValue);

                copiedCurrentValue.phoneNumber = only9Digits;

                return copiedCurrentValue;
              });

              event.currentTarget.value = only9Digits;
            } else {
              setUserData((currentValue) => {
                const copiedCurrentValue = structuredClone(currentValue);

                copiedCurrentValue.phoneNumber = null;

                return copiedCurrentValue;
              });

              event.currentTarget.value = only9Digits;
            }
          }}></Input>
      </form>
    </div>
  );
};

export default ProvideUserData;
