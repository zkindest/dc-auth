export const extractUriParams = (uri: string) => {
  if (uri.indexOf("?") === -1) {
    throw new Error("URI does not have question mark. Cannot continue.")
  }

  const params: { [key: string]: string } = {}

  uri
    .split("?")[1]
    .split("&")
    .map((part) => {
      const split: string[] = part.split("=")
      params[split[0]] = split[1]
    })

  return params
}
