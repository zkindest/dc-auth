import {
  appUrl,
  githubOAuthClientId,
  githubOAuthClientSecret,
} from "~/constants"
import {
  OAuth,
  OAuthClientKeys,
  OAuthOptions,
  OAuthTokenUriOptions,
  OAuthTokenUriOutput,
  OAuthVerificationOptions,
} from "./base"

class GithubStrategy implements OAuth {
  private client_id: string
  private client_secret: string
  private redirect_uri: string
  private scope: string
  constructor({
    clientId,
    clientSecret,
    redirectURI,
    scope = [],
  }: OAuthOptions) {
    this.client_id = clientId
    this.client_secret = clientSecret
    this.redirect_uri = redirectURI
    this.scope = scope.join(" ")
  }

  getVerificationUri({
    scope,
    accessType = "online",
    ...other
  }: OAuthVerificationOptions): string {
    const params = new URLSearchParams({
      // see https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow
      response_type: "code",
      client_id: this.client_id,
      scope: scope ? scope.join(" ") : this.scope,
      redirect_uri: this.redirect_uri,
      access_type: accessType,
      ...other,
    })
    return `https://github.com/login/oauth/authorize?${params.toString()}`
  }
  getAuthUri(options: OAuthTokenUriOptions): OAuthTokenUriOutput
  getAuthUri(options: OAuthTokenUriOptions, resultType: "string"): string
  getAuthUri(
    { authCode }: OAuthTokenUriOptions,
    resultType?: any
  ): string | OAuthTokenUriOutput {
    const params = new URLSearchParams({
      code: authCode,
      client_id: this.client_id,
      client_secret: this.client_secret,
      redirect_uri: this.redirect_uri,
    })
    if (resultType === "string") {
      return `https://github.com/login/oauth/access_token${params.toString()}`
    }
    return {
      uri: "https://github.com/login/oauth/access_token",
      payload: params,
    }
  }
  getClientKeys(): OAuthClientKeys {
    return {
      client_id: this.client_id,
      client_secret: this.client_secret,
    }
  }
}

export const githubStrategy = new GithubStrategy({
  clientId: githubOAuthClientId,
  clientSecret: githubOAuthClientSecret,
  redirectURI: `${appUrl}/oauth/github/callback`,
  scope: ["read:user"],
})
export default GithubStrategy
