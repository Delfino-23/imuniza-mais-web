import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import api from "../services/api.js";
import { formatarCPF } from "../utils/formatadores.js";

function FormFuncionarios({ inicial = {}, onSalvar, onCancelar }) {
    const [form, setForm] = useState({
        nome: "", cpf: "", email: "", senha: "", papel: "funcionario",
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
                <input className={inputCls} value={form.nome} onChange={set("nome")} placeholder="Nome do funcionário" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>CPF *</label>
                    <input
                        type="text"
                        className={inputCls}
                        maxLength={14}
                        value={form.cpf}
                        onChange={(e) => setForm({ ...form, cpf: formatarCPF(e.target.value) })}
                        placeholder="000.000.000-00"
                        required
                    />
                </div>
                <div>
                    <label className={labelCls}>E-mail *</label>
                    <input type="email" className={inputCls} value={form.email} onChange={set("email")} required />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>Senha {inicial?.id ? "(Opcional)" : "*"}</label>
                    <input
                        type="password"
                        className={inputCls}
                        value={form.senha}
                        onChange={set("senha")}
                        required={!inicial?.id}
                    />
                </div>
                <div>
                    <label className={labelCls}>Papel *</label>
                    <select className={inputCls} value={form.papel} onChange={set("papel")} required>
                        <option value="funcionario">Funcionário</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
            </div>
            <div className="flex gap-3 pt-2">
                <button type="button" onClick={onCancelar} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                    Cancelar
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-teal-100">
                    Salvar Funcionário
                </button>
            </div>
        </form>
    );
}

export default function CadastroFunc() {
    const [funcionarios, setFuncionarios] = useState({ total: 0, funcionarios: [] });
    const [busca, setBusca] = useState("");
    const [modalCadastro, setModalCadastro] = useState(false);
    const [funcEdicao, setFuncEdicao] = useState(null);
    const [pagina, setPagina] = useState(1);
    const POR_PAGINA = 5;

    const listaFuncionarios = funcionarios.funcionarios || [];
    const filtrados = listaFuncionarios.filter(f =>
        f.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        f.cpf?.includes(busca)
    );
    const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA);
    const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

    // Carrega usuários do banco filtrados pelo papel de funcionário
    const carregarFuncionarios = async () => {
        try {
            const response = await api.get('/auth/funcionarios');
            const dados = response.data.data || response.data;
            setFuncionarios({
                total: dados.total || dados.length || 0,
                funcionarios: dados.funcionarios || (Array.isArray(dados) ? dados : [])
            });
        } catch (error) {
            console.error('Erro ao carregar funcionários:', error);
        }
    };

    useEffect(() => {
        carregarFuncionarios();
    }, []);

    const salvarFuncionario = async (dadosForm) => {
        try {
            if (funcEdicao) {
                await api.put(`/usuarios/${funcEdicao.id}`, dadosForm);
                alert('Funcionário atualizado com sucesso!');
            } else {
                await api.post('/usuarios/', dadosForm);
                alert('Funcionário cadastrado com sucesso!');
            }

            await carregarFuncionarios();
            setModalCadastro(false);
            setFuncEdicao(null);
        } catch (error) {
            console.error("Erro ao salvar funcionário:", error);
            alert('Houve um erro ao tentar salvar o funcionário no servidor.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Funcionários</h2>
                    <p className="text-slate-500 text-sm mt-1">{funcionarios.total} funcionários cadastrados</p>
                </div>
                <button
                    onClick={() => { setFuncEdicao(null); setModalCadastro(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-teal-100 flex-shrink-0"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                    Cadastrar Novo Funcionário
                </button>
            </div>

            <div className="relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
                <input
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent shadow-sm"
                    placeholder="Pesquisar funcionário por nome ou CPF..."
                    value={busca}
                    onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
                />
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Funcionário</th>
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">CPF</th>
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">E-mail</th>
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Papel</th>
                                <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginados.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm">Nenhum funcionário encontrado.</td></tr>
                            ) : paginados.map((f) => (
                                <tr key={f.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                {f.nome ? f.nome.split(" ").map(n => n[0]).slice(0, 2).join("") : "FN"}
                                            </div>
                                            <span className="font-semibold text-slate-800">{f.nome}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">{formatarCPF(f.cpf)}</td>
                                    <td className="px-6 py-4 text-slate-600 hidden md:table-cell">{f.email}</td>
                                    <td className="px-6 py-4 text-slate-600 capitalize hidden lg:table-cell">{f.papel || "Funcionário"}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => { setFuncEdicao(f); setModalCadastro(true); }}
                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                                        >
                                            Editar
                                        </button>
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
                onFechar={() => { setModalCadastro(false); setFuncEdicao(null); }}
                titulo={funcEdicao ? "Editar Funcionário" : "Cadastrar Novo Funcionário"}
            >
                <FormFuncionarios
                    inicial={funcEdicao || {}}
                    onSalvar={salvarFuncionario}
                    onCancelar={() => { setModalCadastro(false); setFuncEdicao(null); }}
                />
            </Modal>
        </div>
    );
}