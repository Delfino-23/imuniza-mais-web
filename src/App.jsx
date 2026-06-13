// ============================================================
// App.jsx — Componente raiz do Imuniza+
// Gerencia o roteamento entre as páginas via estado
// ============================================================

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import Vacinas from "./pages/Vacinas";
import Aplicacoes from "./pages/Aplicacoes";

const PAGINAS = {
  dashboard: Dashboard,
  pacientes: Pacientes,
  vacinas: Vacinas,
  aplicacoes: Aplicacoes,
};

export default function App() {
  const [paginaAtiva, setPaginaAtiva] = useState("dashboard");

  const PaginaAtual = PAGINAS[paginaAtiva] || Dashboard;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar fixa */}
      <Sidebar paginaAtiva={paginaAtiva} setPaginaAtiva={setPaginaAtiva} />

      {/* Conteúdo principal */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Imuniza+</span>
            <span>›</span>
            <span className="text-slate-700 font-semibold capitalize">
              {paginaAtiva === "dashboard" ? "Painel Geral" :
                paginaAtiva === "pacientes" ? "Pacientes" :
                  paginaAtiva === "vacinas" ? "Estoque de Vacinas" : "Aplicações"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Sino de notificações */}
            <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">AD</div>
          </div>
        </header>

        {/* Página ativa */}
        <div className="px-8 py-8 max-w-6xl">
          <PaginaAtual setPaginaAtiva={setPaginaAtiva} />
        </div>
      </main>
    </div>
  );
}
