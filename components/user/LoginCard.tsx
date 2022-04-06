import { useAtom } from "jotai"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { userAtom } from "~/jotai/user"
import {
  getAuthFetchOptions,
  setJwtToken,
  setRefreshToken,
} from "~/utils/client/auth"
import { getValidation } from "~/utils/form-validation"
import Button from "../Button"
import { LockIconOutline } from "../icons"
import { EmailIcon } from "../icons/internet"
import Input from "../Input"
import { AuthProviders } from "./AuthProviders"

interface LoginCardProps {}

const LoginCard = ({}: LoginCardProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [_, setUser] = useAtom(userAtom)
  const [formError, setFormError] = useState("")
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      const result = await (
        await fetch("/api/user/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        })
      ).json()
      if (result.error) {
        setFormError(result.error)
        return
      }
      if (result.data) {
        setJwtToken(result.data.jwt)
        setRefreshToken(result.data.refreshToken)
        const userResult = await (
          await fetch("/api/user", {
            method: "GET",
            ...getAuthFetchOptions(),
          })
        ).json()

        setUser(userResult.data)

        router.push("/user/info")
      }
    } catch (error) {
      console.error(error)
      setFormError("something went wrong!")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="card">
      <div className="card__logo">
        <i>Fancy Logo here</i>
      </div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {formError && <p className="error">{formError}</p>}
        <Input
          type="email"
          placeholder="Email"
          leftAdornment={<EmailIcon />}
          className="mb-2"
          required
          {...register("email", getValidation({ name: "email" }))}
          error={"email" in errors ? errors["email"].email : ""}
        />
        <Input
          type="password"
          placeholder="Password"
          leftAdornment={<LockIconOutline />}
          {...register(
            "password",
            getValidation({ name: "password", min: 6, max: 15, type: "string" })
          )}
          error={"password" in errors ? errors["password"].message : ""}
        />
        <Button type="submit" className="mt-5" fullWidth loading={loading}>
          Start coding now
        </Button>
      </form>
      <AuthProviders />
      <p className="mt-5">
        Don’t have an account yet?{" "}
        <Link href={"/"}>
          <a className="link">Register</a>
        </Link>
      </p>
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
