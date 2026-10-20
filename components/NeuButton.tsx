"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
}

const sizeMap: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

const variantMap: Record<ButtonVariant, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  ghost: "btn btn-ghost",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", icon, className, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(variantMap[variant], sizeMap[size], className)}
        {...props}
      >
        {icon && <span className="-ml-0.5">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
