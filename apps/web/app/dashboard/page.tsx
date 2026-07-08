"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PlusCircle, 
  Trash2,
  Filter,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { 
  getTransactions, 
  getDailySummaries, 
  getBusinessUnits, 
  getCategories, 
  getBudgets, 
  createTransaction, 
  deleteTransaction 
} from "@/lib/db";
import { TransactionInput } from "@iroko-court/shared";

export default function NexusDashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summaries, setSummaries] = useState<any[]>([]);
  const [businessUnits, setBusinessUnits] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  
  // Selection / Filters
  const [selectedBU, setSelectedBU] = useState<string>("All"); // "All" or BU ID
  
  // Form State
  const [formBU, setFormBU] = useState("");
  const [formType, setFormType] = useState<"income" | "expense">("income");
  const [formCategory, setFormCategory] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formDescription, setFormDescription] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Reload handler
  const loadDashboardData = async () => {
    const txs = await getTransactions();
    const sums = await getDailySummaries();
    const bu = await getBusinessUnits();
    const cats = await getCategories();
    const buds = await getBudgets();

    setTransactions(txs);
    setSummaries(sums);
    setBusinessUnits(bu);
    setCategories(cats);
    setBudgets(buds);

    if (bu.length > 0 && !formBU) {
      setFormBU(bu[0].id);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Update categories options when form business unit changes
  useEffect(() => {
    if (formBU) {
      const firstCat = categories.find(c => c.business_unit_id === formBU && c.type === formType);
      if (firstCat) {
        setFormCategory(firstCat.id);
      } else {
        setFormCategory("");
      }
    }
  }, [formBU, formType, categories]);

  // Compute Aggregations based on filters
  const filteredTxs = selectedBU === "All" 
    ? transactions 
    : transactions.filter(t => t.business_unit_id === selectedBU);

  const totalIncome = filteredTxs
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = filteredTxs
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netProfit = totalIncome - totalExpense;

  // Add Transaction Mutator
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBU || !formCategory || !formAmount || !formDate || !formDescription) return;

    setFormSubmitting(true);
    
    const input: TransactionInput = {
      business_unit_id: formBU,
      type: formType,
      category_id: formCategory,
      amount: parseFloat(formAmount),
      currency: "NGN",
      description: formDescription,
      transaction_date: formDate,
      source: "manual"
    };

    try {
      await createTransaction(input);
      setFormAmount("");
      setFormDescription("");
      await loadDashboardData();
    } catch (err) {
      console.error(err);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete transaction handler
  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm("Are you sure you want to void this transaction?")) {
      const res = await deleteTransaction(id);
      if (res) {
        await loadDashboardData();
      }
    }
  };

  // Helper to get Business Unit Name
  const getBUName = (buId: string) => {
    const found = businessUnits.find(b => b.id === buId);
    return found ? found.display_name : "General";
  };

  // Helper to get Category Name
  const getCatName = (catId: string) => {
    const found = categories.find(c => c.id === catId);
    return found ? found.name : "Other";
  };

  // Budget calculations
  const filteredBudgets = selectedBU === "All" 
    ? budgets 
    : budgets.filter(b => b.business_unit_id === selectedBU);

  const budgetProgressItems = filteredBudgets.flatMap(b => {
    return b.limits.map((l: any) => {
      // Find actual expenses in this category during the budget period
      const actual = transactions
        .filter(t => 
          t.business_unit_id === b.business_unit_id &&
          t.category_id === l.category_id &&
          t.type === "expense" &&
          t.transaction_date >= b.start_date &&
          t.transaction_date <= b.end_date
        )
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const percent = Math.min(100, Math.round((actual / l.limit_amount) * 100));

      return {
        id: `${b.id}_${l.category_id}`,
        budgetName: b.name,
        categoryName: getCatName(l.category_id),
        buName: getBUName(b.business_unit_id),
        limit: l.limit_amount,
        actual,
        percent
      };
    });
  });

  return (
    <div className="space-y-8">
      {/* 1. TOP BAR / FILTER */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-zinc-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-charcoal/60">
          <Filter className="w-4 h-4 text-brand-gold" />
          <span>Filter Hub view:</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedBU("All")}
            className={`h-9 px-4 rounded text-xs font-bold transition-all ${selectedBU === "All" ? "bg-brand-forest text-white" : "bg-brand-mist/50 text-brand-charcoal hover:bg-brand-mist"}`}
          >
            All Units
          </button>
          {businessUnits.map(bu => (
            <button
              key={bu.id}
              onClick={() => setSelectedBU(bu.id)}
              className={`h-9 px-4 rounded text-xs font-bold transition-all ${selectedBU === bu.id ? "bg-brand-forest text-white" : "bg-brand-mist/50 text-brand-charcoal hover:bg-brand-mist"}`}
            >
              {bu.display_name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
        <div className="bg-white border border-zinc-200/60 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-brand-charcoal/50 font-bold block">Total Cash Inflow</span>
            <span className="font-serif text-3xl font-bold text-emerald-600">₦{totalIncome.toLocaleString()}</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white border border-zinc-200/60 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-brand-charcoal/50 font-bold block">Total Cash Outflow</span>
            <span className="font-serif text-3xl font-bold text-brand-terracotta">₦{totalExpense.toLocaleString()}</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-brand-terracotta">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white border border-zinc-200/60 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-brand-charcoal/50 font-bold block">Net Profit Margin</span>
            <span className={`font-serif text-3xl font-bold ${netProfit >= 0 ? "text-brand-forest" : "text-brand-terracotta"}`}>
              ₦{netProfit.toLocaleString()}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-brand-forest">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. MIDDLE: DATA INPUT & BUDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-zinc-200/60 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-brand-gold" />
            <h3 className="font-serif text-lg font-bold text-brand-forest">Record Ledger Entry</h3>
          </div>

          <form onSubmit={handleAddTransaction} className="space-y-4">
            {/* Business Unit Selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Business Unit</label>
              <select 
                value={formBU}
                onChange={(e) => setFormBU(e.target.value)}
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              >
                {businessUnits.map(b => (
                  <option key={b.id} value={b.id}>{b.display_name}</option>
                ))}
              </select>
            </div>

            {/* Type & Amount */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Type</label>
                <select 
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
                >
                  <option value="income">Income (+)</option>
                  <option value="expense">Expense (-)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Amount (NGN)</label>
                <input 
                  type="number"
                  required
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
                />
              </div>
            </div>

            {/* Category selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Ledger Category</label>
              <select 
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              >
                {categories
                  .filter(c => c.business_unit_id === formBU && c.type === formType)
                  .map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
            </div>

            {/* Transaction Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Transaction Date</label>
              <input 
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-brand-charcoal/50">Description</label>
              <input 
                type="text"
                required
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="e.g. Purchase of kitchen materials"
                className="w-full h-10 border border-zinc-200 rounded px-3 text-xs bg-zinc-50 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={formSubmitting}
              className="w-full h-10 bg-brand-forest text-white text-xs font-bold rounded hover:bg-brand-forest-light transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{formSubmitting ? "Saving..." : "Post Entry to Ledger"}</span>
            </button>
          </form>
        </div>

        {/* Right: Budgets Progress & Analytics (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-zinc-200/60 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-brand-forest">Budget Limits & Guardrails</h3>
            <span className="text-[9px] uppercase tracking-wider bg-brand-forest/10 text-brand-forest font-bold px-2 py-0.5 rounded">
              Monthly Caps
            </span>
          </div>

          {budgetProgressItems.length === 0 ? (
            <div className="text-xs italic text-zinc-400 py-10 text-center">
              No active budgets configured for this selected unit view.
            </div>
          ) : (
            <div className="space-y-6">
              {budgetProgressItems.map(item => (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <div className="flex items-center space-x-2">
                      <span className="text-brand-charcoal font-medium">{item.categoryName}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 font-bold uppercase">
                        {item.buName}
                      </span>
                    </div>
                    <span className={item.percent >= 90 ? "text-brand-terracotta" : "text-brand-forest"}>
                      {item.percent}% used
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.percent >= 90 
                          ? "bg-brand-terracotta" 
                          : item.percent >= 70 
                            ? "bg-brand-gold" 
                            : "bg-emerald-600"
                      }`}
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>

                  {/* Limit Indicators */}
                  <div className="flex justify-between text-[10px] text-brand-charcoal/50 font-medium">
                    <span>Actual: ₦{item.actual.toLocaleString()}</span>
                    <span>Budget Limit: ₦{item.limit.toLocaleString()}</span>
                  </div>

                  {/* Alert Threshold Warning */}
                  {item.percent >= 90 && (
                    <div className="flex items-center space-x-1.5 text-[9px] text-brand-terracotta font-bold uppercase mt-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>Warning: Close to or exceeding allocated budget threshold!</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. BOTTOM LEDGER TABLE */}
      <div className="bg-white border border-zinc-200/60 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 md:px-6 py-5 border-b border-zinc-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h3 className="font-serif text-lg font-bold text-brand-forest">Unified Financial Ledger</h3>
          <span className="text-xs text-brand-charcoal/40 font-medium font-sans">
            {filteredTxs.length} entries · Sorted Chronologically
          </span>
        </div>

        {filteredTxs.length === 0 ? (
          <p className="py-12 text-center italic text-brand-charcoal/40 text-xs">
            No transactions recorded matching the selected filter.
          </p>
        ) : (
          <>
            {/* ── MOBILE: stacked cards (hidden on md+) ── */}
            <div className="md:hidden divide-y divide-zinc-100">
              {filteredTxs.map(tx => (
                <div key={tx.id} className="p-4 space-y-2">
                  {/* Row 1: date + amount */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-brand-charcoal/50">{tx.transaction_date}</span>
                    <span className={`font-serif font-bold text-sm ${tx.type === "income" ? "text-emerald-600" : "text-brand-terracotta"}`}>
                      {tx.type === "income" ? "+" : "-"}₦{Number(tx.amount).toLocaleString()}
                    </span>
                  </div>
                  {/* Row 2: description (full, wrapping) */}
                  <p className="text-xs font-medium text-brand-charcoal leading-snug break-words">
                    {tx.description}
                  </p>
                  {/* Row 3: unit badge + category + source + delete */}
                  <div className="flex items-center flex-wrap gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tx.business_unit_id === "a1111111-1111-1111-1111-111111111111"
                        ? "bg-brand-gold/15 text-brand-charcoal"
                        : tx.business_unit_id === "b2222222-2222-2222-2222-222222222222"
                          ? "bg-brand-terracotta/15 text-brand-terracotta"
                          : "bg-brand-slate/15 text-brand-slate"
                    }`}>
                      {getBUName(tx.business_unit_id)}
                    </span>
                    <span className="text-[10px] text-brand-charcoal/50">{getCatName(tx.category_id)}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-charcoal/30">{tx.source}</span>
                    <button
                      onClick={() => handleDeleteTransaction(tx.id)}
                      className="ml-auto text-brand-charcoal/30 hover:text-brand-terracotta transition-colors"
                      title="Void entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── DESKTOP: table (hidden on mobile) ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100 text-brand-charcoal/40 uppercase tracking-widest font-bold font-sans">
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6">Unit</th>
                    <th className="py-3 px-6">Description</th>
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-6">Source</th>
                    <th className="py-3 px-6 text-right">Amount</th>
                    <th className="py-3 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredTxs.map(tx => (
                    <tr key={tx.id} className="hover:bg-zinc-50/40 transition-colors">
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
                      <td className="py-3.5 px-6 font-medium max-w-xs truncate">{tx.description}</td>
                      <td className="py-3.5 px-6 text-brand-charcoal/60">{getCatName(tx.category_id)}</td>
                      <td className="py-3.5 px-6">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-charcoal/40">
                          {tx.source}
                        </span>
                      </td>
                      <td className={`py-3.5 px-6 text-right font-serif font-bold text-sm ${tx.type === "income" ? "text-emerald-600" : "text-brand-terracotta"}`}>
                        {tx.type === "income" ? "+" : "-"}₦{Number(tx.amount).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <button
                          onClick={() => handleDeleteTransaction(tx.id)}
                          className="text-brand-charcoal/30 hover:text-brand-terracotta transition-colors"
                          title="Void entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
