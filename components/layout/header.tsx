import { Nav } from "./nav"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center px-4">
        <span className="text-xl font-bold">Lumina</span>
        <Nav />
      </div>
    </header>
  )
}
