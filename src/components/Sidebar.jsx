import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// 1. Itens para Funcionário
const funcionarioItems = [
  {
    id: "dashboard",
    path: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "pacientes",
    path: "/pacientes",
    label: "Pacientes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "vacinas",
    path: "/vacinas",
    label: "Vacinas",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="m18 2 4 4" />
        <path d="m17 7 3-3" />
        <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
        <path d="m9 11 4 4" />
        <path d="m5 19-3 3" />
        <path d="m14 4 6 6" />
      </svg>
    ),
  },
  {
    id: "agendamentos",
    path: "/agendamentos",
    label: "Agendamentos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"
      >
        <rect x="3" y="5" width="14" height="16" rx="2" />
        <path d="M7 3v4M13 3v4M3 10h14" />
        <circle cx="17.5" cy="16.5" r="4.5" />
        <path d="M17.5 14v2.5l1.5 1" />
      </svg>
    ),
  },
  {
    id: "aplicacoes",
    path: "/aplicacoes",
    label: "Aplicações",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
      </svg>
    ),
  },
  {
    id: "funcionários",
    path: "/funcionarios",
    label: "Funcionários",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

// 2. Itens para Cidadão
const cidadaoItems = [
  {
    id: "agendamentos",
    path: "/meus-agendamentos",
    label: "Meus Agendamentos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        <path d="M7 7h10" />
        <path d="M7 11h10" />
        <path d="M7 15h6" />
      </svg>
    ),
  },
  {
    id: "carteirinha",
    path: "/carteirinha",
    label: "Carteirinha Digital",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
        <path d="M15 15.5l1.5 1.5 3-4" />
      </svg>
    ),
  }
];

export default function Sidebar({ menuAberto = false, onFechar = () => { } }) {
  const location = useLocation(); // Corrigido: adicionada a chamada do Hook
  const { user } = useAuth();
  const papel = user?.papel;

  // Define dinamicamente quais rotas exibir
  const navItems = papel === "funcionario" ? funcionarioItems : cidadaoItems;

  // Gerador simples de iniciais para o avatar (ex: "João Silva" -> "JS")
  const getIniciais = (nome) => {
    if (!nome) return "U";
    const partes = nome.trim().split(" ");
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  return (
    <aside
      id="sidebar-navegacao"
      aria-label="Navegação Principal"
      className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-slate-100 bg-white shadow-sm transition-transform duration-300 ease-in-out md:translate-x-0 md:z-40 ${menuAberto ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="m18 2 4 4" />
              <path d="m17 7 3-3" />
              <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
              <path d="m9 11 4 4" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-none tracking-tight">Imuniza<span className="text-teal-600">+</span></h1>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium tracking-wide">Sistema de Vacinas</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Menu Principal</p>
        {navItems.map((item) => {
          const ativo = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={onFechar}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                ${ativo
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
            >
              <span className={`transition-transform duration-150 ${ativo ? "text-white" : "text-slate-400 group-hover:text-teal-500"}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Perfil do Usuário com Botão de Logout */}
      <div className="px-4 py-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {getIniciais(user?.nome)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">{user?.nome || "Usuário"}</p>
            <p className="text-[10px] text-slate-400 truncate capitalize">{user?.papel || "Acesso"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}