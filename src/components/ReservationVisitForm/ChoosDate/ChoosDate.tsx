import DataPicker from "@/components/DataPicker/DataPicker";
import styles from "./styles.module.scss";

const ChoosDate = () => {
  return (
    <div className={`${styles.choosDate}`}>
      <h2>Wybierz termin</h2>
      <div className={`${styles.content}`}>
        <div className={`${styles.dataPickerWrapper}`}>
          <DataPicker
            onSave={() => {}}
            style={{
              backgrondColor: "white",
              fontColor: "#00a1e6",
              hoverColor: "rgba(0, 161, 230, 0.15)",
              borderColor: "#00a1e6",
              borderRadius: "4px",
            }}></DataPicker>
        </div>
        <div className={`${styles.availableHours}`}>
          <div className={`${styles.availableHour}`}>
            <p>14.00 - 15.00</p>
          </div>
          <div className={`${styles.availableHour}`}>
            <p>14.00 - 15.00</p>
          </div>
          <div className={`${styles.availableHour}`}>
            <p>14.00 - 15.00</p>
          </div>
          <div className={`${styles.availableHour}`}>
            <p>14.00 - 15.00</p>
          </div>
          <div className={`${styles.availableHour}`}>
            <p>14.00 - 15.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChoosDate;
