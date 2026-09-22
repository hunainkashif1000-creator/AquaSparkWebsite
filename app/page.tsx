import Features from "@/components/Features";
import DealTicker from "@/components/DealTicker";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowToUse from "@/components/HowToUse";
import ProductShowcase from "@/components/ProductShowcase";
import WhereToBuy from "@/components/WhereToBuy";

export default function Home() {
  return (
    <main>
      <Hero />
      <DealTicker />
      <ProductShowcase />
      <Features />
      <HowToUse />
      <WhereToBuy />
      <Footer />
    </main>
  );
}
