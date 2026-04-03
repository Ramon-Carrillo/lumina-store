import Link from "next/link"

const links = [
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
]

export function Nav() {
  return (
    <nav className="ml-auto flex items-center gap-6">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
