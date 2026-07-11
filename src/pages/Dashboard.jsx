// ============================================================
// Dashboard.jsx — Painel principal com KPIs e resumos
// ============================================================

import React, { useEffect, useState } from "react";
import { pacientes, vacinas, aplicacoes, getStatus } from "../data/mockData";
import api from "../services/api";

// Card de KPI reutilizável
function KPICard({ titulo, valor, subtitulo, cor, icon }) {
  const cores = {
    teal: { bg: "from-teal-500 to-cyan-500", light: "bg-teal-50", text: "text-teal-600", shadow: "shadow-teal-100" },
    blue: { bg: "from-blue-500 to-indigo-500", light: "bg-blue-50", text: "text-blue-600", shadow: "shadow-blue-100" },
    green: { bg: "from-emerald-500 to-green-500", light: "bg-emerald-50", text: "text-emerald-600", shadow: "shadow-emerald-100" },
    amber: { bg: "from-amber-400 to-orange-400", light: "bg-amber-50", text: "text-amber-600", shadow: "shadow-amber-100" },
  };
  const c = cores[cor];
  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-100 hover:border-slate-200 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 shadow-sm`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-md ${c.shadow}`}>
          <span className="text-white">{icon}</span>
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-800 tracking-tight">{valor}</p>
      <p className="text-sm font-semibold text-slate-700 mt-1">{titulo}</p>
      {subtitulo && <p className="text-xs text-slate-400 mt-1">{subtitulo}</p>}
    </div>
  );
}

export default function Dashboard({ setPaginaAtiva }) {
  const [qtdePacientes, setQtdePacientes] = useState([]);

  // Cálculos derivados dos dados mockados
  const hoje = new Date().toISOString().split("T")[0];
  const aplicacoesHoje = aplicacoes.filter(a => a.data === hoje).length;
  const totalDoses = vacinas.reduce((acc, v) => acc + v.doses, 0);
  const alertasEstoque = vacinas.filter(v => {
    const s = getStatus(v);
    return s.cor === "red" || s.cor === "amber";
  }).length;

  const ultimasAplicacoes = [...aplicacoes].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 5);

  const vacinasCriticas = vacinas.filter(v => getStatus(v).cor !== "green");

  const countPacientes = async () => {
    try {
      const response = await api.get('/pacientes/');

      // 1. ADICIONE ESTE LOG para inspecionar a estrutura exata no console do navegador:
      console.log("RESPOSTA COMPLETA DO BACKEND:", response.data);

      // Se o backend enviar direto o objeto de image_46bca5.png:
      if (response.data && response.data.total !== undefined) {
        setQtdePacientes(response.data.total);
      }
      // Se o backend envelopar dentro de outra chave (ex: response.data.data):
      else if (response.data.data && response.data.data.total !== undefined) {
        setQtdePacientes(response.data.data.total);
      }

    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    }
  }

  // Esse hook diz ao React: "assim que a tela carregar, execute o que está aqui dentro"
  useEffect(() => {
    countPacientes();
  }, []); // Os colchetes vazios garantem que só rode UMA vez ao abrir a página

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Painel Geral</h2>
        <p className="text-slate-500 text-sm mt-1">
          Visão geral do sistema — {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          titulo="Pacientes Cadastrados"
          valor={qtdePacientes}
          subtitulo="Total no sistema"
          cor="teal"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
        />
        <KPICard
          titulo="Aplicações Hoje"
          valor={aplicacoesHoje}
          subtitulo="Doses aplicadas no dia"
          cor="blue"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5"><path d="M9 12l2 2 4-4" /><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" /></svg>}
        />
        <KPICard
          titulo="Doses em Estoque"
          valor={totalDoses.toLocaleString("pt-BR")}
          subtitulo={`${vacinas.length} lotes ativos`}
          cor="green"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5"><path d="m18 2 4 4" /><path d="m17 7 3-3" /><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" /></svg>}
        />
        <KPICard
          titulo="Alertas de Estoque"
          valor={alertasEstoque}
          subtitulo="Lotes que precisam de atenção"
          cor="amber"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>}
        />
      </div>

      {/* Conteúdo inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Últimas Aplicações */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Aplicações Recentes</h3>
            <button onClick={() => setPaginaAtiva("aplicacoes")} className="text-xs text-teal-600 font-semibold hover:text-teal-700 transition-colors">
              Ver todas →
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {ultimasAplicacoes.map((ap) => (
              <div key={ap.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50/60 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {ap.pacienteNome.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{ap.pacienteNome}</p>
                  <p className="text-xs text-slate-400 truncate">{ap.vacinaNome} · {ap.dose}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-medium text-slate-600">{new Date(ap.data + "T00:00:00").toLocaleDateString("pt-BR")}</p>
                  <p className="text-[11px] text-slate-400">{ap.profissional}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas de Vacinas */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Alertas de Estoque</h3>
            <button onClick={() => setPaginaAtiva("vacinas")} className="text-xs text-teal-600 font-semibold hover:text-teal-700 transition-colors">
              Gerenciar →
            </button>
          </div>
          {vacinasCriticas.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-sm text-slate-500">Todos os lotes estão regulares.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {vacinasCriticas.map((v) => {
                const s = getStatus(v);
                return (
                  <div key={v.id} className="px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">{v.nome}</p>
                        <p className="text-xs text-slate-400">{v.doses} doses · Lote {v.lote}</p>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${s.cor === "red" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                        }`}>{s.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Validade: {new Date(v.validade + "T00:00:00").toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
