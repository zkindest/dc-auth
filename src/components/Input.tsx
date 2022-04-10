import React, { ComponentPropsWithoutRef } from "react"
import { useId } from "@reach/auto-id"

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  error?: string
  loading?: boolean
  label?: string
  classes?: {
    root?: string
    field__body?: string
    field__input?: string
    left__adornment?: string
    right__adornment?: string
    field__footer?: string
    field__label?: string
  }
  leftAdornment?: JSX.Element
  rightAdornment?: JSX.Element
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(function TextField(
  props,
  ref
) {
  const {
    classes = {},
    error,
    loading,
    label,
    leftAdornment,
    rightAdornment,
    className,
    id,
    ...rest
  } = props
  const randId = useId(id)
  const {
    root = "",
    field__body = "",
    field__label = "",
    field__footer = "",
    field__input = "",
    left__adornment = "",
    right__adornment = "",
  } = classes
  return (
    <div className={`o_root ${root} ${className || ""}`}>
      {label && (
        <label className={`o_field__label ${field__label}`} htmlFor={randId}>
          {label}
        </label>
      )}
      <div className={`o_field__body ${field__body}`}>
        <div className={`o_field__input ${field__input}`}>
          {leftAdornment && (
            <div
              className={`o_left-admt ${left__adornment}`}
              aria-hidden="true"
            >
              {leftAdornment}
            </div>
          )}
          <input type="text" ref={ref} {...rest} id={randId} />
          {rightAdornment && (
            <div
              className={`o_right-admt ${right__adornment}`}
              aria-hidden="true"
            >
              {rightAdornment}
            </div>
          )}
          <fieldset
            aria-hidden="true"
            className={error ? "field__error" : ""}
          ></fieldset>
        </div>
      </div>
      <div className={`o_field__footer ${field__footer}`}>
        {error && <p className="field__error">{error}</p>}
      </div>
      <style jsx>{`
        .o_root {
          position: relative;
          font: inherit;
          color: var(--clr-text);
          width: 100%;
        }
        .o_field__label {
          color: var(--clr-mediumgray-1);
        }
        .o_field__body {
        }
        .o_field__footer {
          padding: 0.2em;
          font-size: 0.8em;
          text-align: left;
        }
        p.field__error {
          color: red;
        }
        .o_field__input {
          position: relative;
          display: flex;
          align-items: center;
          background-color: var(--clr-bg-elements);
          border-radius: 8px;
        }
        input {
          border: 0;
          outline: 0;
          padding-left: 0.5em;
          line-height: 2.5em;
          flex-grow: 1;
          background-color: inherit;
          color: var(--clr-text);
          border-radius: inherit;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px var(--clr-bg-elements) inset !important;
          -webkit-text-fill-color: var(--clr-text) !important;
        }
        .o_field__input fieldset {
          border: 1px solid var(--clr-gray-2);
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
        }
        .o_field__body input:focus ~ fieldset {
          border-width: 2px;
          border-color: var(--clr-input-active);
        }
        .o_field__input:hover > fieldset {
          border-color: var(--clr-input-active);
          border-width: 1px;
        }
        .o_field__input fieldset.field__error {
          border-color: red !important;
        }
        .o_left-admt,
        .o_right-admt {
          font-size: 1.2em;
          color: var(--clr-text);
        }
        .o_left-admt {
          padding-left: 0.5em;
        }
        .o_right-admt {
          padding-right: 0.5em;
          padding-left: 0.5em;
        }
      `}</style>
    </div>
  )
})
export default Input
