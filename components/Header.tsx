import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { ThemeContext } from "../lib/theme"
import { SunnyOutline } from "./icons"
import UserMenu from "./user/UserMenu"

const Header = () => {
  const router = useRouter()
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname
  const { toggleTheme } = useContext(ThemeContext)

  return (
    <header>
      <Link href="/">
        <a data-active={isActive("/")} className="logo">
          Fancy Logo
        </a>
      </Link>
      <nav>
        <UserMenu />
        <button className="toggle" onClick={toggleTheme}>
          <SunnyOutline />
        </button>
      </nav>
      <style jsx>
        {`
          header {
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 1.5rem 0.5rem;
            margin: 0 auto;
          }
          .logo {
            font-style: italic;
            font-size: 2rem;
            color: var(--color-text);
            text-decoration: none;
          }
          nav {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          .toggle {
            color: var(--clr-text);
            background: none;
            border: 0;
            font-size: 2rem;
          }
          a.link {
            text-decoration: none;
          }
          a[data-active="true"] {
            text-decoration: underline;
          }
          @media (min-width: 1024px) {
            header {
              max-width: 1024px;
            }
          }
          @media (max-width: 640px) {
            .logo {
              font-size: 1.5rem;
            }
          }
        `}
      </style>
    </header>
  )
}
export default Header
