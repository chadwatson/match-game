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
      className={`inline-flex items-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white ring-1 shadow-xs cursor-pointer ring-violet-500 ring-inset hover:bg-violet-700 hover:ring-violet-600 active:bg-violet-800 active:text-violet-200 ${className}`}
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
