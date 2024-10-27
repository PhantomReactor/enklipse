"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface AnimatedContentProps {
  playfairClassName: string;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  playfairClassName,
}) => {
  return (
    <div className="max-w-4xl mx-auto text-center px-4 pb-8 md:pb-16 relative">
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`${playfairClassName} text-3xl sm:text-5xl md:text-7xl font-bold mb-6 sm:mb-4 md:mb-10 leading-tight text-gray-200`}
      >
        Create Instant <br className="hidden sm:inline" />
        <span className="text-emerald-500">Faceless</span> Short Videos
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-base sm:text-xl md:text-2xl mb-8 sm:mb-6 md:mb-10 space-y-2 text-gray-300"
      >
        <p>
          Transform your ideas into engaging videos
          <br className="hidden sm:inline" /> with AI-driven visuals and voiceovers.
        </p>
      </motion.div>
      <Link href="/generate" passHref>
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          className="bg-emerald-800 text-white py-2 px-4 md:py-3 md:px-6 rounded-xl text-base md:text-lg hover:bg-emerald-900 transition-colors duration-300 shadow-lg relative overflow-hidden group w-full sm:w-auto mb-10 sm:mb-8 md:mb-12"
        >
          <span className="relative z-10">Get Started</span>
        </motion.button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-h-[60vh] sm:max-h-none overflow-y-auto sm:overflow-y-visible pb-4 sm:pb-0"
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
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
            className="bg-[#1a1a1a] p-4 sm:p-6 rounded-xl shadow-md"
          >
            <h3 className="text-lg font-bold text-emerald-500 mb-2">{card.title}</h3>
            <p className="text-sm text-gray-300">{card.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AnimatedContent;
