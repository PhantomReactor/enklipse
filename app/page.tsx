import { Playfair_Display } from "next/font/google";
import dynamic from "next/dynamic";

const playfair = Playfair_Display({ subsets: ["latin"] });

// Dynamically import the AnimatedContent component
const AnimatedContent = dynamic(() => import("../components/AnimatedContent"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center mt-16">
        <section className="w-full">
          <AnimatedContent playfairClassName={playfair.className} />
        </section>
      </main>
    </div>
  );
}
