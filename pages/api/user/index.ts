import { Prisma } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { loginCookieAge, loginCookieName, refreshTokenTtl } from "~/constants"
import prisma from "~/lib/prisma"
import { parseToken, setHardCookie } from "~/utils"
import { hashPassword, SignWithUserClaims, uuidv4, md5 } from "~/utils/crypto"
import crypto from "crypto"

export const getUserFromToken = (req: NextApiRequest) => {
  const rawToken = req.headers["authorization"] || ""
  const token = rawToken.split(" ")[1]
  const user = parseToken(token)
  if (!(user && user.id)) {
    return null
  }
  return user
}
export const UserSelect: Prisma.UserSelect = {
  avatar: true,
  id: true,
  bio: true,
  email: true,
  name: true,
  phone: true,
}

export const getUserFromDB = async (
  userId: number,
  options?: {
    select?: Prisma.UserSelect
  }
) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: (options && options.select) || UserSelect,
  })
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  try {
    switch (method) {
      case "GET": {
        const decodedUser = getUserFromToken(req)
        if (!decodedUser)
          return res.status(400).json({ error: "Invalid credentials" })

        const user = await getUserFromDB(decodedUser.id)
        if (!user) return res.status(400).json({ error: "User not found" })
        return res.json({ data: user })
      }
      case "POST": {
        const { email, password, name } = req.body

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        })
        if (user) {
          res.status(400).json({ error: "User already exists" })
          return
        }
        const refreshToken = uuidv4()
        const newUser = await prisma.user.create({
          data: {
            bio: "",
            name,
            phone: "",
            avatar: `https://secure.gravatar.com/avatar/${md5(
              email
            )}?s=164&d=identicon`,
            email,
            password: await hashPassword(password),
            session: {
              create: {
                refreshToken: refreshToken,
                refreshTokenExpiresAt: new Date(
                  Date.now() + refreshTokenTtl
                ).toISOString(),
              },
            },
          },
        })

        // Generate a random string that will constitute the fingerprint for this user
        const fingerprint = crypto.randomBytes(50).toString("hex")
        // Add the fingerprint in a hardened cookie to prevent Token Sidejacking
        // https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking
        setHardCookie(loginCookieName, fingerprint, res, {
          maxAge: loginCookieAge,
        })
        const jwt = SignWithUserClaims(newUser, fingerprint)

        return res.status(200).json({ data: { jwt, refreshToken } })
      }
      default:
        res.setHeader("Allow", ["GET", "POST"])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "something went wrong!" })
  }
}
