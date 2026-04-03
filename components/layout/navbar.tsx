"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  Menu,
  X,
  Headphones,
  ChevronRight,
  ChevronDown,
  Music,
  Zap,
  Volume2,
  Package,
  ArrowRight,
  Gamepad2,
  AudioLines,
  MonitorSpeaker,
  Sliders,
} from "lucide-react"
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
import { useRef } from "react"

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORIES = [
  { slug: "true-wireless", name: "True Wireless", description: "ANC earbuds for every moment",      icon: Music         },
  { slug: "headphones",    name: "Headphones",    description: "Over-ear & on-ear immersion",        icon: Headphones    },
  { slug: "sport",         name: "Sport",         description: "Sweat-proof, built to move",         icon: Zap           },
  { slug: "speakers",      name: "Speakers",      description: "Portable & home audio",              icon: Volume2       },
  { slug: "gaming",        name: "Gaming",        description: "Win without distraction",            icon: Gamepad2      },
  { slug: "earphones",     name: "Earphones",     description: "Wired precision for audiophiles",    icon: AudioLines    },
  { slug: "soundbars",     name: "Soundbars",     description: "Cinematic sound for your space",     icon: MonitorSpeaker},
  { slug: "dacs-amps",     name: "DACs & Amps",   description: "Power your listening setup",         icon: Sliders       },
  { slug: "accessories",   name: "Accessories",   description: "Cables, cases & ear tips",           icon: Package       },
] as const

const NAV_LINKS = [
  { href: "/about",   label: "About"   },
  { href: "/contact", label: "Contact" },
] as const

const dropdownVariants = {
  hidden:  { opacity: 0, y: -8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: "easeOut" } },
  exit:    { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.13, ease: "easeIn" } },
}

// ─── Shop dropdown ────────────────────────────────────────────────────────────

function ShopDropdown({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isShopActive = pathname.startsWith("/products") || pathname.startsWith("/categories")

  function handleMouseEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  function handleMouseLeave() {
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors",
          "relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full",
          "after:origin-left after:bg-white after:transition-transform after:duration-200",
          open || isShopActive
            ? "text-white after:scale-x-100"
            : "text-white/65 after:scale-x-0 hover:text-white hover:after:scale-x-100"
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Shop
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="size-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-1/2 top-full mt-3 w-[560px] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="border-b border-border px-5 py-3.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Browse by category
              </p>
            </div>

            <div className="grid grid-cols-3 gap-px bg-border p-px">
              {CATEGORIES.map(({ slug, name, description, icon: Icon }) => {
                const active = pathname.includes(`category=${slug}`)
                return (
                  <Link
                    key={slug}
                    href={`/products?category=${slug}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-start gap-3 bg-card px-4 py-3.5 transition-colors hover:bg-primary/5",
                      active && "bg-primary/8"
                    )}
                  >
                    <span className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                      "bg-primary/10 transition-colors group-hover:bg-primary/20",
                      active && "bg-primary/20"
                    )}>
                      <Icon className="size-4 text-primary" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-foreground">{name}</span>
                      <span className="block text-xs text-muted-foreground">{description}</span>
                    </span>
                  </Link>
                )
              })}
            </div>

            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="group flex items-center justify-between border-t border-border px-5 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View all products
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Desktop nav link ─────────────────────────────────────────────────────────

function NavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const active = pathname === href || pathname.startsWith(href + "/")
  return (
    <Link
      href={href}
      className={cn(
        "relative text-sm font-medium transition-colors",
        "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full",
        "after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-200",
        "hover:text-white hover:after:scale-x-100",
        active ? "text-white after:scale-x-100" : "text-white/65"
      )}
    >
      {label}
    </Link>
  )
}

// ─── Mobile categories accordion ─────────────────────────────────────────────

function MobileCategoryList({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)
  return (
    <li>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between px-6 py-3.5 text-sm font-medium",
          "border-b border-border/50 transition-colors hover:bg-muted hover:text-foreground",
          pathname.startsWith("/products") ? "text-primary bg-primary/8" : "text-muted-foreground"
        )}
      >
        Shop
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="size-4 opacity-60" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden bg-muted/30"
          >
            <Link
              href="/products"
              className={cn(
                "flex items-center gap-3 px-6 py-2.5 text-sm transition-colors",
                "border-b border-border/30 hover:text-foreground",
                pathname === "/products" ? "font-semibold text-primary" : "text-muted-foreground"
              )}
            >
              <ArrowRight className="size-3.5 shrink-0" />
              All Products
            </Link>
            {CATEGORIES.map(({ slug, name, icon: Icon }) => {
              const active = pathname.includes(`category=${slug}`)
              return (
                <Link
                  key={slug}
                  href={`/products?category=${slug}`}
                  className={cn(
                    "flex items-center gap-3 px-6 py-2.5 text-sm transition-colors",
                    "border-b border-border/30 last:border-b-0 hover:text-foreground",
                    active ? "font-semibold text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className="size-3.5 shrink-0 text-primary/70" />
                  {name}
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname    = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => setMobileOpen(false), [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black border-b border-white/10">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">

        {/* ── Logo ── */}
        <Link href="/" className="flex shrink-0 items-center gap-2 text-white" aria-label="Lumina home">
          <span className="flex size-7 items-center justify-center rounded-lg bg-white">
            <Headphones className="size-4 text-black" />
          </span>
          <span className="text-lg font-bold tracking-tight">Lumina</span>
        </Link>

        {/* ── Desktop links ── */}
        <ul className="hidden items-center gap-8 md:flex">
          <li><ShopDropdown pathname={pathname} /></li>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <NavLink href={href} label={label} pathname={pathname} />
            </li>
          ))}
        </ul>

        {/* ── Right actions ── */}
        <div className="ml-auto flex items-center gap-1">
          <CartDrawer triggerClassName="text-white hover:bg-white/10 hover:text-white" />

          {/* ── Mobile menu trigger ── */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-lg",
                "border border-transparent text-white transition-all md:hidden",
                "hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/30 outline-none"
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
                  {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </motion.span>
              </AnimatePresence>
            </SheetTrigger>

            {/* ── Mobile drawer ── */}
            <SheetContent side="right" className="w-72 border-l border-border bg-card px-0">
              <SheetHeader className="border-b border-border px-6 pb-4">
                <SheetTitle className="flex items-center gap-2 text-left">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary">
                    <Headphones className="size-4 text-primary-foreground" />
                  </span>
                  <span className="text-lg font-bold tracking-tight">Lumina</span>
                </SheetTitle>
              </SheetHeader>

              <ul className="mt-2 flex flex-col">
                <MobileCategoryList pathname={pathname} />
                {NAV_LINKS.map(({ href, label }, i) => {
                  const active = pathname === href || pathname.startsWith(href + "/")
                  return (
                    <motion.li
                      key={href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center justify-between px-6 py-3.5 text-sm font-medium",
                          "border-b border-border/50 transition-colors",
                          "hover:bg-muted hover:text-foreground",
                          active ? "text-primary bg-primary/8" : "text-muted-foreground"
                        )}
                      >
                        {label}
                        <ChevronRight className="size-4 opacity-40" />
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>

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

// ─── Cart badge (mobile drawer) ───────────────────────────────────────────────

function CartBadge() {
  const { itemCount } = useCart()
  if (itemCount === 0) return null
  return (
    <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  )
}
