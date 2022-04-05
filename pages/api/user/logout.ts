import { NextApiRequest, NextApiResponse } from "next"
import { serialize } from "cookie"
import { loginCookieName } from "~/constants"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      res.setHeader(
        "Set-Cookie",
        serialize(loginCookieName, "", {
          maxAge: -1,
          path: "/",
        })
      )
      return res.json({ ok: true })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "something went wrong!" })
  }
}
