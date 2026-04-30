'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Link from 'next/link';

const footerLinks = [
  { label: 'Начало', href: '#hero' },
  { label: 'Услуги', href: '#services' },
  { label: 'Галерия', href: '#portfolio' },
  { label: 'Калкулатор', href: '#calculator' },
  { label: 'Контакти', href: '#contact' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-dark-950 border-t border-dark-800">
      <div className="container-width py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <motion.a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#hero');
            }}
            className="text-xl font-serif font-semibold text-primary-400"
            whileHover={{ scale: 1.05 }}
          >
            CreativeHub Wedding
          </motion.a>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="text-dark-400 hover:text-primary-400 transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/admin"
              className="text-dark-400 hover:text-primary-400 transition-colors text-sm"
            >
              Админ
            </Link>
          </nav>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-dark-500 text-sm">
            <span>&copy; {currentYear} CreativeHub Wedding</span>
            <Heart className="w-4 h-4 text-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
