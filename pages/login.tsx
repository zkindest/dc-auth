import LoginCard from "../components/auth/LoginCard"
import Layout from "../components/Layout"

const Home = () => {
  return (
    <Layout>
      <div className="wrapper">
        <LoginCard />
        <style jsx>
          {`
            .wrapper {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 80vh;
            }
          `}
        </style>
      </div>
    </Layout>
  )
}

export default Home
