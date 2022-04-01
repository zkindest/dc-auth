import { ComponentPropsWithoutRef } from "react"

const Button = ({ children, ...rest }: ComponentPropsWithoutRef<"button">) => {
  return (
    <button {...rest}>
      {children}
      <style jsx>
        {`
          button {
            display: inline-block;
            transition: color background-color 0.3s linear;
            border: 0;
            border-radius: 0.5em;
            width: 100%;
            min-height: 2.3em;
            cursor: pointer;
            background: var(--clr-blue-1);
            font: inherit;
            font-weight: bold;
            color: var(--clr-white);
          }
        `}
      </style>
    </button>
  )
}

export default Button
