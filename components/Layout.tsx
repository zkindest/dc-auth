import { ReactNode } from "react"
import Header from "./Header"

interface LayoutProps {
  children: ReactNode
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <style jsx>{``}</style>
      <footer></footer>
    </>
  )
}
export default Layout
