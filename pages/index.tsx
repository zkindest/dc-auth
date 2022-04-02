import LoginCard from "../components/user/LoginCard"
import Layout from "../components/Layout"

const Home = () => {
  return (
    <Layout>
      <div className="wrapper">
        <LoginCard join />
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
