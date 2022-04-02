import { AppProps } from "next/app"
import { ThemeProvider } from "../lib/theme"
import "../styles/base.css"

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
