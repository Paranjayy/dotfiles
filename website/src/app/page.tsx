import { Hero } from "@/components/Hero";
import { Keybindings } from "@/components/Keybindings";
import { Terminals } from "@/components/Terminals";
import { DevTools } from "@/components/DevTools";
import { Tmux } from "@/components/Tmux";
import { Install } from "@/components/Install";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Keybindings />
      <Terminals />
      <DevTools />
      <Tmux />
      <Install />
      <Footer />
    </main>
  );
}
