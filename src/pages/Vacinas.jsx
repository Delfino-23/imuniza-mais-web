// ============================================================
// Vacinas.jsx — Tela de estoque e catálogo de vacinas
// ============================================================

import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Badge from "../components/Badge";
import api from "../services/api.js";

function FormVacina({ inicial = {}, onSalvar, onCancelar }) {
  const [form, setForm] = useState({
    nome: "", fabricante: "", lote: "", validade: "", quantidade_estoque: "", minimo_alerta: 30,
    ...inicial,
  });

  const set = (campo) => (e) => setForm(p => ({ ...p, [campo]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar(form);
  }

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Nome da Vacina *</label>
        <input className={inputCls} value={form.nome} onChange={set("nome")} placeholder="Ex: COVID-19 (Pfizer)" required />
      </div>
      <div>
        <label className={labelCls}>Fabricante / Laboratório *</label>
        <input className={inputCls} value={form.fabricante} onChange={set("fabricante")} placeholder="Ex: Pfizer-BioNTech" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Número do Lote *</label>
          <input className={inputCls} value={form.lote} onChange={set("lote")} placeholder="Ex: PFZ-2024-001" required />
        </div>
        <div>
          <label className={labelCls}>Data de Validade *</label>
          <input type="date" className={inputCls} value={form.validade} onChange={set("validade")} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Quantidade em Estoque *</label>
          <input type="number" min="1" className={inputCls} value={form.quantidade_estoque} onChange={set("quantidade_estoque")} placeholder="Ex: 200" required />
        </div>
        <div>
          <label className={labelCls}>Mín. para Alerta</label>
          <input type="number" min="1" className={inputCls} value={form.minimo_alerta} onChange={set("minimo_alerta")} placeholder="Ex: 30" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancelar} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          Cancelar
        </button>
        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-teal-100">
          Salvar Vacina/Lote
        </button>
      </div>
    </form>
  );
}

export default function Vacinas() {
  const [vacinas, setVacinas] = useState({ total: 0, vacinas: [] });
  const [busca, setBusca] = useState("");
  const [modalForm, setModalForm] = useState(false);
  const [vacinaEdicao, setVacinaEdicao] = useState(null);
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 6;

  const filtrados = (vacinas.vacinas || []).filter(v =>
    v.nome.toLowerCase().includes(busca.toLowerCase()) ||
    v.lote.toLowerCase().includes(busca.toLowerCase())
  );

  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA);
  const paginadas = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const carregarVacinas = async () => {
    try {
      const response = await api.get("/vacinas/");
      console.log("Vacinas carregadas:", response.data.data);

      // Ajuste aqui: Como o backend retorna o array puro, nós o envelopamos 
      // para o estado manter a mesma estrutura esperada pelo restante do componente.
      const listaDeVacinas = response.data.data || [];
      setVacinas({
        total: listaDeVacinas.length,
        vacinas: listaDeVacinas
      });

    } catch (error) {
      console.error("Erro ao carregar vacinas:", error);
    }
  };

  useEffect(() => {
    carregarVacinas();
  }, []);

  const getStatus = (vacina) => {
    if (!vacina) return { label: "Sem dados", cor: "slate" };

    const hoje = new Date();
    const dataValidade = new Date(vacina.validade ? vacina.validade.split('T')[0] + "T12:00:00" : "2100-01-01T12:00:00"); // Se não houver validade, assume uma data futura

    // 1. Crítico: Estoque zerado ou vacina já venceu
    if (vacina.quantidade_estoque <= 0 || dataValidade < hoje) {
      return { label: "Crítico", cor: "red" };
    }

    // 2. Atenção: Estoque igual ou abaixo do mínimo definido para alerta
    if (vacina.quantidade_estoque <= vacina.minimo_alerta) {
      return { label: "Atenção", cor: "amber" };
    }

    // 3. Regular: Tudo em ordem
    return { label: "Regular", cor: "green" };
  };

  const cadastrarVacina = async (dadosForm) => {
    try {
      const dadosFormatado = {
        ...dadosForm,
        validade: new Date(dadosForm.validade).toISOString().split('T')[0] // Formata a data para YYYY-MM-DD
      };

      if (vacinaEdicao) {
        await api.put(`/vacinas/${vacinaEdicao.id}`, dadosFormatado);
      } else {
        await api.post("/vacinas/", dadosFormatado);
      }

      await carregarVacinas();
      setModalForm(false);
      setVacinaEdicao(null);
    } catch (error) {
      console.error("Erro ao cadastrar vacina:", error);
    }
  }

  const abrirEdicao = (v) => {
    const vacinaFormatada = {
      ...v,
      validade: v.validade ? v.validade.split('T')[0] : ""
    };

    setVacinaEdicao(vacinaFormatada);
    setModalForm(true);
  };

  // Resumo de status
  const regulares = (vacinas.vacinas || []).filter(v => getStatus(v).cor === "green").length;
  const alertas = (vacinas.vacinas || []).filter(v => getStatus(v).cor === "amber").length;
  const criticos = (vacinas.vacinas || []).filter(v => getStatus(v).cor === "red").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Estoque de Vacinas</h2>
          <p className="text-slate-500 text-sm mt-1">{(vacinas.total || 0)} lotes cadastrados</p>
        </div>
        <button
          onClick={() => { setVacinaEdicao(null); setModalForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-teal-100 flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
          Adicionar Nova Vacina / Lote
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Regulares", valor: regulares, cor: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-500" },
          { label: "Atenção", valor: alertas, cor: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-500" },
          { label: "Crítico", valor: criticos, cor: "bg-red-50 border-red-200 text-red-700", dot: "bg-red-500" },
        ].map(s => (
          <div key={s.label} className={`flex items-center gap-3 p-4 rounded-xl border ${s.cor}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${s.dot} flex-shrink-0`} />
            <div>
              <p className="text-xl font-bold leading-none">{s.valor}</p>
              <p className="text-xs font-semibold mt-0.5 opacity-80">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Busca */}
      <div className="relative">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent shadow-sm"
          placeholder="Pesquisar por nome, fabricante ou lote..."
          value={busca}
          onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
        />
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Vacina</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Lote</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Validade</th>
                <th className="text-center px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Doses</th>
                <th className="text-center px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginadas.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400 text-sm">Nenhum lote encontrado.</td></tr>
              ) : paginadas.map((v) => {
                const s = getStatus(v);
                const rowHighlight = s.cor === "red" ? "bg-red-50/30" : s.cor === "amber" ? "bg-amber-50/20" : "";
                return (
                  <tr key={v.id} className={`hover:bg-slate-50/60 transition-colors ${rowHighlight}`}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{v.nome}</p>
                      <p className="text-xs text-slate-400">{v.fabricante}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs hidden md:table-cell">{v.lote}</td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className={`text-sm font-medium ${s.cor === "red" ? "text-red-600" : s.cor === "amber" ? "text-amber-600" : "text-slate-600"}`}>
                        {v.validade ? new Date(v.validade.split('T')[0] + "T12:00:00").toLocaleDateString("pt-BR") : "Sem data"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-base font-bold ${v.quantidade_estoque < v.minimo_alerta ? "text-red-600" : "text-slate-800"}`}>
                        {v.quantidade_estoque}
                      </span>
                      <span className="text-xs text-slate-400 block">/{v.minimo_alerta} mín</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge label={s.label} cor={s.cor} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => abrirEdicao(v)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Exibindo {(pagina - 1) * POR_PAGINA + 1}–{Math.min(pagina * POR_PAGINA, filtradas.length)} de {filtradas.length}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPagina(n)} className={`w-8 h-8 rounded-lg text-sm font-medium ${n === pagina ? "bg-teal-500 text-white" : "border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>{n}</button>
              ))}
              <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">›</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        aberto={modalForm}
        onFechar={() => { setModalForm(false); setVacinaEdicao(null); }}
        titulo={vacinaEdicao ? "Editar Vacina / Lote" : "Adicionar Nova Vacina / Lote"}
      >
        <FormVacina
          inicial={vacinaEdicao || {}}
          onSalvar={cadastrarVacina}
          onCancelar={() => { setModalForm(false); setVacinaEdicao(null); }}
        />
      </Modal>
    </div>
  );
}