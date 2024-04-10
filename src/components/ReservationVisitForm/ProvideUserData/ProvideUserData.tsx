import Input from "@/components/UI/Input/Input";
import styles from "./styles.module.scss";
import Button from "@/components/UI/Button/Button";

const ProvideUserData = () => {
  return (
    <div className={`${styles.provideUserData}`}>
      <h2>Podaj dane</h2>
      <form>
        <div className={`${styles.inputRow}`}>
          <Input placeholder="Imię"></Input>
          <Input placeholder="Nazwisko"></Input>
        </div>
        <Input placeholder="Email"></Input>
        <Input placeholder="Numer telefonu"></Input>
      </form>
    </div>
  );
};

export default ProvideUserData;
