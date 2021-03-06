import Layout from "../components/Layout"
import RegisterCard from "~/components/user/RegisterCard"
import { useAtom } from "jotai"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { userAtom } from "~/jotai/user"
import ErrorBoundary from "~/components/ErrorBoundary"

const Home = () => {
  const router = useRouter()
  const [user] = useAtom(userAtom)
  useEffect(() => {
    if (user) router.push("/user/info")
  }, [user, router])
  return (
    <Layout>
      <div className="wrapper">
        <ErrorBoundary>
          <RegisterCard />
        </ErrorBoundary>
        <style jsx>
          {`
            .wrapper {
              display: flex;
              justify-content: center;
              align-items: center;
            }
          `}
        </style>
      </div>
    </Layout>
  )
}

export default Home
