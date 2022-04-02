import { getImage } from "~/utils/formidable"
import { uploadImage } from "~/utils/cloudinary"
import prisma from "~/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const imageUploaded = await getImage(req)
  const userId = req.query.userId
  console.log({ userId })

  const imageData: any = await uploadImage(imageUploaded.filepath)

  const result = await prisma.image.create({
    data: {
      publicId: imageData.public_id,
      format: imageData.format,
      version: imageData.version.toString(),
    },
  })

  console.log(result)
  const updatedUser = await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      avatar: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/v${result.version}/${result.publicId}.${result.format}`,
    },
  })

  console.log({ updatedUser })

  res.json(updatedUser)
}
