import { promisify } from "node:util"
import crypto from "node:crypto"

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
