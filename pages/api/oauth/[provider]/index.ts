import { NextApiRequest, NextApiResponse } from "next"
import { googleStrategy } from "~/lib/oauth/google"
import crypto from "node:crypto"
import { setHardCookie } from "~/utils"
import { OAuthCookieAge, OAuthCookieName } from "~/constants"
import { sha256 } from "~/utils/crypto"
import { githubStrategy } from "~/lib/oauth/github"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { provider } = req.query

      if (!provider) {
        return res.status(400).json({ error: "invalid provider" })
      }
      const state = crypto.randomBytes(512).toString("hex")

      setHardCookie(OAuthCookieName, state, res, {
        maxAge: OAuthCookieAge,
      })
      let verificationUri
      switch (provider) {
        case "google":
          verificationUri = googleStrategy.getVerificationUri({
            accessType: "offline",
            prompt: "consent",
            state: sha256(state),
          })
          break

        case "github":
          verificationUri = githubStrategy.getVerificationUri({
            accessType: "offline",
            prompt: "consent",
            state: sha256(state),
          })
          break
        default:
          break
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
