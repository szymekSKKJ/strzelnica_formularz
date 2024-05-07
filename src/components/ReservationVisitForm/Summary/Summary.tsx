import { userSelectedDataSignal } from "../ReservationVisitForm";
import styles from "./styles.module.scss";

const Summary = () => {
  const { userData, weapons, date } = userSelectedDataSignal.value;

  return (
    <div className={`${styles.summary}`}>
      <h2>Podsumowanie</h2>
      <div className={`${styles.content}`}>
        <div className={`${styles.userData}`}>
          <h3>Dane</h3>
          <div className={`${styles.content}`}>
            <p>
              {userData!.firstName} {userData!.lastName}
            </p>
            <p>{userData!.email}</p>
            <p>{userData!.phoneNumber}</p>
          </div>
        </div>
        <div className={`${styles.weapons}`}>
          <h3>Bronie</h3>
          <div className={`${styles.content}`}>
            {weapons.map((data) => {
              const { id, caliber, model, type, manufacturer } = data;

              return (
                <p key={id}>
                  {type} {model} {manufacturer.name} {caliber}
                </p>
              );
            })}
          </div>
        </div>

        <div className={`${styles.date}`}>
          <h3>Termin</h3>
          <div className={`${styles.content}`}>
            <p>
              {new Date(date!.start).toLocaleDateString("pl-PL", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
            <span>-</span>
            <p>
              {new Date(date!.end).toLocaleTimeString("pl-PL", {
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
