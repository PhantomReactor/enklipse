"use client";

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { api_url } from '@/constants';
import { useToast } from '@/hooks/use-toast';

interface PricingSectionProps {
    playfairClassName: string;
}

// Add these new icon components before the PricingSection component
function BasicIcon({ className = "" }) {
    return (
        <svg
            className={`w-8 h-8 text-emerald-500 ${className}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );
}

function ProIcon({ className = "" }) {
    return (
        <svg
            className={`w-8 h-8 text-emerald-500 ${className}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    );
}

function MaxIcon({ className = "" }) {
    return (
        <svg
            className={`w-8 h-8 text-emerald-500 ${className}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
    );
}

const PricingSection: React.FC<PricingSectionProps> = ({ playfairClassName }) => {
    const [promoCode, setPromoCode] = useState({ basic: '', pro: '', max: '' });
    const { getToken } = useAuth();
    const { toast } = useToast();

    const handleSubscribe = async (tier: 'basic' | 'pro' | 'max') => {
        try {
            const token = await getToken();
            const response = await fetch(`${api_url}/subscriptions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    promo: promoCode[tier],
                    numOfVideos: 10,
                    tier: tier
                }),
            });

            if (!response.ok) {
                throw new Error('Subscription failed');
            }

            toast({
                title: "Success",
                description: "Subscription created successfully!",
                variant: "default",
            });
        } catch (error) {
            console.error('Error creating subscription:', error);
            toast({
                title: "Error",
                description: "Failed to create subscription",
                variant: "destructive",
            });
        }
    };

    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-24">
            <h2 className={`${playfairClassName} text-4xl text-center mb-12 text-white`}>
                Simple, transparent pricing
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
                {/* Basic Tier */}
                <div className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 hover:border-gray-700 transition-all flex flex-col h-full">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <BasicIcon />
                            <h3 className="text-xl font-bold text-white">Basic</h3>
                        </div>
                        <p className="text-3xl font-bold text-white mb-6">$15<span className="text-lg text-gray-400">/month</span></p>
                        <ul className="space-y-4 mb-8">
                            <li className="text-gray-300 flex items-center">
                                <CheckIcon className="mr-2" /> 30 short videos
                            </li>
                            <li className="text-gray-300 flex items-center">
                                <CheckIcon className="mr-2" /> Upto 1 series
                            </li>
                            <li className="text-gray-300 flex items-center">
                                <CheckIcon className="mr-2" /> Publish to YouTube, Instagram, and TikTok
                            </li>
                            <li className="text-gray-300 flex items-center">
                                <CheckIcon className="mr-2" /> AI generated images, voiceovers, captions, and music
                            </li>
                        </ul>
                    </div>
                    <div className="mt-auto">
                        <input
                            type="text"
                            placeholder="Invite code"
                            className="w-full mb-4 p-2 rounded-xl bg-gray-800 text-white border border-gray-700"
                            value={promoCode.basic}
                            onChange={(e) => setPromoCode({ ...promoCode, basic: e.target.value })}
                        />
                        <button
                            className="w-full py-2 px-4 bg-emerald-800 text-white rounded-xl hover:bg-emerald-900 transition-colors"
                            onClick={() => handleSubscribe('basic')}
                        >
                            Get Started
                        </button>
                    </div>
                </div>

                {/* Pro Tier */}
                <div className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 hover:border-gray-700 transition-all flex flex-col h-full relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm">Popular</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <ProIcon />
                            <h3 className="text-xl font-bold text-white">Pro</h3>
                        </div>
                        <p className="text-3xl font-bold text-white mb-6">$30<span className="text-lg text-gray-400">/month</span></p>
                        <ul className="space-y-4 mb-8">
                            <li className="text-gray-300 flex items-center">
                                <CheckIcon className="mr-2" /> Everything in Basic
                            </li>
                            <li className="text-gray-300 flex items-center">
                                <CheckIcon className="mr-2" /> 60 short videos
                            </li>
                            <li className="text-gray-300 flex items-center">
                                <CheckIcon className="mr-2" /> Upto 2 series
                            </li>
                        </ul>
                    </div>
                    <div className="mt-auto">
                        <input
                            type="text"
                            placeholder="Promo code"
                            className="w-full mb-4 p-2 rounded-xl bg-gray-800 text-white border border-gray-700"
                            value={promoCode.pro}
                            onChange={(e) => setPromoCode({ ...promoCode, pro: e.target.value })}
                        />
                        <button
                            className="w-full py-2 px-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                            onClick={() => handleSubscribe('pro')}
                        >
                            Get Started
                        </button>
                    </div>
                </div>

                {/* Enterprise Tier */}
                <div className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 hover:border-gray-700 transition-all flex flex-col h-full">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <MaxIcon />
                            <h3 className="text-xl font-bold text-white">Max</h3>
                        </div>
                        <p className="text-3xl font-bold text-white mb-6">$45<span className="text-lg text-gray-400">/month</span></p>
                        <ul className="space-y-4 mb-8">
                            <li className="text-gray-300 flex items-center">
                                <CheckIcon className="mr-2" /> Everything in Pro
                            </li>
                            <li className="text-gray-300 flex items-center">
                                <CheckIcon className="mr-2" /> 90 short videos
                            </li>
                            <li className="text-gray-300 flex items-center">
                                <CheckIcon className="mr-2" /> Upto 3 series
                            </li>
                        </ul>
                    </div>
                    <div className="mt-auto">
                        <input
                            type="text"
                            placeholder="Promo code"
                            className="w-full mb-4 p-2 rounded-xl bg-gray-800 text-white border border-gray-700"
                            value={promoCode.max}
                            onChange={(e) => setPromoCode({ ...promoCode, max: e.target.value })}
                        />
                        <button
                            className="w-full py-2 px-4 bg-emerald-800 text-white rounded-xl hover:bg-emerald-900 transition-colors"
                            onClick={() => handleSubscribe('max')}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

function CheckIcon({ className = "" }) {
    return (
        <svg
            className={`w-5 h-5 text-green-500 ${className}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path d="M5 13l4 4L19 7"></path>
        </svg>
    );
}

export default PricingSection; 