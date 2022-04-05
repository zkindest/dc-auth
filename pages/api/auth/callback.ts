import crypto from "crypto"
import md5 from "md5"
import { NextApiRequest, NextApiResponse } from "next"
import { loginCookieAge, loginCookieName, OAuthCookieName } from "~/constants"
// import { decode } from "jsonwebtoken"
import prisma from "~/lib/prisma"
import { getCookie, setHardCookie } from "~/utils"
import { sha256, SignWithUserClaims, uuidv4 } from "~/utils/crypto"
import { googleStrategy } from "~/lib/auth/google"

interface OAuthTokenResult {
  access_token: string
  expires_in: number
  id_token: string
  scope: string
  token_type: string
  refresh_token?: string
  error?: string
}
interface OAuthUserResult {
  id: string
  email: string
  verified_email: boolean
  name?: string
  given_name?: string
  family_name?: string
  picture?: string
  locale?: string
  error?: {
    code: number
    message: string
  }
}
const getUserFromGoogle = async (token: string) => {
  const result = await (
    await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
  ).json()
  return result
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { state, code } = req.body

    if (!code) {
      res.status(500).json({
        error: "something went wrong",
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

    const { uri, payload } = googleStrategy.getAuthUri({
      authCode: code.toString(),
    })

    const oAuthTokenResult: OAuthTokenResult = await (
      await fetch(uri, {
        method: "POST",
        body: payload,
      })
    ).json()
    console.log({ oAuthTokenResult })

    if (oAuthTokenResult.error) {
      res.status(500).json({
        error: oAuthTokenResult.error,
      })
      return
    }
    // const decodedUser: any = decode(googleTokenResult.id_token)

    const oAuthUserResult: OAuthUserResult = await getUserFromGoogle(
      oAuthTokenResult.access_token
    )
    console.log({ oAuthUserResult })
    if (oAuthUserResult.error) {
      res.status(401).json({
        error: oAuthUserResult.error.message,
      })
      return
    }
    if (!oAuthUserResult.verified_email) {
      res.status(401).json({
        error: "email not verified",
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
      userFromDb = await prisma.user.create({
        data: {
          bio: "",
          name: oAuthUserResult.name || "",
          phone: "",
          avatar:
            oAuthUserResult.picture ||
            `https://secure.gravatar.com/avatar/${md5(
              oAuthUserResult.email
            )}?s=164&d=identicon`,
          email: oAuthUserResult.email,
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
}
