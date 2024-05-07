import { FormEvent, HtmlHTMLAttributes } from "react";
import styles from "./styles.module.scss";

interface componentProps extends HtmlHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  value?: string;
}

const Input = ({ placeholder, value, ...rest }: componentProps) => {
  return (
    <div className={`${styles.inputWrapper}`}>
      <input {...rest} placeholder={placeholder} defaultValue={value ? value : ""}></input>
      <label>{placeholder}</label>
    </div>
  );
};

export default Input;
