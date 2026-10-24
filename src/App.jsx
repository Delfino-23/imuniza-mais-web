import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EsqueceuSenha from "./pages/EsqueceuSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import Vacinas from "./pages/Vacinas";
import Aplicacoes from "./pages/Aplicacoes";
import Agendamentos from "./pages/Agendamentos";
import MeusAgendamentos from "./pages/MeusAgendamentos";
import CadastroFunc from "./pages/CadastroFunc";
import CarteirinhaDigital from "./pages/CarteirinhaDigital";

// Componente para proteger páginas que exigem login
function RotaProtegida({ estaAutenticado, children }) {
  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Layout com Sidebar e Header para as páginas do sistema
function LayoutSistema({ paginaAtiva, setPaginaAtiva, handleLogout, children }) {
  const [menuAberto, setMenuAberto] = useState(false);

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

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-xs font-bold text-white"
              aria-label="Perfil do usuário"
            >
              AD
            </div>
            <button
              onClick={handleLogout}
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

export default function App() {
  const [estaAutenticado, setEstaAutenticado] = useState(
    Boolean(localStorage.getItem("@imuniza:token"))
  );

  const [usuario, setUsuario] = useState(() => {
    const savedUser = localStorage.getItem("@imuniza:user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [paginaAtiva, setPaginaAtiva] = useState("dashboard");

  const handleLogin = (dadosUsuario) => {
    setUsuario(dadosUsuario);
    setEstaAutenticado(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("@imuniza:token");
    localStorage.removeItem("@imuniza:user");
    setUsuario(null);
    setEstaAutenticado(false);
  };

  // Define a rota inicial com base no perfil do usuário
  const rotaInicial = usuario?.papel === "funcionario" ? "/dashboard" : "/meus-agendamentos";

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route
          path="/login"
          element={
            estaAutenticado ? <Navigate to={rotaInicial} replace /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/cadastro"
          element={
            estaAutenticado ? <Navigate to={rotaInicial} replace /> : <Cadastro />
          }
        />
        <Route
          path="/esqueceu-senha"
          element={
            estaAutenticado ? <Navigate to={rotaInicial} replace /> : <EsqueceuSenha />
          }
        />
        <Route
          path="/redefinir-senha"
          element={
            estaAutenticado ? <Navigate to={rotaInicial} replace /> : <RedefinirSenha />
          }
        />

        {/* Rota para Cidadão */}
        <Route
          path="/meus-agendamentos"
          element={
            <RotaProtegida estaAutenticado={estaAutenticado}>
              <LayoutSistema paginaAtiva="meus-agendamentos" setPaginaAtiva={setPaginaAtiva} handleLogout={handleLogout} usuario={usuario}>
                <MeusAgendamentos />
              </LayoutSistema>
            </RotaProtegida>
          }
        />

        <Route
          path="/carteirinha"
          element={
            <RotaProtegida estaAutenticado={estaAutenticado}>
              <LayoutSistema paginaAtiva="carteirinha" setPaginaAtiva={setPaginaAtiva} handleLogout={handleLogout} usuario={usuario}>
                <CarteirinhaDigital />
              </LayoutSistema>
            </RotaProtegida>
          }
        />

        {/* Rotas para Funcionários */}
        <Route
          path="/dashboard"
          element={
            <RotaProtegida estaAutenticado={estaAutenticado}>
              <LayoutSistema paginaAtiva="dashboard" setPaginaAtiva={setPaginaAtiva} handleLogout={handleLogout} usuario={usuario}>
                <Dashboard setPaginaAtiva={setPaginaAtiva} />
              </LayoutSistema>
            </RotaProtegida>
          }
        />
        <Route
          path="/pacientes"
          element={
            <RotaProtegida estaAutenticado={estaAutenticado}>
              <LayoutSistema paginaAtiva="pacientes" setPaginaAtiva={setPaginaAtiva} handleLogout={handleLogout} usuario={usuario}>
                <Pacientes />
              </LayoutSistema>
            </RotaProtegida>
          }
        />
        <Route
          path="/vacinas"
          element={
            <RotaProtegida estaAutenticado={estaAutenticado}>
              <LayoutSistema paginaAtiva="vacinas" setPaginaAtiva={setPaginaAtiva} handleLogout={handleLogout} usuario={usuario}>
                <Vacinas />
              </LayoutSistema>
            </RotaProtegida>
          }
        />
        <Route
          path="/agendamentos"
          element={
            <RotaProtegida estaAutenticado={estaAutenticado}>
              <LayoutSistema paginaAtiva="agendamentos" setPaginaAtiva={setPaginaAtiva} handleLogout={handleLogout} usuario={usuario}>
                <Agendamentos />
              </LayoutSistema>
            </RotaProtegida>
          }
        />
        <Route
          path="/aplicacoes"
          element={
            <RotaProtegida estaAutenticado={estaAutenticado}>
              <LayoutSistema paginaAtiva="aplicacoes" setPaginaAtiva={setPaginaAtiva} handleLogout={handleLogout} usuario={usuario}>
                <Aplicacoes />
              </LayoutSistema>
            </RotaProtegida>
          }
        />
        <Route
          path="/funcionarios"
          element={
            <RotaProtegida estaAutenticado={estaAutenticado}>
              <LayoutSistema paginaAtiva="funcionarios" setPaginaAtiva={setPaginaAtiva} handleLogout={handleLogout} usuario={usuario}>
                <CadastroFunc />
              </LayoutSistema>
            </RotaProtegida>
          }
        />

        {/* Redirecionamento Padrão */}
        <Route
          path="*"
          element={<Navigate to={estaAutenticado ? rotaInicial : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}