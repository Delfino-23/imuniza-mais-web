import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Carteirinha() {
    const [dados, setDados] = useState({ paciente: null, historico: [] });
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    const usuarioSalvo = localStorage.getItem("@imuniza:user");
    const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
    const pacienteId = usuario?.id;

    useEffect(() => {
        const buscarDadosCarteirinha = async () => {
            try {
                setCarregando(true);
                // Consome a rota que você criou passando o ID na URL
                const response = await api.get(`/historico/carteirinha/${pacienteId}`);

                console.log("Dados recebidos do backend:", response.data);

                // Armazena { paciente, historico } vindo do controller
                setDados(response.data.data);
            } catch (err) {
                console.error("Erro ao carregar carteirinha:", err);
                setErro("Não foi possível carregar os dados da carteirinha.");
            } finally {
                setCarregando(false);
            }
        };

        if (pacienteId) {
            buscarDadosCarteirinha();
        }
    }, [pacienteId]);

    if (carregando) return <p className="p-4 text-slate-500">Carregando carteirinha...</p>;
    if (erro) return <p className="p-4 text-red-500">{erro}</p>;

    const { paciente, historico } = dados;

    return (
        <div className="p-6 bg-white rounded-2xl border border-slate-100 space-y-6">
            {/* Dados do Paciente */}
            <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-800">{paciente?.nome}</h2>
                <p className="text-sm text-slate-500">CPF: {paciente?.cpf}</p>
                <p className="text-xs text-slate-400">
                    Nascimento: {paciente?.data_nascimento ? new Date(paciente.data_nascimento).toLocaleDateString("pt-BR") : "-"}
                </p>
            </div>

            {/* Lista de Vacinas */}
            <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                    Histórico de Vacinação
                </h3>

                {historico.length === 0 ? (
                    <p className="text-sm text-slate-400">Nenhuma vacina encontrada.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500">
                                <th className="p-2 text-left">Data</th>
                                <th className="p-2 text-left">Vacina</th>
                                <th className="p-2 text-center">Dose</th>
                                <th className="p-2 text-left">Lote</th>
                                <th className="p-2 text-left">Profissional</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {historico.map((item) => (
                                <tr key={item.id}>
                                    <td className="p-2">
                                        {new Date(item.data_aplicacao).toLocaleDateString("pt-BR")}
                                    </td>
                                    <td className="p-2 font-semibold text-slate-700">
                                        {item.vacina_nome}
                                    </td>
                                    <td className="p-2 text-center">{item.dose}</td>
                                    <td className="p-2 font-mono text-xs text-slate-500">
                                        {item.lote}
                                    </td>
                                    <td className="p-2 text-xs text-slate-500">
                                        {item.profissional_responsavel}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}