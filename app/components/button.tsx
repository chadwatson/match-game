"use client";

import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FunctionComponent,
  ReactNode,
} from "react";
import { Button as HeadlessUiButton } from "@headlessui/react";

type ButtonTheme = "primary" | "neutral";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  icon?: ReactNode | null | undefined;
  glow?: boolean | undefined;
  theme?: ButtonTheme | undefined;
};

type ButtonThemeProps = {
  glow?: boolean | undefined;
  theme?: ButtonTheme | undefined;
};

function themeClassName(props: ButtonThemeProps) {
  switch (props.theme) {
    case "primary":
      return `bg-violet-600 text-white disabled:text-violet-300 ring-violet-500 enabled:hover:bg-violet-700 enabled:hover:ring-violet-600 enabled:active:bg-violet-800 enabled:active:text-violet-200 ${
        props.glow ? "shadow-violet-500/50" : ""
      }`;
    default:
      return `bg-gray-800 text-white disabled:text-gray-500 ring-gray-800 enabled:hover:bg-gray-700 enabled:hover:ring-gray-600 enabled:active:bg-gray-800 enabled:active:text-gray-200 ${
        props.glow ? "shadow-gray-500/50" : ""
      }`;
  }
}

export const createButtonClassName = (props: ButtonProps) =>
  `inline-flex items-center justify-center rounded-full px-3 py-2 text-sm text-center font-semibold ring-1 enabled:cursor-pointer ring-inset ${themeClassName(
    props
  )} ${props.glow ? "shadow-lg active:shadow-md" : ""} ${props.className}`;

function Button(props: ButtonProps) {
  const { icon, children, glow, theme, ...rest } = props;

  return (
    <HeadlessUiButton
      {...rest}
      className={createButtonClassName({ theme, glow })}
    >
      {icon}
      {children}
    </HeadlessUiButton>
  );
}

Button.Icon = function ButtonIcon({
  Component,
}: {
  Component: FunctionComponent<{ className: string }>;
}) {
  return <Component className="mr-1.5 -ml-0.5 size-5" />;
};

export default Button;
