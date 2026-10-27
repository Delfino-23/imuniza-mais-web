import React, { useEffect, useState } from "react";
import api from "../services/api";
import AsyncState from "../components/AsyncState";
import { useAuth } from "../contexts/AuthContext";

export default function Carteirinha() {
    const [dados, setDados] = useState({ paciente: null, historico: [] });
    const [statusCarregamento, setStatusCarregamento] = useState("loading");
    const { user: usuario } = useAuth();
    const pacienteId = usuario?.paciente_id || usuario?.id;

    const buscarDadosCarteirinha = async () => {
        if (!pacienteId) {
            setStatusCarregamento("error");
            return;
        }

        setStatusCarregamento("loading");
        try {
            const response = await api.get(`/historico/carteirinha/${pacienteId}`);
            setDados(response.data.data);
            setStatusCarregamento("ready");
        } catch (error) {
            console.error("Erro ao carregar carteirinha:", error);
            setStatusCarregamento("error");
        }
    };

    useEffect(() => {
        buscarDadosCarteirinha();
    }, [pacienteId]);

    if (statusCarregamento !== "ready") {
        const mensagem = statusCarregamento === "loading"
            ? "Carregando carteirinha..."
            : pacienteId
                ? "Não foi possível carregar os dados da carteirinha."
                : "Não foi possível identificar o paciente desta conta.";

        return (
            <AsyncState
                status={statusCarregamento}
                message={mensagem}
                onRetry={buscarDadosCarteirinha}
            />
        );
    }

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
                    <AsyncState status="empty" message="Nenhuma vacina encontrada." />
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