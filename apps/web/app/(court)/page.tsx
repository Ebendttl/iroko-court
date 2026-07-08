"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Utensils, Shirt, ChevronRight, Star, Send, Bell, Gift, ArrowRight } from "lucide-react";
import { 
  getBusinessUnits, 
  getMenuItems, 
  getEventPackages, 
  getLaundryServices, 
  getTestimonials, 
  getComingSoonUnits, 
  getDeals, 
  createPublicEnquiry 
} from "@/lib/db";
import { PublicEnquiryInput } from "@iroko-court/shared";

export default function StorefrontHome() {
  const [businessUnits, setBusinessUnits] = useState<any[]>([]);
  const [featuredFood, setFeaturedFood] = useState<any[]>([]);
  const [featuredHall, setFeaturedHall] = useState<any[]>([]);
  const [laundryServices, setLaundryServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [comingSoon, setComingSoon] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);

  // Interactive Form State
  const [leadType, setLeadType] = useState<"event_enquiry" | "laundry_pickup" | "eatery_order">("event_enquiry");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const bu = await getBusinessUnits();
      setBusinessUnits(bu);
      
      const food = await getMenuItems();
      setFeaturedFood(food.filter(f => f.is_featured));
      
      const hall = await getEventPackages();
      setFeaturedHall(hall);
      
      const laundry = await getLaundryServices();
      setLaundryServices(laundry);
      
      const test = await getTestimonials();
      setTestimonials(test);
      
      const soon = await getComingSoonUnits();
      // Deduplicate by name in case both Supabase and localStorage return data
      const uniqueSoon = soon.filter(
        (unit: any, idx: number, arr: any[]) =>
          arr.findIndex((u: any) => u.name === unit.name) === idx
      );
      setComingSoon(uniqueSoon);
      
      const dl = await getDeals();
      setDeals(dl);
    }
    loadData();
  }, []);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;
    
    setIsSubmitting(true);
    
    // Scoped BU reference
    let unitId = "";
    if (leadType === "event_enquiry") unitId = "a1111111-1111-1111-1111-111111111111";
    if (leadType === "eatery_order") unitId = "b2222222-2222-2222-2222-222222222222";
    if (leadType === "laundry_pickup") unitId = "c3333333-3333-3333-3333-333333333333";

    const data: PublicEnquiryInput = {
      business_unit_id: unitId,
      type: leadType,
      full_name: fullName,
      email,
      phone,
      message,
      metadata: {
        submitted_via: "storefront_landing_quickform",
        timestamp: new Date().toISOString()
      }
    };

    try {
      await createPublicEnquiry(data);
      setSubmitSuccess(true);
      setFullName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error("Enquiry failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-24 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-brand-forest-dark overflow-hidden">
        {/* Background Gradients and Accents */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-forest-light/35 via-brand-forest-dark to-brand-forest-dark"></div>
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-brand-gold/5 blur-[120px]"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-brand-terracotta/5 blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center py-20">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-brand-forest-dark/40 p-1">
              <img src="/logo.png" alt="Iroko Court Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 bg-brand-forest/40 border border-brand-cream/10 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
            <span className="text-[10px] tracking-widest uppercase text-brand-gold-light font-bold">Discover Iroko Court</span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-[1.1] max-w-4xl mx-auto tracking-tight mb-8">
            One Court. <br className="sm:hidden" />
            <span className="text-gradient-gold">Infinite Experiences</span>.
          </h1>
          
          <p className="text-brand-cream/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-12">
            Experience premium lifestyle, fine dining, and laundry perfection inside Ikeja GRA’s premier destination. Three distinct businesses. One standard of absolute excellence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a 
              href="#units" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 h-14 rounded-md bg-brand-gold text-brand-charcoal text-sm font-bold hover:bg-brand-gold-light transition-all shadow-lg hover:shadow-xl hover:scale-[1.01]"
            >
              Explore Services
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
            <a 
              href="#book-now" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 h-14 rounded-md bg-white/5 border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-all"
            >
              Book / Enquire
            </a>
          </div>
        </div>
      </section>

      {/* 2. THE LEADING UNITS SHOWCASE */}
      <section id="units" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-forest mb-4">Our Premium Offerings</h2>
          <p className="text-brand-charcoal/60 text-sm md:text-base">
            Every business unit inside Iroko Court operates with unique style and dedication to customer experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* THE HALL */}
          <div className="flex flex-col bg-white rounded-xl shadow-md border border-brand-gold/10 overflow-hidden hover-lift hover:border-brand-gold/30 transition-all duration-300">
            <div className="h-56 bg-zinc-900 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800" 
                alt="The Hall" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-4 left-4 bg-brand-gold text-brand-charcoal text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded">
                Events & Celebrations
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-brand-forest">The Hall</h3>
                <p className="text-sm text-brand-charcoal/70 leading-relaxed">
                  Lagos’ leading bespoke multi-purpose event center. Perfect for luxury traditional weddings, elite corporate conferences, and high-fashion galas.
                </p>
                <div className="bg-brand-cream/50 border border-brand-gold/10 rounded-md p-3 text-xs">
                  <span className="text-brand-gold font-bold uppercase block mb-1">Active Package:</span>
                  <span className="text-brand-charcoal/80 font-medium font-serif">Iroko Classic Wedding (500 capacity)</span>
                </div>
              </div>
              <div className="pt-6 border-t border-zinc-100 mt-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-brand-charcoal/40 block">PRICING FROM</span>
                  <span className="text-brand-gold font-serif font-bold text-lg">₦1,200,000</span>
                </div>
                <Link 
                  href="/hall" 
                  className="inline-flex items-center text-xs font-bold text-brand-gold hover:text-brand-gold-light group"
                >
                  Configure & Book
                  <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* THE TABLE */}
          <div className="flex flex-col bg-white rounded-xl shadow-md border border-brand-terracotta/10 overflow-hidden hover-lift hover:border-brand-terracotta/30 transition-all duration-300">
            <div className="h-56 bg-zinc-900 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800" 
                alt="The Table" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-4 left-4 bg-brand-terracotta text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded">
                Bespoke Diner
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-brand-forest">The Table</h3>
                <p className="text-sm text-brand-charcoal/70 leading-relaxed">
                  A premium culinary experience blending modern continental cuisines with traditional smoky wood-fire Nigerian classics. Dine in or home delivery.
                </p>
                <div className="bg-brand-cream/50 border border-brand-terracotta/10 rounded-md p-3 text-xs">
                  <span className="text-brand-terracotta font-bold uppercase block mb-1">Featured Dish:</span>
                  <span className="text-brand-charcoal/80 font-medium font-serif">Signature Smoky Jollof with Dodo & Chicken</span>
                </div>
              </div>
              <div className="pt-6 border-t border-zinc-100 mt-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-brand-charcoal/40 block">PRICING FROM</span>
                  <span className="text-brand-terracotta font-serif font-bold text-lg">₦2,500</span>
                </div>
                <Link 
                  href="/table" 
                  className="inline-flex items-center text-xs font-bold text-brand-terracotta hover:text-brand-terracotta/80 group"
                >
                  View Active Menu
                  <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* THE PRESS */}
          <div className="flex flex-col bg-white rounded-xl shadow-md border border-brand-slate/10 overflow-hidden hover-lift hover:border-brand-slate/30 transition-all duration-300">
            <div className="h-56 bg-zinc-900 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1489274495757-95c7c837b101?auto=format&fit=crop&q=80&w=800" 
                alt="The Press" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-4 left-4 bg-brand-slate text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded">
                Laundry & Dry Cleaning
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-brand-forest">The Press</h3>
                <p className="text-sm text-brand-charcoal/70 leading-relaxed">
                  Premium laundry care. We specialize in delicate native materials, Senator wears, and agbadas. Customized starching and express 6-hour turnaround.
                </p>
                <div className="bg-brand-cream/50 border border-brand-slate/10 rounded-md p-3 text-xs">
                  <span className="text-brand-slate font-bold uppercase block mb-1">Popular Request:</span>
                  <span className="text-brand-charcoal/80 font-medium font-serif">Senator Wears Premium Starching Dry Clean</span>
                </div>
              </div>
              <div className="pt-6 border-t border-zinc-100 mt-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-brand-charcoal/40 block">PRICING FROM</span>
                  <span className="text-brand-slate font-serif font-bold text-lg">₦1,500</span>
                </div>
                <Link 
                  href="/press" 
                  className="inline-flex items-center text-xs font-bold text-brand-slate hover:text-brand-slate/80 group"
                >
                  Schedule Pickup
                  <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEALS & PROMOTIONS SLIDER */}
      {deals.length > 0 && (
        <section className="bg-brand-forest text-brand-cream py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12">
              <div className="mb-6 md:mb-0">
                <div className="inline-flex items-center space-x-1.5 bg-brand-gold/25 border border-brand-gold/20 rounded-full px-3 py-1 mb-3 text-xs text-brand-gold-light font-bold">
                  <Gift className="w-3.5 h-3.5" />
                  <span>SPECIAL PROMOTIONS</span>
                </div>
                <h2 className="font-serif text-3xl font-bold">Active Iroko Deals</h2>
              </div>
              <p className="text-brand-cream/60 max-w-md text-sm leading-relaxed">
                Take advantage of our coordinated court deals. Eat at The Table, get event discounts at The Hall, or claim free laundry rewards!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {deals.map(deal => (
                <div 
                  key={deal.id} 
                  className="bg-brand-forest-dark border border-white/10 rounded-lg p-8 flex flex-col md:flex-row items-start md:items-center justify-between space-y-6 md:space-y-0 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <span className="inline-block bg-brand-gold text-brand-charcoal text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded">
                      {deal.discount_label}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white">{deal.title}</h3>
                    <p className="text-xs text-brand-cream/50">Valid until: {new Date(deal.valid_until).toLocaleDateString()}</p>
                  </div>
                  
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center justify-center h-10 px-5 rounded bg-brand-cream text-brand-forest text-xs font-semibold hover:bg-white transition-all shadow"
                  >
                    Claim Offer
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. INTERACTIVE BOOKING QUICK-LEAD FORM */}
      <section id="book-now" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white rounded-xl shadow-lg border border-zinc-100 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/10 rounded-bl-full pointer-events-none"></div>
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-serif text-3xl font-bold text-brand-forest mb-3">Instant Enquiry Queue</h2>
            <p className="text-brand-charcoal/60 text-xs sm:text-sm">
              Ready to experience Iroko Court? Select a service tab, fill the quick details, and your request will queue directly onto the Nexus operations desk instantly.
            </p>
          </div>

          {/* Service Tabs */}
          <div className="flex border-b border-zinc-100 mb-8 justify-center">
            <button 
              onClick={() => setLeadType("event_enquiry")}
              className={`flex items-center space-x-1.5 pb-3 px-4 border-b-2 text-xs font-bold transition-all ${leadType === "event_enquiry" ? "border-brand-gold text-brand-gold" : "border-transparent text-brand-charcoal/40 hover:text-brand-charcoal"}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Event Hall Booking</span>
            </button>
            <button 
              onClick={() => setLeadType("eatery_order")}
              className={`flex items-center space-x-1.5 pb-3 px-4 border-b-2 text-xs font-bold transition-all ${leadType === "eatery_order" ? "border-brand-terracotta text-brand-terracotta" : "border-transparent text-brand-charcoal/40 hover:text-brand-charcoal"}`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Eatery Order</span>
            </button>
            <button 
              onClick={() => setLeadType("laundry_pickup")}
              className={`flex items-center space-x-1.5 pb-3 px-4 border-b-2 text-xs font-bold transition-all ${leadType === "laundry_pickup" ? "border-brand-slate text-brand-slate" : "border-transparent text-brand-charcoal/40 hover:text-brand-charcoal"}`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>Laundry pickup</span>
            </button>
          </div>

          {submitSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold">Enquiry Registered Successfully!</h3>
              <p className="text-xs max-w-sm mx-auto">
                Thank you! Your lead has been queued directly onto our operations dashboard queue (Canopy Nexus). One of our managers will review it and contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name" 
                    className="w-full h-11 border border-zinc-200 rounded px-4 text-sm focus:outline-none focus:border-brand-forest transition-colors bg-brand-mist/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">Phone Number (Lagos/WhatsApp)</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +234 800 000 0000" 
                    className="w-full h-11 border border-zinc-200 rounded px-4 text-sm focus:outline-none focus:border-brand-forest transition-colors bg-brand-mist/20"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@domain.com" 
                  className="w-full h-11 border border-zinc-200 rounded px-4 text-sm focus:outline-none focus:border-brand-forest transition-colors bg-brand-mist/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">Your message</label>
                <textarea 
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your requirements (event date, preferred dish, pickup location)" 
                  className="w-full border border-zinc-200 rounded p-4 text-sm focus:outline-none focus:border-brand-forest transition-colors bg-brand-mist/20 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 bg-brand-forest text-white text-sm font-bold rounded hover:bg-brand-forest-light transition-all flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? "Queueing lead..." : "Submit Enquiry"}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-forest mb-4 font-bold">What Our Guests Say</h2>
          <p className="text-brand-charcoal/60 text-sm md:text-base">
            Read real feedback from elite clients who regularly patronize The Hall, The Table, and The Press.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white p-8 rounded-lg shadow-sm border border-zinc-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-1 text-brand-gold mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-gold" />
                  ))}
                  {[...Array(5 - t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-zinc-200" />
                  ))}
                </div>
                <p className="text-sm italic text-brand-charcoal/80 leading-relaxed mb-6">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>
              <div className="flex items-center space-x-3.5 pt-4 border-t border-zinc-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={t.image_url} 
                  alt={t.author_name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-brand-charcoal">{t.author_name}</h4>
                  <span className="text-[10px] text-brand-charcoal/40 uppercase tracking-widest">Verified Customer</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CONFIGURATION PREVIEW: COMING SOON UNITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-200/60 pt-24">
        <div className="flex flex-col md:flex-row items-start justify-between mb-16">
          <div className="max-w-xl mb-6 md:mb-0">
            <div className="inline-flex items-center space-x-1.5 bg-brand-forest/10 border border-brand-forest/20 rounded-full px-3 py-1 mb-3 text-xs text-brand-forest font-bold">
              <Bell className="w-3.5 h-3.5" />
              <span>CONFIGURATION SCALING</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-brand-forest">Expanding the Court</h2>
            <p className="text-brand-charcoal/60 text-sm mt-3 leading-relaxed">
              Our core database architecture is structured dynamically. The following upcoming business units are configured as system-ready leaves, waiting to be enabled on the storefront and operations dashboard simply via metadata toggles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {comingSoon.map(unit => (
            <div 
              key={unit.id} 
              className="flex flex-col bg-white rounded-xl shadow-md border border-zinc-200/60 overflow-hidden hover-lift hover:border-brand-forest/20 transition-all duration-300 opacity-80 hover:opacity-100"
            >
              <div className="h-56 bg-zinc-900 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={
                    unit.image_url ||
                    (unit.name === "The Yard"
                      ? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800"
                      : unit.name === "The Stay"
                      ? "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
                      : "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800")
                  }
                  alt={unit.name} 
                  className="w-full h-full object-cover opacity-80 grayscale-[30%]"
                />
                <div className="absolute top-4 left-4 bg-brand-forest text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded">
                  {unit.name.split(" ")[1] || unit.name}
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-brand-forest">{unit.name}</h3>
                  <p className="text-sm text-brand-charcoal/70 leading-relaxed">{unit.description}</p>
                </div>
                
                <div className="pt-6 border-t border-zinc-100 mt-6 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-brand-charcoal/40 font-bold uppercase">EXPECTED LAUNCH</span>
                  <span className="bg-brand-forest/10 text-brand-forest text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                    {unit.expected_launch_label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
