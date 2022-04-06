import React, { useEffect } from "react"
import { extractPaths, extractUriParams } from "~/utils/client"
import { setJwtToken, setRefreshToken } from "~/utils/client/auth"

interface callbackProps {}

const Callback: React.FC<callbackProps> = ({}) => {
  useEffect(() => {
    try {
      ;(async () => {
        const { code, state } = extractUriParams(window.location.href)
        const provider = extractPaths(window.location.href)[1]

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
          throw new Error("oauth provider name not found")
        }
      })()
    } catch (err) {
      console.error(err)
      throw new Error("oauth failed")
    }
  }, [])
  return <div className="page-center">loading...</div>
}

export default Callback
