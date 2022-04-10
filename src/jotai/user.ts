import { atom } from "jotai"
import { IUser } from "~/types"

export const userAtom = atom<IUser | null>(null)
