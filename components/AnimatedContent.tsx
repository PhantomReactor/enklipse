"use client";

import Link from "next/link";

interface AnimatedContentProps {
  playfairClassName: string;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  playfairClassName,
}) => {
  return (
    <div className="max-w-4xl mx-auto text-center px-4 pb-8 md:pb-16 relative z-0">
      <h2
        className={`${playfairClassName} text-3xl sm:text-5xl md:text-7xl font-bold mb-6 sm:mb-4 md:mb-10 leading-tight text-gray-200`}
      >
        Create Instant <br className="hidden sm:inline" />
        <span className="text-emerald-500">Faceless</span> Short Videos
      </h2>
      <div
        className="text-base sm:text-xl md:text-2xl mb-8 sm:mb-6 md:mb-10 space-y-2 text-gray-300"
      >
        <p>
          Transform your ideas into engaging videos
          <br className="hidden sm:inline" /> with AI-driven visuals and voiceovers.
        </p>
      </div>
      <Link href="/generate" passHref>
        <button
          className="bg-emerald-800 text-white py-2 px-4 md:py-3 md:px-6 rounded-xl text-base md:text-lg hover:bg-emerald-900 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-lg relative overflow-hidden group w-full sm:w-auto mb-10 sm:mb-8 md:mb-12"
        >
          <span className="relative z-10">Get Started</span>
        </button>
      </Link>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-h-[60vh] sm:max-h-none sm:overflow-y-visible pb-4 sm:pb-0"
      >
        {[
          {
            title: "Script to Video",
            description: "Create short videos from your script",
          },
          {
            title: "AI-Generated Content",
            description: "Let AI write the script and generate the short",
          },
          {
            title: "Automated Publishing",
            description: "AI automates video generation and uploads to socials",
          },
        ].map((card, index) => (
          <div
            key={index}
            className="bg-[#1a1a1a] p-6 sm:p-6 rounded-xl shadow-md min-h-[120px] hover:scale-[1.01] transition-transform duration-200"
          >
            <h3 className="text-lg font-bold text-emerald-500 mb-3">{card.title}</h3>
            <p className="text-sm text-gray-300">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedContent;
