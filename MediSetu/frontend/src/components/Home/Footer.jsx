"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "react-feather";

const Footer = () => {
  return (
    <footer className="bg-blue-50 text-gray-700 pt-10 pb-6 mt-20">
      <div className="container mx-auto px-6">
        {/* Logo and description */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Link href="/">
            <Image
              src="/assets/medisetu-logo.png"
              alt="Medisetu Logo"
              width={100}
              height={60}
              priority
            />
          </Link>
          <p className="text-sm text-gray-600 max-w-md">
            Empowering digital healthcare access for everyone.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4">
            <Link href="#" aria-label="Facebook">
              <Facebook className="w-5 h-5 text-blue-600 hover:text-blue-800" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Twitter className="w-5 h-5 text-blue-500 hover:text-blue-700" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Instagram className="w-5 h-5 text-pink-500 hover:text-pink-700" />
            </Link>
            <Link href="#" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5 text-blue-700 hover:text-blue-900" />
            </Link>
          </div>
        </div>

        {/* Bottom text */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Medisetu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
