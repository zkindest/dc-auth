import { useAtom } from "jotai"
import router from "next/router"
import React, { useState } from "react"
import { userAtom } from "~/jotai/user"
import { removeJwtTokens } from "~/utils/client/auth"
import Menu from "../BasicMenu"
import BasicMenuItem from "../BasicMenu/BasicMenuItem"

interface UserMenuProps {}

const UserMenu: React.FC<UserMenuProps> = ({}) => {
  const [user, setUser] = useAtom(userAtom)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined)

  const handleLogout = async () => {
    try {
      await fetch("/api/user/logout", {
        method: "POST",
      })
      sessionStorage.clear()
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error(error)
    }
    removeJwtTokens()
    setAnchorEl(undefined)
  }
  return (
    <>
      <button onClick={(e) => setAnchorEl(e.currentTarget)}>
        Menu
        <style jsx>{`
          button {
            background: var(--clr-bg-elements);
            color: var(--clr-text);
            border: 0;
            max-width: 10ch;
            text-overflow: ellipsis;
          }
        `}</style>
      </button>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(undefined)}
      >
        {user && (
          <BasicMenuItem tag="button" onClick={handleLogout}>
            Logout
          </BasicMenuItem>
        )}
        {!user && (
          <>
            <BasicMenuItem tag="a" href="/login">
              Login
            </BasicMenuItem>
            <BasicMenuItem tag="a" href="/">
              Register
            </BasicMenuItem>
          </>
        )}
      </Menu>
    </>
  )
}
export default UserMenu
