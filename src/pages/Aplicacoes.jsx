import React, { useEffect, useState, useRef } from "react"; // 1. Adicionado useRef
import html2pdf from "html2pdf.js"; // 2. Importado html2pdf.js
import Badge from "../components/Badge";
import {
  DOSES_OPCOES,
  getStatus,
} from "../data/mockData";
import api from "../services/api";
import { vacinasDisponiveis } from "../utils/vacinasUtils.js";
import { formatarCPF } from "../utils/formatadores.js";

// Campo de autocomplete para pacientes
function AutocompletePaciente({ valor, onChange }) {
  const [pacientes, setPacientes] = useState({ total: 0, pacientes: [] });
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState(valor?.nome || "");

  const filtrados = (pacientes.pacientes || []).filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.cpf.includes(busca)
  ).slice(0, 6);

  const selecionar = (p) => {
    onChange(p);
    setBusca(p.nome);
    setAberto(false);
  };

  const carregarPacientes = async () => {
    try {
      const response = await api.get("/pacientes/");
      setPacientes(response.data.data);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    }
  }

  useEffect(() => {
    carregarPacientes();
  }, []);

  return (
    <div className="relative">
      <input
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
        placeholder="Digite nome ou CPF do paciente..."
        value={busca}
        onChange={(e) => { setBusca(e.target.value); setAberto(true); onChange(null); }}
        onFocus={() => setAberto(true)}
        onBlur={() => setTimeout(() => setAberto(false), 150)}
      />
      {aberto && busca.length >= 1 && filtrados.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
          {filtrados.map(p => (
            <button
              key={p.id}
              type="button"
              onMouseDown={() => selecionar(p)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-teal-50 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                {p.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">{p.nome}</p>
                <p className="text-xs text-slate-400">{formatarCPF(p.cpf)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Aplicacoes() {
  const hoje = new Date().toISOString().split("T")[0];

  const historicoRef = useRef(null); // 3. Ref para a área que será impressa em PDF

  const [aplicacoes, setAplicacoes] = useState([]);
  const [form, setForm] = useState({
    paciente: null,
    vacinaId: "",
    data: hoje,
    dose: "",
    profissional: "",
  });
  const [sucesso, setSucesso] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [vacinas, setVacinas] = useState([]);
  const POR_PAGINA = 5;

  useEffect(() => {
    const carregarVacinas = async () => {
      try {
        const response = await api.get("/vacinas/");
        const dados = response.data;
        const listaArray = dados?.data?.vacinas || dados?.vacinas || (Array.isArray(dados) ? dados : []);
        setVacinas(listaArray);
      } catch (error) {
        console.error("Erro ao carregar vacinas:", error);
        setVacinas([]);
      }
    };

    carregarVacinas();
  }, []);

  const carregarHistorico = async () => {
    try {
      const response = await api.get("/historico/");
      const dados = response.data.data || response.data || [];
      setAplicacoes(dados);
    } catch (error) {
      console.error("Erro ao carregar histórico de aplicações:", error);
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  // 4. Função para acionar o download em PDF
  const handleGerarPDF = () => {
    const element = historicoRef.current;

    const options = {
      margin: 10,
      filename: `Historico_Aplicacoes_${hoje}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          // Esconde os botões de paginação apenas dentro do PDF gerado
          const paginacao = clonedDoc.querySelector('[data-pdf-paginacao]');
          if (paginacao) paginacao.style.display = 'none';
        }
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().set(options).from(element).save();
  };

  const listaVacinasDisponiveis = vacinasDisponiveis(vacinas);
  const setF = (campo) => (e) => setForm(p => ({ ...p, [campo]: e.target.value }));
  const vacinasSelecionada = listaVacinasDisponiveis.find(v => v.id === Number(form.vacinaId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.paciente || !form.vacinaId || !form.dose || !form.profissional) return;

    try {
      const vacinaEncontrada = vacinas.find((v) => v.id === Number(form.vacinaId));
      const loteSelecionado = vacinaEncontrada?.lote || vacinaEncontrada?.numero_lote || '';

      const payload = {
        paciente_id: form.paciente.id,
        vacina_id: Number(form.vacinaId),
        lote: loteSelecionado,
        data_aplicacao: form.data,
        dose: form.dose,
        profissional_responsavel: form.profissional,
      };

      await api.post("/historico/", payload);

      setSucesso(true);
      setForm({ paciente: null, vacinaId: "", data: hoje, dose: "", profissional: "" });

      await carregarHistorico();
      setTimeout(() => setSucesso(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar aplicação no banco:", error);
      alert("Ocorreu um erro ao registrar a aplicação no banco de dados.");
    }
  };

  const totalPaginas = Math.ceil(aplicacoes.length / POR_PAGINA);
  const paginadas = aplicacoes.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";

  return (
    <div className="space-y-6">
      {/* Header com botão de Exportar PDF */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Registro de Aplicações</h2>
          <p className="text-slate-500 text-sm mt-1">{aplicacoes.length} vacinações registradas no sistema</p>
        </div>

        {/* 5. Botão de Exportar PDF */}
        <button
          onClick={handleGerarPDF}
          className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="12" y2="18"></line>
            <line x1="15" y1="15" x2="12" y2="18"></line>
          </svg>
          Exportar PDF
        </button>
      </div>

      {/* Formulário de registro */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-500">
          <h3 className="font-semibold text-white text-base flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Nova Aplicação de Vacina
          </h3>
          <p className="text-teal-100 text-xs mt-0.5">Preencha todos os campos obrigatórios</p>
        </div>

        {sucesso && (
          <div className="mx-6 mt-4 flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-semibold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 flex-shrink-0"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
            Aplicação registrada com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={labelCls}>Paciente *</label>
            <AutocompletePaciente
              valor={form.paciente}
              onChange={(p) => setForm(f => ({ ...f, paciente: p }))}
            />
            {form.paciente && (
              <p className="text-xs text-teal-600 mt-1.5 font-medium">
                ✓ {form.paciente.nome} · CPF: {formatarCPF(form.paciente.cpf)}
              </p>
            )}
          </div>

          <div>
            <label className={labelCls}>Vacina / Lote Disponível *</label>
            <select className={inputCls} value={form.vacinaId} onChange={setF("vacinaId")} required>
              <option value="">Selecionar vacina disponível...</option>
              {listaVacinasDisponiveis.map(v => {
                const s = getStatus(v);
                return (
                  <option key={v.id} value={v.id}>
                    {v.nome} — Lote: {v.lote} ({v.doses} doses) {s.cor !== "green" ? `⚠ ${s.label}` : ""}
                  </option>
                );
              })}
            </select>
            {vacinasSelecionada && (
              <div className="flex items-center gap-2 mt-1.5">
                <p className="text-xs text-slate-500">
                  Fabricante: {vacinasSelecionada.fabricante} · Validade: {new Date(vacinasSelecionada.validade).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Data da Aplicação *</label>
              <input type="date" className={inputCls} value={form.data} onChange={setF("data")} required />
            </div>
            <div>
              <label className={labelCls}>Dose *</label>
              <select className={inputCls} value={form.dose} onChange={setF("dose")} required>
                <option value="">Selecionar dose...</option>
                {DOSES_OPCOES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Nome do Profissional / Aplicador *</label>
            <input className={inputCls} value={form.profissional} onChange={setF("profissional")} placeholder="Ex: Enf. Maria Costa" required />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-teal-100 flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
            Registrar Aplicação
          </button>
        </form>
      </div>

      {/* Histórico de aplicações (6. Vinculado à ref `historicoRef`) */}
      <div ref={historicoRef} data-pdf-content className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-2">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Histórico de Aplicações</h3>
          <p className="text-xs text-slate-400 mt-0.5">Todas as vacinações registradas no sistema</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Paciente</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Vacina</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Lote</th>
                <th className="text-center px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Dose</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Profissional</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginadas.map((a) => {
                const nomePaciente = a.Paciente?.nome || a.paciente_nome || "Não informado";
                const listaVacinasSegura = Array.isArray(vacinas) ? vacinas : [];
                const vacinaRelacionada = listaVacinasSegura.find((v) => v.id === (a.vacina_id || a.Vacina?.id));
                const nomeVacina = a.Vacina?.nome || a.vacina_nome || vacinaRelacionada?.nome || "Não informada";
                const loteVacina =
                  a.lote ||
                  a.Vacina?.lote ||
                  a.Vacina?.numero_lote ||
                  a.vacina_lote ||
                  vacinaRelacionada?.lote ||
                  vacinaRelacionada?.numero_lote ||
                  "-";

                const profissional = a.profissional_responsavel || a.profissional || "-";
                const dataAplicacao = a.data_aplicacao || a.data;

                return (
                  <tr key={a.id} style={{ height: "40px" }}>
                    <td style={{ padding: "8px 12px", verticalAlign: "middle", fontWeight: "600", color: "#334155" }}>
                      {nomePaciente}
                    </td>
                    <td style={{ padding: "8px 12px", verticalAlign: "middle", color: "#475569" }}>
                      {nomeVacina}
                    </td>
                    <td style={{ padding: "8px 12px", verticalAlign: "middle", fontFamily: "monospace", color: "#64748b" }}>
                      {loteVacina}
                    </td>
                    <td style={{ padding: "8px 12px", verticalAlign: "middle", textAlign: "center" }}>
                      <span style={{ backgroundColor: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>
                        {a.dose}
                      </span>
                    </td>
                    <td style={{ padding: "8px 12px", verticalAlign: "middle", color: "#64748b", fontSize: "12px" }}>
                      {profissional}
                    </td>
                    <td style={{ padding: "8px 12px", verticalAlign: "middle", textAlign: "right", fontWeight: "500", color: "#334155" }}>
                      {dataAplicacao ? new Date(dataAplicacao).toLocaleDateString("pt-BR") : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPaginas > 1 && (
          <div data-pdf-paginacao className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Exibindo {(pagina - 1) * POR_PAGINA + 1}–{Math.min(pagina * POR_PAGINA, aplicacoes.length)} de {aplicacoes.length}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
              {Array.from({ length: Math.min(totalPaginas, 5) }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPagina(n)} className={`w-8 h-8 rounded-lg text-sm font-medium ${n === pagina ? "bg-teal-500 text-white" : "border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>{n}</button>
              ))}
              <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}