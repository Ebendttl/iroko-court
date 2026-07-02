"use client";

import React, { useState } from "react";
import { Info, Mail, Phone, MapPin, Send } from "lucide-react";
import { createPublicEnquiry } from "@/lib/db";
import { PublicEnquiryInput } from "@iroko-court/shared";

export default function ContactStorefront() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"event_enquiry" | "laundry_pickup" | "eatery_order" | "contact">("contact");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !message) return;

    setIsSubmitting(true);

    let unitId = "";
    if (type === "event_enquiry") unitId = "a1111111-1111-1111-1111-111111111111";
    if (type === "eatery_order") unitId = "b2222222-2222-2222-2222-222222222222";
    if (type === "laundry_pickup") unitId = "c3333333-3333-3333-3333-333333333333";

    const data: PublicEnquiryInput = {
      business_unit_id: unitId || null,
      type,
      full_name: fullName,
      email,
      phone,
      message,
      metadata: {
        submitted_via: "storefront_contact_page",
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
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-forest">Contact & Enquiries</h1>
        <p className="text-brand-charcoal/60 text-sm md:text-base leading-relaxed">
          Have questions about pricing, catering, or logistics? Get in touch. Submitting this form deposits a lead ticket directly onto the manager queue.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
        {/* Info Left (5 cols) */}
        <div className="lg:col-span-5 space-y-8 bg-brand-forest text-brand-cream p-8 sm:p-12 rounded-xl flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-serif text-2xl font-bold text-white">Lagos Head Office</h3>
            <p className="text-xs opacity-70 leading-relaxed">
              We are located in the secure and elite neighborhood of Ikeja GRA. Stop by to inspect the event hall or try the eatery menu live.
            </p>
            
            <div className="space-y-4 pt-4 text-xs">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-brand-gold-light shrink-0" />
                <span>24 Iroko Court Street, Ikeja GRA, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand-gold-light shrink-0" />
                <span>+234 812 345 6789 | +234 700 IROKO COURT</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-brand-gold-light shrink-0" />
                <span>enquiries@irokocourt.com</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-[10px] opacity-50 uppercase tracking-widest font-semibold">
            Iroko Court Limited &copy; {new Date().getFullYear()}
          </div>
        </div>

        {/* Form Right (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-zinc-100 rounded-xl shadow-md p-8 sm:p-10">
          {submitSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold">Inquiry Lodged</h3>
              <p className="text-xs max-w-sm mx-auto">
                Thank you for contacting us. Your message has been routed to our staff queue in the Canopy Nexus dashboard. We will be in touch shortly.
              </p>
              <button 
                onClick={() => setSubmitSuccess(false)}
                className="text-xs text-brand-forest hover:underline font-bold mt-4 block mx-auto"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="font-serif text-xl font-bold text-brand-forest">Submit Lead Ticket</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe" 
                    className="w-full h-11 border border-zinc-200 rounded px-4 text-sm focus:outline-none focus:border-brand-forest transition-colors bg-brand-mist/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">Phone / WhatsApp</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234..." 
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
                  placeholder="john@domain.com" 
                  className="w-full h-11 border border-zinc-200 rounded px-4 text-sm focus:outline-none focus:border-brand-forest transition-colors bg-brand-mist/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">Inquiry Department</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full h-11 border border-zinc-200 rounded px-4 text-sm focus:outline-none focus:border-brand-forest transition-colors bg-brand-mist/20"
                >
                  <option value="contact">General Office Enquiry</option>
                  <option value="event_enquiry">The Hall (Event Center Rentals)</option>
                  <option value="eatery_order">The Table (Reservations & Catering)</option>
                  <option value="laundry_pickup">The Press (Dry Cleaning & Laundry)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">Detailed Message</label>
                <textarea 
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter details about dates, dietary needs, or logistics..." 
                  className="w-full border border-zinc-200 rounded p-4 text-sm focus:outline-none focus:border-brand-forest transition-colors bg-brand-mist/20 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 bg-brand-forest text-white text-sm font-bold rounded hover:bg-brand-forest-light transition-all flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? "Submitting..." : "Send Ticket"}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
