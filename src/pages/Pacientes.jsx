// ============================================================
// Pacientes.jsx — Tela de gerenciamento de pacientes
// ============================================================

import React, { useState } from "react";
import Modal from "../components/Modal";
import { pacientes as dadosPacientes, aplicacoes } from "../data/mockData";

// Formulário de paciente (usado em cadastro e edição)
function FormPaciente({ inicial = {}, onSalvar, onCancelar }) {
  const [form, setForm] = useState({
    nome: "", cpf: "", nascimento: "", sexo: "", telefone: "", endereco: "",
    ...inicial,
  });

  const set = (campo) => (e) => setForm(p => ({ ...p, [campo]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar(form);
  };

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Nome Completo *</label>
        <input className={inputCls} value={form.nome} onChange={set("nome")} placeholder="Nome completo do paciente" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>CPF *</label>
          <input className={inputCls} value={form.cpf} onChange={set("cpf")} placeholder="000.000.000-00" required />
        </div>
        <div>
          <label className={labelCls}>Data de Nascimento *</label>
          <input type="date" className={inputCls} value={form.nascimento} onChange={set("nascimento")} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Sexo *</label>
          <select className={inputCls} value={form.sexo} onChange={set("sexo")} required>
            <option value="">Selecionar</option>
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
            <option value="O">Outro</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Telefone</label>
          <input className={inputCls} value={form.telefone} onChange={set("telefone")} placeholder="(00) 00000-0000" />
        </div>
      </div>
      <div>
        <label className={labelCls}>Endereço</label>
        <input className={inputCls} value={form.endereco} onChange={set("endereco")} placeholder="Rua, número, bairro, cidade - UF" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancelar} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          Cancelar
        </button>
        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-teal-100">
          Salvar Paciente
        </button>
      </div>
    </form>
  );
}

// Modal de histórico de vacinação do paciente
function HistoricoPaciente({ paciente, onFechar }) {
  const historico = aplicacoes.filter(a => a.pacienteId === paciente.id);
  return (
    <div className="space-y-4">
      <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
        <p className="text-sm font-semibold text-teal-800">{paciente.nome}</p>
        <p className="text-xs text-teal-600 mt-0.5">CPF: {paciente.cpf} · Nasc.: {new Date(paciente.nascimento + "T00:00:00").toLocaleDateString("pt-BR")}</p>
      </div>
      {historico.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-6">Nenhuma vacinação registrada.</p>
      ) : (
        <div className="space-y-2">
          {historico.map(h => (
            <div key={h.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700">{h.vacinaNome}</p>
                <p className="text-xs text-slate-400">{h.dose} · Lote: {h.lote} · {h.profissional}</p>
              </div>
              <span className="text-xs font-medium text-slate-500 flex-shrink-0">
                {new Date(h.data + "T00:00:00").toLocaleDateString("pt-BR")}
              </span>
            </div>
          ))}
        </div>
      )}
      <button onClick={onFechar} className="w-full py-2.5 rounded-xl bg-slate-100 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
        Fechar
      </button>
    </div>
  );
}

export default function Pacientes() {
  const [pacientes, setPacientes] = useState(dadosPacientes);
  const [busca, setBusca] = useState("");
  const [modalCadastro, setModalCadastro] = useState(false);
  const [pacienteEdicao, setPacienteEdicao] = useState(null);
  const [pacienteHistorico, setPacienteHistorico] = useState(null);
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 5;

  // Filtragem
  const filtrados = pacientes.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.cpf.includes(busca)
  );
  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA);
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const salvarPaciente = (form) => {
    if (pacienteEdicao) {
      setPacientes(p => p.map(x => x.id === pacienteEdicao.id ? { ...x, ...form } : x));
    } else {
      setPacientes(p => [...p, { ...form, id: Date.now() }]);
    }
    setModalCadastro(false);
    setPacienteEdicao(null);
  };

  const abrirEdicao = (p) => { setPacienteEdicao(p); setModalCadastro(true); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pacientes</h2>
          <p className="text-slate-500 text-sm mt-1">{pacientes.length} pacientes cadastrados</p>
        </div>
        <button
          onClick={() => { setPacienteEdicao(null); setModalCadastro(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-teal-100 flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>
          Cadastrar Novo Paciente
        </button>
      </div>

      {/* Busca */}
      <div className="relative">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
        </svg>
        <input
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent shadow-sm"
          placeholder="Pesquisar por nome ou CPF..."
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
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Paciente</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">CPF</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Nascimento</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Telefone</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginados.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm">Nenhum paciente encontrado.</td></tr>
              ) : paginados.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {p.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{p.nome}</p>
                        <p className="text-xs text-slate-400">{p.sexo === "F" ? "Feminino" : p.sexo === "M" ? "Masculino" : "Outro"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-sm">{p.cpf}</td>
                  <td className="px-6 py-4 text-slate-600 hidden md:table-cell">
                    {new Date(p.nascimento + "T00:00:00").toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 text-slate-600 hidden lg:table-cell">{p.telefone || "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => abrirEdicao(p)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setPacienteHistorico(p)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-600 border border-teal-200 hover:bg-teal-50 transition-colors"
                      >
                        Histórico
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Exibindo {(pagina - 1) * POR_PAGINA + 1}–{Math.min(pagina * POR_PAGINA, filtrados.length)} de {filtrados.length}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">‹</button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPagina(n)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${n === pagina ? "bg-teal-500 text-white" : "border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>{n}</button>
              ))}
              <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">›</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Cadastro/Edição */}
      <Modal
        aberto={modalCadastro}
        onFechar={() => { setModalCadastro(false); setPacienteEdicao(null); }}
        titulo={pacienteEdicao ? "Editar Paciente" : "Cadastrar Novo Paciente"}
      >
        <FormPaciente
          inicial={pacienteEdicao || {}}
          onSalvar={salvarPaciente}
          onCancelar={() => { setModalCadastro(false); setPacienteEdicao(null); }}
        />
      </Modal>

      {/* Modal Histórico */}
      <Modal
        aberto={!!pacienteHistorico}
        onFechar={() => setPacienteHistorico(null)}
        titulo="Histórico de Vacinação"
      >
        {pacienteHistorico && (
          <HistoricoPaciente paciente={pacienteHistorico} onFechar={() => setPacienteHistorico(null)} />
        )}
      </Modal>
    </div>
  );
}
