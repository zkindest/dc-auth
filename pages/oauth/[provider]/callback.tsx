import React, { useEffect, useState } from "react"
import { extractPaths, extractUriParams } from "~/utils/client"
import { setJwtToken, setRefreshToken } from "~/utils/client/auth"

interface callbackProps {}

const Callback: React.FC<callbackProps> = ({}) => {
  const [provider, setProvider] = useState("")
  useEffect(() => {
    try {
      ;(async () => {
        const { code, state } = extractUriParams(window.location.href)
        const provider = extractPaths(window.location.href)[1]
        setProvider(provider)

        if (provider) {
          const result = await (
            await fetch(`/api/oauth/${provider}/callback`, {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                code: decodeURIComponent(code),
                state: decodeURIComponent(state),
              }),
            })
          ).json()
          setJwtToken(result.jwt)
          setRefreshToken(result.refreshToken)
          window.location.replace("/user/info")
        } else {
          console.log({ provider })

          console.error("no provider found")
        }
      })()
    } catch (err) {
      console.error(err)
    }
  }, [])
  if (!provider) {
    return <div className="page-center">invalid provider!</div>
  }
  return <div className="page-center">loading...</div>
}

export default Callback
