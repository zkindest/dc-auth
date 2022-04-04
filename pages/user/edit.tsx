import Layout from "../../components/Layout"
import Link from "next/link"
import EditInfoCard from "../../components/user/EditInfoCard"
import { useAtom } from "jotai"
import { useRouter } from "next/router"
import { userAtom } from "~/jotai/user"
import { useEffect } from "react"
import ErrorBoundary from "~/components/ErrorBoundary"

const Edit = () => {
  const [user] = useAtom(userAtom)
  const router = useRouter()
  useEffect(() => {
    if (!user) router.push("/login")
  }, [user])
  if (!user) {
    return null
  }
  return (
    <Layout>
      <ErrorBoundary>
        <div className="wrapper">
          <section>
            <Link href={"/user/info"}>
              <a className="link ">Back</a>
            </Link>
            <EditInfoCard user={user} />
          </section>
        </div>
        <style jsx>{`
          section {
            text-align: left;
            padding: 2rem 0 3rem;
          }
          a {
            display: inline-block;
            margin-bottom: 1rem;
          }

          @media (max-width: 640px) {
            section {
              padding: 0.8rem 1rem;
            }
          }
        `}</style>
      </ErrorBoundary>
    </Layout>
  )
}

export default Edit
