import {
  appUrl,
  googleOAuthClientId,
  googleOAuthClientSecret,
} from "~/constants"
import {
  OAuth,
  OAuthClientKeys,
  OAuthOptions,
  OAuthTokenUriOptions,
  OAuthTokenUriOutput,
  OAuthVerificationOptions,
} from "./base"

class GoogleStrategy implements OAuth {
  private clientId
  private clientSecret
  private redirectURI
  private scope
  constructor({
    clientId,
    clientSecret,
    redirectURI,
    scope = [],
  }: OAuthOptions) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectURI = redirectURI
    this.scope = scope.join(" ")
  }
  getVerificationUri({
    scope,
    accessType = "online",
    ...other
  }: OAuthVerificationOptions) {
    const params = new URLSearchParams({
      // see https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters
      response_type: "code",
      client_id: this.clientId,
      scope: scope ? scope.join(" ") : this.scope,
      redirect_uri: this.redirectURI,
      access_type: accessType,
      ...other,
    })
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }
  getAuthUri(options: OAuthTokenUriOptions): OAuthTokenUriOutput
  getAuthUri(options: OAuthTokenUriOptions, resultType: "string"): string
  getAuthUri(
    { authCode }: OAuthTokenUriOptions,
    resultType?: any
  ): string | OAuthTokenUriOutput {
    const params = new URLSearchParams({
      code: authCode,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectURI,
      grant_type: "authorization_code",
    })
    if (resultType === "string") {
      return `https://oauth2.googleapis.com/token${params.toString()}`
    }
    return {
      uri: "https://oauth2.googleapis.com/token",
      payload: params,
    }
  }
  getClientKeys(): OAuthClientKeys {
    return {
      client_id: this.clientId,
      client_secret: this.clientSecret,
    }
  }
}

export const googleStrategy = new GoogleStrategy({
  clientId: googleOAuthClientId,
  clientSecret: googleOAuthClientSecret,
  redirectURI: `${appUrl}/oauth/google/callback`,
  scope: ["openid", "email"],
})

export default GoogleStrategy
