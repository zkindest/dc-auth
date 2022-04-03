/**
 * mostly taken from https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/
 */
import React, {
  ChangeEvent,
  ComponentPropsWithoutRef,
  FocusEvent,
  useState,
} from "react"
import { useId } from "@reach/auto-id"

interface FileInputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  function FileInput(props, ref) {
    const {
      label = "Choose a file",
      id,
      onChange,
      onFocus,
      onBlur,
      ...rest
    } = props
    const randId = useId(id)
    const [fileName, setFileName] = useState(label)
    const [hasFocus, setFocus] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      let fileName
      const input = e.target as HTMLInputElement
      const inputFiles = input.files
      if (inputFiles && inputFiles.length > 1) {
        fileName = `${inputFiles.length} files selected`
      } else {
        fileName = input.value.split("\\").pop()
      }
      if (fileName) setFileName(fileName)
      else setFileName(label)
      onChange?.(e)
    }
    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setFocus(true)
      onFocus?.(e)
    }
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setFocus(false)
      onBlur?.(e)
    }
    return (
      <div>
        <input
          type="file"
          id={randId}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={hasFocus ? "has-focus" : ""}
          ref={ref}
          {...rest}
        />
        <label htmlFor={randId}>{fileName}</label>
        <style jsx>{`
          input {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
          }
          input + label {
            font-size: 1.25em;
            font-weight: 700;
            color: white;
            background-color: black;
            display: inline-block;
            padding: 0.1em 0.5em;
          }
          input:focus + label,
          input + label:hover {
            background-color: red;
          }
          input + label {
            cursor: pointer;
          }
          input:focus + label,
          input.has-focus + label {
            outline: 1px dotted #000;
            outline: -webkit-focus-ring-color auto 5px;
          }
          input + label * {
            pointer-events: none;
          }
        `}</style>
      </div>
    )
  }
)

export default FileInput
