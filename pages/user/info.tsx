import { useAtom } from "jotai"
import { useRouter } from "next/router"
import { useEffect } from "react"
import ErrorBoundary from "~/components/ErrorBoundary"
import { userAtom } from "~/jotai/user"
import Layout from "../../components/Layout"
import InfoCard from "../../components/user/InfoCard"

const Info = () => {
  const [user] = useAtom(userAtom)
  const router = useRouter()
  useEffect(() => {
    if (!user) router.push("/login")
  }, [user, router])
  if (!user) {
    return null
  }
  return (
    <Layout>
      <ErrorBoundary>
        <div className="wrapper">
          <section>
            <h1>Personal info</h1>
            <p>Basic info, like your name and photo</p>
            <InfoCard data={user} />
          </section>
        </div>
        <style jsx>{`
          h1 {
            color: var(--clr-black);
            font-size: 2.8rem;
          }
          h1,
          p {
            text-align: center;
            letter-spacing: -0.035em;
            font-weight: 400;
          }
          p {
            margin-bottom: 2rem;
          }
          @media (max-width: 640px) {
            h1 {
              font-size: 2rem;
            }
          }
        `}</style>
      </ErrorBoundary>
    </Layout>
  )
}

export default Info
