import React, { forwardRef, PropsWithChildren } from "react";

import cn from "classnames";
import { Typography } from "../../Typography";
import styles from "./Input.module.scss";

type Props = PropsWithChildren<{
  label: string;
  errorMessage?: string;
  supportText?: string;
}> &
  React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<any, Props>(
  (
    {
      label,
      errorMessage,
      supportText,
      id,
      disabled,
      className,
      children,
      ...other
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          styles.formGroup,
          {
            [styles.formGroupDisabled]: disabled,
          },
          className
        )}
      >
        <input
          className={cn(
            styles.formField,
            { [styles.formFieldDisabled]: disabled },
            { [styles.formFieldError]: !!errorMessage }
          )}
          placeholder={label}
          id={id}
          ref={ref}
          {...other}
        ></input>
        {children}
        {label && (
          <label
            className={cn(
              styles.formLabel,
              { [styles.formLabelDisabled]: disabled },
              { [styles.formLabelError]: !!errorMessage }
            )}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        {(supportText || errorMessage) && (
          <Typography
            className={cn(
              styles.message,
              {
                [styles.messageDisabled]: disabled,
              },
              { [styles.messageError]: !!errorMessage }
            )}
          >
            {errorMessage || supportText}
          </Typography>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
