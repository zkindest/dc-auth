import React, { ComponentPropsWithoutRef } from "react"

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  error?: string
  loading?: boolean
  classes?: {
    root?: string
    field__body?: string
    field__input?: string
    left__adornment?: string
    right__adornment?: string
    field__footer?: string
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
    leftAdornment,
    rightAdornment,
    className,
    ...rest
  } = props
  const {
    root = "",
    field__body = "",
    field__footer = "",
    field__input = "",
    left__adornment = "",
    right__adornment = "",
  } = classes
  return (
    <div className={`o_root ${root} ${className}`}>
      {/* <div className={classes.field__header}>
      </div> */}
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
          <input type="text" ref={ref} {...rest} />
          {rightAdornment && (
            <div
              className={`o_right-admt ${right__adornment}`}
              aria-hidden="true"
            >
              {rightAdornment}
            </div>
          )}
          <fieldset aria-hidden="true"></fieldset>
        </div>
      </div>
      <div className={`o_field__footer ${field__footer}`}>
        {error && <p className="error">{error}</p>}
      </div>
      <style jsx>{`
        .o_root {
          position: relative;
          font: inherit;
          color: var(--clr-text);
          width: 100%;
        }
        .o_field__body {
        }
        .o_field__footer {
          padding: 0.2em;
          font-size: 0.8em;
          font-weight: bold;
        }
        .o_field__input {
          position: relative;
          display: flex;
          align-items: center;
          background-color: var(--clr-bg-elements);
          border-radius: 8px;
        }
        .o_field__input input {
          border: 0;
          outline: 0;
          padding-left: 0.5em;
          line-height: 2.5em;
          flex-grow: 1;
          background-color: inherit;
          color: var(--clr-text);
          border-radius: inherit;
        }
        .o_field__input input:focus ~ fieldset {
          border-width: 2px;
          border-color: var(--clr-input-active);
        }
        .o_field__input:hover > fieldset {
          border-color: var(--clr-input-active);
          border-width: 2px;
        }
        .o_field__input fieldset {
          border: 1px solid #bdbdbd;
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
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
