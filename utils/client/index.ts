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

export const extractPaths = (uri: string) => {
  const { pathname } = new URL(uri)
  if (!pathname) {
    throw new Error("URI does not have paths. Cannot continue.")
  }

  return pathname
    .split("/")
    .slice(1)
    .filter((path) => path)
}
