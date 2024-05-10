import styles from "./styles.module.scss";
import ReservationVisitForm from "@/components/ReservationVisitForm/ReservationVisitForm";

const HomePage = () => {
  return (
    <div className={`${styles.homePage}`}>
      <h1>
        Strzelnica Precision <i className="fa-sharp fa-regular fa-bullseye-arrow"></i>
      </h1>
      <ReservationVisitForm></ReservationVisitForm>
    </div>
  );
};

export default HomePage;
