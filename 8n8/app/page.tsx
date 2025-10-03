import { Features } from "@/components/Features";
import HeroSection from "@/components/hero-section";
import HowItWorks from "@/components/how-it-works";
import { FloatingNavbar } from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative w-full">
      <FloatingNavbar />
      <HeroSection />
      <HowItWorks />
      <Features />
      {/* Pricing */}
      {/* Footer */}
    </div>
  );
}
