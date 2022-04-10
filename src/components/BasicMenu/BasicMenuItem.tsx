import Link from "next/link"
import React, { RefObject } from "react"
import { ComponentPropsWithoutRef } from "react"
import css from "styled-jsx/css"

type BasicMenuItemProps<T extends "button" | "a"> = {
  tag: T
  selected?: boolean
} & ComponentPropsWithoutRef<T>

declare function BasicMenuItemFn<T extends "button" | "a">(
  props: BasicMenuItemProps<T>
): JSX.Element

const menuItem = css`
  .menu-item {
    position: relative;
    display: flex;
    justify-content: start;
    align-items: center;
    vertical-align: middle;
    overflow: hidden;
    transition: color 0.3s ease;
    margin: 0.3em;
    border-radius: 4px;
    border: 0;
    width: auto;
    padding: 0.4em 1em;
    font: inherit;
    user-select: none;
    white-space: nowrap;
    text-decoration: none;
    text-align: left;
    background-color: var(--clr-white);
    color: var(--clr-text);
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
  }
  .menu-item:hover {
    background-color: var(--clr-white-1);
  }
  .menu-item.selected {
    background-color: var(--clr-white-1);
  }
`
const BasicMenuItem = React.forwardRef<HTMLElement, BasicMenuItemProps<any>>(
  function MenuItem(props, ref) {
    const { tag, href, selected, children, ...rest } = props
    if (tag === "a") {
      return (
        <Link href={href}>
          <a
            ref={ref as RefObject<HTMLAnchorElement>}
            {...rest}
            className="menu-item"
          >
            {children}
            <style jsx>{menuItem}</style>
          </a>
        </Link>
      )
    }

    return (
      <button
        ref={ref as RefObject<HTMLButtonElement>}
        {...rest}
        className="menu-item"
      >
        {children}
        <style jsx>{menuItem}</style>
      </button>
    )
  }
) as typeof BasicMenuItemFn
export default BasicMenuItem
