"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  Sun,
  Moon,
  Menu,
  X,
  Headphones,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCart } from "@/components/providers/cart-provider"
import { CartDrawer } from "@/components/shop/cart-drawer"
import { cn } from "@/lib/utils"

// ─── Nav links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

// ─── Theme toggle ─────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="size-9 shrink-0" />
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9 shrink-0"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
          transition={{ duration: 0.18 }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun className="size-4 text-muted-foreground" />
          ) : (
            <Moon className="size-4 text-muted-foreground" />
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}

// CartButton is replaced by CartDrawer (self-contained trigger + sheet).

// ─── Desktop nav link ─────────────────────────────────────────────────────────

function NavLink({
  href,
  label,
  pathname,
}: {
  href: string
  label: string
  pathname: string
}) {
  const active = pathname === href || pathname.startsWith(href + "/")

  return (
    <Link
      href={href}
      className={cn(
        "relative text-sm font-medium transition-colors",
        "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full",
        "after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200",
        "hover:text-foreground hover:after:scale-x-100",
        active
          ? "text-foreground after:scale-x-100"
          : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Detect scroll to apply border + shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl shadow-[0_1px_0_0_oklch(1_0_0/6%)]"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">

        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-foreground"
          aria-label="Lumina home"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary">
            <Headphones className="size-4 text-primary-foreground" />
          </span>
          <span className="text-lg font-bold tracking-tight">Lumina</span>
        </Link>

        {/* ── Desktop links ── */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <NavLink href={href} label={label} pathname={pathname} />
            </li>
          ))}
        </ul>

        {/* ── Right actions ── */}
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <CartDrawer />

          {/* ── Mobile menu trigger ── */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-lg",
                "border border-transparent text-sm font-medium transition-all",
                "hover:bg-muted hover:text-foreground md:hidden",
                "focus-visible:ring-2 focus-visible:ring-ring/50 outline-none"
              )}
              aria-label="Open menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center"
                >
                  {mobileOpen ? (
                    <X className="size-5" />
                  ) : (
                    <Menu className="size-5" />
                  )}
                </motion.span>
              </AnimatePresence>
            </SheetTrigger>

            {/* ── Mobile drawer ── */}
            <SheetContent
              side="right"
              className="w-72 border-l border-border bg-card px-0"
            >
              <SheetHeader className="border-b border-border px-6 pb-4">
                <SheetTitle className="flex items-center gap-2 text-left">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary">
                    <Headphones className="size-4 text-primary-foreground" />
                  </span>
                  <span className="text-lg font-bold tracking-tight">Lumina</span>
                </SheetTitle>
              </SheetHeader>

              <ul className="mt-2 flex flex-col">
                {NAV_LINKS.map(({ href, label }, i) => {
                  const active =
                    pathname === href || pathname.startsWith(href + "/")
                  return (
                    <motion.li
                      key={href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.05 }}
                    >
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center justify-between px-6 py-3.5 text-sm font-medium",
                          "border-b border-border/50 transition-colors",
                          "hover:bg-muted hover:text-foreground",
                          active
                            ? "text-primary bg-primary/8"
                            : "text-muted-foreground"
                        )}
                      >
                        {label}
                        <ChevronRight className="size-4 opacity-40" />
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>

              {/* Mobile cart link */}
              <div className="mt-auto border-t border-border px-6 pt-4">
                <Link
                  href="/cart"
                  className="flex items-center gap-3 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  <ShoppingCart className="size-4" />
                  View Cart
                  <CartBadge />
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

// Small inline badge for the mobile drawer cart link
function CartBadge() {
  const { itemCount } = useCart()
  if (itemCount === 0) return null
  return (
    <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  )
}
