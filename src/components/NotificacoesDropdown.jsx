// src/components/NotificacoesDropdown.jsx
import { useState, useEffect } from 'react';
import { notificacoesServices } from '../services/notificacoesServices.js';

export default function NotificacoesDropdown() {
    const [notificacoes, setNotificacoes] = useState([]);
    const [naoLidasCount, setNaoLidasCount] = useState(0);
    const [aberto, setAberto] = useState(false);

    // Carrega o contador inicial de não lidas e atualiza periodicamente (opcional)
    useEffect(() => {
        carregarContador();
        const intervalo = setInterval(carregarContador, 30000); // a cada 30s
        return () => clearInterval(intervalo);
    }, []);

    async function carregarContador() {
        try {
            const total = await notificacoesServices.contarNaoLidas();
            setNaoLidasCount(total);
        } catch (error) {
            console.error('Erro ao contar notificações:', error);
        }
    }

    async function carregarNotificacoes() {
        try {
            const resultado = await notificacoesServices.listar();
            setNotificacoes(resultado.data);
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
        }
    }

    const toggleDropdown = () => {
        if (!aberto) {
            carregarNotificacoes();
        }
        setAberto(!aberto);
    };

    const handleMarcarComoLida = async (id) => {
        try {
            await notificacoesServices.marcarComoLida(id);
            setNotificacoes(prev =>
                prev.map(n => n.id === id ? { ...n, lida_em: new Date().toISOString() } : n)
            );
            setNaoLidasCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Erro ao marcar notificação como lida:', error);
        }
    };

    const handleMarcarTodas = async () => {
        try {
            await notificacoesServices.marcarTodasComoLidas();
            setNotificacoes(prev => prev.map(n => ({ ...n, lida_em: new Date().toISOString() })));
            setNaoLidasCount(0);
        } catch (error) {
            console.error('Erro ao marcar todas como lidas:', error);
        }
    };

    return (
        <div className="relative">
            {/* Botão do Sino */}
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                {naoLidasCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {naoLidasCount}
                    </span>
                )}
            </button>

            {/* Caixa Dropdown de Notificações */}
            {aberto && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700">Notificações</span>
                        {naoLidasCount > 0 && (
                            <button
                                onClick={handleMarcarTodas}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Marcar todas como lidas
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                        {notificacoes.length === 0 ? (
                            <p className="p-4 text-center text-sm text-gray-500">Nenhuma notificação por enquanto.</p>
                        ) : (
                            notificacoes.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-3 text-sm transition-colors ${notif.lida_em ? 'bg-white text-gray-600' : 'bg-blue-50/50 text-gray-900 font-medium'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-semibold uppercase text-blue-600">{notif.categoria}</span>
                                        {!notif.lida_em && (
                                            <button
                                                onClick={() => handleMarcarComoLida(notif.id)}
                                                className="text-xs text-gray-400 hover:text-blue-600"
                                                title="Marcar como lida"
                                            >
                                                ✓ Lida
                                            </button>
                                        )}
                                    </div>
                                    <p className="font-bold mt-1">{notif.titulo}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{notif.mensagem}</p>
                                    <span className="text-[10px] text-gray-400 mt-1 block">
                                        {new Date(notif.criada_em).toLocaleString('pt-BR')}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}