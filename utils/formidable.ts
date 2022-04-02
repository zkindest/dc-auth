import { Fields, File, Files, IncomingForm } from "formidable"
import { NextApiRequest } from "next"

export async function getImage(req: NextApiRequest) {
  const data = await new Promise<{ files: Files; fields: Fields }>(function (
    resolve,
    reject
  ) {
    const form = new IncomingForm({ keepExtensions: true })
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })

  return data.files.avatar as File
}
