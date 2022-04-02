import { User } from "@prisma/client"
import { atom } from "jotai"

export const userAtom = atom<User>({
  id: 1,
  avatar: "/1.png",
  name: "Rock",
  bio: "I am a software developer and a big fan of devchallenges...",
  phone: "908249274292",
  email: "xanthe.neal@gmail.com",
  password: "************",
})
