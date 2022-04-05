import { NextApiRequest, NextApiResponse } from "next"
import { googleStrategy } from "~/lib/auth/google"
import crypto from "node:crypto"
import { setHardCookie } from "~/utils"
import { OAuthCookieAge, OAuthCookieName } from "~/constants"
import { sha256 } from "~/utils/crypto"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { provider } = req.query
      if (!provider) {
        return res.redirect("/")
      }
      const state = crypto.randomBytes(512).toString("hex")

      setHardCookie(OAuthCookieName, state, res, {
        maxAge: OAuthCookieAge,
      })
      let verificationUri
      if (provider === "google") {
        verificationUri = googleStrategy.getVerificationUri({
          accessType: "offline",
          prompt: "consent",
          state: sha256(state),
        })
      }

      if (verificationUri) {
        res.redirect(verificationUri)
      } else {
        res.status(400).json({ error: "invalid parameter: provider" })
      }
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "something went wrong",
    })
  }
}
