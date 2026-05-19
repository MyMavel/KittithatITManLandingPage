import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Nav />
      <Hero />
      <Features />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
