import HeroSection from "@/components/hero-section";
import { FloatingNavbar } from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative w-full">
      <FloatingNavbar />
      <HeroSection />
      {/* How it works */}
      {/* Features */}
      {/* Pricing */}
      {/* Footer */}
    </div>
  );
}
