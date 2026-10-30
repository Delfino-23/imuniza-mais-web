import React, { useState, useEffect } from "react";
import Modal from "../components/Modal.jsx";
import api from "../services/api.js";
import AsyncState from "../components/AsyncState";
import { formatarCPF } from "../utils/formatadores.js";
import { vacinasDisponiveis } from "../utils/vacinasUtils.js";

// Componente de Autocomplete para Pacientes
function AutocompletePaciente({ valor, onChange }) {
  const [pacientes, setPacientes] = useState({ total: 0, pacientes: [] });
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState(valor?.nome || "");
  const [statusCarregamento, setStatusCarregamento] = useState("loading");

  const listaPacientes = pacientes.pacientes || (Array.isArray(pacientes) ? pacientes : []);
  const filtrados = listaPacientes.filter(p =>
    (p.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
    (p.cpf || "").includes(busca)
  ).slice(0, 6);

  const selecionar = (p) => {
    onChange(p);
    setBusca(p.nome);
    setAberto(false);
  };

  const carregarPacientes = async () => {
    setStatusCarregamento("loading");
    try {
      const response = await api.get("/pacientes/");
      const dados = response.data.data || response.data || [];
      setPacientes(Array.isArray(dados) ? { pacientes: dados } : dados);
      setStatusCarregamento("ready");
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      setStatusCarregamento("error");
    }
  };

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
        required
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
                {(p.nome || "P").split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">{p.nome}</p>
                <p className="text-xs text-slate-400">{formatarCPF(p.cpf)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      {aberto && busca.length >= 1 && statusCarregamento !== "ready" && (
        <div className="absolute top-full left-0 right-0 mt-1 z-20">
          <AsyncState
            status={statusCarregamento}
            message={statusCarregamento === "loading" ? "Carregando..." : "Erro ao carregar."}
            onRetry={carregarPacientes}
          />
        </div>
      )}
      {aberto && busca.length >= 1 && statusCarregamento === "ready" && filtrados.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white p-3 border rounded-xl text-xs text-slate-400 text-center">
          Nenhum paciente encontrado.
        </div>
      )}
    </div>
  );
}

// Componente de Autocomplete para Vacinas
function AutocompleteVacina({ valor, onChange }) {
  const [vacinas, setVacinas] = useState([]);
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [statusCarregamento, setStatusCarregamento] = useState("loading");

  const listaDisponivel = vacinasDisponiveis(vacinas);
  const filtradas = listaDisponivel.filter(v =>
    (v.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
    (v.lote || "").toLowerCase().includes(busca.toLowerCase())
  ).slice(0, 6);

  const selecionar = (v) => {
    onChange(v);
    setBusca(`${v.nome} — Lote: ${v.lote}`);
    setAberto(false);
  };

  const carregarVacinas = async () => {
    setStatusCarregamento("loading");
    try {
      const response = await api.get("/vacinas/");
      const dadosVacinas = response.data;
      const lista = dadosVacinas?.data?.vacinas || dadosVacinas?.vacinas || (Array.isArray(dadosVacinas) ? dadosVacinas : []);
      setVacinas(lista);
      setStatusCarregamento("ready");
    } catch (error) {
      console.error("Erro ao carregar vacinas:", error);
      setStatusCarregamento("error");
    }
  };

  useEffect(() => {
    carregarVacinas();
  }, []);

  return (
    <div className="relative">
      <input
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
        placeholder="Digite o nome da vacina ou lote..."
        value={busca}
        onChange={(e) => { setBusca(e.target.value); setAberto(true); onChange(null); }}
        onFocus={() => setAberto(true)}
        onBlur={() => setTimeout(() => setAberto(false), 150)}
        required
      />
      {aberto && busca.length >= 1 && filtradas.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
          {filtradas.map(v => (
            <button
              key={v.id}
              type="button"
              onMouseDown={() => selecionar(v)}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-teal-50 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-semibold text-slate-700">{v.nome}</p>
                <p className="text-xs text-slate-400">Lote: {v.lote} · Doses: {v.doses}</p>
              </div>
              <span className="text-xs text-teal-600 font-medium">Selecionar</span>
            </button>
          ))}
        </div>
      )}
      {aberto && busca.length >= 1 && statusCarregamento !== "ready" && (
        <div className="absolute top-full left-0 right-0 mt-1 z-20">
          <AsyncState
            status={statusCarregamento}
            message="Carregando vacinas..."
            onRetry={carregarVacinas}
          />
        </div>
      )}
      {aberto && busca.length >= 1 && statusCarregamento === "ready" && filtradas.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white p-3 border rounded-xl text-xs text-slate-400 text-center">
          Nenhuma vacina disponível encontrada.
        </div>
      )}
    </div>
  );
}

function FormAgendamento({ inicial = {}, onSalvar, onCancelar }) {
  const [form, setForm] = useState({
    paciente: null,
    vacina: null,
    data_agendamento: "",
    posto_id: 1,
    status: "Agendado",
    ...inicial,
  });

  const set = (campo) => (e) => setForm(p => ({ ...p, [campo]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.paciente || !form.vacina) {
      alert("Selecione um paciente e uma vacina válidos na lista.");
      return;
    }

    const payload = {
      ...form,
      paciente_id: form.paciente.id,
      vacina_id: form.vacina.id
    };

    onSalvar(payload);
  };

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <label className={labelCls}>Vacina *</label>
        <AutocompleteVacina
          valor={form.vacina}
          onChange={(v) => setForm(f => ({ ...f, vacina: v }))}
        />
        {form.vacina && (
          <p className="text-xs text-teal-600 mt-1.5 font-medium">
            ✓ {form.vacina.nome} — Lote: {form.vacina.lote}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Data e Hora do Agendamento *</label>
          <input
            type="datetime-local"
            className={inputCls}
            value={form.data_agendamento ? form.data_agendamento.slice(0, 16) : ""}
            onChange={set("data_agendamento")}
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
  const [statusCarregamento, setStatusCarregamento] = useState("loading");
  const POR_PAGINA = 10;

  const carregarAgendamentos = async () => {
    setStatusCarregamento("loading");
    try {
      const response = await api.get('/agendamentos/');
      const dados = response.data.data || response.data || [];
      setAgendamentos(dados);
      setStatusCarregamento("ready");
    } catch (error) {
      console.error('Erro ao carregar os agendamentos:', error);
      setStatusCarregamento("error");
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const salvarAgendamento = async (dadosForm) => {
    try {
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
      const mensagem = error.response?.data?.message || "Houve um erro ao tentar salvar o agendamento no servidor.";
      alert(mensagem);
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

  if (statusCarregamento !== "ready") {
    return (
      <AsyncState
        status={statusCarregamento}
        message={statusCarregamento === "loading" ? "Carregando agendamentos..." : "Não foi possível carregar os agendamentos."}
        onRetry={carregarAgendamentos}
      />
    );
  }

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
                <tr><td colSpan="6" className="px-6 py-8"><AsyncState status="empty" message={busca ? "Nenhum agendamento corresponde à busca." : "Nenhum agendamento cadastrado."} /></td></tr>
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