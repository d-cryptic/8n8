"use client";

import FooterSection from "@/components/layout/Footer";
import { FloatingNavbar } from "@/components/layout/Navbar";
import { CTA } from "@/components/sections/CTA";
import { Features } from "@/components/sections/Features";
import HeroSection from "@/components/sections/hero-section";
import HowItWorks from "@/components/sections/how-it-works";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/ui/faq";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    getCurrentUser().then((user) => {
      if (user) {
        // Redirect authenticated users to dashboard
        router.push("/dashboard");
      }
    });
  }, [router]);

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
