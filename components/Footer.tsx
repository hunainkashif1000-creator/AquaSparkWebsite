import Image from "next/image";
import Container from "./Container";
import { getSiteSettings } from "@/lib/site-content";

export default async function Footer() {
  const settings = (await getSiteSettings())[0];
  return <footer className="bg-ink text-white/70"><Container className="flex flex-col items-center gap-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left"><div className="flex items-center gap-3"><Image src="/images/logo-sm.png" alt="Aqua Spark" width={32} height={32} className="rounded-full" /><span className="font-display font-semibold text-white">Aqua Spark</span></div><p className="text-sm">{settings.footer.tagline}</p><p className="text-sm">&copy; {new Date().getFullYear()} Aqua Spark. All rights reserved.</p></Container></footer>;
}
