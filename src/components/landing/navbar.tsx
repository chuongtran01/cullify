import { Menu } from "lucide-react";

import { ButtonLink } from "@/components/landing/button-link";
import { navLinks } from "@/components/landing/content";
import { Logo } from "@/components/landing/logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5">
        <Logo />
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              href={`#${link.toLowerCase().replaceAll(" ", "-")}`}
              key={link}
              className="text-sm font-medium text-body transition-colors hover:text-ink"
            >
              {link}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <ButtonLink
            variant="link"
            className="h-10 px-0 text-ink no-underline hover:text-primary hover:no-underline"
          >
            Sign In
          </ButtonLink>
          <ButtonLink className="h-10 px-[18px]">Get Started</ButtonLink>
        </div>
        <button
          className="grid size-10 place-items-center rounded-[8px] border border-hairline bg-surface-card md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </button>
      </nav>
    </header>
  );
}
