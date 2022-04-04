import { AppProps } from "next/app"
import { ThemeProvider } from "../lib/theme"
import "../styles/base.css"

import { useEffect } from "react"
import { getAuthFetchOptions } from "~/utils/auth"
import { useAtom } from "jotai"
import { userAtom } from "~/jotai/user"

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  const [_, setUser] = useAtom(userAtom)
  useEffect(() => {
    try {
      ;(async () => {
        const result = await (
          await fetch("/api/user", {
            method: "GET",
            ...getAuthFetchOptions(),
          })
        ).json()
        setUser(result.data)
      })()
    } catch (err) {
      console.error(err)
    }
  }, [setUser])
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
