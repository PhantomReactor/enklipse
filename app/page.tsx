import { Playfair_Display } from "next/font/google";
import dynamic from "next/dynamic";
import PricingSection from "@/components/PricingSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Link from "next/link";

const playfair = Playfair_Display({ subsets: ["latin"] });

// Dynamically import the AnimatedContent component
const AnimatedContent = dynamic(() => import("../components/AnimatedContent"), {
  ssr: false,
  loading: () => <div className="h-[600px]" />
});

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full pt-16 pb-8 mt-16 relative z-0">
          <AnimatedContent playfairClassName={playfair.className} />
        </section>

        {/* How It Works Section */}
        <section className="relative z-0">
          <HowItWorksSection playfairClassName={playfair.className} />
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="relative z-0">
          <PricingSection playfairClassName={playfair.className} />
        </section>
      </main>
    </div>
  );
}
