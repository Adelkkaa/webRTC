import cn from "classnames";
import {
  HTMLAttributes,
  PropsWithChildren,
  createElement,
  forwardRef,
} from "react";
import styles from "./Typography.module.scss";

export type TypographyLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type TypographyWeight = "regular" | "medium" | "semibold" | "bold";
export type TypographyColor = "black" | "white" | "green" | "red" | "gray";

type Props = PropsWithChildren<{
  el?: string;
  level?: TypographyLevel;
  weight?: TypographyWeight;
  color?: TypographyColor;
}> &
  HTMLAttributes<HTMLDivElement>;

export const Typography = forwardRef<any, Props>(
  (
    {
      el = "p",
      level = 6,
      weight = "regular",
      color = "white",
      className,
      children,
      ...other
    },
    ref
  ) => {
    const typograpthyClassName = cn(
      className,
      styles.typography,
      styles[`level${level}`],
      styles[weight],
      styles[color]
    );

    return createElement(
      el,
      {
        ref,
        className: typograpthyClassName,
        ...other,
      },
      children
    );
  }
);

Typography.displayName = "Typography";
