"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    ChevronRight,
    PenLine,
    Palette,
    Share2,
    CheckCircle2
} from "lucide-react";

interface HowItWorksSectionProps {
    playfairClassName: string;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
    playfairClassName,
}) => {
    const steps = [
        {
            title: "Create Your Script",
            description: "Write a script between 100-500 words that will be transformed into your video",
            icon: <PenLine className="w-8 h-8 text-emerald-500" />,
            details: [
                "Enter a catchy title (3-30 characters)",
                "Write or paste your script",
                "Perfect for storytelling, tutorials, or explanations"
            ]
        },
        {
            title: "Choose Your Style",
            description: "Select from multiple video styles and voice options to match your content",
            icon: <Palette className="w-8 h-8 text-emerald-500" />,
            details: [
                "Cinematic style for dramatic content",
                "Animated style for engaging explanations",
                "Documentary style for informative content"
            ]
        },
        {
            title: "Generate & Share",
            description: "Our AI creates your video and makes it ready for multiple platforms",
            icon: <Share2 className="w-8 h-8 text-emerald-500" />,
            details: [
                "Automatic video generation",
                "Direct publishing to YouTube",
                "Share on TikTok with one click"
            ]
        },
    ];

    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-24">
            <h2 className={`${playfairClassName} text-4xl text-center mb-16 text-white`}>
                How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 hover:border-emerald-600/30 transition-all"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6 p-3 bg-emerald-500/10 rounded-full">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                            <p className="text-gray-400 mb-6">{step.description}</p>
                            <ul className="text-sm text-gray-500 space-y-2 text-left w-full">
                                {step.details.map((detail, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="text-center mt-12">
                <Link
                    href="/generate"
                    className="inline-flex items-center bg-emerald-800 text-white py-3 px-6 rounded-xl hover:bg-emerald-900 transition-colors"
                >
                    Start Creating
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
            </div>
        </section>
    );
};

export default HowItWorksSection; 