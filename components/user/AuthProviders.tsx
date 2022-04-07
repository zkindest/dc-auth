import React from "react"
import { appUrl } from "~/constants"
import {
  FacebookIcon,
  GithubIcon,
  GoogleIcon,
  TwitterIcon,
} from "../icons/internet"

interface AuthProvidersProps {}

export const AuthProviders: React.FC<AuthProvidersProps> = ({}) => {
  return (
    <div className="auth">
      <p>or continue with these social profile</p>
      <ul className="auth-providers">
        <li>
          <a href={`${appUrl}/api/oauth/google`} rel="noopener follow">
            <GoogleIcon aria-hidden={false} />
          </a>
        </li>
        <li>
          <a href={`${appUrl}/api/oauth/github`} rel="noopener follow">
            <GithubIcon aria-hidden={false} />
          </a>
        </li>
        {/* <li>
          <TwitterIcon aria-hidden={false} />
        </li>
        <li>
          <FacebookIcon aria-hidden={false} />
        </li> */}
      </ul>
      <style jsx>{`
        .auth {
          margin-top: 2rem;
          text-align: center;
          color: var(--clr-gray-1);
        }
        .auth p {
          font-size: 14px;
          margin: 1rem 0;
        }
        .auth-providers {
          padding: 0;
          margin: 0;
          display: flex;
          gap: 1rem;
          align-content: center;
          justify-content: center;
          list-style: none;
        }
        li:hover {
          color: var(--clr-blue-1);
        }
      `}</style>
    </div>
  )
}
