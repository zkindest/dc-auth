import Link from "next/link"
import Button from "../Button"
import { LockIconOutline } from "../icons"
import {
  EmailIcon,
  FacebookIcon,
  GithubIcon,
  GoogleIcon,
  TwitterIcon,
} from "../icons/internet"
import Input from "../Input"

interface LoginCardProps {
  join?: boolean
}
const LoginCard = ({ join }: LoginCardProps) => {
  const handleSubmit = () => {}
  return (
    <div className="card">
      <div className="card__logo">
        <i>Fancy Logo here</i>
      </div>
      {join ? (
        <h1>Join thousands of learners from around the world</h1>
      ) : (
        <h1>Login</h1>
      )}
      {join && (
        <p>
          Master web development by making real-life projects. There are
          multiple paths for you to choose
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          leftAdornment={<EmailIcon />}
          className="mb-2"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          leftAdornment={<LockIconOutline />}
        />
        <Button type="submit" className="mt-5" fullWidth>
          Start coding now
        </Button>
      </form>
      <div className="auth">
        <p>or continue with these social profile</p>
        <ul className="auth-providers">
          <li>
            <GoogleIcon />
          </li>
          <li>
            <FacebookIcon />
          </li>
          <li>
            <TwitterIcon />
          </li>
          <li>
            <GithubIcon />
          </li>
        </ul>
        <p className="mt-5">
          {join ? (
            <>
              Adready a member?{" "}
              <Link href={"/login"}>
                <a className="link">Login</a>
              </Link>
            </>
          ) : (
            <>
              Don’t have an account yet?{" "}
              <Link href={"/register"}>
                <a className="link">Register</a>
              </Link>
            </>
          )}
        </p>
      </div>
      <style jsx>
        {`
          .card {
            width: 473.83px;
            min-height: 544.37px;
            // height: 634.3px;
            border-radius: 1.5rem;
            border: 1px solid #bdbdbd;
            padding: 3.7rem;
            color: var(--clr-text);
          }
          @media (max-width: 640px) {
            .card {
              border: 0;
              padding: 1.5rem;
            }
          }
          logo {
            object-fit: contain;
          }
          h1 {
            font-size: 1.15rem;
            margin: 1.5rem 0 0.9rem;
          }
          p {
            margin-bottom: 0.9rem;
          }
          a {
            cursor: pointer;
          }
          .auth {
            margin-top: 2rem;
            text-align: center;
            color: var(--clr-gray-1);
          }
          .auth p {
            font-size: 14px;
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
        `}
      </style>
      <style jsx global>
        {`
          .text-sm {
            font-size: 14px;
          }
          .mt-5 {
            margin-top: 1.25rem;
          }
          .mb-2 {
            margin-bottom: 0.5rem;
          }
          .link {
            color: var(--link-color);
          }
        `}
      </style>
    </div>
  )
}

export default LoginCard
