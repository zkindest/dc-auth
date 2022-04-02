import Layout from "../../components/Layout"
import Link from "next/link"
import EditInfoCard from "../../components/user/EditInfoCard"

const Edit = () => {
  return (
    <Layout>
      <div className="wrapper">
        <section>
          <Link href={"/user/info"}>
            <a className="link ">Back</a>
          </Link>
          <EditInfoCard />
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
    </Layout>
  )
}

export default Edit
