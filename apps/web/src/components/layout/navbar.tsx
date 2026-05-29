import { Menu } from "lucide-react";

import { AuthNavActions } from "@/components/auth/auth-nav-actions";
import { navLinks } from "@/components/landing/content";
import { Logo } from "@/components/layout/logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <a
              href={`#${link.toLowerCase().replaceAll(" ", "-")}`}
              key={link}
              className="text-sm text-body transition-colors hover:text-ink"
            >
              {link}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <AuthNavActions />
        </div>
        <button
          className="grid size-10 place-items-center rounded-full border border-hairline bg-surface-card md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </button>
      </nav>
    </header>
  );
}
