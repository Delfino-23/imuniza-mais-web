import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function MeusAgendamentos() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarAgendamentos() {
            try {
                const token = localStorage.getItem('@imuniza:token');

                const response = await api.get('/agendamentos/meus-agendamentos', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Garante que pega a lista correta do retorno da API
                setAgendamentos(response.data.data || []);
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
            } finally {
                setLoading(false);
            }
        }

        carregarAgendamentos();
    }, []);

    if (loading) {
        return <div className="p-6 text-slate-600">Carregando seus agendamentos...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Meus Agendamentos</h2>
                <p className="text-sm text-slate-500">Confira as suas consultas de vacinação marcadas</p>
            </div>

            {agendamentos.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 p-8 rounded-lg text-center text-slate-500">
                    Você não possui nenhum agendamento ativo no momento.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {agendamentos.map((item) => {
                        const dataObjeto = new Date(item.data_agendamento);
                        const dataFormatted = dataObjeto.toLocaleDateString('pt-BR');
                        const horaFormatted = dataObjeto.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        return (
                            <div
                                key={item.id}
                                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-slate-800 text-lg">
                                        {item.vacina || 'Vacina'}
                                    </h3>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                                        {item.status || 'Agendado'}
                                    </span>
                                </div>

                                <div className="space-y-1.5 text-sm text-slate-600">
                                    <p>
                                        <strong className="text-slate-700">Local:</strong> {item.posto || 'Posto de Saúde'}
                                    </p>
                                    <p>
                                        <strong className="text-slate-700">Data:</strong> {dataFormatted} às {horaFormatted}
                                    </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                                    <span>Senha/Protocolo: #{item.id}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}