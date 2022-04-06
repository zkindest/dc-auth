import { githubStrategy } from "~/lib/oauth/github"
import { googleStrategy } from "~/lib/oauth/google"
import { md5 } from "./crypto"
import { ClientError } from "./error"

export type OAuthTokenResult = {
  access_token?: string
  expires_in?: number
  id_token?: string
  scope?: string
  token_type?: string
  refresh_token?: string
  error?: string
}
export interface OAuthUserResult {
  id: string
  email: string
  verified_email: boolean
  name?: string
  given_name?: string
  family_name?: string
  picture?: string
  locale?: string
  error?: {
    code: number
    message: string
  }
}
export const getUserFromProvider = async (
  provider: "google" | "github" | string,
  access_token: string
): Promise<OAuthUserResult> => {
  switch (provider) {
    case "google":
      return getUserFromGoogle(access_token)
    case "github":
      return getUserFromGithub(access_token)
    default:
      throw new Error("invalid provider: " + provider)
  }
}
export const getUserFromGoogle = async (token: string) => {
  const result = await (
    await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    })
  ).json()
  return result
}
export const getUserFromGithub = async (token: string) => {
  const result = await (
    await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        authorization: `token ${token}`,
        accept: "application/json",
      },
    })
  ).json()
  return result
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
  return {
    error: "failed to fetch tokens from provider",
  }
}
export type OAuthProvider = "google" | "github"

export const extractUserData = (payload: any, provider: OAuthProvider) => {
  const data: any = {}

  data.bio = payload?.bio || ""
  data.name = payload?.name || ""
  data.email = payload.email
  data.phone = payload?.phone || ""

  switch (provider) {
    case "github": {
      data.avatar = payload.avatar_id
        ? `https://secure.gravatar.com/avatar/${payload.avatar_id}?s=164&d=identicon`
        : payload.avatar_url ||
          `https://secure.gravatar.com/avatar/${md5(
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
