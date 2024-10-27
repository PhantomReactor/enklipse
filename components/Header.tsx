"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dancing_Script } from "next/font/google";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const dancingScript = Dancing_Script({ weight: "700", subsets: ["latin"] });

const Header: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className={`text-2xl ${dancingScript.className} text-green-500`}
        >
          Enklipse
        </Link>

        <nav className="space-x-4 flex items-center">
          <Link
            href="/generate"
            className="text-white hover:text-green-500 transition-colors"
          >
            Generate
          </Link>
          <Link
            href="/about"
            className="text-white hover:text-green-500 transition-colors"
          >
            About
          </Link>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-full inline-flex items-center transition-colors duration-300">
                <FontAwesomeIcon icon={faGoogle} className="w-5 h-5 mr-2" />
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  rootBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
};

export default Header;
