import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId

  if (req.method === "GET") {
  }
}
