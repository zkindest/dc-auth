import { SVGProps } from "react"

export function LockIconOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5 4.636c0-.876.242-1.53.643-1.962c.396-.427 1.003-.696 1.858-.696c.856 0 1.462.269 1.857.694c.4.431.642 1.085.642 1.961V6H5V4.636ZM4 6V4.636c0-1.055.293-1.978.91-2.643c.623-.67 1.517-1.015 2.591-1.015c1.075 0 1.969.344 2.59 1.014c.617.664.909 1.587.909 2.641V6h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1ZM3 7h9v6H3V7Z"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}

export function SunnyOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 512 512" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32"
        d="M256 48v48m0 320v48m147.08-355.08l-33.94 33.94M142.86 369.14l-33.94 33.94M464 256h-48m-320 0H48m355.08 147.08l-33.94-33.94M142.86 142.86l-33.94-33.94"
      ></path>
      <circle
        cx="256"
        cy="256"
        r="80"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32"
      ></circle>
    </svg>
  )
}
