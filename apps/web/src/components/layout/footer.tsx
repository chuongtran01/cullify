import { Logo } from "@/components/layout/logo";

const footerGroups = [
  ["Product", "Features", "Pricing", "Demo"],
  ["Resources", "Docs", "Guides", "Changelog"],
  ["Company", "About", "Careers", "Contact"],
  ["Legal", "Privacy", "Terms", "Security"],
];

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-body">
              AI photo culling for people who want fewer decisions and better
              final sets.
            </p>
          </div>
          {footerGroups.map(([heading, ...links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-ink">{heading}</h3>
              <ul className="mt-4 grid gap-3 text-sm text-body">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition-colors hover:text-ink">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-hairline pt-6 text-sm text-muted sm:flex-row">
          <p>Copyright 2026 Cullify. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-ink">
              X
            </a>
            <a href="#" className="hover:text-ink">
              LinkedIn
            </a>
            <a href="#" className="hover:text-ink">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
