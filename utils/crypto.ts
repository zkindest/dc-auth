import { promisify } from "node:util"
import crypto from "node:crypto"
import {
  FINGERPRINT_COOKIE_NAME,
  FINGERPRINT_COOKIE_MAX_AGE,
  IS_PROD,
  JWT_TOKEN_EXPIRES_IN,
} from "~/constants"
import tokenGenerator from "./TokenGenerator"
import { NextApiResponse } from "next"
import { serialize } from "cookie"

const scrypt = promisify(crypto.scrypt)

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(8).toString("hex")
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer
  return salt + ":" + derivedKey.toString("hex")
}

export async function checkPassword(
  plaintextPassword: string,
  hashedPassword: string
) {
  const [salt, key] = hashedPassword.split(":")
  const derivedKey = (await scrypt(
    plaintextPassword,
    salt,
    64
  )) as NodeJS.ArrayBufferView

  return crypto.timingSafeEqual(Buffer.from(key, "hex"), derivedKey)
}

export function sha256(value: string) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex")
}
export function uuidv4(): string {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    // @ts-ignore
    (
      c ^
      // @ts-ignore
      (crypto.randomFillSync(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

export function setFingerprintCookieAndSignJwt(
  fingerprint: string,
  res: NextApiResponse,
  user: { id: number }
) {
  res.setHeader(
    "Set-Cookie",
    serialize(FINGERPRINT_COOKIE_NAME, fingerprint, {
      path: "/",
      maxAge: FINGERPRINT_COOKIE_MAX_AGE,
      httpOnly: true,
      secure: IS_PROD,
      sameSite: IS_PROD ? "none" : "lax",
    })
  )

  return tokenGenerator.signWithClaims({
    allowedRoles: ["user"],
    defaultRole: "user",
    expiresIn: JWT_TOKEN_EXPIRES_IN,
    otherClaims: {
      "X-Hasura-User-Id": String(user.id),
      "X-User-Fingerprint": sha256(fingerprint),
    },
  })
}
