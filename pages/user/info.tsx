import Layout from "../../components/Layout"
import InfoCard from "../../components/user/InfoCard"
import { User } from "../../types"

export const user: User = {
  avatar: "/1.png",
  name: "Rock",
  bio: "I am a software developer and a big fan of devchallenges...",
  phone: "908249274292",
  email: "xanthe.neal@gmail.com",
  password: "************",
}
const Info = () => {
  return (
    <Layout>
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
    </Layout>
  )
}

export default Info
