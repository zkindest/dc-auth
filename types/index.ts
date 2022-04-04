import { User } from "@prisma/client"

export type DecodedUser = {
  id: number
  [x: string]: any
}

export type IUser = Omit<User, "password">
