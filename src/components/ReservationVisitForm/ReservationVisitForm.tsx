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

// Ta zmienna korzysta z bibiglioteki "signals", która umożliwia wyrenderowanie komponentu na nowo w momencie, w którym jej wartość zostanie zmodyfikowana.
// Dokładnie tak samo działa "useState" ale różnica jest taka, że "useState" musi wykonać się wewnątrz danego komponentu, a signal nie ().
// Umożliwia to uniknięcie przekazywania przez wiele komponentów funkcji z "useState", aby zmienić stan.
// Dlatego ta zmienna ma na początku "export", bo jest wykorzystywana w wielu komponentach.
// W przypadku "useState" jest to bardziej skomplikowane.

// Ta zmiena odpowiada za przechowywanie danych, które user wyklikał na poszczególnych etapach np. podczas wyboru daty lub podania swoich informacji osobowych, te dane zapisywane są w tej zmiennej.
// Dzięki temu, że inne komponenty mają do niej łatwy dostęp, można wracać do poprzedniego etapu, a dane zostaną zachowane

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

// Tutaj są zdeklarowane pomocnicze funkcje (od lini 62 do 96), które w łatwiejszy sposób umożliwiają aktualizacje "signalu", który jest zdeklarowany w lini 31.
// Dzięki czemu mamy pewność, że dane w "signale" są poprawne oraz nie musimy za każdym razem na nowo pisać logiki do ich zapisywania.
// Jeżeli sobie zaznaczysz np. addWeaponsToUserSelectedData i wciśniesz lewy ctrl + lewy shift + f to zobaczysz, w których miejsach w całej aplikacji, jest tak funkcja wykorzystywana

// Akurat jest ona wykorzystywana w jednym miejscu i jest to plik "ChooseWeapon.tsx"
// Ma to sens, bo addWeaponsToUserSelectedData dodaje do naszego signalu wybrane bronie przez użytkownika,a mamy tylko jeden taki etap w formularzu, którym jest właśnie plik "ChooseWeapon.tsx"

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

// Spróbuj wyszukać tę funkcję i znaleźć gdzie się ona wykonuje

export const addDateToUserSelectedData = (date: { start: Date; end: Date } | null) => {
  const copiedValue = { ...userSelectedDataSignal.value };

  copiedValue.date = date;

  userSelectedDataSignal.value = copiedValue;
};

export const addUserDataToUserSelectedData = (userData: { firstName: string; lastName: string; email: string; phoneNumber: string } | null) => {
  const copiedValue = { ...userSelectedDataSignal.value };

  copiedValue.userData = userData;

  userSelectedDataSignal.value = copiedValue;
};

// Tutaj rozpoczyna się cykl Reactowego komponentu. Widać to po tym, że nazwa tej funkcji rozpoczyna się z wielkiej litery oraz jest identyczna jak nazwa pliku (chociaż nie zawsze musi być identyczna jak nazwa pliku ale taka jest konwencja)

const ReservationVisitForm = () => {
  useSignals();

  // Tutaj mamy pewność, że jest to już Reactowy komponment, bo widać, że korzysta z tkz. "hooka" o nazwie "useState".
  // Hooki w Reactcie to pomocniczne funkcje, które pozwalają zarządzać cyklem życia komponentu.
  // W tym przypadku "useState" to hook, który umożliwia wykonanie się komponentu na nowo oraz przechowanie wartości między renderowaniami.
  // Wszelkiego rodzaju inne zmienie, które nie są zapisane w "useState", po modyfikacji nie spowodują, że komponent wyrenderuje się na nowo (czyli, to co było na ekranie się nie zmieni, pomimo zmiany wartości zwyczajnej zmiennje) oraz z kolejnym renderingiem ich wartość zostanie ustawiana na taką, jaka była zadeklarowana na samym początku.
  // Wszelkiego rodzaju hooki zaczynają się od słowa "use" (niżej "useEffect" to też Reactowy hook)
  // Hooki muszą być użyta na samym początku komponentu, czyli nie mogą zostać wykorzystane w innych funkcjach lub "ifach"
  // "useState" zwrace tablicę z dwoma elemantami. Pierwszy z nich to aktualna wartość, a drugi to funkcja, która umożliwia aktualizację wartośći.
  // Dlatego tutake mamy tablicę ([]), a w niej "stages" jako wartość, a dalej "setStages" jako funkcję, która aktualizuje wartość. Te nazwy mogą być dowolne

  // Zadaniem tego hooka "useState" jest przechowywanie stanu, na którym etapie aktualnie znajduje się użytkownik. Dlatego jest to tablica z obiektamy, która mają poszczególne właściwości.
  // np "isDone" stwierdza, czy dany etap się zakończył, isFilled oznacza, czy użytkownik wypełnił wszystkie dane na danym etapie poprawnie i czy można odblokować przycisk, który umożliwia przejście dalej
  // Do tego są tutaj zapisane dodatkowe informacje jak np. order (kolejność), ikona do aktuialnego etapu (faIconClassName) czy wyświetlany tytuł.

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

  // I tutaj widać, że jeżeli każdy stage (stages.every) is wypełniony (data.isDone === true) to ta zmienna przechowuje wartość true.
  // Co ważne ona wykonuje się z każdym renderingiem, więc na podstawie "stages", które są zapisane w stanie, przyjmuje ona różne wartości (bo zmienia się "stages")

  const areAllStagesDone = stages.every((data) => data.isDone === true);

  // Tutaj mamy kolejny hook "useEffect"
  // Jego zadaniem jest wykonywanie funkcji, która jest do niego przekazna, za każdym razem, jak zmieni się tkz. tablica zależności, czyli drugi argument "useEffect".
  // W naszym przypadku w tej tablicy znajduje się userSelectedDataSignal.value, czyli właśnie nasz sygnal, który przechowuje dane wybrane przez użytkownika.
  // Jak się przypatszysz to zobaczysz, że useEffect wykonuje się każadym razem jak zmieni się nasz globalny stan (signal) z datą użytkownika
  // To spowoiduje, że zostanie zaaktualizowany "setStages", czyli stan odpowiedzialny za to, który mamy wyśweitlany etap.
  // Dlatego tutaj mamy "ify" dla poszczególnych wartości naszego userSelectedDataSignal.value np. jeżeli weapons.length będzie różna od 0, to wiemy, że nasz użytkownik właśnie wybrał bronie i możemy ustawić właściwośc "isFilled" na true
  // A bronie ustawiamy wtedy, gdy zmienie się wartość dla naszego signalu (userSelectedDataSignal.value), a robimy to za pomcą funkcji addWeaponsToUserSelectedData (w lini 65)
  // Podobnie z innymi etapami np. date

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
        {/* Tutaj jest przycik, który umożliwia przejście na kolejny etap formularza*/}
        {/* Jak zobaczysz ma on właściwości (propsy), które w tym przycisku umożliwiają wykonywanie się poszczególnych funkcji */}
        {/* np "disabled" stwierdza czy podana funkcja w "onClick" może się wykonać */}
        {/* Jeżeli stages[currentStageIndex].isFilled (czyli jeżeli aktualny "stage" is wypełniony poprawnie) to zwracamy true, jeżeli nie to false */}
        <Button
          disabled={stages[currentStageIndex].isFilled === false ? true : false}
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
          show={nextStage ? nextStage.componentKey : stages[0]!.componentKey}
          onClick={async () => {
            // Jeżeli są wszystkie etapy wypełnione, to ustawiany początkowy stan naszych "stagów" co powoduje, że komponent się rerenderuje i wyświetla to, co było na samym początku, bez potrzeby odświeżania strony
            // Jak przytrzymasz lewy ctrl i klikniesz lewym przyciskiem myszy na "areAllStagesDone" to przeniesie cię do deklaracji tej zmiennej

            if (areAllStagesDone === true) {
              setStages([
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
              setCurrentStageId(1);
              userSelectedDataSignal.value = {
                weapons: [],
                date: null,
                userData: null,
              };
            }
            // W przeciwnym razie, jeżeli wszystkie etapy nie są wypełnione, to chcemy wyświetlić nie początek, tylko kolejny etap
            else {
              setStages((currentValue) => {
                const copiedCurrentValue = structuredClone(currentValue);

                // Tutaj znajdujemy etap, na który, użytkownik właśnie się znajduje i jeżeli kliknie dalej to ustawiamy go na "isDone = true"

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

              // Jeżeli "componentKey" === "Summary", czyli jeżeli jesteśmy na etapie podsumowania, to wiemy, że następny etap, to będzie informacje, że wszystko jest gotowe,
              // więc w rym momencie musimy wysłace dane na serwer

              if (stages[currentStageIndex]!.componentKey === "Summary") {
                // I tutaj widziemy, że pobieramy wartości z naszego "signala" zadeklarowanego na samym początku (lewy ctrl plus lewy przycisk myszy na "userSelectedDataSignal")
                const { weapons, date, userData } = userSelectedDataSignal.value;

                const weaponsId = weapons.map((data) => data.id);

                // słowo "await" sygnalizuje, że dana funckje jest asynchroniczna, więc zanim kod wykona się dalej, trzeba poczekać (a wait), aż dana funkcja skończy się wyonywać

                const response = await reservationAdd(
                  date!.start,
                  date!.end,
                  weaponsId,
                  userData!.email,
                  userData!.firstName,
                  userData!.lastName,
                  parseInt(userData!.phoneNumber)
                );
              }
            }
          }}>
          {areAllStagesDone === true ? "Gotowe!" : stages[currentStageIndex]!.componentKey === "Summary" ? "Wyślij rezerwację" : "Dalej"}
        </Button>
      </div>
    </div>
  );
};

export default ReservationVisitForm;
