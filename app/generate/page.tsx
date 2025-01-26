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
    icon: "📝",
    disabled: false,
  },
  {
    title: "AI-Generated Content",
    description: "Coming soon",
    icon: "🤖",
    disabled: true,
  },
  {
    title: "Automated Publishing",
    description: "AI automates video generation and uploads to socials",
    icon: "🚀",
    disabled: false,
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
    <main className="min-h-screen relative bg-[#0a0a0a] pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#151515] to-[#0f0f0f] opacity-70"></div>

      {/* Dashboard Layout */}
      <div className="relative z-0 p-4 sm:p-6 md:p-8">
        <div className="max-w-5xl mx-auto">

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {options.map((option, index) => (
              <button
                key={index}
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                onClick={() => !option.disabled && setSelectedOption(index)}
                className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${option.disabled
                  ? "bg-gray-800/50 border-2 border-gray-700 cursor-not-allowed opacity-50"
                  : selectedOption === index
                    ? "bg-emerald-700/20 border-2 border-emerald-600"
                    : "bg-[#1a1a1a] border-2 border-transparent hover:border-emerald-600/50"
                  }`}
              >
                <span className="text-3xl mb-3">{option.icon}</span>
                <h3 className="text-lg font-semibold text-white mb-2">{option.title}</h3>
                <p className="text-sm text-gray-400 text-center">{option.description}</p>
              </button>
            ))}
          </div>

          {/* Content Area */}
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
      </div>
    </main>
  );
}
