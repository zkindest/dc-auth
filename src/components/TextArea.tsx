import React, { ComponentPropsWithoutRef } from "react"
import { useId } from "@reach/auto-id"

interface TextAreaProps extends ComponentPropsWithoutRef<"textarea"> {
  error?: string
  label?: string
  classes?: {
    root?: string
    field__body?: string
    field__input?: string
    field__footer?: string
    field__label?: string
  }
}
const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextField(props, ref) {
    const { classes = {}, error, label, className, id, ...rest } = props
    const randId = useId(id)
    const {
      root = "",
      field__body = "",
      field__label = "",
      field__footer = "",
      field__input = "",
    } = classes
    return (
      <div className={`o_root ${root} ${className}`}>
        {label && (
          <label className={`o_field__label ${field__label}`} htmlFor={randId}>
            {label}
          </label>
        )}
        <div className={`o_field__body ${field__body}`}>
          <div className={`o_field__input ${field__input}`}>
            <textarea ref={ref} {...rest} id={randId} />
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
          .o_field__input fieldset.field__error {
            border-color: red !important;
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
          .o_field__input textarea {
            border: 0;
            outline: 0;
            padding-left: 0.5em;
            line-height: 2.5em;
            flex-grow: 1;
            background-color: inherit;
            color: var(--clr-text);
            border-radius: inherit;
          }
          .o_field__input textarea:focus ~ fieldset {
            border-width: 2px;
            border-color: var(--clr-input-active);
          }
          .o_field__input:hover > fieldset {
            border-color: var(--clr-input-active);
            border-width: 1px;
          }
          .o_field__input fieldset {
            border: 1px solid var(--clr-gray-2);
            position: absolute;
            inset: 0;
            border-radius: inherit;
            pointer-events: none;
          }
        `}</style>
      </div>
    )
  }
)
export default TextArea
