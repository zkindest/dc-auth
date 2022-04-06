import { githubStrategy } from "~/lib/oauth/github"
import { googleStrategy } from "~/lib/oauth/google"
import { md5 } from "./crypto"
import { ClientError, KnownError } from "./error"

export type OAuthProvider = "google" | "github"

export type OAuthTokenResult = {
  access_token: string
  expires_in?: number
  id_token?: string
  scope?: string
  token_type?: string
  refresh_token?: string
}
export interface OAuthUserResult {
  id: string
  email: string
  name?: string
}
export interface GoogleUserResult extends OAuthUserResult {
  verified_email?: boolean
  given_name?: string
  family_name?: string
  picture?: string
  locale?: string
}
export interface GithubUserResult extends OAuthUserResult {
  avatar_url?: string
  location?: string
  bio?: string
  // username
  login?: string
}
export const getAuthUri = (provider: OAuthProvider, code: string) => {
  switch (provider) {
    case "google": {
      return googleStrategy.getAuthUri({
        authCode: code.toString(),
      })
    }
    case "github": {
      return githubStrategy.getAuthUri({
        authCode: code.toString(),
      })
    }
    default:
      throw new ClientError("invalid provider")
  }
}
export const getTokensFromProvider = async (
  uri: string,
  payload: URLSearchParams
): Promise<OAuthTokenResult> => {
  const res = await fetch(uri, {
    headers: {
      accept: "application/json",
    },
    method: "POST",
    body: payload,
  })
  if (res.ok) {
    return res.json()
  }
  throw new KnownError("failed to fetch tokens from provider")
}
export const fetchUserFromGoogle = async (
  token: string
): Promise<GoogleUserResult> => {
  const result = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/json",
    },
  })
  if (result.ok) return result.json()
  else throw new KnownError("failed fetch user info from google")
}
export const fetchUserFromGithub = async (
  token: string
): Promise<GithubUserResult> => {
  const result = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      authorization: `token ${token}`,
      accept: "application/json",
    },
  })
  if (result.ok) return result.json()
  else throw new KnownError("failed fetch user info from github")
}

export const getUserDataFromProvider = async (
  provider: OAuthProvider,
  access_token: string
) => {
  switch (provider) {
    case "google":
      return fetchUserFromGoogle(access_token)
    case "github":
      return fetchUserFromGithub(access_token)
    default:
      throw new KnownError("invalid provider: " + provider)
  }
}

export const extractUserData = (payload: any, provider: OAuthProvider) => {
  const data: any = {}

  data.bio = payload?.bio || ""
  data.name = payload?.name || ""
  data.email = payload.email
  data.phone = payload?.phone || ""

  switch (provider) {
    case "github": {
      data.avatar =
        payload.avatar_url || payload.login
          ? `https://github.com/${payload.login}.png?size=200`
          : `https://secure.gravatar.com/avatar/${md5(
              payload.email
            )}?s=164&d=identicon`
    }

    case "google": {
      data.avatar =
        payload.picture ||
        `https://secure.gravatar.com/avatar/${md5(
          payload.email
        )}?s=164&d=identicon`
    }
  }
  return data
}
