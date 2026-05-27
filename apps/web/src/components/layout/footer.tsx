import { Logo } from "@/components/layout/logo";

const footerGroups = [
  ["Product", "Features", "Pricing", "Demo"],
  ["Resources", "Docs", "Guides", "Changelog"],
  ["Company", "About", "Careers", "Contact"],
  ["Legal", "Privacy", "Terms", "Security"],
];

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div>
            <div className="[&_a]:text-white [&_span:first-child]:bg-white [&_span:first-child]:text-primary">
              <Logo />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">
              AI photo culling for people who want fewer decisions and better
              final sets.
            </p>
          </div>
          {footerGroups.map(([heading, ...links]) => (
            <div key={heading}>
              <h3 className="text-sm font-medium text-white">{heading}</h3>
              <ul className="mt-4 grid gap-3 text-sm text-white/60">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/15 pt-6 text-sm text-white/50 sm:flex-row">
          <p>Copyright 2026 Cullify. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">
              X
            </a>
            <a href="#" className="hover:text-white">
              LinkedIn
            </a>
            <a href="#" className="hover:text-white">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
