"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScriptToVideoForm from "@/components/forms/ScriptToVideoForm";
import AutomatedPublishingForm from "@/components/forms/AutomatedPublishingForm";
import AIGeneratedContentForm from "@/components/forms/AIGeneratedContentForm";

const options = [
  {
    title: "Script to Video",
    description: "Create short videos from your script",
    content: "Content for Script to Video option",
  },
  {
    title: "AI-Generated Content",
    description: "Let AI write the script and generate the short",
    content: "Content for AI-Generated Content option",
  },
  {
    title: "Automated Publishing",
    description: "AI automates video generation and uploads to socials",
    content: "Content for Automated Publishing option",
  },
];

export default function GeneratePage() {
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [highlighterWidth, setHighlighterWidth] = useState<number>(0);
  const [highlighterOffset, setHighlighterOffset] = useState<number>(0);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const selectedButton = buttonRefs.current[selectedOption];
    if (selectedButton) {
      setHighlighterWidth(selectedButton.offsetWidth);
      setHighlighterOffset(
        selectedButton.offsetLeft - selectedButton.parentElement!.offsetLeft
      );
    }
  }, [selectedOption]);

  const renderForm = () => {
    switch (selectedOption) {
      case 0:
        return <ScriptToVideoForm />;
      case 1:
        return <AIGeneratedContentForm />;
      case 2:
        return <AutomatedPublishingForm />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen relative bg-[#0a0a0a] p-4 sm:p-6 md:p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#151515] to-[#0f0f0f] opacity-70"></div>
      <div className="relative z-10 max-w-4xl mx-auto mt-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-200 text-center mb-8 sm:mb-12">
          Generate Content
        </h1>

        <div className="relative mb-8 bg-[#1a1a1a] rounded-xl p-1 shadow-md max-w-md mx-auto">
          <div className="flex justify-center">
            {options.map((option, index) => (
              <button
                key={index}
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                onClick={() => setSelectedOption(index)}
                className={`relative z-10 px-3 py-2 text-xs sm:text-sm font-medium transition-colors duration-300 rounded-xl ${selectedOption === index
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
                  }`}
              >
                {option.title}
              </button>
            ))}
          </div>
          <motion.div
            className="absolute top-1 bottom-1 bg-emerald-700 rounded-xl"
            initial={false}
            animate={{
              width: highlighterWidth,
              x: highlighterOffset,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedOption}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1a1a1a] p-6 sm:p-8 rounded-xl shadow-md"
          >
            {renderForm()}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
