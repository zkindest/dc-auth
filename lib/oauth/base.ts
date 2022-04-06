export interface OAuthOptions {
  clientId: string
  clientSecret: string
  redirectURI: string
  scope?: string[]
}
export interface OAuthVerificationOptions {
  state?: string
  scope?: string[]
  accessType?: "offline" | "online"
  prompt?: "consent"
}
export interface OAuthTokenUriOptions {
  authCode: string
}
export interface OAuthTokenUriOutput {
  uri: string
  payload: URLSearchParams
}
export interface OAuthClientKeys {
  client_id: string
  client_secret: string
}

export interface OAuth {
  getVerificationUri(options: OAuthVerificationOptions): string

  getAuthUri(options: OAuthTokenUriOptions): OAuthTokenUriOutput
  getAuthUri(options: OAuthTokenUriOptions, resultType: "string"): string

  getClientKeys(): OAuthClientKeys
}
