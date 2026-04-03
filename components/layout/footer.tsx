import Link from 'next/link'
import { Headphones, Code2, Send, Camera, Play } from 'lucide-react'
import { NewsletterForm } from './newsletter-form'

const SHOP_LINKS = [
  { href: '/products?category=true-wireless', label: 'True Wireless' },
  { href: '/products?category=headphones',    label: 'Headphones'   },
  { href: '/products?category=gaming',        label: 'Gaming'       },
  { href: '/products?category=speakers',      label: 'Speakers'     },
  { href: '/products?category=accessories',   label: 'Accessories'  },
]

const COMPANY_LINKS = [
  { href: '/about',   label: 'About Us' },
  { href: '/contact', label: 'Contact'  },
  { href: '/terms',   label: 'Terms'    },
  { href: '/privacy', label: 'Privacy'  },
]

const SOCIAL_LINKS = [
  { href: 'https://github.com',    label: 'GitHub',    icon: Code2  },
  { href: 'https://twitter.com',   label: 'Twitter',   icon: Send   },
  { href: 'https://instagram.com', label: 'Instagram', icon: Camera },
  { href: 'https://youtube.com',   label: 'YouTube',   icon: Play   },
]

export function Footer() {
  return (
    <footer className="bg-black">

      {/* ── Main grid ── */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white">
              <span className="flex size-7 items-center justify-center rounded-lg bg-white">
                <Headphones className="size-4 text-black" />
              </span>
              <span className="text-lg font-bold tracking-tight">Lumina</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              Premium wireless audio engineered for audiophiles. Every product is crafted to bring you closer to the music.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-8 items-center justify-center rounded-lg border border-white/20 text-white/55 transition-colors hover:border-white/50 hover:text-white"
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Shop
            </p>
            <ul className="mt-4 space-y-2.5">
              {SHOP_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Company
            </p>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Stay in the loop
            </p>
            <p className="mt-4 text-sm text-white/55">
              New drops, exclusive deals, and audio tips — straight to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/45 sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Lumina Store. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms"   className="transition-colors hover:text-white">Terms</Link>
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <span>Built with Next.js &amp; Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
