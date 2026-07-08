"use client";

import React, { useState, useEffect } from "react";
import { getEateryDailySales, createEaterySale } from "@/lib/db";
import { Utensils, Calendar, Users, DollarSign, PlusCircle, CheckCircle, RefreshCw } from "lucide-react";
import { EaterySaleInput } from "@iroko-court/shared";

export default function NexusTable() {
  const [salesLogs, setSalesLogs] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);
  const [totalCovers, setTotalCovers] = useState("");
  const [totalRevenue, setTotalRevenue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    const logs = await getEateryDailySales();
    setSalesLogs(logs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleDate || !totalCovers || !totalRevenue) return;

    setIsSubmitting(true);
    
    const input: EaterySaleInput = {
      business_unit_id: "b2222222-2222-2222-2222-222222222222", // The Table
      sale_date: saleDate,
      total_covers: parseInt(totalCovers),
      total_revenue: parseFloat(totalRevenue)
    };

    try {
      await createEaterySale(input);
      setShowAddForm(false);
      setTotalCovers("");
      setTotalRevenue("");
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/60">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-forest">The Table Sales Logger</h1>
          <p className="text-xs text-brand-charcoal/60">Record covers and daily restaurant sales. Submitting logs automatically generates corresponding income ledger transactions.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="h-10 px-4 rounded bg-brand-forest text-white text-xs font-bold hover:bg-brand-forest-light transition-all flex items-center justify-center space-x-1.5 whitespace-nowrap w-fit shrink-0 self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span>Record Daily Sales</span>
        </button>
      </div>

      {/* Add Sale Modal/Form */}
      {showAddForm && (
        <form onSubmit={handleCreateSale} className="bg-white border border-zinc-200/60 rounded-xl p-6 shadow-sm max-w-xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-brand-forest">Log Eatery Daily Business</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Business Date</label>
            <input 
              type="date" 
              required 
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Total Covers (Guests Served)</label>
              <input 
                type="number" 
                required 
                value={totalCovers}
                onChange={(e) => setTotalCovers(e.target.value)}
                placeholder="e.g. 45"
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Total Daily Revenue (NGN)</label>
              <input 
                type="number" 
                required 
                value={totalRevenue}
                onChange={(e) => setTotalRevenue(e.target.value)}
                placeholder="e.g. 145000"
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              />
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
              Save & Sync
            </button>
          </div>
        </form>
      )}

      {/* Sales Logs Table */}
      <div className="bg-white border border-zinc-200/60 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100 text-brand-charcoal/40 uppercase tracking-widest font-bold font-sans">
                <th className="py-3 px-6">Sale Date</th>
                <th className="py-3 px-6">Covers (Guests)</th>
                <th className="py-3 px-6 text-right">Daily Revenue</th>
                <th className="py-3 px-6 text-center">Integration Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {salesLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center italic text-brand-charcoal/40">
                    No eatery sales recorded yet.
                  </td>
                </tr>
              ) : (
                salesLogs.map(log => (
                  <tr key={log.id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-brand-charcoal/80">{log.sale_date}</td>
                    <td className="py-3.5 px-6 text-brand-charcoal/60">
                      <span className="flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1 text-zinc-400" />
                        <strong>{log.total_covers} Guests served</strong>
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right font-serif font-bold text-sm text-brand-forest">
                      ₦{Number(log.total_revenue).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded inline-flex items-center">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Posted to Ledger
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
