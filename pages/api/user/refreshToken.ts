import { NextApiRequest, NextApiResponse } from "next"
import {
  FINGERPRINT_COOKIE_NAME,
  getRefreshTokenExpiryTime,
  JWT_REFRESH_TOKEN_EXPIRES_IN,
} from "~/constants"
import { getCookie } from "~/utils"
import { sha256, uuidv4 } from "~/utils/crypto"
import tokenGenerator from "~/utils/TokenGenerator"
import prisma from "~/lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { refreshToken, fingerPrintHash } = req.body

      const fingerprintCookie = getCookie(
        req.headers.cookie,
        FINGERPRINT_COOKIE_NAME
      )
      console.log({ fingerprintCookie })
      if (!fingerprintCookie) {
        return res.status(400).json({ error: "Unable to refresh JWT token" })
      }

      // Compute a SHA256 hash of the received fingerprint in cookie in order to compare
      // it to the fingerprint hash stored in the token
      const fingerprintCookieHash = sha256(fingerprintCookie)
      console.log({
        fingerprintCookie,
        fingerprintCookieHash,
        fingerPrintHash,
      })

      if (fingerPrintHash != fingerprintCookieHash) {
        return res.status(400).json({ error: "Unable to refresh JWT token" })
      }

      const user = await prisma.session.findFirst({
        where: {
          refreshToken,
        },
      })
      if (!user) return res.status(400).json({ error: "user not found" })

      await prisma.session.update({
        where: {
          id: user.id,
        },
        data: {
          refreshToken: uuidv4(),
          refreshTokenExpiresAt: new Date(
            Date.now() + getRefreshTokenExpiryTime()
          ).toISOString(),
        },
      })
      const jwt = tokenGenerator.signWithClaims({
        expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
        allowedRoles: ["user"],
        defaultRole: "user",
        otherClaims: {
          "X-Hasura-User-Id": String(user.id),
        },
      })
      return res.status(200).json({
        data: {
          jwt,
        },
      })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "something went wrong!" })
  }
}
