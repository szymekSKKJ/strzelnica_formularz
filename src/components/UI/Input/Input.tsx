import styles from "./styles.module.scss";

interface componentProps {
  placeholder: string;
}

const Input = ({ placeholder }: componentProps) => {
  return (
    <div className={`${styles.inputWrapper}`}>
      <input placeholder={placeholder}></input>
      <label>{placeholder}</label>
    </div>
  );
};

export default Input;
