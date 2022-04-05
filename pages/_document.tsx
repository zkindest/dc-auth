import { Html, Head, Main, NextScript } from "next/document"
import Terser from "terser"
import { colorModeKey } from "~/constants"
import mem from "mem"

const minify = mem(Terser.minify)

function setColorsByTheme() {
  let colorMode = "light"
  let colorModeKey = "sdfsdfsf"
  const persistedColorPreference = window.localStorage.getItem(colorModeKey)

  const mql = window.matchMedia("(prefers-color-scheme: dark)")
  const hasMediaQueryPreference = typeof mql.matches === "boolean"

  if (typeof persistedColorPreference == "string") {
    colorMode = persistedColorPreference
  } else {
    colorMode = hasMediaQueryPreference ? "dark" : "light"
  }

  let body = document.body

  if (colorMode == "dark") {
    body.classList.remove("light")
    body.classList.add("dark")
  } else {
    body.classList.remove("dark")
    body.classList.add("light")
  }
}

const MagicScriptTag = () => {
  const boundFn = String(setColorsByTheme).replace("sdfsdfsf", colorModeKey)

  let codeToRunOnClient = `(${boundFn})()`

  const minifyOutput = minify(codeToRunOnClient)
  if (minifyOutput.error) {
    throw minifyOutput.error
  }

  if (!minifyOutput.code) {
    throw new Error("Minified code is empty")
  }

  return (
    <script
      type="text/javascript"
      dangerouslySetInnerHTML={{ __html: codeToRunOnClient }}
    />
  )
}
export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <MagicScriptTag />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
