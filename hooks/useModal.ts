import { RefObject, useEffect, useRef, useState } from "react"

const getDOMRef = (
  value: string | RefObject<HTMLElement> | HTMLElement
): HTMLElement | null => {
  if (typeof value == "string") {
    return document.querySelector(value)
  } else if (typeof value == "object") {
    if (value instanceof HTMLElement) return value
    if (value.current) return value.current
  }
  return null
}
const isFocusable = (element: HTMLElement): element is HTMLElement => {
  return typeof element.focus === "function"
}
interface UseModalProps {
  focusFirst?: string | RefObject<HTMLElement> | HTMLElement
  focusAfterClosed?: string | RefObject<HTMLElement> | HTMLElement
  autoFocus?: boolean
  onClose: () => void
  overlayModal?: boolean
}

const useModal = <RefType extends HTMLElement>({
  focusFirst,
  onClose,
  focusAfterClosed,
  autoFocus,
  overlayModal = true,
}: UseModalProps) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement>()
  const focusElements = useRef<{
    focusFirst: HTMLElement | null
    focusAfterClosed: HTMLElement | null
  }>()
  useEffect(() => {
    let modalRoot = document.getElementById("modal-root")
    if (!modalRoot) {
      modalRoot = document.createElement("div")
      modalRoot.setAttribute("id", "modal-root")
      document.body.appendChild(modalRoot)
    }
    setModalRoot(modalRoot)
    if (!focusElements.current) {
      focusElements.current = {
        focusFirst: focusFirst ? getDOMRef(focusFirst) : null,
        focusAfterClosed: focusAfterClosed ? getDOMRef(focusAfterClosed) : null,
      }
    }
  }, [])

  const ref = useRef<RefType | null>(null)

  // attach necessary click and key event handlers
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (!ref.current) {
        return
      }
      if (!ref.current.contains(e.target as HTMLElement)) {
        onClose()
        if (focusElements.current?.focusAfterClosed)
          focusElements.current.focusAfterClosed.focus()
      }
    }

    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
        if (focusElements.current?.focusAfterClosed)
          focusElements.current.focusAfterClosed.focus()
      }
    }
    document.body.addEventListener("keyup", handleKeyPress)
    document.body.addEventListener("click", handleOutsideClick, {
      capture: true,
    })

    return () => {
      document.body.removeEventListener("click", handleOutsideClick, {
        capture: true,
      })
      document.body.removeEventListener("keyup", handleKeyPress)
    }
  }, [onClose, focusElements])

  // attach focus event handlers to handle tabbing and what to focus on open/close modal
  useEffect(() => {
    // `focus` event can be triggered by keyboard(user input),javascript
    // we want to run some operations only when focus is triggered by keyboard
    let ignoreUntilFocusChanges = false
    const attempFocus = (element: HTMLElement) => {
      if (!isFocusable(element)) {
        return false
      }
      ignoreUntilFocusChanges = true

      try {
        element.focus()
      } catch (e) {
        console.error(e)
      }
      ignoreUntilFocusChanges = false
      return document.activeElement === element
    }
    const focusFirstDescendant = (element: HTMLElement) => {
      for (var i = 0; i < element.childNodes.length; i++) {
        var child = element.childNodes[i]

        if (
          attempFocus(child as HTMLElement) ||
          focusFirstDescendant(child as HTMLElement)
        ) {
          return true
        }
      }
      return false
    }
    const focusLastDescendant = (element: HTMLElement) => {
      for (var i = element.childNodes.length - 1; i >= 0; i--) {
        var child = element.childNodes[i]
        if (
          attempFocus(child as HTMLElement) ||
          focusLastDescendant(child as HTMLElement)
        ) {
          return true
        }
      }
      return false
    }

    if (focusElements.current?.focusFirst)
      focusElements.current.focusFirst.focus()
    else {
      if (autoFocus && ref.current) {
        focusFirstDescendant(ref.current)
      }
    }

    let lastFocus: any
    const trapFocus = (e: FocusEvent) => {
      if (ignoreUntilFocusChanges) {
        return
      }

      if (!ref.current) {
        console.error("dialog not found")
        return
      }
      if (ref.current.contains(e.target as HTMLElement)) {
        lastFocus = e.target
      } else {
        focusFirstDescendant(ref.current)

        // user clicks Shift + Tab when activeElement is first focusable descendant inside dialog,in this case `focusFirstDescendant` won't change lastFocus
        // then focus last descendant, it goes round and round
        if (lastFocus === document.activeElement) {
          focusLastDescendant(ref.current)
        }

        lastFocus = document.activeElement
      }
    }

    if (overlayModal) {
      document.body.classList.add("has-dialog")
    }
    document.addEventListener("focus", trapFocus, true)

    return () => {
      if (overlayModal) {
        document.body.classList.remove("has-dialog")
      }
      document.removeEventListener("focus", trapFocus, true)

      if (focusElements.current?.focusAfterClosed) {
        focusElements.current?.focusAfterClosed.focus()
      }
    }
  }, [focusElements, autoFocus, overlayModal])

  return { ref, modalRoot }
}

export default useModal
