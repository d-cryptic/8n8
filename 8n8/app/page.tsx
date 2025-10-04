import { CTA } from "@/components/CTA";
import { Features } from "@/components/Features";
import FooterSection from "@/components/Footer";
import HeroSection from "@/components/hero-section";
import HowItWorks from "@/components/how-it-works";
import { FloatingNavbar } from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/ui/faq";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative w-full">
      <FloatingNavbar />
      <HeroSection />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <CTA />
      <FooterSection />
    </div>
  );
}
