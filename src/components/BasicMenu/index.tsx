import React, { ReactNode, useEffect, useState } from "react"
import ReactDOM from "react-dom"
import useModal from "~/hooks/useModal"

export interface BasicMenuProps {
  open: boolean
  anchorEl: HTMLElement | undefined
  anchorOrigin: {
    vertical: "top" | "bottom"
    horizontal: "left" | "right"
  }
  transformOrigin: {
    vertical: "top" | "center" | "bottom"
    horizontal: "left" | "center" | "right"
  }
  onClose: () => void
  children?: ReactNode
}
const BasicMenu = ({
  open,
  anchorEl,
  anchorOrigin,
  transformOrigin,
  onClose,
  children,
  ...rest
}: BasicMenuProps) => {
  const [anchorPos, setAnchorPos] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (anchorEl) {
      setAnchorPos(anchorEl.getBoundingClientRect())
    }
  }, [anchorEl])

  const { ref, modalRoot } = useModal<HTMLDivElement>({
    onClose,
    focusAfterClosed: anchorEl,
    overlayModal: false,
  })
  if (!modalRoot) {
    return null
  }
  const getAnchorOriginPos = () => {
    let pos: any = {}
    if (anchorPos) {
      pos.top =
        anchorOrigin.vertical === "top"
          ? `calc(${anchorPos.top}px + 10px)`
          : `calc(${anchorPos.bottom}px + 10px)`
      if (anchorOrigin.horizontal === "left") {
        pos.left = `calc(${anchorPos.left}px + 5px)`
      } else {
        pos.right = `calc(100vw - ${anchorPos.right - 10}px)`
      }
      return pos
    }
  }
  const menu = (
    <div role="presentation" className={`menu ${open ? "open" : ""}`}>
      {/* {open && <MenuBackDrop />} */}
      <div tabIndex={0}></div>
      <div
        {...rest}
        className={"menu__children shadow-md"}
        ref={ref}
        tabIndex={-1}
        style={
          anchorPos
            ? {
                ...getAnchorOriginPos(),
                transformOrigin: `${transformOrigin.horizontal || "0px"} ${
                  transformOrigin.vertical || "0px"
                }`,
              }
            : null
        }
      >
        {children}
      </div>
      <div tabIndex={0}></div>
      <style jsx>{`
        .menu {
          position: fixed;
          inset: 0;
          z-index: 1300;
          visibility: hidden;
        }
        .menu.open {
          visibility: visible;
        }
        .menu__children {
          position: absolute;
          visibility: hidden;
          overflow-x: hidden;
          overflow-y: auto;
          outline: none;
          border: 1px solid var(--clr-gray-1);
          border-radius: 4px;
          background-color: var(--clr-white);
          color: var(--clr-text);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .menu.open .menu__children {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </div>
  )
  return ReactDOM.createPortal(menu, modalRoot)
}
export default BasicMenu
