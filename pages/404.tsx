import Link from "next/link"
import React from "react"
import Layout from "../components/Layout"

const ErrorPage = () => (
  <>
    <Layout>
      <div className="wrapper">
        <h1>Oops!</h1>
        <h3>This is clearly not the page you're looking for.</h3>
        <p>
          Looks like the page you’re looking for does not exist, or the link
          that got you here is outdated or broken. You may find what you’re
          looking for in one of the sections available in the menu at the top
          right of this page.
        </p>
        <Link href="/">
          <a>Back Home</a>
        </Link>
      </div>
    </Layout>
    <style jsx>
      {`
        h1 {
          font-size: 5rem;
          font-weight: 700;
        }
        @media (min-width: 625px) {
          h1 {
            font-size: 10rem;
          }
        }
        @media all and (max-width: 625px) {
          p {
            display: none;
          }
        }
        h3 {
          font-size: 2rem;
          font-weight: 400;
        }
      `}
    </style>
  </>
)

export default ErrorPage
