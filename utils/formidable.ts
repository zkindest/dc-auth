import { Fields, Files, IncomingForm } from "formidable"
import { NextApiRequest } from "next"

export async function formidableParse(req: NextApiRequest) {
  const data = await new Promise<{ files: Files; fields: Fields }>(function (
    resolve,
    reject
  ) {
    const form = new IncomingForm({ keepExtensions: true, encoding: "utf-8" })
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })

  return data
}
