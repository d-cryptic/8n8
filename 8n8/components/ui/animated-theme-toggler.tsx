"use client"

import { Moon, Sun } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"

type Props = {
  className?: string
}

export const AnimatedThemeToggler = ({ className }: Props) => {
  const [isDark, setIsDark] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return

    const applyThemeChange = () => {
      const newTheme = !isDark
      setIsDark(newTheme)
      document.documentElement.classList.toggle("dark")
      try {
        localStorage.setItem("theme", newTheme ? "dark" : "light")
      } catch {}
    }

    const startViewTransition: undefined | ((cb: () => void) => { ready: Promise<void> }) =
      (document as any)?.startViewTransition

    if (typeof startViewTransition === "function") {
      const transition = startViewTransition(() => {
        flushSync(applyThemeChange)
      })

      try {
        await transition.ready
      } catch {}

      const { top, left, width, height } = buttonRef.current.getBoundingClientRect()
      const x = left + width / 2
      const y = top + height / 2
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      )

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    } else {
      applyThemeChange()
    }
  }, [isDark])

  return (
    <button ref={buttonRef} onClick={toggleTheme} className={cn(className)}>
      {isDark ? <Sun /> : <Moon />}
    </button>
  )
}
