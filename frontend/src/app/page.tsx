import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CTASection from "@/components/landing/CTASection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF8F4]">
      <LandingHeader />

      <HeroSection />

      <FeaturesSection />

      <HowItWorksSection />

      <CTASection />

      <LandingFooter />
    </main>
  );
}