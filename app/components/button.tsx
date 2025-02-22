"use client";

import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FunctionComponent,
  ReactNode,
} from "react";

function Button(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    icon?: ReactNode | null | undefined;
  }
) {
  const { icon, className, ...rest } = props;

  return (
    <button
      {...rest}
      className={`inline-flex items-center rounded-full bg-violet-600 px-3 py-2 text-sm font-semibold text-white disabled:text-violet-300 shadow-lg shadow-violet-500/50 active:shadow-md ring-1 enabled:cursor-pointer ring-violet-500 ring-inset enabled:hover:bg-violet-700 enabled:hover:ring-violet-600 enabled:active:bg-violet-800 enabled:active:text-violet-200 ${className}`}
    >
      {props.icon}
      {props.children}
    </button>
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
