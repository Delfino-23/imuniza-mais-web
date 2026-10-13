import React, { useState, useEffect } from "react";
import Modal from "../components/Modal.jsx";
import api from "../services/api.js";
import { formatarCPF, formatarTelefone } from "../utils/formatadores.js";
import ExportDropdown from "../components/ExportDropdown.jsx";

function FormAgendamento({ inicial = {}, onSalvar, onCancelar }) {
  // Ajustado para os campos reais de agendamento do seu banco de dados
  const [form, setForm] = useState({
    paciente_id: "",
    vacina_id: "",
    data_agendamento: "",
    posto_id: 1, // Fixado na UBS Aterrado conforme conversamos
    status: "Agendado",
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
        <label className={labelCls}>ID do Paciente</label>
        <input className={inputCls} type="number" value={form.paciente_id} onChange={set("paciente_id")} placeholder="Digite o ID do paciente" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>ID da Vacina</label>
          <input
            type="number"
            className={inputCls}
            value={form.vacina_id}
            onChange={set("vacina_id")}
            placeholder="ID da vacina"
            required
          />
        </div>
        <div>
          <label className={labelCls}>Data e Hora do Agendamento</label>
          <input
            type="datetime-local"
            className={inputCls}
            value={form.data_agendamento ? form.data_agendamento.slice(0, 16) : ""}
            onChange={set("data_agendamento")}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Posto de Saúde</label>
          <input
            type="text"
            className={inputCls}
            value="UBS Aterrado"
            disabled
            required
          />
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <input
            type="text"
            className={inputCls}
            value={form.status}
            onChange={set("status")}
            required
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancelar} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          Cancelar
        </button>
        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-teal-100">
          Salvar Agendamento
        </button>
      </div>
    </form>
  );
}

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalCadastro, setModalCadastro] = useState(false);
  const [agendamentoEdicao, setAgendamentoEdicao] = useState(null);
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 10;

  const carregarAgendamentos = async () => {
    try {
      const response = await api.get('/agendamentos/');
      // Ajuste para pegar a lista independentemente de vir direto no array ou em response.data.data
      const dados = response.data.data || response.data || [];
      setAgendamentos(dados);
    } catch (error) {
      console.error('Erro ao carregar os agendamentos:', error);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const salvarAgendamento = async (dadosForm) => {
    try {
      // Ajusta o formato da data para o MySQL (troca 'T' por espaço e adiciona segundos se necessário)
      const dataFormatadaParaSql = dadosForm.data_agendamento
        ? dadosForm.data_agendamento.replace('T', ' ') + (dadosForm.data_agendamento.length === 16 ? ':00' : '')
        : "";

      const dadosFormatados = {
        ...dadosForm,
        data_agendamento: dataFormatadaParaSql
      };

      if (agendamentoEdicao) {
        await api.put(`/agendamentos/${agendamentoEdicao.id}`, dadosFormatados);
        alert('Agendamento atualizado com sucesso!');
      } else {
        await api.post('/agendamentos/', dadosFormatados);
        alert('Agendamento cadastrado com sucesso!');
      }

      await carregarAgendamentos();
      setModalCadastro(false);
      setAgendamentoEdicao(null);
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      alert('Houve um erro ao tentar salvar o agendamento no servidor.');
    }
  };

  const abrirEdicao = (agendamento) => {
    setAgendamentoEdicao(agendamento);
    setModalCadastro(true);
  };

  const filtrados = (Array.isArray(agendamentos) ? agendamentos : []).filter(a =>
    (a.paciente_nome || "").toLowerCase().includes(busca.toLowerCase()) ||
    (a.vacina || "").toLowerCase().includes(busca.toLowerCase())
  );

  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA);
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Agendamentos</h2>
          <p className="text-slate-500 text-sm mt-1">{agendamentos.length} agendamentos registrados</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setAgendamentoEdicao(null); setModalCadastro(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-teal-100 flex-shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
            Novo Agendamento
          </button>
        </div>
      </div>

      <div className="relative">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent shadow-sm"
          placeholder="Pesquisar por paciente ou vacina..."
          value={busca}
          onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Paciente / ID</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Vacina</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Data e Hora</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Posto</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginados.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400 text-sm">Nenhum agendamento encontrado.</td></tr>
              ) : paginados.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800">{a.paciente_nome || `Paciente ID: ${a.paciente_id}`}</td>
                  <td className="px-6 py-4 text-slate-600">{a.vacina || `Vacina ID: ${a.vacina_id}`}</td>
                  <td className="px-6 py-4 text-slate-600 hidden md:table-cell">
                    {a.data_agendamento ? new Date(a.data_agendamento).toLocaleString("pt-BR") : "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-600 hidden lg:table-cell">{a.posto || "UBS Aterrado"}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700">
                      {a.status || "Agendado"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => abrirEdicao(a)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

      <Modal
        aberto={modalCadastro}
        onFechar={() => { setModalCadastro(false); setAgendamentoEdicao(null); }}
        titulo={agendamentoEdicao ? "Editar Agendamento" : "Novo Agendamento"}
      >
        <FormAgendamento
          inicial={agendamentoEdicao || {}}
          onSalvar={salvarAgendamento}
          onCancelar={() => { setModalCadastro(false); setAgendamentoEdicao(null); }}
        />
      </Modal>
    </div>
  );
}