export type BasicSizes = "small" | "medium" | "large"

export const sizePadding: Record<BasicSizes, string> = {
  small: ".2rem 1rem",
  medium: ".5rem 2rem",
  large: ".8rem 3rem",
}

export const sizeFont: Record<BasicSizes, string> = {
  small: ".8rem",
  medium: "1.2rem",
  large: "1.6rem",
}
