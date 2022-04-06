import { ComponentPropsWithoutRef } from "react"
import { BasicSizes, sizeFont, sizePadding } from "./config"

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  size?: BasicSizes
  variant?: "outline" | "filled"
  fullWidth?: boolean
  loading?: boolean
}

const Button = ({
  size = "medium",
  variant = "filled",
  fullWidth,
  children,
  loading,
  ...rest
}: ButtonProps) => {
  return (
    <button {...rest}>
      {loading ? "loading..." : children}
      <style jsx>
        {`
          button {
            display: inline-block;
            transition: color 0.3s ease;
            border: ${variant === "filled"
              ? "0"
              : "1px solid var(--clr-gray-1)"};
            border-radius: 0.5em;
            width: ${fullWidth ? "100%" : "auto"};
            padding: ${sizePadding[size]};
            cursor: pointer;
            background: ${variant === "filled"
              ? "var(--clr-blue-1)"
              : "var(--clr-white)"};
            font-size: ${sizeFont[size]};
            font-weight: bold;
            color: ${variant === "filled" ? "#eee" : "var(--clr-gray-1)"};
          }
          button[disabled] {
            cursor: not-allowed;
            background: ${variant === "filled"
              ? "var(--clr-blue-2)"
              : "var(--clr-white)"};
          }
        `}
      </style>
    </button>
  )
}

export default Button
