import { NextApiRequest, NextApiResponse } from "next"
import { getRefreshTokenExpiryTime } from "~/constants"
import {
  checkPassword,
  uuidv4,
  setFingerprintCookieAndSignJwt,
} from "~/utils/crypto"
import crypto from "crypto"
import prisma from "~/lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { email, password } = req.body
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      })

      if (!user) {
        return res.status(400).json({ error: "User not found" })
      }
      const validPassword = await checkPassword(password, user.password)

      if (!validPassword) {
        return res.status(400).json({ error: "Invalid credentials" })
      }
      // Update user refresh token and refresh token expiration
      const refreshToken = uuidv4()
      await prisma.session.update({
        where: {
          userId: user.id,
        },
        data: {
          refreshToken,
          refreshTokenExpiresAt: new Date(
            Date.now() + getRefreshTokenExpiryTime()
          ).toISOString(),
        },
      })
      // //Generate a random string that will constitute the fingerprint for this user
      const fingerprint = crypto.randomBytes(50).toString("hex")

      // Add the fingerprint in a hardened cookie to prevent Token Sidejacking
      // https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking
      const jwt = setFingerprintCookieAndSignJwt(fingerprint, res, user)

      return res.status(200).json({
        data: {
          jwt,
          refreshToken,
        },
      })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "something went wrong!" })
  }
}
