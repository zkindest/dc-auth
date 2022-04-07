import { AppProps } from "next/app"
import { ThemeProvider } from "../lib/theme"
import "../styles/base.css"

import { useEffect, useLayoutEffect, useState } from "react"
import { getAuthFetchOptions } from "~/utils/client/auth"
import { useAtom } from "jotai"
import { userAtom } from "~/jotai/user"
import ErrorBoundary from "~/components/ErrorBoundary"

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  const [loadUser, setLoadUser] = useState(false)

  // Wait until after client-side hydration to show
  useEffect(() => {
    setLoadUser(true)
  }, [])

  return (
    <ThemeProvider>
      <ErrorBoundary>
        {loadUser && <LoadInitialUser />}
        <Component {...pageProps} />
      </ErrorBoundary>
    </ThemeProvider>
  )
}

const LoadInitialUser = () => {
  const [_, setUser] = useAtom(userAtom)

  useLayoutEffect(() => {
    // to avoid state updates after component unmount
    // see: https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
    let isActive = true
    try {
      ;(async () => {
        const result = await (
          await fetch("/api/user", {
            method: "GET",
            ...getAuthFetchOptions(),
          })
        ).json()
        if (isActive) setUser(result.data)
      })()
    } catch (err) {
      console.error(err)
    }
    return () => {
      isActive = false
    }
  }, [setUser])
  return <></>
}
