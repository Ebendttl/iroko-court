"use client";

import React, { useState, useEffect } from "react";
import { Utensils, Award, ChefHat, Check, Send, ShoppingBag } from "lucide-react";
import { getMenuItems, createPublicEnquiry } from "@/lib/db";
import { PublicEnquiryInput } from "@iroko-court/shared";

export default function TableStorefront() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  // Lead Order Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [selectedItemName, setSelectedItemName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const items = await getMenuItems();
      setMenuItems(items);
    }
    loadData();
  }, []);

  const categories = ["All", "Starter", "Main", "Drink"];
  
  const filteredItems = activeCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    setIsSubmitting(true);

    const messageContent = selectedItemName 
      ? `Eatery reservation/order request for: "${selectedItemName}". Notes: ${orderNotes}`
      : `Eatery reservation/order request. Notes: ${orderNotes}`;

    const data: PublicEnquiryInput = {
      business_unit_id: "b2222222-2222-2222-2222-222222222222", // The Table BU ID
      type: "eatery_order",
      full_name: fullName,
      email,
      phone,
      message: messageContent,
      metadata: {
        interested_item: selectedItemName || "General Reservation",
        customer_notes: orderNotes
      }
    };

    try {
      await createPublicEnquiry(data);
      setSubmitSuccess(true);
      setFullName("");
      setEmail("");
      setPhone("");
      setOrderNotes("");
      setSelectedItemName("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* 1. HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-terracotta/10 text-brand-terracotta mb-2">
          <Utensils className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-forest">The Table Restaurant</h1>
        <p className="text-brand-charcoal/60 text-sm md:text-base leading-relaxed">
          Savor curated dishes built on the collision of traditional African woodfire spices and modern culinary craft. Order for home delivery or book an exclusive table.
        </p>
      </div>

      {/* 2. SPLIT MENU AND ORDERING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Menu Left (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Category Tabs */}
          <div className="flex border-b border-zinc-100 pb-2 space-x-6 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm font-bold pb-2 border-b-2 transition-colors duration-200 shrink-0 ${activeCategory === cat ? "border-brand-terracotta text-brand-terracotta" : "border-transparent text-brand-charcoal/40 hover:text-brand-charcoal"}`}
              >
                {cat}s
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow-sm border border-zinc-100 overflow-hidden flex flex-col justify-between hover-lift duration-300"
              >
                <div>
                  <div className="h-44 bg-zinc-900 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {item.dietary_tags.map((tag: string, i: number) => (
                        <span key={i} className="bg-brand-forest/90 text-brand-cream text-[9px] font-bold px-2 py-0.5 rounded shadow">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif font-bold text-lg text-brand-forest">{item.name}</h3>
                    <p className="text-xs text-brand-charcoal/60 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-zinc-50 flex items-center justify-between mt-4">
                  <span className="text-brand-terracotta font-serif font-bold text-base">₦{item.price.toLocaleString()}</span>
                  <button
                    onClick={() => {
                      setSelectedItemName(item.name);
                      const formSec = document.getElementById("order-form");
                      formSec?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center text-xs font-bold text-brand-terracotta border border-brand-terracotta/25 hover:bg-brand-terracotta hover:text-white px-3.5 h-8 rounded transition-all"
                  >
                    Order this
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ordering Right (4 cols) */}
        <div id="order-form" className="lg:col-span-4 bg-white border border-zinc-100 rounded-xl shadow-md p-6 sm:p-8 space-y-6 self-start lg:sticky lg:top-24">
          <div>
            <div className="inline-flex items-center space-x-1 text-brand-terracotta font-bold text-[10px] uppercase tracking-wider mb-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Dine-In or Takeaway</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-forest">Reserve & Order</h3>
            <p className="text-xs text-brand-charcoal/60">Submit details to queue your order or reservation lead onto the kitchen dashboard.</p>
          </div>

          {submitSuccess ? (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded p-4 text-center text-xs space-y-2">
              <span className="font-bold">Order Received!</span>
              <p className="opacity-75">Your table booking / meal request has been logged onto Nexus. We will call you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              {selectedItemName && (
                <div className="bg-brand-cream/60 border border-brand-terracotta/20 rounded p-3 text-xs flex justify-between items-center">
                  <div>
                    <span className="opacity-60 block text-[9px] uppercase font-bold text-brand-charcoal/60">Selected Item</span>
                    <span className="font-bold text-brand-forest">{selectedItemName}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setSelectedItemName("")}
                    className="text-brand-terracotta font-bold hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-brand-charcoal/60">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter name" 
                  className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-brand-mist/20 focus:outline-none focus:border-brand-forest"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-brand-charcoal/60">Phone / WhatsApp</label>
                <input 
                  type="tel" 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +234..." 
                  className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-brand-mist/20 focus:outline-none focus:border-brand-forest"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-brand-charcoal/60">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@domain.com" 
                  className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-brand-mist/20 focus:outline-none focus:border-brand-forest"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-brand-charcoal/60">Notes / Table details</label>
                <textarea 
                  rows={3}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Preferred pickup/delivery time, table guest size, or allergy notes..." 
                  className="w-full border border-zinc-200 rounded p-3 text-xs bg-brand-mist/20 focus:outline-none focus:border-brand-forest resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-10 bg-brand-terracotta text-white font-bold text-xs rounded hover:bg-brand-terracotta/90 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>{isSubmitting ? "Sending..." : "Submit Reservation"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
