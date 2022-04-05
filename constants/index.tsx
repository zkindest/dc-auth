// GENERAL
export const appUrl = process.env.NEXT_PUBLIC_APP_URL as string

export const colorModeKey = "AFroz's-auth-color-mode"
export const isProd = process.env.NODE_ENV === "production"

// JWT
export const jwtSecret = process.env.JWT_SECRET
export const jwtTtl = 900000
export const refreshTokenTtl = 900000
export const jwtClaims = `${appUrl}/jwt/claims`
export const jwtClaimPrefix = "x-auth"

// COOKIES
export const generalCookieAge = 60 * 60 * 8 // 8 hours

export const loginCookieName = "__Secure__User-Fgp"
export const loginCookieAge = 60 * 60 * 8 // 8 hours
export const OAuthCookieName = "__Secure__OAuth-Fgp"
export const OAuthCookieAge = 60 * 60 * 8 // 8 hours
export const refreshTokenCookieName = "__Secure__User-Refresh"
export const accessTokenCookieName = "__Secure__User-Access"
export const jwtCookieTtl = 60 * 60 * 8

// AUTH PROVIDERS
export const googleOAuthClientId = process.env.GOOGLE_OAUTH_CLIENT_ID as string
export const googleOAuthClientSecret = process.env
  .GOOGLE_OAUTH_CLIENT_SECRET as string
