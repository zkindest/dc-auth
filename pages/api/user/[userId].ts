import { Prisma } from "@prisma/client"
import { File } from "formidable"
import { NextApiRequest, NextApiResponse } from "next"
import { uploadImage } from "~/utils/cloudinary"
import { formidableParse } from "~/utils/formidable"
import prisma from "~/lib/prisma"
import { parseToken } from "~/utils"
import { getUserFromDB, UserSelect } from "."

export const isAuthenticated = (req: NextApiRequest, res: NextApiResponse) => {
  const rawToken = req.headers["authorization"] || ""
  const token = rawToken.split(" ")[1]
  const user = parseToken(token)
  if (!(user && user.id)) {
    return false
  }
  return true
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { userId: rawId },
    method,
  } = req
  const userId = Number(rawId)
  if (!userId) {
    return res.status(400).json({
      error: "invalid request: userId is missing",
    })
  }

  try {
    switch (method) {
      case "GET": {
        if (!isAuthenticated(req, res))
          return res.status(400).json({ error: "user not authenticated" })

        const user = getUserFromDB(userId)
        if (!user) {
          res.status(400).json({ error: "user not found" })
        }
        res.status(200).json({ data: user })
        break
      }
      case "PUT": {
        try {
          if (!isAuthenticated(req, res))
            return res.status(400).json({ error: "user not authenticated" })

          const { files, fields } = await formidableParse(req)

          // console.log({ fields, files })

          let data = { ...fields }
          if (files && files.avatar) {
            const imageData: any = await uploadImage(
              (files.avatar as File).filepath
            )
            const updatedAvatar = await prisma.avatar.create({
              data: {
                publicId: imageData.public_id,
                format: imageData.format,
                version: imageData.version.toString(),
              },
            })
            data.avatar = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/v${updatedAvatar.version}/${updatedAvatar.publicId}.${updatedAvatar.format}`
          }
          const updatedUser = await prisma.user.update({
            where: {
              id: userId,
            },
            data: data,
            select: UserSelect,
          })
          res.status(200).json({ data: updatedUser })
        } catch (err) {
          console.error(err)
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2025") {
              res.status(400).json({ error: "User not found" })
            } else {
              res.status(400).json({ error: "invalid request" })
            }
          }
        }
        break
      }
      case "DELETE": {
        if (!isAuthenticated(req, res))
          return res.status(400).json({ error: "user not authenticated" })
        await prisma.user.delete({
          where: { id: userId },
        })
        res.status(200).json({ data: "success" })
      }
      default: {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"])
        res.status(405).end(`Method ${method} Not Allowed`)
      }
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "something went wrong!" })
  }
}
