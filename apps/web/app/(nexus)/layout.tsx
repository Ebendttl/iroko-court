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
  UserCheck
} from "lucide-react";

export default function NexusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-brand-mist text-brand-charcoal selection:bg-brand-gold selection:text-brand-charcoal">
      {/* SIDEBAR */}
      <aside className="w-64 bg-brand-forest text-brand-cream/80 flex flex-col justify-between border-r border-brand-forest-dark/45 shrink-0 select-none">
        <div>
          {/* Brand Header */}
          <div className="h-20 border-b border-brand-forest-light/20 flex items-center px-6 space-x-3 bg-brand-forest-dark/40">
            <div className="w-8 h-8 rounded bg-brand-gold flex items-center justify-center">
              <span className="font-serif text-brand-charcoal font-bold text-sm">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-white font-bold tracking-tight text-lg leading-none">CANOPY NEXUS</span>
              <span className="text-[9px] uppercase tracking-wider text-brand-gold font-bold mt-1 font-sans">Operations Hub</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <Link 
              href="/nexus" 
              className="flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-semibold hover:bg-brand-forest-light/60 hover:text-white transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-brand-gold" />
              <span>Financial Dashboard</span>
            </Link>

            <Link 
              href="/nexus/leads" 
              className="flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-semibold hover:bg-brand-forest-light/60 hover:text-white transition-all"
            >
              <Inbox className="w-4 h-4 text-brand-gold-light" />
              <span>Inquiry Leads Queue</span>
            </Link>

            <div className="h-px bg-brand-forest-light/20 my-4"></div>
            
            <div className="px-3 mb-2 text-[9px] font-bold uppercase tracking-wider text-brand-cream/30">Business Units</div>

            <Link 
              href="/nexus/hall" 
              className="flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-semibold hover:bg-brand-forest-light/60 hover:text-white transition-all"
            >
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span>The Hall (Bookings)</span>
            </Link>

            <Link 
              href="/nexus/table" 
              className="flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-semibold hover:bg-brand-forest-light/60 hover:text-white transition-all"
            >
              <Utensils className="w-4 h-4 text-brand-terracotta" />
              <span>The Table (Eatery Sales)</span>
            </Link>

            <Link 
              href="/nexus/press" 
              className="flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-semibold hover:bg-brand-forest-light/60 hover:text-white transition-all"
            >
              <Shirt className="w-4 h-4 text-brand-slate" />
              <span>The Press (Laundry Orders)</span>
            </Link>

            <div className="h-px bg-brand-forest-light/20 my-4"></div>

            <Link 
              href="/nexus/reports" 
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
            className="flex items-center justify-center space-x-1.5 w-full py-2 border border-brand-cream/20 hover:bg-brand-cream hover:text-brand-forest text-[10px] font-bold rounded transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-zinc-200/60 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <h2 className="font-serif text-lg font-bold text-brand-forest">Iroko Court Executive Hub</h2>
          </div>
          
          <div className="flex items-center space-x-6 text-xs text-brand-charcoal/60">
            <div className="flex flex-col text-right">
              <span className="font-semibold text-brand-charcoal">Location: Ikeja GRA</span>
              <span className="text-[10px] text-brand-charcoal/40">Tenant ID: 0f3d2e_lagos</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="System online"></span>
          </div>
        </header>

        {/* Content Page */}
        <main className="flex-grow p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
