import { footerColumns, studio } from "@/data/studio";

export default function Footer() {
  return (
    <footer className="relative bg-bg border-t border-line py-16 px-6 md:px-16">
      <div className="grid md:grid-cols-4 gap-10 mb-16">
        <div>
          <p className="font-display italic text-2xl mb-3">{studio.name}</p>
          <p className="text-sm text-fg-dim max-w-xs">{studio.tagline}</p>
        </div>
        {footerColumns.map((col) => (
          <div key={col.title}>
            <p className="text-xs tracking-[0.2em] uppercase text-fg-dim mb-4">{col.title}</p>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-accent transition-colors duration-300">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-fg-dim border-t border-line pt-6">
        <p>
          © {new Date().getFullYear()} {studio.fullName}. All rights reserved.
        </p>
        <p>{studio.location}</p>
      </div>
    </footer>
  );
}
