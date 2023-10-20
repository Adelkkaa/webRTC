import React, { type ReactNode } from "react";

import cn from "classnames";

import styles from "./Button.module.scss";

type TButtonProps = {
  className?: string;
  icon?: ReactNode;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<TButtonProps> = ({
  className,
  icon,
  disabled = false,
  children,
  ...otherProps
}) => (
  <button
    className={cn(styles.button, { [styles.buttonDisabled]: disabled }, [
      className,
    ])}
    disabled={disabled}
    {...otherProps}
  >
    {icon && icon}
    {children}
  </button>
);
