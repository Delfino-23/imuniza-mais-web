import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EsqueceuSenha from "./pages/EsqueceuSenha";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import Vacinas from "./pages/Vacinas";
import Aplicacoes from "./pages/Aplicacoes";
import Agendamentos from "./pages/Agendamentos";
import MeusAgendamentos from "./pages/MeusAgendamentos";
import CadastroFunc from "./pages/CadastroFunc";
import CarteirinhaDigital from "./pages/CarteirinhaDigital";
import NotificacoesDropdown from "./components/NotificacoesDropdown";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function RotaProtegida({ papel, children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const papelAtual = user?.papel === "funcionario" ? "funcionario" : "cidadao";
  if (papelAtual !== papel) {
    return (
      <Navigate
        to={papelAtual === "funcionario" ? "/dashboard" : "/meus-agendamentos"}
        replace
      />
    );
  }

  return children;
}

// Layout com Sidebar e Header para as páginas do sistema
function LayoutSistema({ paginaAtiva, children }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const { logout } = useAuth();

  // Permite fechar a navegação móvel pelo teclado.
  useEffect(() => {
    if (!menuAberto) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuAberto(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuAberto]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        menuAberto={menuAberto}
        onFechar={() => setMenuAberto(false)}
      />

      {/* Fundo de sobreposição exibido apenas quando o menu móvel está aberto. */}
      {menuAberto && (
        <button
          type="button"
          aria-label="Fechar menu de navegação"
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
          onClick={() => setMenuAberto(false)}
        />
      )}

      <main className="min-h-screen min-w-0 w-full md:ml-64 md:w-[calc(100%-16rem)]">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-100 bg-white/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
              onClick={() => setMenuAberto(true)}
              aria-label="Abrir menu de navegação"
              aria-expanded={menuAberto}
              aria-controls="sidebar-navegacao"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex min-w-0 items-center gap-2 text-sm text-slate-400">
              <span className="shrink-0">Imuniza+</span>
              <span aria-hidden="true">›</span>
              <span className="truncate font-semibold capitalize text-slate-700">
                {paginaAtiva}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificacoesDropdown />
            <button
              onClick={logout}
              className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500 transition-colors hover:text-red-600"
            >
              Sair
            </button>
          </div>
        </header>

        <div className="w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, user, login } = useAuth();
  const rotaInicial = user?.papel === "funcionario" ? "/dashboard" : "/meus-agendamentos";

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to={rotaInicial} replace /> : <Login onLogin={login} />
        }
      />
      <Route
        path="/cadastro"
        element={
          isAuthenticated ? <Navigate to={rotaInicial} replace /> : <Cadastro />
        }
      />
      <Route
        path="/esqueceu-senha"
        element={
          isAuthenticated ? <Navigate to={rotaInicial} replace /> : <EsqueceuSenha />
        }
      />

      {/* Rota para Cidadão */}
      <Route
        path="/meus-agendamentos"
        element={
          <RotaProtegida papel="cidadao">
            <LayoutSistema paginaAtiva="meus-agendamentos">
              <MeusAgendamentos />
            </LayoutSistema>
          </RotaProtegida>
        }
      />

      <Route
        path="/carteirinha"
        element={
          <RotaProtegida papel="cidadao">
            <LayoutSistema paginaAtiva="carteirinha">
              <CarteirinhaDigital />
            </LayoutSistema>
          </RotaProtegida>
        }
      />

      {/* Rotas para Funcionários */}
      <Route
        path="/dashboard"
        element={
          <RotaProtegida papel="funcionario">
            <LayoutSistema paginaAtiva="dashboard">
              <Dashboard />
            </LayoutSistema>
          </RotaProtegida>
        }
      />
      <Route
        path="/pacientes"
        element={
          <RotaProtegida papel="funcionario">
            <LayoutSistema paginaAtiva="pacientes">
              <Pacientes />
            </LayoutSistema>
          </RotaProtegida>
        }
      />
      <Route
        path="/vacinas"
        element={
          <RotaProtegida papel="funcionario">
            <LayoutSistema paginaAtiva="vacinas">
              <Vacinas />
            </LayoutSistema>
          </RotaProtegida>
        }
      />
      <Route
        path="/agendamentos"
        element={
          <RotaProtegida papel="funcionario">
            <LayoutSistema paginaAtiva="agendamentos">
              <Agendamentos />
            </LayoutSistema>
          </RotaProtegida>
        }
      />
      <Route
        path="/aplicacoes"
        element={
          <RotaProtegida papel="funcionario">
            <LayoutSistema paginaAtiva="aplicacoes">
              <Aplicacoes />
            </LayoutSistema>
          </RotaProtegida>
        }
      />
      <Route
        path="/funcionarios"
        element={
          <RotaProtegida papel="funcionario">
            <LayoutSistema paginaAtiva="funcionarios">
              <CadastroFunc />
            </LayoutSistema>
          </RotaProtegida>
        }
      />

      {/* Redirecionamento Padrão */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? rotaInicial : "/login"} replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}