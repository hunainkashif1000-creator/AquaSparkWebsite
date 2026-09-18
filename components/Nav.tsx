import Image from "next/image";
import Container from "./Container";

const links = [
  { href: "#why", label: "Why it works" },
  { href: "#how", label: "How to use" },
  { href: "#buy", label: "Where to buy" },
];

export default function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <Container className="flex items-center justify-between py-6">
        <a href="#top" className="flex items-center gap-3">
          <Image
            src="/images/logo-sm.png"
            alt="Aqua Spark"
            width={44}
            height={44}
            className="rounded-full"
            priority
          />
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            Aqua Spark
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-white/85 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#buy"
          className="rounded-full bg-lemon px-5 py-2.5 text-[15px] font-semibold text-ink shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Get in touch
        </a>
      </Container>
    </header>
  );
}
