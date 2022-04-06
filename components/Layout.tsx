import { ReactNode } from "react"
import Header from "./Header"
import SEO from "./SEO"

interface LayoutProps {
  children: ReactNode
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <SEO />
      <Header />
      <main>{children}</main>
      <style jsx>{``}</style>
      <footer></footer>
    </>
  )
}
export default Layout
