import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { extractUriParams } from "~/utils/client"
import { setJwtToken, setRefreshToken } from "~/utils/client/auth"

interface callbackProps {}

const Callback: React.FC<callbackProps> = ({}) => {
  const router = useRouter()
  useEffect(() => {
    try {
      ;(async () => {
        const { code, state } = extractUriParams(window.location.href)

        const result = await (
          await fetch("/api/auth/callback", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              code: decodeURIComponent(code),
              state,
            }),
          })
        ).json()
        setJwtToken(result.jwt)
        setRefreshToken(result.refreshToken)
        window.location.replace("/")
      })()
    } catch (err) {
      console.error(err)
    }
  }, [])
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        alignItems: "center",
      }}
    >
      loading...
    </div>
  )
}

export default Callback
