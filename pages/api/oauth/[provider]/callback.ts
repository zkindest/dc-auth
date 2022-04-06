import crypto from "crypto"
import { NextApiRequest, NextApiResponse } from "next"
import { loginCookieAge, loginCookieName, OAuthCookieName } from "~/constants"
import prisma from "~/lib/prisma"
import { getCookie, setHardCookie } from "~/utils"
import { sha256, SignWithUserClaims, uuidv4 } from "~/utils/crypto"
import { ClientError } from "~/utils/error"
import {
  extractUserData,
  getAuthUri,
  getTokensFromProvider,
  getUserFromProvider,
  OAuthProvider,
} from "~/utils/oauth"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { state, code } = req.body
      const { provider } = req.query

      if (!code || !provider) {
        res.status(400).json({
          error: "bad request",
        })
        return
      }
      const rawStateCookie = getCookie(req.headers.cookie, OAuthCookieName)
      const stateCookie = sha256(rawStateCookie)

      if (state !== stateCookie) {
        return res.status(401).json({
          error: "Invalid state parameter",
        })
      }

      const { uri, payload } = getAuthUri(provider as OAuthProvider, code)

      const oAuthTokenResult = await getTokensFromProvider(uri, payload)
      console.log({ oAuthTokenResult })

      if (oAuthTokenResult.error) {
        res.status(500).json({
          error: oAuthTokenResult.error,
        })
        return
      }
      // const decodedUser: any = decode(googleTokenResult.id_token)

      const oAuthUserResult = await getUserFromProvider(
        provider as string,
        oAuthTokenResult.access_token!
      )
      console.log({ oAuthUserResult })
      if (oAuthUserResult.error) {
        res.status(401).json({
          error: oAuthUserResult.error.message,
        })
        return
      }
      if (!oAuthUserResult.email) {
        res.status(401).json({
          error: "email not available",
        })
        return
      }

      let userFromDb
      if (oAuthUserResult.email) {
        userFromDb = await prisma.user.findUnique({
          where: {
            email: oAuthUserResult.email,
          },
        })
      }

      if (!userFromDb) {
        // create a user
        const data = extractUserData(oAuthUserResult, provider as OAuthProvider)
        userFromDb = await prisma.user.create({
          data: {
            ...data,
            password: "",
            session: {
              create: {
                refreshToken: "",
                refreshTokenExpiresAt: "",
              },
            },
          },
        })
      }

      // Update user refresh token and refresh token expiration
      const refreshToken = uuidv4()

      await prisma.session.update({
        where: {
          userId: userFromDb.id,
        },
        data: {
          refreshToken,
        },
      })
      // //Generate a random string that will constitute the fingerprint for this user
      const fingerprint = crypto.randomBytes(50).toString("hex")

      // Add the fingerprint in a hardened cookie to prevent Token Sidejacking
      // https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking
      setHardCookie(loginCookieName, fingerprint, res, {
        maxAge: loginCookieAge,
      })

      const jwt = SignWithUserClaims(userFromDb, fingerprint)

      res.status(200).json({
        jwt,
        refreshToken: oAuthTokenResult.refresh_token,
      })
    } else {
      res.setHeader("Allow", ["POST"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (err) {
    console.error(err)
    if (err instanceof ClientError) {
      res.status(400).json({
        error: err.message,
      })
    } else {
      res.status(500).json({
        error: "something went wrong",
      })
    }
  }
}
