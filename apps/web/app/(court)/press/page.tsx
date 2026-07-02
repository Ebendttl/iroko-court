"use client";

import React, { useState, useEffect } from "react";
import { Shirt, Clock, Shield, Sparkles, Send, Calculator } from "lucide-react";
import { getLaundryServices, createPublicEnquiry } from "@/lib/db";
import { PublicEnquiryInput } from "@iroko-court/shared";

export default function PressStorefront() {
  const [services, setServices] = useState<any[]>([]);
  
  // Calculator quantities
  const [shirtQty, setShirtQty] = useState(0);
  const [nativeQty, setNativeQty] = useState(0);
  const [expressService, setExpressService] = useState(false);

  // Lead State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const svs = await getLaundryServices();
      setServices(svs);
    }
    loadData();
  }, []);

  // Estimator Calculations
  const shirtCost = shirtQty * 1500; // ₦1,500 per shirt
  const nativeCost = nativeQty * 3500; // ₦3,500 per native Senator suit
  const expressSurcharge = expressService ? 5000 : 0; // ₦5,000 flat same-day
  const totalEstimate = shirtCost + nativeCost + expressSurcharge;

  const handleSchedulerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    setIsSubmitting(true);

    const messageContent = `Laundry Pickup Request. Shirts: ${shirtQty}, Natives/Senator: ${nativeQty}. Service Speed: ${expressService ? "EXPRESS SAME-DAY" : "Standard 24-48h"}. Pickup Address: ${pickupAddress}. Calculated Estimate: ₦${totalEstimate.toLocaleString()}`;

    const data: PublicEnquiryInput = {
      business_unit_id: "c3333333-3333-3333-3333-333333333333", // The Press BU ID
      type: "laundry_pickup",
      full_name: fullName,
      email,
      phone,
      message: messageContent,
      metadata: {
        shirt_quantity: shirtQty,
        native_quantity: nativeQty,
        express_delivery: expressService,
        pickup_address: pickupAddress,
        calculated_estimate: totalEstimate
      }
    };

    try {
      await createPublicEnquiry(data);
      setSubmitSuccess(true);
      setFullName("");
      setEmail("");
      setPhone("");
      setPickupAddress("");
      setShirtQty(0);
      setNativeQty(0);
      setExpressService(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* 1. HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-slate/10 text-brand-slate mb-2">
          <Shirt className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-forest">The Press Laundry & Dry Cleaning</h1>
        <p className="text-brand-charcoal/60 text-sm md:text-base leading-relaxed">
          Premium fabric care in Lagos. Professional dry cleaning, custom native wear starching, and express 6-hour turnaround to suit the schedules of elite executives.
        </p>
      </div>

      {/* 2. SERVICES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map(svc => (
          <div key={svc.id} className="bg-white rounded-lg shadow-sm border border-zinc-100 p-6 flex flex-col justify-between hover-lift transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded bg-brand-slate/10 text-brand-slate flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-brand-forest">{svc.name}</h3>
              <p className="text-xs text-brand-charcoal/60 leading-relaxed">{svc.description}</p>
            </div>
            
            <div className="pt-6 border-t border-zinc-50 mt-6 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-brand-charcoal/40 block font-semibold">TURNAROUND</span>
                <span className="text-xs font-bold text-brand-forest flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-brand-slate" />
                  <span>{svc.turnaround_time}</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-brand-charcoal/40 block font-semibold">EST. PRICE</span>
                <span className="text-brand-slate font-serif font-bold text-sm">₦{svc.price_from.toLocaleString()}+</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. CALCULATOR & SCHEDULER SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden">
        {/* Calculator Left */}
        <div className="p-8 sm:p-12 lg:col-span-7 space-y-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-brand-slate font-bold text-xs uppercase mb-2">
              <Calculator className="w-4 h-4" />
              <span>Interactive Pricing Estimator</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-forest">Estimate Laundry Charge</h2>
            <p className="text-xs text-brand-charcoal/60">Configure your order details, toggle express turnaround, and compute your total cost estimation.</p>
          </div>

          <div className="space-y-6">
            {/* Quantity Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">Standard Shirts (₦1,500 / item)</label>
                <div className="flex items-center space-x-3">
                  <button 
                    type="button" 
                    onClick={() => setShirtQty(Math.max(0, shirtQty - 1))}
                    className="w-10 h-10 border border-zinc-200 rounded flex items-center justify-center text-sm hover:bg-zinc-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{shirtQty}</span>
                  <button 
                    type="button" 
                    onClick={() => setShirtQty(shirtQty + 1)}
                    className="w-10 h-10 border border-zinc-200 rounded flex items-center justify-center text-sm hover:bg-zinc-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">Native Senator/Agbada Wears (₦3,500 / item)</label>
                <div className="flex items-center space-x-3">
                  <button 
                    type="button" 
                    onClick={() => setNativeQty(Math.max(0, nativeQty - 1))}
                    className="w-10 h-10 border border-zinc-200 rounded flex items-center justify-center text-sm hover:bg-zinc-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{nativeQty}</span>
                  <button 
                    type="button" 
                    onClick={() => setNativeQty(nativeQty + 1)}
                    className="w-10 h-10 border border-zinc-200 rounded flex items-center justify-center text-sm hover:bg-zinc-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Express Same-Day Toggle */}
            <div className="bg-brand-mist/20 border border-zinc-200/50 p-4 rounded-lg flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-brand-forest">Express Turnaround (6-Hour Same-Day)</span>
                <p className="text-[10px] text-brand-charcoal/50">Adds a flat charge of ₦5,000 to the estimate.</p>
              </div>
              <input 
                type="checkbox" 
                checked={expressService}
                onChange={(e) => setExpressService(e.target.checked)}
                className="w-4 h-4 text-brand-slate focus:ring-brand-slate rounded border-zinc-300 accent-brand-slate cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Lead/Schedule Form Right */}
        <div className="lg:col-span-5 bg-brand-forest text-brand-cream p-8 sm:p-12 flex flex-col justify-between space-y-8 border-l border-white/10">
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold">Estimated Cost Details</h3>
            
            <div className="space-y-4 text-sm border-b border-white/10 pb-6">
              {shirtQty > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="opacity-75">Shirts ({shirtQty} items)</span>
                  <span>₦{shirtCost.toLocaleString()}</span>
                </div>
              )}
              {nativeQty > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="opacity-75">Natives ({nativeQty} items)</span>
                  <span>₦{nativeCost.toLocaleString()}</span>
                </div>
              )}
              {expressService && (
                <div className="flex justify-between text-xs">
                  <span className="opacity-75">Express same-day surcharge</span>
                  <span>₦{expressSurcharge.toLocaleString()}</span>
                </div>
              )}
              {shirtQty === 0 && nativeQty === 0 && (
                <div className="text-xs opacity-50 italic text-center py-4">
                  Add items to display pricing details.
                </div>
              )}
            </div>

            <div className="flex justify-between items-baseline pt-2">
              <span className="text-xs uppercase font-bold text-brand-gold-light">Calculated Total</span>
              <span className="font-serif text-2xl font-bold text-white">₦{totalEstimate.toLocaleString()}</span>
            </div>
          </div>

          {submitSuccess ? (
            <div className="bg-white/10 border border-white/15 p-4 rounded text-center text-xs space-y-2">
              <span className="font-bold text-brand-gold-light">Pickup Lead Submitted!</span>
              <p className="opacity-75">The dispatch details have been sent to the desk. We will call to coordinate pickup.</p>
            </div>
          ) : (
            <form onSubmit={handleSchedulerSubmit} className="space-y-4 pt-4 border-t border-white/10">
              <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold block">Request Home Pickup</span>
              <div className="space-y-3">
                <input 
                  type="text" 
                  required 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full h-10 rounded bg-white/5 border border-white/15 px-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-brand-gold"
                />
                <input 
                  type="tel" 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full h-10 rounded bg-white/5 border border-white/15 px-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-brand-gold"
                />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full h-10 rounded bg-white/5 border border-white/15 px-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-brand-gold"
                />
                <input 
                  type="text" 
                  required 
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Lagos pickup Address"
                  className="w-full h-10 rounded bg-white/5 border border-white/15 px-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || (shirtQty === 0 && nativeQty === 0)}
                className="w-full h-10 bg-brand-gold hover:bg-brand-gold-light text-brand-charcoal font-bold text-xs rounded transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? "Submitting..." : "Schedule Pickup"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
