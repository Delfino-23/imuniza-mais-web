import React, { useState } from "react";
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
import MeusAgendamentos from "./pages/Agendamentos";
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
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar paginaAtiva={paginaAtiva} setPaginaAtiva={setPaginaAtiva} />
      <main className="flex-1 ml-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Imuniza+</span>
            <span>›</span>
            <span className="text-slate-700 font-semibold capitalize">
              {paginaAtiva}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-slate-500 hover:text-red-600 px-2 py-1 rounded border border-slate-200 transition-colors"
            >
              Sair
            </button>
          </div>
        </header>

        <div className="px-8 py-8 max-w-6xl">{children}</div>
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