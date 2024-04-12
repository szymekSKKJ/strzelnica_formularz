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
}

const Button = ({ children, show, context, animationIn, animationOut, className, ...rest }: componentProps) => {
  if (show) {
    return (
      <TransitionButton
        animationOut={animationOut}
        animationIn={animationIn}
        context={context}
        show={show}
        className={`${styles.button} ${varela_Round.className} ${className}`}
        {...rest}>
        {children}
        <ClickEffect></ClickEffect>
      </TransitionButton>
    );
  } else {
    return (
      <button className={`${styles.button} ${varela_Round.className} ${className}`} {...rest}>
        {children}
        <ClickEffect></ClickEffect>
      </button>
    );
  }
};

export default Button;
