"use client";

import React, { useState, useEffect } from "react";
import { getTransactions, getBusinessUnits, getCategories } from "@/lib/db";
import { FileSpreadsheet, Download, Calendar, Filter, Sparkles, Utensils, Shirt } from "lucide-react";

export default function ReportsModule() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [businessUnits, setBusinessUnits] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Filter States
  const [selectedBU, setSelectedBU] = useState("All");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const loadData = async () => {
    const txs = await getTransactions();
    const bu = await getBusinessUnits();
    const cats = await getCategories();
    setTransactions(txs);
    setBusinessUnits(bu);
    setCategories(cats);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getBUName = (buId: string) => {
    const found = businessUnits.find(b => b.id === buId);
    return found ? found.display_name : "General";
  };

  const getCatName = (catId: string) => {
    const found = categories.find(c => c.id === catId);
    return found ? found.name : "Other";
  };

  // Filtered dataset
  const filteredTxs = transactions.filter(tx => {
    const dateMatch = tx.transaction_date >= startDate && tx.transaction_date <= endDate;
    const buMatch = selectedBU === "All" || tx.business_unit_id === selectedBU;
    return dateMatch && buMatch;
  });

  const totalIncome = filteredTxs
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = filteredTxs
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netProfit = totalIncome - totalExpense;

  // Export CSV/Excel simulation function
  const handleExportCSV = () => {
    if (filteredTxs.length === 0) return;

    // Headers
    const headers = ["Transaction ID", "Date", "Business Unit", "Type", "Category", "Description", "Source", "Amount (NGN)"];
    
    // Rows
    const rows = filteredTxs.map(tx => [
      tx.id,
      tx.transaction_date,
      getBUName(tx.business_unit_id),
      tx.type.toUpperCase(),
      getCatName(tx.category_id),
      `"${tx.description.replace(/"/g, '""')}"`, // escape quotes for CSV
      tx.source.toUpperCase(),
      tx.amount
    ]);

    // Combine headers and rows
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    const buLabel = selectedBU === "All" ? "All-Units" : getBUName(selectedBU).replace(/\s+/g, "-");
    link.setAttribute("download", `Iroko-Court_Financials_${buLabel}_${startDate}_to_${endDate}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/60">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-forest">Financial Reporting Centre</h1>
          <p className="text-xs text-brand-charcoal/60">Analyze cash flow records, filter audits, and compile spreadsheet summaries.</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={filteredTxs.length === 0}
          className="h-10 px-4 rounded bg-brand-forest text-white text-xs font-bold hover:bg-brand-forest-light transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-fit shrink-0 self-start sm:self-center"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>Export Excel (.CSV)</span>
        </button>
      </div>

      {/* Filter Options */}
      <div className="bg-white border border-zinc-200/60 rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-brand-charcoal/50 flex items-center">
            <Filter className="w-3 h-3 mr-1 text-brand-gold" />
            <span>Business Unit</span>
          </label>
          <select
            value={selectedBU}
            onChange={(e) => setSelectedBU(e.target.value)}
            className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
          >
            <option value="All">All Business Units</option>
            {businessUnits.map(b => (
              <option key={b.id} value={b.id}>{b.display_name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-brand-charcoal/50 flex items-center">
            <Calendar className="w-3 h-3 mr-1 text-zinc-400" />
            <span>Start Date</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-brand-charcoal/50 flex items-center">
            <Calendar className="w-3 h-3 mr-1 text-zinc-400" />
            <span>End Date</span>
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
          />
        </div>

        {/* Aggregate Preview summary inside filter row */}
        <div className="bg-brand-mist/30 border border-zinc-200/50 rounded-lg p-3 flex flex-col justify-center text-xs">
          <div className="flex justify-between font-semibold">
            <span className="text-zinc-500">Filtered Cashflow:</span>
            <span className={netProfit >= 0 ? "text-brand-forest" : "text-brand-terracotta"}>
              ₦{netProfit.toLocaleString()}
            </span>
          </div>
          <p className="text-[9px] text-zinc-400 mt-1 uppercase font-bold">
            {filteredTxs.length} entries selected
          </p>
        </div>
      </div>

      {/* Reports Table List */}
      <div className="bg-white border border-zinc-200/60 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100 text-brand-charcoal/40 uppercase tracking-widest font-bold font-sans">
                <th className="py-3 px-6">Transaction ID</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Business Unit</th>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-6 text-right">Amount (NGN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center italic text-brand-charcoal/40">
                    No transactions found within the selected date range and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTxs.map(tx => (
                  <tr key={tx.id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-[10px] text-brand-charcoal/40">{tx.id}</td>
                    <td className="py-3.5 px-6 font-medium text-brand-charcoal/80">{tx.transaction_date}</td>
                    <td className="py-3.5 px-6 font-semibold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        tx.business_unit_id === "a1111111-1111-1111-1111-111111111111" 
                          ? "bg-brand-gold/15 text-brand-charcoal" 
                          : tx.business_unit_id === "b2222222-2222-2222-2222-222222222222"
                            ? "bg-brand-terracotta/15 text-brand-terracotta"
                            : "bg-brand-slate/15 text-brand-slate"
                      }`}>
                        {getBUName(tx.business_unit_id)}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-bold uppercase tracking-wider">
                      <span className={tx.type === "income" ? "text-emerald-700" : "text-brand-terracotta"}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-brand-charcoal/60">{getCatName(tx.category_id)}</td>
                    <td className="py-3.5 px-6 font-medium max-w-xs truncate">{tx.description}</td>
                    <td className={`py-3.5 px-6 text-right font-serif font-bold text-sm ${tx.type === "income" ? "text-emerald-600" : "text-brand-terracotta"}`}>
                      ₦{Number(tx.amount).toLocaleString()}
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
