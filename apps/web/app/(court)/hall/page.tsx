"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, Users, Shield, Clock, Calculator, ArrowRight, Check, Send } from "lucide-react";
import { getEventPackages, createPublicEnquiry } from "@/lib/db";
import { PublicEnquiryInput } from "@iroko-court/shared";

export default function HallStorefront() {
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPkgId, setSelectedPkgId] = useState("");
  const [additionalHours, setAdditionalHours] = useState(0);
  const [requirePremiumAV, setRequirePremiumAV] = useState(false);
  const [requireExecutiveSecurity, setRequireExecutiveSecurity] = useState(false);
  const [guestCount, setGuestCount] = useState(200);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const pkgs = await getEventPackages();
      setPackages(pkgs);
      if (pkgs.length > 0) {
        setSelectedPkgId(pkgs[0].id);
      }
    }
    loadData();
  }, []);

  const activePackage = packages.find(p => p.id === selectedPkgId);

  // Quote Calculator Logic
  const basePrice = activePackage ? Number(activePackage.price_from) : 0;
  const extraHourCost = additionalHours * 75000; // ₦75,000 per hour
  const premiumAVCost = requirePremiumAV ? 150000 : 0; // ₦150,000 flat
  const securityCost = requireExecutiveSecurity ? 80000 : 0; // ₦80,000 flat
  
  // Custom capacity surcharge if guest count exceeds standard package base capacity
  const maxCapacity = activePackage ? activePackage.capacity : 500;
  const capacitySurcharge = guestCount > maxCapacity ? (guestCount - maxCapacity) * 1500 : 0;

  const totalEstimate = basePrice + extraHourCost + premiumAVCost + securityCost + capacitySurcharge;
  const requiredDeposit = totalEstimate * 0.50; // 50% deposit policy

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !eventDate) return;

    setIsSubmitting(true);
    
    const calculatedQuoteMetadata = {
      package_name: activePackage?.name,
      hall_name: activePackage?.hall_name,
      event_date: eventDate,
      guest_count: guestCount,
      additional_hours: additionalHours,
      premium_av: requirePremiumAV,
      executive_security: requireExecutiveSecurity,
      calculated_total_estimate: totalEstimate,
      calculated_deposit_required: requiredDeposit
    };

    const data: PublicEnquiryInput = {
      business_unit_id: "a1111111-1111-1111-1111-111111111111", // The Hall BU ID
      type: "event_enquiry",
      full_name: fullName,
      email,
      phone,
      message: `Enquiry submitted for ${activePackage?.name} scheduled on ${eventDate}. Estimated Guest Count: ${guestCount}. Calculated Estimate: ₦${totalEstimate.toLocaleString()}.`,
      metadata: calculatedQuoteMetadata
    };

    try {
      await createPublicEnquiry(data);
      setSubmitSuccess(true);
      setFullName("");
      setEmail("");
      setPhone("");
      setEventDate("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* 1. HEADER HERO */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-gold/10 text-brand-gold mb-2">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-forest">The Hall at Iroko Court</h1>
        <p className="text-brand-charcoal/60 text-sm md:text-base leading-relaxed">
          Where grandeur meets flawless operational execution. Discover our luxury wedding, corporate conference, and gala packages tailored to make your milestones unforgettable.
        </p>
      </div>

      {/* 2. PACKAGES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map(pkg => (
          <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="h-48 bg-zinc-900 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pkg.image_url} alt={pkg.name} className="w-full h-full object-cover opacity-95" />
                <div className="absolute bottom-4 left-4 bg-brand-forest text-brand-cream text-xs px-3 py-1 rounded">
                  {pkg.hall_name}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="font-serif text-xl font-bold text-brand-forest">{pkg.name}</h3>
                <div className="flex items-center space-x-4 text-xs text-brand-charcoal/60">
                  <span className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Up to {pkg.capacity} guests</span>
                  </span>
                </div>
                <div className="pt-4 border-t border-zinc-50 space-y-2">
                  <span className="text-[10px] font-bold text-brand-charcoal/40 uppercase block tracking-wider">What is included:</span>
                  <ul className="space-y-2">
                    {pkg.inclusions.map((inc: string, i: number) => (
                      <li key={i} className="flex items-start text-xs text-brand-charcoal/80 space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-zinc-50 bg-brand-mist/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-brand-charcoal/40 block font-semibold">PRICING FROM</span>
                <span className="text-brand-gold font-serif font-bold text-lg">₦{pkg.price_from.toLocaleString()}</span>
              </div>
              <button 
                onClick={() => {
                  setSelectedPkgId(pkg.id);
                  const calculatorSec = document.getElementById("calculator");
                  calculatorSec?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-xs font-bold bg-brand-forest text-white h-9 px-4 rounded hover:bg-brand-forest-light transition-all"
              >
                Calculate Quote
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. CALCULATOR & BOOKING SPLIT */}
      <div id="calculator" className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden scroll-mt-24">
        {/* Calculator Left */}
        <div className="p-8 sm:p-12 lg:col-span-7 space-y-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-brand-gold font-bold text-xs uppercase mb-2">
              <Calculator className="w-4 h-4" />
              <span>Interactive Estimator</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-forest">Customize Your Hall Booking</h2>
            <p className="text-xs text-brand-charcoal/60">Select your package, toggle add-ons, and estimate your total setup cost in real-time.</p>
          </div>

          <div className="space-y-6">
            {/* Choose Package */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">Select Base Package</label>
              <select 
                value={selectedPkgId}
                onChange={(e) => setSelectedPkgId(e.target.value)}
                className="w-full h-11 border border-zinc-200 rounded px-4 text-sm focus:outline-none focus:border-brand-forest transition-colors bg-brand-mist/20 font-medium"
              >
                {packages.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Max {p.capacity} Guests)</option>
                ))}
              </select>
            </div>

            {/* Guest Count Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">Estimated Guest Count</label>
                <span className="font-bold text-brand-gold">{guestCount} Guests</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="1000" 
                step="50"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-brand-gold"
              />
              {activePackage && guestCount > activePackage.capacity && (
                <p className="text-[10px] text-brand-terracotta font-semibold">
                  Note: Exceeds package capacity. A surcharge of ₦1,500 per additional guest will apply.
                </p>
              )}
            </div>

            {/* Extra Hours Selector */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">Additional Rental Hours</label>
                <span className="font-bold text-brand-gold">+{additionalHours} Hours</span>
              </div>
              <select 
                value={additionalHours}
                onChange={(e) => setAdditionalHours(Number(e.target.value))}
                className="w-full h-11 border border-zinc-200 rounded px-4 text-sm focus:outline-none focus:border-brand-forest transition-colors bg-brand-mist/20"
              >
                <option value={0}>Standard Rental Time (Included)</option>
                <option value={1}>1 Extra Hour (+₦75,000)</option>
                <option value={2}>2 Extra Hours (+₦150,000)</option>
                <option value={3}>3 Extra Hours (+₦225,000)</option>
                <option value={4}>4 Extra Hours (+₦300,000)</option>
              </select>
            </div>

            {/* Extras Toggles */}
            <div className="space-y-3 pt-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60 block">Optional Add-ons</label>
              
              <label className="flex items-center space-x-3 text-sm text-brand-charcoal/80 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={requirePremiumAV}
                  onChange={(e) => setRequirePremiumAV(e.target.checked)}
                  className="w-4 h-4 text-brand-forest focus:ring-brand-forest rounded border-zinc-300 accent-brand-forest"
                />
                <span>Premium Line-Array Sound & Automated Intelligent Lighting (+₦150,000)</span>
              </label>

              <label className="flex items-center space-x-3 text-sm text-brand-charcoal/80 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={requireExecutiveSecurity}
                  onChange={(e) => setRequireExecutiveSecurity(e.target.checked)}
                  className="w-4 h-4 text-brand-forest focus:ring-brand-forest rounded border-zinc-300 accent-brand-forest"
                />
                <span>Executive Bouncer Security detail (5 armed guards + crowd control) (+₦80,000)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Pricing Summary & Lead Form */}
        <div className="lg:col-span-5 bg-brand-forest text-brand-cream p-8 sm:p-12 flex flex-col justify-between space-y-8 border-l border-white/10">
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold">Booking Quotation</h3>
            
            <div className="space-y-4 text-sm border-b border-white/10 pb-6">
              <div className="flex justify-between">
                <span className="opacity-75">{activePackage?.name || "Base Hall Rental"}</span>
                <span className="font-serif font-bold">₦{basePrice.toLocaleString()}</span>
              </div>
              {additionalHours > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="opacity-75">Additional Hours ({additionalHours}h)</span>
                  <span>₦{extraHourCost.toLocaleString()}</span>
                </div>
              )}
              {requirePremiumAV && (
                <div className="flex justify-between text-xs">
                  <span className="opacity-75">Premium Sound & Intelligent AV</span>
                  <span>₦{premiumAVCost.toLocaleString()}</span>
                </div>
              )}
              {requireExecutiveSecurity && (
                <div className="flex justify-between text-xs">
                  <span className="opacity-75">Executive Security details</span>
                  <span>₦{securityCost.toLocaleString()}</span>
                </div>
              )}
              {capacitySurcharge > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="opacity-75">Guest Surcharge ({guestCount - maxCapacity} guests)</span>
                  <span>₦{capacitySurcharge.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase font-bold text-brand-gold-light">Estimated Total</span>
                <span className="font-serif text-2xl font-bold text-white">₦{totalEstimate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] opacity-75">Required Deposit (50%)</span>
                <span className="text-xs font-semibold text-brand-gold-light">₦{requiredDeposit.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {submitSuccess ? (
            <div className="bg-white/10 border border-white/15 p-4 rounded text-center text-xs space-y-2">
              <span className="font-bold text-brand-gold-light">Lead Saved in Nexus Queue!</span>
              <p className="opacity-75">One of our managers will verify availability for {eventDate} and follow up.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitEnquiry} className="space-y-4 pt-4 border-t border-white/10">
              <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold block">Save Quote & Check Availability</span>
              <div className="space-y-3">
                <input 
                  type="text" 
                  required 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full h-10 rounded bg-white/5 border border-white/15 px-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-brand-gold"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone/WhatsApp"
                    className="w-full h-10 rounded bg-white/5 border border-white/15 px-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-brand-gold"
                  />
                  <input 
                    type="date" 
                    required 
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full h-10 rounded bg-white/5 border border-white/15 px-3 text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full h-10 rounded bg-white/5 border border-white/15 px-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-10 bg-brand-gold hover:bg-brand-gold-light text-brand-charcoal font-bold text-xs rounded transition-all flex items-center justify-center space-x-1.5"
              >
                <span>{isSubmitting ? "Queueing..." : "Submit Enquiry"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 4. TERMS AND POLICIES SECTION */}
      <div className="bg-brand-mist/30 border border-zinc-200/50 p-8 sm:p-12 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-bold text-brand-forest">Event Center Policies</h3>
          <div className="space-y-3 text-xs text-brand-charcoal/70 leading-relaxed">
            <p><strong>Deposit Policy:</strong> A 50% non-refundable deposit is required to secure the hall booking date. The remaining 50% balance must be settled 14 days prior to event date.</p>
            <p><strong>Cancellation:</strong> Cancellations made more than 30 days prior forfeit the deposit but carry no further fees. Cancellations under 14 days require 100% payment.</p>
          </div>
        </div>
        <div className="space-y-4 border-t md:border-t-0 md:border-l border-zinc-200/60 pt-6 md:pt-0 md:pl-8">
          <h3 className="font-serif text-xl font-bold text-brand-forest">Rules & Damaging Fees</h3>
          <div className="space-y-3 text-xs text-brand-charcoal/70 leading-relaxed">
            <p><strong>Refundable Caution Deposit:</strong> A caution deposit of ₦100,000 is required alongside the final balance and will be refunded within 48 hours post-event if no damages occur.</p>
            <p><strong>Inclusions & Staffing:</strong> Standard booking includes power backup generators, AC, site safety officers, cleaning staff, and site security personnel.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
