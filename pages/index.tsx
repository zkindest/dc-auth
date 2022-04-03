import Layout from "../components/Layout"
import RegisterCard from "~/components/user/RegisterCard"
import { useAtom } from "jotai"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { userAtom } from "~/jotai/user"

const Home = () => {
  const router = useRouter()
  const [user] = useAtom(userAtom)
  useEffect(() => {
    if (user) router.push("/user/info")
  }, [user])
  return (
    <Layout>
      <div className="wrapper">
        <RegisterCard />
        <style jsx>
          {`
            .wrapper {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 80vh;
            }
          `}
        </style>
      </div>
    </Layout>
  )
}

export default Home
