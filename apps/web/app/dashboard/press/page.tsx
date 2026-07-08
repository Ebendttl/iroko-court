"use client";

import React, { useState, useEffect } from "react";
import { getLaundryOrders, updateLaundryOrderStatus, createLaundryOrder, getLaundryServices } from "@/lib/db";
import { Shirt, Calendar, User, DollarSign, PlusCircle, CheckCircle, Clock, Package } from "lucide-react";
import { LaundryOrderInput } from "@iroko-court/shared";

export default function NexusPress() {
  const [orders, setOrders] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [itemsDescription, setItemsDescription] = useState("");
  const [amountCharged, setAmountCharged] = useState("");
  const [dropOffDate, setDropOffDate] = useState(new Date().toISOString().split("T")[0]);
  const [pickupDate, setPickupDate] = useState("");
  const [status, setStatus] = useState<"received" | "in_progress" | "ready" | "collected">("received");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    const ords = await getLaundryOrders();
    const svcs = await getLaundryServices();
    setOrders(ords);
    setServices(svcs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerContact || !itemsDescription || !amountCharged) return;

    setIsSubmitting(true);
    
    const input: LaundryOrderInput = {
      business_unit_id: "c3333333-3333-3333-3333-333333333333", // The Press
      customer_name: customerName,
      customer_contact: customerContact,
      items_description: itemsDescription,
      drop_off_date: dropOffDate,
      pickup_date: pickupDate || null,
      status,
      amount_charged: parseFloat(amountCharged)
    };

    try {
      await createLaundryOrder(input);
      setShowAddForm(false);
      setCustomerName("");
      setCustomerContact("");
      setItemsDescription("");
      setAmountCharged("");
      setPickupDate("");
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: any) => {
    const res = await updateLaundryOrderStatus(id, newStatus);
    if (res) {
      await loadData();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "collected":
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded font-bold uppercase">Collected</span>;
      case "ready":
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded font-bold uppercase">Ready</span>;
      case "in_progress":
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded font-bold uppercase">In Progress</span>;
      default:
        return <span className="bg-zinc-100 text-zinc-800 text-xs px-2.5 py-1 rounded font-bold uppercase">Received</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/60">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-forest">The Press Laundry Orders Manager</h1>
          <p className="text-xs text-brand-charcoal/60">Track garment dropoffs, starch configurations, and mark orders as collected to post revenue to the ledger.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="h-10 px-4 rounded bg-brand-forest text-white text-xs font-bold hover:bg-brand-forest-light transition-all flex items-center justify-center space-x-1.5 whitespace-nowrap w-fit shrink-0 self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span>New Laundry Ticket</span>
        </button>
      </div>

      {/* Add Order Modal/Form */}
      {showAddForm && (
        <form onSubmit={handleCreateOrder} className="bg-white border border-zinc-200/60 rounded-xl p-6 shadow-sm max-w-2xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-brand-forest">Log Laundry Order</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Customer Name</label>
              <input 
                type="text" 
                required 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Chief Adeleke"
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Customer Contact</label>
              <input 
                type="text" 
                required 
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                placeholder="Phone / WhatsApp"
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Items & Starch Configuration Description</label>
            <input 
              type="text" 
              required 
              value={itemsDescription}
              onChange={(e) => setItemsDescription(e.target.value)}
              placeholder="e.g. 3 White Agbadas, 1 Senator suit - Heavy starch"
              className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Drop Off Date</label>
              <input 
                type="date" 
                required 
                value={dropOffDate}
                onChange={(e) => setDropOffDate(e.target.value)}
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Target Pickup Date</label>
              <input 
                type="date" 
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Amount Charged (NGN)</label>
              <input 
                type="number" 
                required 
                value={amountCharged}
                onChange={(e) => setAmountCharged(e.target.value)}
                placeholder="e.g. 14000"
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Order Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              >
                <option value="received">Received</option>
                <option value="in_progress">In Progress</option>
                <option value="ready">Ready</option>
                <option value="collected">Collected</option>
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
              Log Order
            </button>
          </div>
        </form>
      )}

      {/* Orders Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(order => {
          return (
            <div key={order.id} className="bg-white border border-zinc-200/60 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-zinc-300 transition-colors">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif font-bold text-lg text-brand-forest leading-tight">{order.customer_name}</h3>
                  {getStatusBadge(order.status)}
                </div>
                
                <div className="space-y-1.5 text-xs text-brand-charcoal/60">
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-2 text-zinc-400" />
                    <span>Dropped off: <strong>{order.drop_off_date}</strong></span>
                  </div>
                  {order.pickup_date && (
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-2 text-zinc-400" />
                      <span>Target Pickup: {order.pickup_date}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <User className="w-3.5 h-3.5 mr-2 text-zinc-400" />
                    <span>Contact: {order.customer_contact}</span>
                  </div>
                  <div className="flex items-start">
                    <Package className="w-3.5 h-3.5 mr-2 text-zinc-400 mt-0.5 shrink-0" />
                    <span>Garments: {order.items_description}</span>
                  </div>
                </div>

                <div className="bg-zinc-50 p-3 rounded border border-zinc-100 flex justify-between text-xs font-serif font-bold items-center">
                  <span className="text-[9px] font-sans text-brand-charcoal/40 uppercase block leading-none">Amount Charged</span>
                  <span className="text-brand-forest text-sm">₦{Number(order.amount_charged).toLocaleString()}</span>
                </div>
              </div>

              {/* Status Update Options */}
              {order.status !== "collected" && (
                <div className="border-t border-zinc-100 pt-3 flex items-center justify-between gap-2">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-400">Update:</span>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleUpdateStatus(order.id, "in_progress")}
                      className="h-8 px-2 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 text-[10px] font-bold"
                    >
                      In Progress
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(order.id, "ready")}
                      className="h-8 px-2 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold"
                    >
                      Ready
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(order.id, "collected")}
                      className="h-8 px-2.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold flex items-center"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Collect
                    </button>
                  </div>
                </div>
              )}

              {/* Collected Status Notice */}
              {order.status === "collected" && (
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
