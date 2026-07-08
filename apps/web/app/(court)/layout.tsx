"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Utensils, Shirt, Info, Menu, X, ArrowRight } from "lucide-react";

export default function CourtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal selection:bg-brand-forest selection:text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full glassmorphism border-b border-white/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 shadow-md shrink-0">
              <img src="/logo.png" alt="Iroko Court Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-brand-forest font-bold tracking-tight text-xl leading-none">IROKO COURT</span>
              <span className="text-[10px] uppercase tracking-widest text-brand-gold font-semibold font-sans mt-0.5">Canopy Storefront</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-brand-forest/80 hover:text-brand-forest transition-colors">
              Home
            </Link>
            <Link href="/hall" className="flex items-center space-x-1.5 text-sm font-medium text-brand-forest/80 hover:text-brand-forest transition-colors">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span>The Hall</span>
            </Link>
            <Link href="/table" className="flex items-center space-x-1.5 text-sm font-medium text-brand-forest/80 hover:text-brand-forest transition-colors">
              <Utensils className="w-4 h-4 text-brand-terracotta" />
              <span>The Table</span>
            </Link>
            <Link href="/press" className="flex items-center space-x-1.5 text-sm font-medium text-brand-forest/80 hover:text-brand-forest transition-colors">
              <Shirt className="w-4 h-4 text-brand-slate" />
              <span>The Press</span>
            </Link>
            <Link href="/contact" className="text-sm font-medium text-brand-forest/80 hover:text-brand-forest transition-colors">
              Enquiries
            </Link>
          </nav>

          {/* CTA Button & Hamburger */}
          <div className="flex items-center space-x-3">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-4 h-10 rounded-md bg-brand-forest text-brand-cream text-xs font-semibold hover:bg-brand-forest-light transition-all shadow hover:shadow-md"
            >
              Book / Schedule
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-brand-forest hover:bg-brand-forest/10 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-brand-forest/10 bg-brand-cream/95 backdrop-blur-md px-4 pt-4 pb-6 space-y-3 shadow-lg">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-brand-forest hover:bg-brand-forest/5"
            >
              Home
            </Link>
            <Link 
              href="/hall" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-brand-forest hover:bg-brand-forest/5"
            >
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span>The Hall</span>
            </Link>
            <Link 
              href="/table" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-brand-forest hover:bg-brand-forest/5"
            >
              <Utensils className="w-4 h-4 text-brand-terracotta" />
              <span>The Table</span>
            </Link>
            <Link 
              href="/press" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-brand-forest hover:bg-brand-forest/5"
            >
              <Shirt className="w-4 h-4 text-brand-slate" />
              <span>The Press</span>
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-brand-forest hover:bg-brand-forest/5"
            >
              Enquiries
            </Link>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-brand-forest text-brand-cream/80 border-t border-brand-forest-dark/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Info */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-md">
                  <img src="/logo.png" alt="Iroko Court Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-serif text-white font-bold text-2xl tracking-tight">IROKO COURT</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm text-brand-cream/60">
                A premium, unified lifestyle court situated in the heart of Lagos, Nigeria. Delivering exceptional experiences across hospitality, culinary arts, and laundry perfection.
              </p>
              <div className="text-sm pt-2">
                <p className="text-white font-medium">Iroko Court Limited</p>
                <p className="text-brand-cream/60">24 Iroko Court Street, Ikeja GRA, Lagos, Nigeria</p>
                <p className="text-brand-cream/60">enquiries@irokocourt.com | +234 812 345 6789</p>
              </div>
            </div>

            {/* Business Units Links */}
            <div>
              <h3 className="font-serif text-white font-semibold text-lg mb-6">Our Services</h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link href="/hall" className="hover:text-white transition-colors flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                    <span>The Hall (Events & Celebrations)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/table" className="hover:text-white transition-colors flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-terracotta"></span>
                    <span>The Table (Nigerian & Continental)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white transition-colors flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-slate"></span>
                    <span>The Press (Premium Dry Cleaning)</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-serif text-white font-semibold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">Submit an Enquiry</Link>
                </li>
                <li>
                  <span className="text-brand-cream/40">Privacy Policy</span>
                </li>
                <li>
                  <span className="text-brand-cream/40">Terms of Service</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-brand-cream/40">
            <p>&copy; {new Date().getFullYear()} Iroko Court Limited. All rights reserved.</p>
            <p>Designed and Built with Canopy Platform Engine.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
