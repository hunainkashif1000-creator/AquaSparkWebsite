import Image from "next/image";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <Container className="flex flex-col items-center gap-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo-sm.png"
            alt="Aqua Spark"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="font-display font-semibold text-white">
            Aqua Spark
          </span>
        </div>
        <p className="text-sm">
          Aqua Spark Dish Wash — Cleaning Expert. Made with real lemon.
        </p>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Aqua Spark. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
