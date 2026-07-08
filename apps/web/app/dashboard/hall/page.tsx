"use client";

import React, { useState, useEffect } from "react";
import { getEventBookings, updateEventBookingStatus, createEventBooking, getEventPackages } from "@/lib/db";
import { Sparkles, Calendar, User, DollarSign, PlusCircle, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";
import { EventBookingInput } from "@iroko-court/shared";

export default function NexusHall() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [packageId, setPackageId] = useState("");
  const [totalQuoted, setTotalQuoted] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [status, setStatus] = useState<"inquiry" | "confirmed" | "completed">("inquiry");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    const bkgs = await getEventBookings();
    const pkgs = await getEventPackages();
    setBookings(bkgs);
    setPackages(pkgs);
    if (pkgs.length > 0 && !packageId) {
      setPackageId(pkgs[0].id);
      setTotalQuoted(pkgs[0].price_from.toString());
      setDepositAmount((pkgs[0].price_from * 0.5).toString());
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update quoted amount automatically when package is selected
  useEffect(() => {
    if (packageId && packages.length > 0) {
      const pkg = packages.find(p => p.id === packageId);
      if (pkg) {
        setTotalQuoted(pkg.price_from.toString());
        setDepositAmount((pkg.price_from * 0.5).toString());
      }
    }
  }, [packageId, packages]);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientContact || !eventDate || !totalQuoted) return;

    setIsSubmitting(true);
    
    const input: EventBookingInput = {
      business_unit_id: "a1111111-1111-1111-1111-111111111111", // The Hall
      client_name: clientName,
      client_contact: clientContact,
      event_date: eventDate,
      package_id: packageId || null,
      hall_name: "The Grand Ballroom",
      total_quoted: parseFloat(totalQuoted),
      deposit_amount: parseFloat(depositAmount) || 0,
      status
    };

    try {
      await createEventBooking(input);
      setShowAddForm(false);
      setClientName("");
      setClientContact("");
      setEventDate("");
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: any) => {
    const res = await updateEventBookingStatus(id, newStatus);
    if (res) {
      await loadData();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded font-bold uppercase">Completed</span>;
      case "confirmed":
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded font-bold uppercase">Confirmed</span>;
      case "cancelled":
        return <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-1 rounded font-bold uppercase">Cancelled</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded font-bold uppercase">Inquiry</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/60">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-forest">The Hall Bookings Manager</h1>
          <p className="text-xs text-brand-charcoal/60">Manage bookings, confirm client dates, and complete events to sync directly to the ledger.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="h-10 px-4 rounded bg-brand-forest text-white text-xs font-bold hover:bg-brand-forest-light transition-all flex items-center justify-center space-x-1.5 whitespace-nowrap w-fit shrink-0 self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span>New Booking</span>
        </button>
      </div>

      {/* Add Booking Modal/Form */}
      {showAddForm && (
        <form onSubmit={handleCreateBooking} className="bg-white border border-zinc-200/60 rounded-xl p-6 shadow-sm max-w-2xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-brand-forest">Add Event Reservation</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Client Name</label>
              <input 
                type="text" 
                required 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Chief Adeleke"
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Client Contact</label>
              <input 
                type="text" 
                required 
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                placeholder="Phone / Email"
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Event Date</label>
              <input 
                type="date" 
                required 
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Package Option</label>
              <select 
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              >
                {packages.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Quoted Price (NGN)</label>
              <input 
                type="number" 
                required 
                value={totalQuoted}
                onChange={(e) => setTotalQuoted(e.target.value)}
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Deposit Paid (NGN)</label>
              <input 
                type="number" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Initial Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              >
                <option value="inquiry">Inquiry</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="h-9 px-4 rounded border border-zinc-200 text-xs font-semibold hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="h-9 px-5 rounded bg-brand-forest text-white text-xs font-bold hover:bg-brand-forest-light"
            >
              Save Booking
            </button>
          </div>
        </form>
      )}

      {/* Bookings Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map(booking => {
          const pkg = packages.find(p => p.id === booking.package_id);
          return (
            <div key={booking.id} className="bg-white border border-zinc-200/60 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-zinc-300 transition-colors">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif font-bold text-lg text-brand-forest leading-tight">{booking.client_name}</h3>
                  {getStatusBadge(booking.status)}
                </div>
                
                <div className="space-y-1.5 text-xs text-brand-charcoal/60">
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-2 text-zinc-400" />
                    <span>Event Date: <strong>{booking.event_date}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-3.5 h-3.5 mr-2 text-zinc-400" />
                    <span>Contact: {booking.client_contact}</span>
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-2 text-brand-gold" />
                    <span>Package: {pkg ? pkg.name : "Custom Hall Booking"}</span>
                  </div>
                </div>

                <div className="bg-zinc-50 p-3 rounded border border-zinc-100 flex justify-between text-xs font-serif font-bold">
                  <div>
                    <span className="text-[9px] font-sans text-brand-charcoal/40 uppercase block leading-none mb-1">Total Quote</span>
                    <span className="text-brand-forest">₦{Number(booking.total_quoted).toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-sans text-brand-charcoal/40 uppercase block leading-none mb-1">Deposit Paid</span>
                    <span className="text-brand-gold">₦{Number(booking.deposit_amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Options */}
              {booking.status !== "completed" && booking.status !== "cancelled" && (
                <div className="border-t border-zinc-100 pt-3 flex items-center justify-between gap-2">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-400">Actions:</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                      className="h-8 px-2.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(booking.id, "completed")}
                      className="h-8 px-2.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold flex items-center"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Complete
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                      className="h-8 px-2.5 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 text-[10px] font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Completed Status Notice */}
              {booking.status === "completed" && (
                <div className="border-t border-zinc-100 pt-3 flex items-center justify-center text-[10px] text-emerald-600 font-bold uppercase bg-emerald-50/20 py-1 rounded">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Synced to Ledger (Income)
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
