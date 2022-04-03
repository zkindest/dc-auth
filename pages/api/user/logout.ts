import { NextApiRequest, NextApiResponse } from "next"
import { serialize } from "cookie"
import { FINGERPRINT_COOKIE_NAME } from "~/constants"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      res.setHeader(
        "Set-Cookie",
        serialize(FINGERPRINT_COOKIE_NAME, "", {
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
