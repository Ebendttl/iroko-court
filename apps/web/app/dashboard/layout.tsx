"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Inbox,
  Sparkles,
  Utensils,
  Shirt,
  FileSpreadsheet,
  ArrowLeft,
  UserCheck,
  Menu,
  X,
} from "lucide-react";

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Header */}
        <div className="h-20 border-b border-brand-forest-light/20 flex items-center px-6 space-x-3 bg-brand-forest-dark/40">
          <div className="w-8 h-8 rounded overflow-hidden flex items-center justify-center shadow shrink-0">
            <img src="/logo.png" alt="Iroko Court Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-white font-bold tracking-tight text-lg leading-none">CANOPY NEXUS</span>
            <span className="text-[9px] uppercase tracking-wider text-brand-gold font-bold mt-1 font-sans">Operations Hub</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          <Link
            href="/dashboard"
            onClick={onNavClick}
            className="flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-semibold hover:bg-brand-forest-light/60 hover:text-white transition-all"
          >
            <LayoutDashboard className="w-4 h-4 text-brand-gold" />
            <span>Financial Dashboard</span>
          </Link>

          <Link
            href="/dashboard/leads"
            onClick={onNavClick}
            className="flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-semibold hover:bg-brand-forest-light/60 hover:text-white transition-all"
          >
            <Inbox className="w-4 h-4 text-brand-gold-light" />
            <span>Inquiry Leads Queue</span>
          </Link>

          <div className="h-px bg-brand-forest-light/20 my-4" />

          <div className="px-3 mb-2 text-[9px] font-bold uppercase tracking-wider text-brand-cream/30">Business Units</div>

          <Link
            href="/dashboard/hall"
            onClick={onNavClick}
            className="flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-semibold hover:bg-brand-forest-light/60 hover:text-white transition-all"
          >
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <span>The Hall (Bookings)</span>
          </Link>

          <Link
            href="/dashboard/table"
            onClick={onNavClick}
            className="flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-semibold hover:bg-brand-forest-light/60 hover:text-white transition-all"
          >
            <Utensils className="w-4 h-4 text-brand-terracotta" />
            <span>The Table (Eatery Sales)</span>
          </Link>

          <Link
            href="/dashboard/press"
            onClick={onNavClick}
            className="flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-semibold hover:bg-brand-forest-light/60 hover:text-white transition-all"
          >
            <Shirt className="w-4 h-4 text-brand-slate" />
            <span>The Press (Laundry Orders)</span>
          </Link>

          <div className="h-px bg-brand-forest-light/20 my-4" />

          <Link
            href="/dashboard/reports"
            onClick={onNavClick}
            className="flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-semibold hover:bg-brand-forest-light/60 hover:text-white transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Financial Reports</span>
          </Link>
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-brand-forest-light/20 space-y-3">
        <div className="flex items-center space-x-3 bg-brand-forest-dark/30 p-2.5 rounded border border-brand-forest-light/10">
          <UserCheck className="w-4 h-4 text-brand-gold-light" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white leading-none">Admin Operator</span>
            <span className="text-[8px] text-brand-cream/50 mt-1">Iroko Court Admin</span>
          </div>
        </div>

        <Link
          href="/"
          onClick={onNavClick}
          className="flex items-center justify-center space-x-1.5 w-full py-2 border border-brand-cream/20 hover:bg-brand-cream hover:text-brand-forest text-[10px] font-bold rounded transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </Link>
      </div>
    </div>
  );
}

export default function NexusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex bg-brand-mist text-brand-charcoal selection:bg-brand-gold selection:text-brand-charcoal">

      {/* ── DESKTOP SIDEBAR (always visible ≥ md) ── */}
      <aside className="hidden md:flex w-64 bg-brand-forest text-brand-cream/80 flex-col justify-between border-r border-brand-forest-dark/45 shrink-0 select-none">
        <SidebarContent />
      </aside>

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-brand-forest text-brand-cream/80 flex flex-col select-none transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-brand-forest-light/40 hover:bg-brand-forest-light text-brand-cream transition-colors"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>

        <SidebarContent onNavClick={() => setSidebarOpen(false)} />
      </aside>

      {/* ── MAIN CONTAINER ── */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="h-16 md:h-20 bg-white border-b border-zinc-200/60 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center space-x-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-md text-brand-forest hover:bg-brand-forest/10 focus:outline-none mr-1"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="w-7 h-7 md:w-8 md:h-8 rounded overflow-hidden shadow-sm shrink-0">
              <img src="/logo.png" alt="Iroko Court Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="font-serif text-sm md:text-lg font-bold text-brand-forest leading-tight">
              Iroko Court Executive Hub
            </h2>
          </div>

          <div className="flex items-center space-x-3 md:space-x-6 text-xs text-brand-charcoal/60">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-semibold text-brand-charcoal">Location: Ikeja GRA</span>
              <span className="text-[10px] text-brand-charcoal/40">Tenant ID: 0f3d2e_lagos</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" title="System online" />
          </div>
        </header>

        {/* Content Page */}
        <main className="flex-grow p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
