import styles from "./styles.module.scss";

const Finalized = () => {
  return (
    <div className={`${styles.finalized}`}>
      <div className={`${styles.icon}`}>
        <i className="fa-solid fa-check"></i>
      </div>
      <p>Wszystko gotowe!</p>
      <p>Na podany adres email została wysłana wiadomość potwierdzająca</p>
    </div>
  );
};

export default Finalized;
