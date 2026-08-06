import React, { useEffect, useState, useMemo } from "react";
import { getStatus } from "../utils/vacinasUtils.js";
import api from "../services/api";

function KPICard({ titulo, valor, subtitulo, cor, icon }) {
  const cores = {
    teal: { bg: "from-teal-500 to-cyan-500", shadow: "shadow-teal-100" },
    blue: { bg: "from-blue-500 to-indigo-500", shadow: "shadow-blue-100" },
    green: { bg: "from-emerald-500 to-green-500", shadow: "shadow-emerald-100" },
    amber: { bg: "from-amber-400 to-orange-400", shadow: "shadow-amber-100" },
  };
  const c = cores[cor] || cores.teal;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all">
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
  const [qtdePacientes, setQtdePacientes] = useState(0);
  const [vacinas, setVacinas] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const resPacientes = await api.get("/pacientes/");
        const resVacinas = await api.get("/vacinas/");

        // 1. Mapeia Pacientes -> resPacientes.data.totalPacientes
        if (resPacientes.data?.totalPacientes !== undefined) {
          setQtdePacientes(resPacientes.data.totalPacientes);
        }

        // 2. Mapeia Vacinas -> resVacinas.data.data.vacinas
        const listaVacinas = resVacinas.data?.data?.vacinas || [];
        setVacinas(listaVacinas);

      } catch (err) {
        console.error("Erro na busca de dados:", err);
      }
    }

    fetchData();
  }, []);

  // Recalcula o resumo sempre que o array de vacinas mudar
  const resumoVacinas = useMemo(() => {
    return vacinas.reduce(
      (acc, v) => {
        const status = getStatus(v);
        const label = (status.label || "").toLowerCase();
        const cor = (status.cor || "").toLowerCase();

        // Normaliza a verificação para aceitar "Regular" ou "green"
        if (label === "regular" || cor === "green") {
          acc.regulares++;
        } else {
          acc.alertas++;
          acc.listaAlertas.push({ ...v, status });
        }
        return acc;
      },
      { regulares: 0, alertas: 0, listaAlertas: [] }
    );
  }, [vacinas]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Painel Geral</h2>
        <p className="text-slate-500 text-sm mt-1">
          Visão geral do sistema — {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Cards de KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          titulo="Pacientes Cadastrados"
          valor={qtdePacientes}
          subtitulo="Total no banco"
          cor="teal"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
        />
        <KPICard
          titulo="Aplicações Hoje"
          valor={0}
          subtitulo="Doses registradas hoje"
          cor="blue"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5"><path d="M9 12l2 2 4-4" /><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" /></svg>}
        />
        <KPICard
          titulo="Lotes Regulares"
          valor={resumoVacinas.regulares}
          subtitulo="Estoque em dia"
          cor="green"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5"><path d="m18 2 4 4" /><path d="m17 7 3-3" /><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" /></svg>}
        />
        <KPICard
          titulo="Lotes em Alerta"
          valor={resumoVacinas.alertas}
          subtitulo="Exigem atenção imediata"
          cor="amber"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>}
        />
      </div>

      {/* Seção Inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-semibold text-slate-800">Aplicações Recentes</h3>
        </div>

        {/* Lista de Alertas */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Alertas de Estoque</h3>
            <button onClick={() => setPaginaAtiva && setPaginaAtiva("vacinas")} className="text-xs text-teal-600 font-semibold hover:text-teal-700">
              Gerenciar →
            </button>
          </div>

          {resumoVacinas.listaAlertas.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-sm text-slate-500">Todos os lotes estão regulares.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {resumoVacinas.listaAlertas.map((v, index) => (
                <div key={v.id || index} className="px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{v.nome}</p>
                      <p className="text-xs text-slate-400">
                        Lote {v.lote} · {v.quantidade_estoque ?? v.doses ?? 0} doses
                      </p>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${v.status?.cor === "red" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}>
                      {v.status?.label || "Alerta"}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-rose-500 mt-1">
                    ⚠ {v.status?.motivo || "Necessita atenção"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}