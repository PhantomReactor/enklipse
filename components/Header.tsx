"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dancing_Script } from "next/font/google";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import ConnectModal from "./ConnectModal";
import Image from "next/image";

const dancingScript = Dancing_Script({ weight: "700", subsets: ["latin"] });

const Header: React.FC = () => {
  const pathname = usePathname();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const connectButtonRef = useRef<HTMLButtonElement>(null);

  const handleConnectClick = () => {
    setShowConnectModal(!showConnectModal);
  };

  const NavLinks = () => (
    <>
      <Link
        href="/generate"
        className="text-white hover:text-green-500 transition-colors block md:inline"
      >
        generate
      </Link>
      <Link
        href="/#pricing"
        className="text-white hover:text-green-500 transition-colors block md:inline"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        pricing
      </Link>
      <Link
        href="/videos"
        className="text-white hover:text-green-500 transition-colors block md:inline"
      >
        my videos
      </Link>
    </>
  );

  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className={`text-2xl ${dancingScript.className} text-green-500 flex items-center`}
        >
          Enklipse
        </Link>

        <nav className="flex items-center">
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center mr-6">
            <NavLinks />
          </div>

          {/* Auth Components */}
          <div className="flex items-center space-x-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-full inline-flex items-center transition-colors duration-300">
                  <FontAwesomeIcon icon={faGoogle} className="w-5 h-5 mr-2" />
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center space-x-3">
                <button
                  ref={connectButtonRef}
                  onClick={handleConnectClick}
                  className={`${showConnectModal
                    ? 'bg-[#1a1a1a] text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-800'
                    } font-medium py-2 px-4 rounded-full inline-flex items-center transition-all duration-300`}
                >
                  <span>Connect</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ml-2 ${showConnectModal ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                      rootBox: "w-10 h-10",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile Hamburger - Moved after auth components */}
          <button
            className="md:hidden text-white ml-4"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 transition-all duration-300 ${isMenuOpen
          ? 'opacity-100 pointer-events-auto backdrop-blur-sm'
          : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`fixed right-4 top-20 w-48 bg-[#1a1a1a] transform transition-transform duration-300 shadow-lg rounded-lg border border-gray-800 ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
            }`}
          onClick={e => e.stopPropagation()}
        >
          {/* Menu items */}
          <div className="py-2">
            <div className="space-y-1">
              <Link
                href="/generate"
                className="text-gray-300 hover:text-green-500 hover:bg-gray-800 transition-all block text-sm py-2 px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Generate
              </Link>
              <Link
                href="/#pricing"
                className="text-gray-300 hover:text-green-500 hover:bg-gray-800 transition-all block text-sm py-2 px-4"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                Pricing
              </Link>
              <Link
                href="/videos"
                className="text-gray-300 hover:text-green-500 hover:bg-gray-800 transition-all block text-sm py-2 px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                My Videos
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ConnectModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        buttonRef={connectButtonRef}
      />
    </header>
  );
};

export default Header;
