import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowToUse from "@/components/HowToUse";
import ProductShowcase from "@/components/ProductShowcase";
import WhereToBuy from "@/components/WhereToBuy";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductShowcase />
      <Features />
      <HowToUse />
      <WhereToBuy />
      <Footer />
    </main>
  );
}
