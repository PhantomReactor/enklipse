"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-emerald-800 py-8 mt-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-white">© 2024 Your Company. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6">
                        <Link href="#" className="text-white hover:text-gray-200">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-white hover:text-gray-200">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-white hover:text-gray-200">
                            Contact
                        </Link>
                        <Link href="/refund-policy" className="text-white hover:text-gray-200">
                            Refund Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
} 