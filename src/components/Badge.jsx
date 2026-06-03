// ============================================================
// Badge.jsx — Componente de badge/etiqueta de status
// ============================================================

import React from "react";

const cores = {
  green:  "bg-emerald-50 text-emerald-700 border border-emerald-200",
  amber:  "bg-amber-50 text-amber-700 border border-amber-200",
  red:    "bg-red-50 text-red-700 border border-red-200",
  blue:   "bg-blue-50 text-blue-700 border border-blue-200",
  slate:  "bg-slate-100 text-slate-600 border border-slate-200",
};

export default function Badge({ label, cor = "slate" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cores[cor]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        cor === "green" ? "bg-emerald-500" :
        cor === "amber" ? "bg-amber-500" :
        cor === "red"   ? "bg-red-500" :
        cor === "blue"  ? "bg-blue-500" : "bg-slate-400"
      }`} />
      {label}
    </span>
  );
}
