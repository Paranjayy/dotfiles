import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Structure } from "@/components/Structure";
import { Install } from "@/components/Install";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Structure />
      <Install />
      <Footer />
    </main>
  );
}
