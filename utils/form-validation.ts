import { RegisterOptions } from "react-hook-form"

interface GetValidation {
  name: string
  type?: "string" | "number"
  min?: number
  max?: number
}

export const getValidation = ({
  max,
  min,
  type = "string",
  name,
}: GetValidation) => {
  const itemType = type === "string" ? "characters" : "digits"
  return {
    required: `${name} required`,
    minLength: min
      ? {
          value: min,
          message: `${name} cannot be less than ${min} ${itemType}`,
        }
      : undefined,
    maxLength: max
      ? {
          value: max,
          message: `${name} cannot be more than ${max} ${itemType}`,
        }
      : undefined,
  } as RegisterOptions
}
export const validPhone = {
  ...getValidation({ name: "phone", type: "number", min: 9, max: 15 }),
  pattern: {
    value: /\d{9,15}/,
    message: "please enter valid phone",
  },
  required: undefined,
}
