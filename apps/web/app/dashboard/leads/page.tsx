"use client";

import React, { useState, useEffect } from "react";
import { getPublicEnquiries } from "@/lib/db";
import { Inbox, Calendar, Phone, Mail, Sparkles, Utensils, Shirt, CheckCircle, Info, ChevronDown, ChevronUp } from "lucide-react";

export default function LeadsQueue() {
  const [leads, setLeads] = useState<any[]>([]);
  const [processedLeads, setProcessedLeads] = useState<Record<string, boolean>>({});
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const enqs = await getPublicEnquiries();
      setLeads(enqs);
    }
    loadData();
  }, []);

  const toggleLeadProcessed = (id: string) => {
    setProcessedLeads(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleExpand = (id: string) => {
    setExpandedLeadId(prev => prev === id ? null : id);
  };

  const getBUBadgeColor = (type: string) => {
    switch (type) {
      case "event_enquiry":
        return "bg-brand-gold/15 text-brand-charcoal";
      case "eatery_order":
        return "bg-brand-terracotta/15 text-brand-terracotta";
      case "laundry_pickup":
        return "bg-brand-slate/15 text-brand-slate";
      default:
        return "bg-zinc-100 text-zinc-600";
    }
  };

  const getBUBadgeLabel = (type: string) => {
    switch (type) {
      case "event_enquiry":
        return "The Hall";
      case "eatery_order":
        return "The Table";
      case "laundry_pickup":
        return "The Press";
      default:
        return "General Office";
    }
  };

  const getBUIcon = (type: string) => {
    switch (type) {
      case "event_enquiry":
        return <Sparkles className="w-3.5 h-3.5 mr-1" />;
      case "eatery_order":
        return <Utensils className="w-3.5 h-3.5 mr-1" />;
      case "laundry_pickup":
        return <Shirt className="w-3.5 h-3.5 mr-1" />;
      default:
        return <Info className="w-3.5 h-3.5 mr-1" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/60">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-forest">Inquiry Leads Queue</h1>
          <p className="text-xs text-brand-charcoal/60">Manage incoming lead submissions from the Iroko Court public storefront.</p>
        </div>
        <span className="bg-brand-forest text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap inline-flex items-center justify-center h-fit self-start sm:self-center">
          {leads.filter(l => !processedLeads[l.id]).length} Active Leads
        </span>
      </div>

      {/* Leads Table / List */}
      <div className="bg-white border border-zinc-200/60 rounded-xl shadow-sm overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center italic text-brand-charcoal/40 flex flex-col items-center justify-center space-y-3">
            <Inbox className="w-10 h-10 text-zinc-300" />
            <span>No leads in the queue yet. Submissions on the storefront will appear here instantly!</span>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {leads.map(lead => {
              const isProcessed = processedLeads[lead.id];
              const isExpanded = expandedLeadId === lead.id;
              
              return (
                <div key={lead.id} className={`p-6 transition-colors ${isProcessed ? "bg-zinc-50/50 opacity-60" : "hover:bg-zinc-50/30"}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Customer Info */}
                    <div className="space-y-1.5 flex-grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-base font-bold text-brand-forest">{lead.full_name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${getBUBadgeColor(lead.type)}`}>
                          {getBUIcon(lead.type)}
                          {getBUBadgeLabel(lead.type)}
                        </span>
                        {isProcessed && (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded flex items-center">
                            <CheckCircle className="w-3 h-3 mr-0.5" />
                            Processed
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-brand-charcoal/60">
                        <span className="flex items-center">
                          <Phone className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
                          {lead.phone}
                        </span>
                        <span className="flex items-center">
                          <Mail className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
                          {lead.email}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
                          {new Date(lead.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 shrink-0">
                      <button
                        onClick={() => toggleExpand(lead.id)}
                        className="h-9 px-3 rounded border border-zinc-200 text-xs font-semibold hover:bg-zinc-50 flex items-center space-x-1"
                      >
                        <span>Details</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => toggleLeadProcessed(lead.id)}
                        className={`h-9 px-4 rounded text-xs font-bold transition-all ${isProcessed ? "bg-zinc-200 text-zinc-600" : "bg-brand-forest text-white hover:bg-brand-forest-light"}`}
                      >
                        {isProcessed ? "Mark Active" : "Archive / Done"}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Custom Details Card */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-zinc-100 text-xs space-y-4">
                      {lead.message && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/40 block">Message Content</span>
                          <p className="text-brand-charcoal/80 bg-zinc-50 p-3 rounded leading-relaxed italic border border-zinc-100">
                            &ldquo;{lead.message}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Custom metadata details from calculators */}
                      {lead.metadata && Object.keys(lead.metadata).length > 0 && (
                        <div className="bg-brand-cream/40 border border-brand-gold/10 rounded p-4 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">
                            Calculator Quotation Details
                          </span>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1 text-xs">
                            {lead.metadata.package_name && (
                              <div>
                                <span className="opacity-50 block">Selected Package</span>
                                <span className="font-semibold text-brand-forest">{lead.metadata.package_name}</span>
                              </div>
                            )}
                            {lead.metadata.guest_count && (
                              <div>
                                <span className="opacity-50 block">Guests Configured</span>
                                <span className="font-semibold text-brand-forest">{lead.metadata.guest_count} Guests</span>
                              </div>
                            )}
                            {lead.metadata.calculated_total_estimate && (
                              <div>
                                <span className="opacity-50 block">Total Est. Quote</span>
                                <span className="font-semibold text-brand-gold font-serif">₦{lead.metadata.calculated_total_estimate.toLocaleString()}</span>
                              </div>
                            )}
                            {lead.metadata.calculated_deposit_required && (
                              <div>
                                <span className="opacity-50 block">Required Deposit (50%)</span>
                                <span className="font-semibold text-brand-gold font-serif">₦{lead.metadata.calculated_deposit_required.toLocaleString()}</span>
                              </div>
                            )}
                            {lead.metadata.pickup_address && (
                              <div className="col-span-2">
                                <span className="opacity-50 block">Pickup Address</span>
                                <span className="font-semibold text-brand-forest">{lead.metadata.pickup_address}</span>
                              </div>
                            )}
                            {lead.metadata.shirt_quantity !== undefined && lead.metadata.native_quantity !== undefined && (
                              <div>
                                <span className="opacity-50 block">Item Count</span>
                                <span className="font-semibold text-brand-forest">
                                  {lead.metadata.shirt_quantity} Shirts, {lead.metadata.native_quantity} Natives
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
