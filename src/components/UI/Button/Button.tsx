"use client";

import { HtmlHTMLAttributes, MutableRefObject, ReactNode } from "react";
import styles from "./styles.module.scss";
import { TransitionButton } from "react-components-transition";
import { Varela_Round } from "next/font/google";
import ClickEffect from "@/components/ClickEffect/ClickEffect";

const varela_Round = Varela_Round({ subsets: ["latin"], weight: ["400"] });

interface componentProps extends HtmlHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  animationIn?: {
    className: string;
    duration: number;
  };
  animationOut?: {
    className: string;
    duration: number;
  };
  context?: any;
  onClick?: any;
  show?: string;
  disabled?: boolean;
}

const Button = ({ children, show, context, animationIn, animationOut, className, disabled = false, onClick, ...rest }: componentProps) => {
  if (show && disabled === false) {
    return (
      <TransitionButton
        {...rest}
        animationOut={animationOut}
        animationIn={animationIn}
        context={context}
        show={show}
        className={`${styles.button} ${varela_Round.className} ${className}`}
        onClick={(event) => {
          onClick(event);
        }}>
        {children}
        <ClickEffect></ClickEffect>
      </TransitionButton>
    );
  } else {
    return (
      <button
        {...rest}
        className={`${styles.button} ${varela_Round.className} ${disabled === true ? styles.disabled : ""} ${className}`}
        onClick={(event) => {
          if (disabled === false) {
            onClick && onClick(event);
          }
        }}>
        {children}
        <ClickEffect></ClickEffect>
      </button>
    );
  }
};

export default Button;
