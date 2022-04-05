import {
  appUrl,
  googleOAuthClientId,
  googleOAuthClientSecret,
} from "~/constants"

export interface GoogleStrategyOptions {
  clientId: string
  clientSecret: string
  redirectURI: string
  scope?: string[]
}
export interface GetVerificationUriOptions {
  state?: string
  scope?: string[]
  accessType?: "offline" | "online"
  prompt?: "consent"
}
export interface GetAuthUriOptions {
  authCode: string
}
class GoogleStrategy {
  private clientId
  private clientSecret
  private redirectURI
  private scope
  constructor({
    clientId,
    clientSecret,
    redirectURI,
    scope = [],
  }: GoogleStrategyOptions) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectURI = redirectURI
    this.scope = scope.join(" ")
  }
  getVerificationUri({
    scope,
    accessType = "online",
    ...other
  }: GetVerificationUriOptions) {
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
  getAuthUri({ authCode }: GetAuthUriOptions) {
    const params = new URLSearchParams({
      code: authCode,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectURI,
      grant_type: "authorization_code",
    })
    return {
      uri: "https://oauth2.googleapis.com/token",
      payload: params,
    }
  }
  getClientSecrets() {
    return {
      client_id: this.clientId,
      client_secret: this.clientSecret,
    }
  }
}

export const googleStrategy = new GoogleStrategy({
  clientId: googleOAuthClientId,
  clientSecret: googleOAuthClientSecret,
  redirectURI: `${appUrl}/auth/callback`,
  scope: ["openid", "email"],
})

export default GoogleStrategy
