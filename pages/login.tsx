import LoginCard from "../components/user/LoginCard"
import Layout from "../components/Layout"
import { useRouter } from "next/router"
import { userAtom } from "~/jotai/user"
import { useAtom } from "jotai"
import { useEffect } from "react"
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
          <LoginCard />
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
